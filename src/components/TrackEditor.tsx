import { useEffect, useMemo, useRef, useState } from 'react';

import { getIntervalIndex, intervalBorderColor, intervalColor, GRID_STEP_VAR } from '../lib/intervals';
import type { BassEvent, Track } from '../lib/model';

import { TrackHeader } from './TrackHeader';
const STEPS_PER_BAR = 16;
const MIN_MIDI = 23; // B0
const MAX_MIDI = 72; // C5

const NOTE_KEY_MAP: Record<string, number> = {
  z: 0,
  x: 2,
  c: 4,
  v: 5,
  b: 7,
  n: 9,
  m: 11,
  s: 1,
  d: 3,
  g: 6,
  h: 8,
  j: 10,
};

const NOTE_NAME_OPTIONS = [
  { label: 'C', pc: 0 },
  { label: 'C#', pc: 1 },
  { label: 'Db', pc: 1 },
  { label: 'D', pc: 2 },
  { label: 'D#', pc: 3 },
  { label: 'Eb', pc: 3 },
  { label: 'E', pc: 4 },
  { label: 'F', pc: 5 },
  { label: 'F#', pc: 6 },
  { label: 'Gb', pc: 6 },
  { label: 'G', pc: 7 },
  { label: 'G#', pc: 8 },
  { label: 'Ab', pc: 8 },
  { label: 'A', pc: 9 },
  { label: 'A#', pc: 10 },
  { label: 'Bb', pc: 10 },
  { label: 'B', pc: 11 },
];

type EditorNote = {
  id: string;
  startStep: number;
  length: number;
  midi: number;
};

type PendingNote = {
  key: string;
  startStep: number;
  length: number;
  midi: number;
};

type TrackEditorProps = {
  track: Track;
  onClose: () => void;
};

const toMidi = (pc: number, octave: number) => (octave + 1) * 12 + pc;

const clampMidi = (midi: number) => (midi < MIN_MIDI || midi > MAX_MIDI ? null : midi);

const removeOverlappingNotes = (notes: EditorNote[], start: number, length: number) => {
  const end = start + length;
  return notes.filter((note) => {
    const noteEnd = note.startStep + note.length;
    const overlaps = start < noteEnd && end > note.startStep;
    return !overlaps;
  });
};

const findNoteAtStep = (notes: EditorNote[], step: number) =>
  notes.find((note) => step >= note.startStep && step < note.startStep + note.length);

const getInitialTonicName = (track: Track) => {
  const match = NOTE_NAME_OPTIONS.find((option) => option.pc === track.tonic);
  return match ? match.label : 'C';
};

