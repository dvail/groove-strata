# Codex Project Guidance

## Goal

Build a bass-line visualization tool. Default interpretation is **tonal-centric** (intervals relative to global tonic). Visualize bass lines relative to drum beat skeleton and chord progressions when defined.

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
   - git commits prefixed with task(<id>)

Codex must:

- work on one task at a time
- not skip task numbers
- mark tasks complete when finished

## Commands

- Dev: `npm run dev`
- Lint: `npm run lint`
- Format: `npm run format`
- Build: `npm run build`
- Check: `npm run check`

## Specs to follow

- Color mapping: `docs/design/color-system.md`
- Mental model: `docs/design/tonal-vs-chord.md`

## Tools

This project is built with TypeScript, React, DaisyUI, TailwindCSS, and Zod, so use those tools appropriately when generating code. Check package.json for versions to ensure compatibility.

## UI

You can reference https://daisyui.com/llms.txt in context to understand more about DaisyUI
