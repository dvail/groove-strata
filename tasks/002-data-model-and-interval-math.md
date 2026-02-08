# Task 002 — Core data model (track + events + sections + repetition)

## Why this task exists

This project lives or dies on the core data model. We need a representation that is:

- friendly to incremental UI building
- stable under iteration
- supports tonal-centric analysis by default
- supports optional chord/tonic overlays
- supports repeatable sections without copy/paste data bloat

This task defines types + example JSON only. No UI required.

---

## Goals

Implement the core TypeScript types for:

1. A top-level **Track** object that holds metadata and musical context for a song/snippet
2. A **bass line** timeline with pitch + duration + optional expressive techniques (slide, bend, hammer-on, etc.)
3. A minimal **beat** timeline (kick/snare only for now)
4. **Harmony overlays**: chord progression and/or section-relative tonics, defined over ranges
5. **Text annotations** pinned to ranges
6. Optional **section abstraction + repetition** so repeated patterns don’t require duplicating event data

We will use a **bar/beat based timeline**, not absolute time, to keep it musical and editable.

---

## Non-goals (explicit)

- No rendering/UI
- No audio/MIDI import/export
- No editing workflow (yet)
- No advanced drum patterns beyond kick/snare
- No enharmonic spelling correctness; pitch spelling can be minimal
- No full general-purpose DAW model

---

## Deliverables

### A) Types

Create `src/lib/model.ts` exporting types/interfaces (all serializable to JSON).

### B) Example data

Create `src/lib/examples/talking-heads---psycho-killer.json` (or similar) with realistic-looking placeholder data:

- Track metadata
- One repeating bass section
- Basic kick/snare
- A chord overlay / roman numerals overlay
- A text note annotation

### C) Validation

Use Zod to generate types, as we will need to parse and validate external JSON
and ensure the structure is correct.
Create `src/lib/validate.ts` with lightweight runtime checks (no heavy schema lib):

- ensure bars/beats are in range
- ensure durations are positive
- ensure section references resolve
  Return validation errors for review

### D) Unit tests

Add tests verifying:

- JSON example conforms to validation
- section repetition expands into concrete events deterministically (see below)

Use Vitest if present; if not present, add it as part of this task.

---

## Core timeline model

### Timebase

Use a structured musical time coordinate:

- **bar**: integer (0-based)
- **beat**: number (0..beatsPerBar)
- **tick**: optional integer for sub-beat resolution (0..ticksPerBeat-1)

Define:

- `TimePoint { bar: number; beat: number; tick?: number }`
- `TimeSpan { start: TimePoint; end: TimePoint }` OR `{ start: TimePoint; duration: Duration }`

For MVP data model, prefer **start + duration** to avoid end math:

- `Duration { bars?: number; beats?: number; ticks?: number }`

Track defines:

- `timeSignature: { beatsPerBar: number; beatUnit: 4 | 8 }`
- `ticksPerBeat: number` (default 480 or 240; pick 240 for simplicity)

We need deterministic ordering + comparisons:

- Add helper functions later; for now, the model should support them.
- We will need to have changing time signatures within a track down the line, so keep that in mind for the MVP

---

## Top-level object: Track

A `Track` represents a song/snippet definition.

Required fields:

- `id: string`
- `title: string` (e.g., "Don't Start Now")
- `artist?: string`
- `source?: { url?: string; notes?: string }`
- `timeSignature`
- `tempoBpm?: number` (optional; we are bar/beat driven)
- `tonic: PitchClass` (global tonal center, default interpretation)
- `mode?: ModeName` (optional; mostly informational)
- `length: { bars: number }` (explicit timeline length)

Contains:

- `sections: Section[]` (for labeling and repetition)
- `bass: BassTrack`
- `beat: BeatTrack`
- `harmony?: HarmonyTrack`
- `annotations?: TextAnnotation[]`

---

## Pitch + note representation

### Pitch

Represent pitch as MIDI note number for simplicity:

- `midi: number` (0..127)

Also define:

- `PitchClass = 0..11`
- Optional `spelling?: { letter: 'A'..'G'; accidental?: 'b'|'#'|'♮'; octave?: number }` for display-only; not required.

We will compute pitch class from `midi % 12`.

---

## Bass line

### BassTrack

Two-layer model:

- **patterns**: reusable sequences defined locally
- **placements**: where patterns occur in the global timeline
- **events**: one-off events (optional)

Define:

- `BassTrack { patterns?: PatternDef<BassEvent>[]; placements?: PatternPlacement[]; events?: BassEvent[] }`

