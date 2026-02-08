import type { BassEvent, BeatEvent, Duration, TimePoint, Track } from "./model";

const timePointToTicks = (point: TimePoint, beatsPerBar: number, ticksPerBeat: number): number => {
  const tick = point.tick ?? 0;
  return (point.bar * beatsPerBar + point.beat) * ticksPerBeat + tick;
};

const durationToTicks = (duration: Duration, beatsPerBar: number, ticksPerBeat: number): number => {
  const ticksPerBar = beatsPerBar * ticksPerBeat;
  return (duration.bars ?? 0) * ticksPerBar + (duration.beats ?? 0) * ticksPerBeat + (duration.ticks ?? 0);
};

const ticksToTimePoint = (ticks: number, beatsPerBar: number, ticksPerBeat: number): TimePoint => {
  const ticksPerBar = beatsPerBar * ticksPerBeat;
  const bar = Math.floor(ticks / ticksPerBar);
  const remaining = ticks - bar * ticksPerBar;
  const beat = Math.floor(remaining / ticksPerBeat);
  const tick = remaining - beat * ticksPerBeat;
  return tick === 0 ? { bar, beat } : { bar, beat, tick };
};

export function expandBassEvents(track: Track): BassEvent[] {
  const beatsPerBar = track.timeSignature.beatsPerBar;
  const ticksPerBeat = track.ticksPerBeat;

  const expanded: BassEvent[] = [];

  const patternMap = new Map(track.bass.patterns?.map((pattern) => [pattern.id, pattern]));

  track.bass.placements?.forEach((placement) => {
    const pattern = patternMap.get(placement.patternId);
    if (!pattern) {
      return;
    }
    const patternLengthTicks = durationToTicks(pattern.length, beatsPerBar, ticksPerBeat);
    const everyTicks = placement.repeat?.every
      ? durationToTicks(placement.repeat.every, beatsPerBar, ticksPerBeat)
      : patternLengthTicks;
    const times = placement.repeat?.times ?? 1;

    for (let iteration = 0; iteration < times; iteration += 1) {
      const placementStartTicks =
        timePointToTicks(placement.start, beatsPerBar, ticksPerBeat) + iteration * everyTicks;
      pattern.events.forEach((event, eventIndex) => {
        const eventStartTicks = placementStartTicks + timePointToTicks(event.start, beatsPerBar, ticksPerBeat);
        expanded.push({
          id: `${placement.id}:${iteration}:${eventIndex}`,
          start: ticksToTimePoint(eventStartTicks, beatsPerBar, ticksPerBeat),
          duration: event.duration,
          pitch: event.pitch,
          velocity: event.velocity,
          technique: event.technique,
          tags: event.tags,
        });
      });
    }
  });

  if (track.bass.events) {
    expanded.push(...track.bass.events);
  }

  expanded.sort((a, b) => {
    const aTicks = timePointToTicks(a.start, beatsPerBar, ticksPerBeat);
    const bTicks = timePointToTicks(b.start, beatsPerBar, ticksPerBeat);
    if (aTicks !== bTicks) {
      return aTicks - bTicks;
    }
    return a.id.localeCompare(b.id);
  });

  return expanded;
}

export function expandBeatEvents(track: Track): BeatEvent[] {
  const beatsPerBar = track.timeSignature.beatsPerBar;
  const ticksPerBeat = track.ticksPerBeat;

  const events = [...track.beat.events];
  events.sort((a, b) => {
    const aTicks = timePointToTicks(a.start, beatsPerBar, ticksPerBeat);
    const bTicks = timePointToTicks(b.start, beatsPerBar, ticksPerBeat);
    if (aTicks !== bTicks) {
      return aTicks - bTicks;
    }
    return a.id.localeCompare(b.id);
  });
  return events;
}

export const __test = {
  durationToTicks,
  timePointToTicks,
  ticksToTimePoint,
};
