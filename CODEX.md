# Codex Session Bootstrap

## Canonical Product Context

- `README.md` is the canonical high-level description of product behavior and implemented features.
- At the start of any new session, read `README.md` first, then use this file for quick operational guidance.
- Any feature, behavior, workflow, or infrastructure change that affects user/developer understanding must update `README.md` in the same change set.
- Keep `README.md` and `CODEX.md` aligned so session bootstrapping remains fast and accurate.

## Project Summary

Groove Strata is a React + TypeScript app for bass-line visualization and keyboard-driven track authoring.
Tracks are loaded from an external repository (via `index.json` + JSON files), rendered on a 16th-note grid, interval-colored relative to tonic, and exportable back to library-compatible JSON.

## Current Scope (Implemented)

### Core model and utilities

- Zod-first model in `src/lib/model.ts`
- Runtime validation in `src/lib/validate.ts`
- Pattern/event expansion in `src/lib/expand.ts`
- Editor logic helpers in `src/lib/editor-utils.ts`

### Viewer (Tasks 003-005)

- Sidebar track browser with runtime-configurable library URL
- Remote index + track loading (`src/lib/library.ts`)
- Multi-track stacked viewing
- Closable track cards
- Bass grid with measure/beat overlay and 16th-note cells
- Interval color + border mapping from CSS vars in `src/index.css`
- Octave markers in grid (`^`/`v`) using `tonicMidi`
- Collapsible global legend (`src/components/Legend.tsx`)

### Editor (Task 006)

- FAB opens a single draft editor
- Click-to-edit header fields: title, artist, tonic, tempo
- Keyboard note entry (note keys + shift octave modifiers)
- Cursor movement and note extension on right arrow while key held
- Delete behaviors (`Space`, `Delete`, `Backspace`)
- Semitone nudging (`ArrowUp`, `ArrowDown`)
- Measure auto-grow on forward movement, conditional shrink on backward movement
- JSON export from green dot using library-friendly slug format

### Infrastructure

- GH Pages workflow in `.github/workflows/deploy-pages.yml`
- Vite base path set for pages in `vite.config.ts`
- Codespaces devcontainer in `.devcontainer/devcontainer.json`

## External Library Contract

Default base URL:

- `https://raw.githubusercontent.com/dvail/groove-strata-library/main`

Config override:

- `VITE_LIBRARY_BASE_URL`

Expected files at library root:

- `index.json`
- Track JSON files referenced by each index entry `path`

## Commands

- `npm run dev` (port `4444`)
- `npm run lint`
- `npm run build`
- `npm test`
- `npm run check`

## Test Coverage

- `tests/track.test.ts`: model validation + pattern expansion
- `tests/editor-utils.test.ts`: key map, midi helpers, overlap removal, export conversion logic

## Workflow Rules

- Work tasks in order from `tasks/` unless user explicitly reprioritizes
- Keep commits focused and incremental; larger tasks should be split by acceptance steps
- Run `npm run lint` and `npm run build` before finalizing non-trivial changes
- Add/update tests for behavior changes in model/editor/grid logic

## Key Files

- `src/App.tsx`
- `src/components/TrackView.tsx`
- `src/components/BassGrid.tsx`
- `src/components/TrackEditor.tsx`
- `src/components/Legend.tsx`
- `src/lib/model.ts`
- `src/lib/validate.ts`
- `src/lib/expand.ts`
- `src/lib/editor-utils.ts`
- `src/lib/library.ts`
- `src/index.css`

## Design References

- `docs/design/color-system.md`
- `docs/design/tonal-vs-chord.md`