#### BassEvent (atomic)

Represents a sounding note with possible expressive technique metadata.

Required:

- `id: string`
- `start: TimePoint`
- `duration: Duration`
- `pitch: { midi: number }`

Optional:

- `velocity?: number` (0..1)
- `technique?: Technique[]`
- `tags?: string[]` (e.g., ["ghost", "accent"])

#### Techniques

Keep techniques as extensible tagged objects; start with a few:

- `slide { toMidi?: number; kind?: 'shift'|'legato' }`
- `hammerOn { toMidi: number }`
- `pullOff { toMidi: number }`
- `bend { cents: number; curve?: 'linear'|'fast'|'slow' }`
- `vibrato { depthCents?: number; rateHz?: number }`
- `mute { kind?: 'palm'|'leftHand' }`

Technique objects should not require full physical realism; they are metadata for visualization.

---

## Beat track (kick/snare)

### BeatTrack

Similar structure, but events are discrete hits.

- `BeatTrack { events: BeatEvent[] }`

BeatEvent:

- `id: string`
- `start: TimePoint`
- `instrument: 'kick' | 'snare'`
- `velocity?: number`

No duration needed (treated as instantaneous).

---

## Harmony overlays (chords / roman numerals / section tonics)

We need range-based overlays. Do not force a single representation.

### HarmonyTrack

- `HarmonyTrack { regions: HarmonyRegion[] }`

HarmonyRegion:

- `id: string`
- `span: TimeSpan` (start + duration OR start/end, choose one and be consistent)
- `label: string` (for display)
- `kind: 'roman' | 'chord' | 'tonic'`
- `data: ...` depending on kind

For v1, define:

- Roman: `{ numeral: 'I'|'ii'|'iii'|'IV'|'V'|'vi'|'vii°'; quality?: 'maj'|'min'|'dim'|'aug'; inversion?: string }`
- Chord: `{ rootPc: PitchClass; quality: 'maj'|'min'|'dim'|'aug'|'sus2'|'sus4'; extensions?: string[] }`
- Tonic: `{ tonicPc: PitchClass; mode?: ModeName }`

We want to support:

- "four measures of I, two of IV, two of vi"
- "section-relative tonic changes"

Therefore: treat these regions as independent overlays that the UI can show as lanes.

---

## Text annotations (non-musical notes)

Text annotations are pinned to ranges.

- `TextAnnotation { id: string; span: TimeSpan; text: string; tags?: string[] }`

Examples:

- "chorus groove locks in here"
- "note: bass outlines Locrian pitch set"

---

## Sections + repetition

### Section

Sections are named ranges and can be repeated.

- `Section { id: string; name: string; span: TimeSpan; kind?: 'intro'|'verse'|'chorus'|'bridge'|'outro'|'other' }`

### Pattern system

We want to avoid repeating event data for e.g. 16 bars of the same groove.

Define reusable patterns that are local-coordinate:

- Pattern events have `start` relative to pattern start, where pattern start is `{bar:0, beat:0, tick:0}`.

`PatternDef<TEvent> { id: string; name?: string; length: Duration; events: Omit<TEvent, 'start'|'id'> & { start: TimePoint; id?: string } }`

Pattern placement:

- `PatternPlacement { id: string; patternId: string; start: TimePoint; repeat?: { times: number; every: Duration } }`

Rules:

- `repeat.times` >= 1
- if repeat is missing, times = 1
- `every` defaults to pattern length if omitted
- expanded instances must produce deterministic event IDs (e.g., `${placementId}:${iteration}:${eventIndex}`)

### Expansion helper

Create `src/lib/expand.ts` with:

- `expandBassEvents(track: Track): BassEvent[]`
- `expandBeatEvents(track: Track): BeatEvent[]` (optional; beat track may not use patterns now)

Expansion should:

- merge one-off `events` + expanded pattern instances
- sort by start time
- not mutate input
- produce stable IDs

---

## Acceptance criteria

- Types compile with TypeScript
- Example JSON validates with `validateTrack()`
- `expandBassEvents()` expands repeated patterns correctly (test with a 2-bar pattern repeated 4 times)
- No UI work done
- No new runtime deps except Vitest (if needed)

---

## Notes for future tasks (do NOT implement now)

- interval math (tonal-centric) will use pitch class and `track.tonic`
- chord-centric toggle will use `HarmonyRegion` of kind 'chord' or 'roman' to define chord roots over time
- UI will render lanes: bass, beat, harmony overlays, annotations
