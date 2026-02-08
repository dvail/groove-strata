# Task 002 - Data model + interval math (tonal-centric)

## Goal

Add a minimal data model and interval calculation utilities.

## Scope

- Types: Song, Track, NoteEvent
- Utility: compute tonic-relative chromatic interval class (0-11) and map to named interval enum

## Acceptance

- Unit tests cover at least:
  - octave equivalence
  - all 12 chromatic intervals from tonic
- No UI required yet (pure lib)

## Non-goals

- Chord-relative logic (later task)
- Enharmonic spelling (can be simplified)
