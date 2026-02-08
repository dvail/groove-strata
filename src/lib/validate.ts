import type { BassEvent, BeatEvent, Duration, PatternPlacement, TimePoint, TimeSpan, Track } from "./model";
import { TrackSchema } from "./model";

export type ValidationError = {
  path: string;
  message: string;
};

type ValidationResult =
  | { ok: true; track: Track }
  | { ok: false; errors: ValidationError[] };

export function validateTrack(input: unknown): ValidationResult {
  const parsed = TrackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  const track = parsed.data;
  const errors: ValidationError[] = [];
  const beatsPerBar = track.timeSignature.beatsPerBar;
  const ticksPerBeat = track.ticksPerBeat;
  const ticksPerBar = beatsPerBar * ticksPerBeat;
  const trackLengthTicks = track.length.bars * ticksPerBar;

  const addError = (path: string, message: string) => {
    errors.push({ path, message });
  };

  const timePointToTicks = (point: TimePoint): number => {
    const tick = point.tick ?? 0;
    return (point.bar * beatsPerBar + point.beat) * ticksPerBeat + tick;
  };

  const durationToTicks = (duration: Duration): number => {
    return (duration.bars ?? 0) * ticksPerBar + (duration.beats ?? 0) * ticksPerBeat + (duration.ticks ?? 0);
  };

  const checkTimePoint = (point: TimePoint, path: string, options?: { skipTrackLength?: boolean }) => {
    if (point.beat < 0 || point.beat >= beatsPerBar) {
      addError(path + ".beat", `Beat must be between 0 and ${beatsPerBar - 1}`);
    }
    if (point.tick !== undefined && (point.tick < 0 || point.tick >= ticksPerBeat)) {
      addError(path + ".tick", `Tick must be between 0 and ${ticksPerBeat - 1}`);
    }
    if (!options?.skipTrackLength && timePointToTicks(point) >= trackLengthTicks) {
      addError(path, "TimePoint exceeds track length");
    }
  };

  const checkDuration = (duration: Duration, path: string) => {
    const hasUnit = duration.bars !== undefined || duration.beats !== undefined || duration.ticks !== undefined;
    if (!hasUnit) {
      addError(path, "Duration must include at least one unit");
      return;
    }
    if (duration.beats !== undefined && (duration.beats < 0 || duration.beats >= beatsPerBar)) {
      addError(path + ".beats", `Beats must be between 0 and ${beatsPerBar - 1}`);
    }
    if (duration.ticks !== undefined && (duration.ticks < 0 || duration.ticks >= ticksPerBeat)) {
      addError(path + ".ticks", `Ticks must be between 0 and ${ticksPerBeat - 1}`);
    }
    if (durationToTicks(duration) <= 0) {
      addError(path, "Duration must be positive");
    }
  };

  const checkSpan = (span: TimeSpan, path: string) => {
    checkTimePoint(span.start, path + ".start");
    checkDuration(span.duration, path + ".duration");
    const spanEnd = timePointToTicks(span.start) + durationToTicks(span.duration);
    if (spanEnd > trackLengthTicks) {
      addError(path, "Span exceeds track length");
    }
  };

  const checkBassEvent = (event: BassEvent, path: string) => {
    checkTimePoint(event.start, path + ".start");
    checkDuration(event.duration, path + ".duration");
    const end = timePointToTicks(event.start) + durationToTicks(event.duration);
    if (end > trackLengthTicks) {
      addError(path, "Bass event exceeds track length");
    }
  };

  const checkBeatEvent = (event: BeatEvent, path: string) => {
    checkTimePoint(event.start, path + ".start");
  };

  const patternIds = new Set((track.bass.patterns ?? []).map((pattern) => pattern.id));

  track.sections.forEach((section, index) => {
    checkSpan(section.span, `sections.${index}.span`);
  });

  track.annotations?.forEach((annotation, index) => {
    checkSpan(annotation.span, `annotations.${index}.span`);
  });

  track.harmony?.regions.forEach((region, index) => {
    checkSpan(region.span, `harmony.regions.${index}.span`);
  });

  track.bass.patterns?.forEach((pattern, patternIndex) => {
    checkDuration(pattern.length, `bass.patterns.${patternIndex}.length`);
    const patternLengthTicks = durationToTicks(pattern.length);
    pattern.events.forEach((event, eventIndex) => {
      const eventPath = `bass.patterns.${patternIndex}.events.${eventIndex}`;
      checkTimePoint(event.start, eventPath + ".start", { skipTrackLength: true });
      checkDuration(event.duration, eventPath + ".duration");
      const end = timePointToTicks(event.start) + durationToTicks(event.duration);
      if (end > patternLengthTicks) {
        addError(eventPath, "Pattern event exceeds pattern length");
      }
    });
  });

  track.bass.placements?.forEach((placement, index) => {
    checkPlacement(placement, `bass.placements.${index}`);
  });

  track.bass.events?.forEach((event, index) => {
    checkBassEvent(event, `bass.events.${index}`);
  });

  track.beat.events.forEach((event, index) => {
    checkBeatEvent(event, `beat.events.${index}`);
  });

  function checkPlacement(placement: PatternPlacement, path: string) {
    checkTimePoint(placement.start, path + ".start");
    if (!patternIds.has(placement.patternId)) {
      addError(path + ".patternId", "Pattern reference does not resolve");
    }
    const times = placement.repeat?.times ?? 1;
    if (times < 1) {
      addError(path + ".repeat.times", "Repeat times must be at least 1");
    }
    if (placement.repeat?.every) {
      checkDuration(placement.repeat.every, path + ".repeat.every");
    }
    const pattern = track.bass.patterns?.find((item) => item.id === placement.patternId);
    if (pattern) {
      const patternLengthTicks = durationToTicks(pattern.length);
      const everyTicks = placement.repeat?.every ? durationToTicks(placement.repeat.every) : patternLengthTicks;
      for (let i = 0; i < times; i += 1) {
        const iterationStart = timePointToTicks(placement.start) + i * everyTicks;
        if (iterationStart + patternLengthTicks > trackLengthTicks) {
          addError(path, "Pattern placement exceeds track length");
          break;
        }
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, track };
}
