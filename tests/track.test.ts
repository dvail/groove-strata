import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { expandBassEvents } from "../src/lib/expand";
import type { Track } from "../src/lib/model";
import { validateTrack } from "../src/lib/validate";

describe("track validation", () => {
  it("validates the example JSON", () => {
    const examplePath = new URL("../src/lib/examples/demo-track.json", import.meta.url);
    const example = JSON.parse(readFileSync(examplePath, "utf8"));
    const result = validateTrack(example);
    expect(result.ok).toBe(true);
  });
});

describe("bass pattern expansion", () => {
  it("expands repeated patterns deterministically", () => {
    const track: Track = {
      id: "test",
      title: "Test",
      timeSignature: { beatsPerBar: 4, beatUnit: 4 },
      ticksPerBeat: 240,
      tonic: 0,
      length: { bars: 8 },
      sections: [
        {
          id: "sec",
          name: "Verse",
          span: { start: { bar: 0, beat: 0 }, duration: { bars: 8 } },
        },
      ],
      bass: {
        patterns: [
          {
            id: "pattern-a",
            length: { bars: 2 },
            events: [
              {
                start: { bar: 0, beat: 0 },
                duration: { beats: 1 },
                pitch: { midi: 40 },
              },
              {
                start: { bar: 0, beat: 2 },
                duration: { beats: 1 },
                pitch: { midi: 43 },
              },
            ],
          },
        ],
        placements: [
          {
            id: "place-a",
            patternId: "pattern-a",
            start: { bar: 0, beat: 0 },
            repeat: { times: 4 },
          },
        ],
        events: [
          {
            id: "one-off",
            start: { bar: 1, beat: 0 },
            duration: { beats: 1 },
            pitch: { midi: 45 },
          },
        ],
      },
      beat: {
        events: [{ id: "kick-0", start: { bar: 0, beat: 0 }, instrument: "kick" }],
      },
    };

    const expanded = expandBassEvents(track);

    const starts = expanded.map((event) => [event.start.bar, event.start.beat]);
    expect(starts).toEqual([
      [0, 0],
      [0, 2],
      [1, 0],
      [2, 0],
      [2, 2],
      [4, 0],
      [4, 2],
      [6, 0],
      [6, 2],
    ]);

    expect(expanded[0]?.id).toBe("place-a:0:0");
    expect(expanded[1]?.id).toBe("place-a:0:1");
    expect(expanded.at(-1)?.id).toBe("place-a:3:1");
  });
});
