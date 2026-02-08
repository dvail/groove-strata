import { z } from "zod";

export const PitchClassSchema = z.number().int().min(0).max(11);
export type PitchClass = z.infer<typeof PitchClassSchema>;

export const ModeNameSchema = z.enum([
  "major",
  "minor",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "locrian",
]);
export type ModeName = z.infer<typeof ModeNameSchema>;

export const TimeSignatureSchema = z.object({
  beatsPerBar: z.number().int().positive(),
  beatUnit: z.union([z.literal(4), z.literal(8)]),
});
export type TimeSignature = z.infer<typeof TimeSignatureSchema>;

export const TimePointSchema = z.object({
  bar: z.number().int().min(0),
  beat: z.number().min(0),
  tick: z.number().int().min(0).optional(),
});
export type TimePoint = z.infer<typeof TimePointSchema>;

export const DurationSchema = z
  .object({
    bars: z.number().int().min(0).optional(),
    beats: z.number().min(0).optional(),
    ticks: z.number().int().min(0).optional(),
  })
  .refine((value) => value.bars !== undefined || value.beats !== undefined || value.ticks !== undefined, {
    message: "Duration must include at least one unit",
  });
export type Duration = z.infer<typeof DurationSchema>;

export const TimeSpanSchema = z.object({
  start: TimePointSchema,
  duration: DurationSchema,
});
export type TimeSpan = z.infer<typeof TimeSpanSchema>;

export const PitchSpellingSchema = z.object({
  letter: z.enum(["A", "B", "C", "D", "E", "F", "G"]),
  accidental: z.enum(["b", "#", "♮"]).optional(),
  octave: z.number().int().optional(),
});
export type PitchSpelling = z.infer<typeof PitchSpellingSchema>;

export const PitchSchema = z.object({
  midi: z.number().int().min(0).max(127),
  spelling: PitchSpellingSchema.optional(),
});
export type Pitch = z.infer<typeof PitchSchema>;

const SlideTechniqueSchema = z.object({
  type: z.literal("slide"),
  toMidi: z.number().int().min(0).max(127).optional(),
  kind: z.enum(["shift", "legato"]).optional(),
});
const HammerOnTechniqueSchema = z.object({
  type: z.literal("hammerOn"),
  toMidi: z.number().int().min(0).max(127),
});
const PullOffTechniqueSchema = z.object({
  type: z.literal("pullOff"),
  toMidi: z.number().int().min(0).max(127),
});
const BendTechniqueSchema = z.object({
  type: z.literal("bend"),
  cents: z.number().int(),
  curve: z.enum(["linear", "fast", "slow"]).optional(),
});
const VibratoTechniqueSchema = z.object({
  type: z.literal("vibrato"),
  depthCents: z.number().int().optional(),
  rateHz: z.number().positive().optional(),
});
const MuteTechniqueSchema = z.object({
  type: z.literal("mute"),
  kind: z.enum(["palm", "leftHand"]).optional(),
});

export const TechniqueSchema = z.discriminatedUnion("type", [
  SlideTechniqueSchema,
  HammerOnTechniqueSchema,
  PullOffTechniqueSchema,
  BendTechniqueSchema,
  VibratoTechniqueSchema,
  MuteTechniqueSchema,
]);
export type Technique = z.infer<typeof TechniqueSchema>;

export const BassEventSchema = z.object({
  id: z.string(),
  start: TimePointSchema,
  duration: DurationSchema,
  pitch: PitchSchema,
  velocity: z.number().min(0).max(1).optional(),
  technique: z.array(TechniqueSchema).optional(),
  tags: z.array(z.string()).optional(),
});
export type BassEvent = z.infer<typeof BassEventSchema>;

export const BeatEventSchema = z.object({
  id: z.string(),
  start: TimePointSchema,
  instrument: z.enum(["kick", "snare"]),
  velocity: z.number().min(0).max(1).optional(),
});
export type BeatEvent = z.infer<typeof BeatEventSchema>;

