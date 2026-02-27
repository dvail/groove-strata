import type { BassEvent } from './model';

export const STEPS_PER_BAR = 16;
export const MIN_MIDI = 23; // B0
export const MAX_MIDI = 72; // C5

export type EditorNote = {
  id: string;
  startStep: number;
  length: number;
  midi: number;
};

export const toMidi = (pc: number, octave: number) => (octave + 1) * 12 + pc;

export const clampMidi = (midi: number) => (midi < MIN_MIDI || midi > MAX_MIDI ? null : midi);

export const removeOverlappingNotes = (notes: EditorNote[], start: number, length: number) => {
  const end = start + length;
  return notes.filter((note) => {
    const noteEnd = note.startStep + note.length;
    const overlaps = start < noteEnd && end > note.startStep;
    return !overlaps;
  });
};

export const findNoteAtStep = (notes: EditorNote[], step: number) =>
  notes.find((note) => step >= note.startStep && step < note.startStep + note.length);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';

export const buildBassEvents = (notes: EditorNote[]): BassEvent[] =>
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
