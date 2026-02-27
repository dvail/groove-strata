import { describe, expect, it } from 'vitest';

import {
  buildBassEvents,
  clampMidi,
  findNoteAtStep,
  removeOverlappingNotes,
  slugify,
  STEPS_PER_BAR,
  toMidi,
} from '../src/lib/editor-utils';

const notes = [
  { id: 'a', startStep: 0, length: 2, midi: 36 },
  { id: 'b', startStep: 4, length: 4, midi: 38 },
  { id: 'c', startStep: 10, length: 2, midi: 40 },
];

describe('editor-utils', () => {
  it('slugify produces stable filenames', () => {
    expect(slugify('Talking Heads')).toBe('talking-heads');
    expect(slugify('  Hello   World  ')).toBe('hello-world');
    expect(slugify('@@@')).toBe('untitled');
  });

  it('clampMidi enforces B0 to C5 range', () => {
    expect(clampMidi(23)).toBe(23);
    expect(clampMidi(72)).toBe(72);
    expect(clampMidi(22)).toBeNull();
    expect(clampMidi(73)).toBeNull();
  });

  it('toMidi converts pitch class and octave', () => {
    expect(toMidi(0, 1)).toBe(24);
    expect(toMidi(9, 1)).toBe(33);
    expect(toMidi(0, 4)).toBe(60);
  });

  it('findNoteAtStep returns the correct note', () => {
    expect(findNoteAtStep(notes, 0)?.id).toBe('a');
    expect(findNoteAtStep(notes, 1)?.id).toBe('a');
    expect(findNoteAtStep(notes, 4)?.id).toBe('b');
    expect(findNoteAtStep(notes, 8)).toBeUndefined();
  });

  it('removeOverlappingNotes removes intersecting notes', () => {
    const result = removeOverlappingNotes(notes, 3, 4);
    expect(result.map((note) => note.id)).toEqual(['a', 'c']);
  });

  it('buildBassEvents converts steps to bars and beats', () => {
    const events = buildBassEvents([
      { id: 'a', startStep: 0, length: 4, midi: 36 },
      { id: 'b', startStep: 5, length: 2, midi: 38 },
      { id: 'c', startStep: STEPS_PER_BAR + 2, length: 1, midi: 40 },
    ]);

    expect(events[0]?.start).toEqual({ bar: 0, beat: 0 });
    expect(events[0]?.duration).toEqual({ beats: 1 });
    expect(events[1]?.start).toEqual({ bar: 0, beat: 1.25 });
    expect(events[1]?.duration).toEqual({ beats: 0.5 });
    expect(events[2]?.start).toEqual({ bar: 1, beat: 0.5 });
    expect(events[2]?.duration).toEqual({ beats: 0.25 });
  });
});