export type PatternEvent<TEvent> = Omit<TEvent, "id" | "start"> & {
  start: TimePoint;
  id?: string;
};

export type PatternDef<TEvent> = {
  id: string;
  name?: string;
  length: Duration;
  events: PatternEvent<TEvent>[];
};

export const BassPatternEventSchema = BassEventSchema.omit({ id: true, start: true }).extend({
  id: z.string().optional(),
  start: TimePointSchema,
});

export const BassPatternDefSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  length: DurationSchema,
  events: z.array(BassPatternEventSchema),
});
export type BassPatternDef = z.infer<typeof BassPatternDefSchema>;

export const PatternPlacementSchema = z.object({
  id: z.string(),
  patternId: z.string(),
  start: TimePointSchema,
  repeat: z
    .object({
      times: z.number().int().min(1),
      every: DurationSchema.optional(),
    })
    .optional(),
});
export type PatternPlacement = z.infer<typeof PatternPlacementSchema>;

export const BassTrackSchema = z.object({
  patterns: z.array(BassPatternDefSchema).optional(),
  placements: z.array(PatternPlacementSchema).optional(),
  events: z.array(BassEventSchema).optional(),
});
export type BassTrack = z.infer<typeof BassTrackSchema>;

export const BeatTrackSchema = z.object({
  events: z.array(BeatEventSchema),
});
export type BeatTrack = z.infer<typeof BeatTrackSchema>;

const RomanDataSchema = z.object({
  numeral: z.enum(["I", "ii", "iii", "IV", "V", "vi", "vii°"]),
  quality: z.enum(["maj", "min", "dim", "aug"]).optional(),
  inversion: z.string().optional(),
});
const ChordDataSchema = z.object({
  rootPc: PitchClassSchema,
  quality: z.enum(["maj", "min", "dim", "aug", "sus2", "sus4"]),
  extensions: z.array(z.string()).optional(),
});
const TonicDataSchema = z.object({
  tonicPc: PitchClassSchema,
  mode: ModeNameSchema.optional(),
});

export const HarmonyRegionSchema = z.discriminatedUnion("kind", [
  z.object({
    id: z.string(),
    span: TimeSpanSchema,
    label: z.string(),
    kind: z.literal("roman"),
    data: RomanDataSchema,
  }),
  z.object({
    id: z.string(),
    span: TimeSpanSchema,
    label: z.string(),
    kind: z.literal("chord"),
    data: ChordDataSchema,
  }),
  z.object({
    id: z.string(),
    span: TimeSpanSchema,
    label: z.string(),
    kind: z.literal("tonic"),
    data: TonicDataSchema,
  }),
]);
export type HarmonyRegion = z.infer<typeof HarmonyRegionSchema>;

export const HarmonyTrackSchema = z.object({
  regions: z.array(HarmonyRegionSchema),
});
export type HarmonyTrack = z.infer<typeof HarmonyTrackSchema>;

export const TextAnnotationSchema = z.object({
  id: z.string(),
  span: TimeSpanSchema,
  text: z.string(),
  tags: z.array(z.string()).optional(),
});
export type TextAnnotation = z.infer<typeof TextAnnotationSchema>;

export const SectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  span: TimeSpanSchema,
  kind: z.enum(["intro", "verse", "chorus", "bridge", "outro", "other"]).optional(),
});
export type Section = z.infer<typeof SectionSchema>;

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string().optional(),
  source: z
    .object({
      url: z.string().url().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  timeSignature: TimeSignatureSchema,
  ticksPerBeat: z.number().int().positive(),
  tempoBpm: z.number().positive().optional(),
  tonic: PitchClassSchema,
  mode: ModeNameSchema.optional(),
  length: z.object({
    bars: z.number().int().positive(),
  }),
  sections: z.array(SectionSchema),
  bass: BassTrackSchema,
  beat: BeatTrackSchema,
  harmony: HarmonyTrackSchema.optional(),
  annotations: z.array(TextAnnotationSchema).optional(),
});
export type Track = z.infer<typeof TrackSchema>;
