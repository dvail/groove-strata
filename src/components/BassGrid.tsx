import type { ReactNode } from 'react';

import { expandBassEvents } from '../lib/expand';
import type { BassEvent, Track } from '../lib/model';

const STEPS_PER_BEAT = 4;

type NoteSpan = {
  startStep: number;
  length: number;
  midi: number;
};

type BarIndex = {
  startStep: number;
};

const timePointToTicks = (track: Track, bar: number, beat: number, tick = 0) => {
  const { beatsPerBar } = track.timeSignature;
  const { ticksPerBeat } = track;
  return (bar * beatsPerBar + beat) * ticksPerBeat + tick;
};

const durationToTicks = (track: Track, duration: { bars?: number; beats?: number; ticks?: number }) => {
  const { beatsPerBar } = track.timeSignature;
  const { ticksPerBeat } = track;
  const ticksPerBar = beatsPerBar * ticksPerBeat;
  return (duration.bars ?? 0) * ticksPerBar + (duration.beats ?? 0) * ticksPerBeat + (duration.ticks ?? 0);
};

const buildNoteSpans = (track: Track, events: BassEvent[]): NoteSpan[] => {
  const ticksPerStep = track.ticksPerBeat / STEPS_PER_BEAT;
  return events
    .map((event) => {
      const startTicks = timePointToTicks(track, event.start.bar, event.start.beat, event.start.tick ?? 0);
      const lengthTicks = durationToTicks(track, event.duration);
      return {
        startStep: Math.floor(startTicks / ticksPerStep),
        length: Math.max(1, Math.round(lengthTicks / ticksPerStep)),
        midi: event.pitch.midi,
      };
    })
    .sort((a, b) => a.startStep - b.startStep);
};

const buildRowCells = (
  startStep: number,
  stepsPerBar: number,
  spansByStart: Map<number, NoteSpan>,
  variant: 'top' | 'middle' | 'bottom',
) => {
  const elements: ReactNode[] = [];
  let stepOffset = 0;

  while (stepOffset < stepsPerBar) {
    const globalStep = startStep + stepOffset;
    if (variant === 'middle') {
      const span = spansByStart.get(globalStep);
      if (span) {
        const maxLength = Math.min(span.length, stepsPerBar - stepOffset);
        elements.push(
          <div
            key={`note-${globalStep}`}
            className="h-2 w-full rounded-full bg-black"
            style={{ gridColumnEnd: `span ${maxLength}` }}
            data-midi={span.midi}
            title={`MIDI ${span.midi}`}
          />,
        );
        stepOffset += maxLength;
        continue;
      }
    }

    elements.push(
      <div key={`${variant}-${globalStep}`} className="text-center text-base-content/30">
        -
      </div>,
    );
    stepOffset += 1;
  }

  return elements;
};

type BassGridProps = {
  track: Track;
};

export function BassGrid({ track }: BassGridProps) {
  const bassEvents = expandBassEvents(track);
  const totalBars = track.length.bars;
  const stepsPerBar = track.timeSignature.beatsPerBar * STEPS_PER_BEAT;
  const spans = buildNoteSpans(track, bassEvents);
  const spansByStart = new Map(spans.map((span) => [span.startStep, span]));
  const barWidth = `calc(${stepsPerBar} * 1rem)`;
  const stepSize = '1.5rem';
  const bars: BarIndex[] = Array.from({ length: totalBars }, (_, index) => ({
    startStep: index * stepsPerBar,
  }));

  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body gap-4">
        <div className="flex items-center gap-3">
          <div className="badge badge-outline">Bass</div>
          <span className="text-xs uppercase text-base-content/50">16th note grid</span>
        </div>

        <div className="flex flex-wrap gap-y-4">
          {bars.map((bar, barIndex) => (
            <div key={`bar-${barIndex}`} className="bg-base-200 px-0 py-2" style={{ width: barWidth }}>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-0 grid grid-flow-col auto-cols-[1rem]"
                  style={{ gridTemplateColumns: `repeat(${stepsPerBar}, minmax(0, ${stepSize}))` }}
                  aria-hidden
                >
                  {Array.from({ length: stepsPerBar }, (_, step) => {
                    const isBeatStart = step % STEPS_PER_BEAT === 0;
                    return (
                      <div key={`divider-${barIndex}-${step}`} className="relative">
                        {isBeatStart ? (
                          <span
                            className={`absolute left-1/2 -translate-x-1/2 ${
                              step === 0 ? 'top-[-0.5rem] h-[calc(100%+1rem)] w-[2px] bg-base-content/80' : 'top-0 h-full w-px bg-base-content/35'
                            }`}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div className="relative grid gap-2">
                  <div
                    className="grid grid-flow-col auto-cols-[1rem] text-base-content/30"
                    style={{ gridTemplateColumns: `repeat(${stepsPerBar}, minmax(0, ${stepSize}))` }}
                  >
                    {buildRowCells(bar.startStep, stepsPerBar, spansByStart, 'top')}
                  </div>
                  <div
                    className="grid grid-flow-col auto-cols-[1rem] items-center"
                    style={{ gridTemplateColumns: `repeat(${stepsPerBar}, minmax(0, ${stepSize}))` }}
                  >
                    {buildRowCells(bar.startStep, stepsPerBar, spansByStart, 'middle')}
                  </div>
                  <div
                    className="grid grid-flow-col auto-cols-[1rem] text-base-content/30"
                    style={{ gridTemplateColumns: `repeat(${stepsPerBar}, minmax(0, ${stepSize}))` }}
                  >
                    {buildRowCells(bar.startStep, stepsPerBar, spansByStart, 'bottom')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
