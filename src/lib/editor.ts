import type { Track } from './model';

export const createEmptyTrack = (): Track => ({
  id: `draft-${crypto.randomUUID()}`,
  title: 'Untitled Track',
  artist: 'Unknown Artist',
  timeSignature: { beatsPerBar: 4, beatUnit: 4 },
  ticksPerBeat: 240,
  tonic: 0,
  tonicMidi: 24,
  length: { bars: 1 },
  sections: [
    {
      id: 'section-1',
      name: 'Section 1',
      span: { start: { bar: 0, beat: 0 }, duration: { bars: 1 } },
    },
  ],
  bass: {
    events: [],
  },
  beat: {
    events: [],
  },
});