const getInitialTonicOctave = (track: Track) => {
  if (track.tonicMidi === undefined) return 1;
  return Math.floor(track.tonicMidi / 12) - 1;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';

const buildBassEvents = (notes: EditorNote[]): BassEvent[] =>
  notes
    .slice()
    .sort((a, b) => a.startStep - b.startStep)
    .map((note, index) => ({
      id: `note-${index + 1}`,
      start: {
        bar: Math.floor(note.startStep / STEPS_PER_BAR),
        beat: (note.startStep % STEPS_PER_BAR) / 4,
      },
      duration: { beats: note.length / 4 },
      pitch: { midi: note.midi },
    }));

export function TrackEditor({ track, onClose }: TrackEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist ?? '');
  const [tempoBpm, setTempoBpm] = useState(track.tempoBpm?.toString() ?? '120');
  const [tonicName, setTonicName] = useState(getInitialTonicName(track));
  const [tonicOctave, setTonicOctave] = useState(getInitialTonicOctave(track));
  const [measures, setMeasures] = useState(track.length.bars);
  const [cursorStep, setCursorStep] = useState(0);
  const [notes, setNotes] = useState<EditorNote[]>([]);
  const [pendingNote, setPendingNote] = useState<PendingNote | null>(null);
  const [shiftState, setShiftState] = useState({ left: false, right: false });
  const notesRef = useRef<EditorNote[]>([]);

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  const tonicPc = useMemo(() => {
    const match = NOTE_NAME_OPTIONS.find((option) => option.label === tonicName);
    return match ? match.pc : 0;
  }, [tonicName]);

  const tonicMidi = useMemo(() => {
    const midi = toMidi(tonicPc, tonicOctave);
    return clampMidi(midi) ?? MIN_MIDI;
  }, [tonicOctave, tonicPc]);

  const totalSteps = measures * STEPS_PER_BAR;
  const stepSize = `var(${GRID_STEP_VAR})`;
  const barWidth = `calc(${STEPS_PER_BAR} * ${stepSize})`;

  const handleExport = () => {
    const artistSlug = slugify(artist || 'unknown-artist');
    const titleSlug = slugify(title || 'untitled');
    const exportTrack: Track = {
      id: `${artistSlug}--${titleSlug}`,
      title: title || 'Untitled Track',
      artist: artist || undefined,
      timeSignature: { beatsPerBar: 4, beatUnit: 4 },
      ticksPerBeat: 240,
      tonic: tonicPc,
      tonicMidi,
      tempoBpm: Number(tempoBpm) || undefined,
      length: { bars: measures },
      sections: [
        {
          id: 'section-1',
          name: 'Section 1',
          span: { start: { bar: 0, beat: 0 }, duration: { bars: measures } },
        },
      ],
      bass: {
        events: buildBassEvents(notes),
      },
      beat: {
        events: [],
      },
    };

    const fileName = `${artistSlug}--${titleSlug}.json`;
    const blob = new Blob([JSON.stringify(exportTrack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const availableOctaves = useMemo(() => {
    const octaves: number[] = [];
    for (let octave = 0; octave <= 8; octave += 1) {
      const midi = toMidi(tonicPc, octave);
      if (midi >= MIN_MIDI && midi <= MAX_MIDI) {
        octaves.push(octave);
      }
    }
    return octaves;
  }, [tonicPc]);

  const moveCursor = (delta: number) => {
    setCursorStep((prev) => {
      const next = Math.max(0, prev + delta);
      setMeasures((prevMeasures) => {
        let nextMeasures = prevMeasures;
        if (next >= prevMeasures * STEPS_PER_BAR) {
          nextMeasures = prevMeasures + 1;
        } else if (prevMeasures > 1) {
          const lastMeasureStart = (prevMeasures - 1) * STEPS_PER_BAR;
          if (next < lastMeasureStart) {
            const hasNotesInLast = notesRef.current.some(
              (note) => note.startStep + note.length > lastMeasureStart,
            );
            if (!hasNotesInLast) {
              nextMeasures = prevMeasures - 1;
            }
          }
        }
        return nextMeasures;
      });
      return next;
    });
  };

  const handleDeleteAtCursor = (shouldAdvance: boolean) => {
    setNotes((prev) => {
      const note = findNoteAtStep(prev, cursorStep);
      if (!note) return prev;
      return prev.filter((item) => item.id !== note.id);
    });
    if (shouldAdvance) {
      moveCursor(1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'ShiftLeft') {
      setShiftState((prev) => ({ ...prev, left: true }));
      return;
    }
    if (event.code === 'ShiftRight') {
      setShiftState((prev) => ({ ...prev, right: true }));
      return;
    }

    if (event.code === 'ArrowRight') {
      event.preventDefault();
      if (pendingNote) {
        setPendingNote((prev) =>
          prev
            ? {
                ...prev,
                length: prev.length + 1,
              }
            : prev,
        );
        moveCursor(1);
      } else {
        moveCursor(1);
      }
      return;
    }

    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      if (!pendingNote) {
        moveCursor(-1);
      }
      return;
    }

    if (event.code === 'Space') {
      event.preventDefault();
      if (!pendingNote) {
        handleDeleteAtCursor(true);
      }
      return;
    }

    if (event.code === 'Delete' || event.code === 'Backspace') {
      event.preventDefault();
      if (!pendingNote) {
        handleDeleteAtCursor(false);
      }
      return;
    }

    const key = event.key.toLowerCase();
    if (!(key in NOTE_KEY_MAP) || pendingNote) {
      return;
    }

    const pc = NOTE_KEY_MAP[key];
    const baseOctave = Math.floor(tonicMidi / 12) - 1;
    const octaveOffset = shiftState.right ? 1 : shiftState.left ? -1 : 0;
    const midi = clampMidi(toMidi(pc, baseOctave + octaveOffset));
    if (midi === null) {
      return;
    }

    setPendingNote({
      key,
      startStep: cursorStep,
      length: 1,
      midi,
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'ShiftLeft') {
      setShiftState((prev) => ({ ...prev, left: false }));
      return;
    }
    if (event.code === 'ShiftRight') {
      setShiftState((prev) => ({ ...prev, right: false }));
      return;
    }

    const key = event.key.toLowerCase();
    if (!pendingNote || pendingNote.key !== key) {
      return;
    }

    setNotes((prev) => {
      const trimmed = removeOverlappingNotes(prev, pendingNote.startStep, pendingNote.length);
      return [
        ...trimmed,
        {
          id: `note-${crypto.randomUUID()}`,
          startStep: pendingNote.startStep,
          length: pendingNote.length,
          midi: pendingNote.midi,
        },
      ];
    });
    moveCursor(pendingNote.length);
    setPendingNote(null);
  };

  const renderRow = (barIndex: number, row: 'top' | 'middle' | 'bottom') => {
    const barStart = barIndex * STEPS_PER_BAR;
    const cells: React.ReactNode[] = [];

    for (let offset = 0; offset < STEPS_PER_BAR; offset += 1) {
      const step = barStart + offset;
      const note = findNoteAtStep(notes, step);
      const pendingRange = pendingNote
        ? step >= pendingNote.startStep && step < pendingNote.startStep + pendingNote.length
        : false;

      if (row === 'middle') {
        if (note && note.startStep === step) {
          const interval = getIntervalIndex(note.midi, tonicPc);
          const length = Math.min(note.length, STEPS_PER_BAR - offset);
          cells.push(
            <div
              key={`note-${step}`}
              className="h-full w-full rounded-full"
              style={{
                gridColumnEnd: `span ${length}`,
                backgroundColor: intervalColor(interval),
                border: `1px solid ${intervalBorderColor(interval)}`,
              }}
            />,
          );
          offset += length - 1;
          continue;
        }

        if (pendingRange && pendingNote && pendingNote.startStep === step) {
          const interval = getIntervalIndex(pendingNote.midi, tonicPc);
          const length = Math.min(pendingNote.length, STEPS_PER_BAR - offset);
          cells.push(
            <div
              key={`pending-${step}`}
              className="h-full w-full rounded-full opacity-40"
              style={{
                gridColumnEnd: `span ${length}`,
                backgroundColor: intervalColor(interval),
                border: `1px dashed ${intervalBorderColor(interval)}`,
              }}
            />,
          );
          offset += length - 1;
          continue;
        }
      }

      if (row === 'top' && note && note.startStep === step && note.midi >= tonicMidi + 12) {
        cells.push(
          <div key={`oct-up-${step}`} className="text-center font-bold text-base-content/70">
            ^
          </div>,
        );
        continue;
      }

      if (row === 'bottom' && note && note.startStep === step && note.midi < tonicMidi) {
        cells.push(
          <div key={`oct-down-${step}`} className="text-center font-bold text-base-content/70">
            v
          </div>,
        );
        continue;
      }

      const isCursor = row === 'middle' && step === cursorStep;
      cells.push(
        <div
          key={`dash-${row}-${step}`}
          className={`text-center text-base-content/30 ${isCursor ? 'outline outline-2 outline-primary/70' : ''}`}
        >
          -
        </div>,
      );
    }

    return cells;
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="card border border-base-300 bg-base-100 shadow-sm outline-none"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div className="card-body gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-4 w-4 cursor-pointer rounded-full border border-base-300 bg-error/70"
              onClick={onClose}
              aria-label="Close editor"
            />
            <div className="h-4 w-4 rounded-full border border-base-300 bg-warning/70" />
            <div className="tooltip tooltip-bottom flex items-center" data-tip="Export track">
              <button
                type="button"
                className="h-4 w-4 cursor-pointer rounded-full border border-base-300 bg-success/70"
                onClick={handleExport}
                aria-label="Export track"
              />
            </div>
          </div>
          <span className="text-xs uppercase text-base-content/50">Edit Mode</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="space-y-1">
            <label className="text-xs uppercase text-base-content/50">Title</label>
            <input
              className="input input-bordered w-full"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase text-base-content/50">Author</label>
            <input
              className="input input-bordered w-full"
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase text-base-content/50">Tonic</label>
            <div className="flex gap-2">
              <select
                className="select select-bordered"
                value={tonicName}
                onChange={(event) => setTonicName(event.target.value)}
              >
                {NOTE_NAME_OPTIONS.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered"
                value={tonicOctave}
                onChange={(event) => setTonicOctave(Number(event.target.value))}
              >
                {availableOctaves.map((octave) => (
                  <option key={octave} value={octave}>
                    {octave}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase text-base-content/50">Tempo</label>
            <input
              className="input input-bordered w-full"
              value={tempoBpm}
              onChange={(event) => setTempoBpm(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-y-4">
          {Array.from({ length: measures }, (_, barIndex) => (
            <div key={`bar-${barIndex}`} className="bg-base-200 px-0 py-2" style={{ width: barWidth }}>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-0 grid grid-flow-col"
                  style={{
                    gridTemplateColumns: `repeat(${STEPS_PER_BAR}, minmax(0, ${stepSize}))`,
                    gridAutoColumns: stepSize,
                  }}
                  aria-hidden
                >
                  {Array.from({ length: STEPS_PER_BAR }, (_, step) => {
                    const isBeatStart = step % 4 === 0;
                    return (
                      <div key={`divider-${barIndex}-${step}`} className="relative">
                        {isBeatStart ? (
                          <span
                            className={`absolute left-1/2 -translate-x-1/2 ${
                              step === 0 ? 'top-[-0.35rem] h-[calc(100%+0.7rem)] w-[2px] bg-base-content/80' : 'top-0 h-full w-px bg-base-content/35'
                            }`}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div className="relative grid gap-0">
                  {(['top', 'middle', 'bottom'] as const).map((row) => (
                    <div
                      key={`row-${row}-${barIndex}`}
                      className="grid grid-flow-col items-center text-base-content/30 leading-none"
                      style={{
                        gridTemplateColumns: `repeat(${STEPS_PER_BAR}, minmax(0, ${stepSize}))`,
                        gridAutoColumns: stepSize,
                        height: stepSize,
                      }}
                    >
                      {renderRow(barIndex, row)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <TrackHeader
          track={{
            ...track,
            title,
            artist: artist || undefined,
            tempoBpm: Number(tempoBpm) || undefined,
            tonic: tonicPc,
            tonicMidi,
            length: { bars: measures },
          }}
        />

        <div className="text-xs text-base-content/50">
          Keyboard: Z X C V B N M (naturals), S D G H J (sharps). Hold left/right shift for octave.
        </div>
      </div>
    </div>
  );
}
