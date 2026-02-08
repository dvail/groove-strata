export type IntervalSpec = {
  semitones: number;
  label: string;
  shortLabel: string;
  cssVar: string;
};

export const INTERVALS: IntervalSpec[] = [
  { semitones: 0, label: 'Root', shortLabel: 'root', cssVar: '--interval-0' },
  { semitones: 1, label: 'Minor 2nd', shortLabel: 'm2', cssVar: '--interval-1' },
  { semitones: 2, label: 'Major 2nd', shortLabel: 'M2', cssVar: '--interval-2' },
  { semitones: 3, label: 'Minor 3rd', shortLabel: 'm3', cssVar: '--interval-3' },
  { semitones: 4, label: 'Major 3rd', shortLabel: 'M3', cssVar: '--interval-4' },
  { semitones: 5, label: 'Perfect 4th', shortLabel: 'P4', cssVar: '--interval-5' },
  { semitones: 6, label: 'Tritone', shortLabel: 'TRI', cssVar: '--interval-6' },
  { semitones: 7, label: 'Perfect 5th', shortLabel: 'P5', cssVar: '--interval-7' },
  { semitones: 8, label: 'Minor 6th', shortLabel: 'm6', cssVar: '--interval-8' },
  { semitones: 9, label: 'Major 6th', shortLabel: 'M6', cssVar: '--interval-9' },
  { semitones: 10, label: 'Minor 7th', shortLabel: 'm7', cssVar: '--interval-10' },
  { semitones: 11, label: 'Major 7th', shortLabel: 'M7', cssVar: '--interval-11' },
  { semitones: 12, label: 'Octave', shortLabel: '8ve', cssVar: '--interval-0' },
];

export const GRID_STEP_VAR = '--grid-step-size';

export const getIntervalIndex = (midi: number, tonicPc: number) => (midi % 12 - tonicPc + 12) % 12;

export const getIntervalSpec = (semitones: number) => INTERVALS[semitones] ?? INTERVALS[0];

export const intervalColor = (semitones: number) => `var(${getIntervalSpec(semitones).cssVar})`;
