# Codex Project Guidance

## Goal

Build a bass-line visualization tool. Default interpretation is **tonal-centric** (intervals relative to global tonic).
Chord-centric is a secondary toggle (optional).

## Non-goals (for now)

- Traditional notation replacement
- MIDI import/export
- Audio playback
- Complex multi-track editing

## Workflow rules (must follow)

1. Pick the next task from `tasks/` (lowest number not done).
2. Keep changes small and reviewable (prefer < ~300 LOC diff).
3. Do not refactor unrelated code.
4. Add/adjust tests when logic changes.
5. Run:
   - `npm run lint`
   - `npm run build`
6. Summarize in the PR/commit message:
   - what changed
   - how to verify
   - known limitations

## Commands

- Dev: `npm run dev`
- Lint: `npm run lint`
- Format: `npm run format`
- Build: `npm run build`
- Check: `npm run check`

## Specs to follow

- Color mapping: `docs/design/color-system.md`
- Mental model: `docs/design/tonal-vs-chord.md`
