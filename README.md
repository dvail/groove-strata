# Groove Strata

Groove Strata is a bass-line visualization and editing app focused on tonal context.
It renders bass notes on a 16th-note grid, colors notes by interval from tonic, loads tracks from an external library repository, and supports in-app track authoring/export.

## What It Does

- Loads a remote track index (`index.json`) and track JSON files from a configurable library URL
- Displays one or more tracks at once in stacked viewers
- Colors notes by interval class relative to track tonic
- Shows octave markers (`^` above, `v` below) relative to `tonicMidi`
- Provides a collapsible global interval legend
- Supports fretboard-based track editing in a dedicated editor view
- Exports authored tracks as JSON files ready for the library repo

## Current Feature Set

### Viewer

- Collapsible left sidebar with track list
- URL input in sidebar to switch library source at runtime
- Open tracks from sidebar; newest opens at top
- Prevent duplicate opens for the same track id
- Close individual track views
- Edit opened tracks via the green header dot
- Track header metadata: title, artist, tonic, tempo, bars
- Bass lane rendering:
  - 4/4 default visual with 16 cells per measure
  - Separate measure/beat overlay layer
  - Top/middle/bottom rows
  - Note width based on duration
  - Interval fill + border color system

### Legend

- Global collapsible legend (shown when at least one track is open)
- Interval swatches + short labels
- Includes octave entry with root color

### Editor

- Floating action button opens one editable draft track view (single editor at a time)
- Editable header fields (click-to-edit):
  - title
  - artist
  - tonic (note + octave dropdown)
  - tempo
- Grid editor initializes from track content and expands/shrinks with cursor movement
- Fretboard note entry:
  - Click/tap fret buttons (open to 12th fret) to insert notes
  - String-count selector supports 4, 5, and 6 string layouts (default 4)
  - Fret markers shown at 3/5/7/9 and double at 12
  - Hover preview shows interval-based fill/border color
  - Hold `Shift` while clicking to start an extendable note
- Pending note extension:
  - `ArrowRight` extends pending note length by 16th increments
  - Releasing `Shift` commits the pending note
- Cursor movement:
  - `ArrowLeft` / `ArrowRight`
  - cursor advances to the end of inserted note
- Editing commands:
  - `Space`: delete note under cursor and advance one step
  - `Delete` / `Backspace`: delete note under cursor without advancing
  - `ArrowUp` / `ArrowDown`: nudge note under cursor by semitone
- Overlap behavior:
  - replacing/deleting affects intersecting note spans
- Export:
  - green editor dot exports JSON
  - filename/id pattern: `artist-slug--title-slug.json`

## Track Library Format

Groove Strata expects an external library root URL with:

- `index.json` at the top level
- track files referenced by `index.json` `path` fields

`index.json` entries currently use:

- `id`
- `title`
- `artist`
- `tonic`
- `tonicMidi`
- `mode`
- `tempoBpm`
- `lengthBars`
- `path`

Default library URL:

- `https://raw.githubusercontent.com/dvail/groove-strata-library/main`

Override via env:

- `VITE_LIBRARY_BASE_URL`

## Development

### Requirements

- Node.js 20+
- npm

### Scripts

- `npm run dev` starts Vite dev server on port `4444`
- `npm run build` type checks + production build
- `npm run lint` runs ESLint
- `npm test` runs Vitest
- `npm run check` runs lint + build

## Tests

Current automated coverage includes:

- data model validation basics
- bass event expansion determinism
- editor utility logic:
  - slug generation
  - midi clamp and pitch conversion
  - overlap removal
  - step-to-event conversion

See:

- `tests/track.test.ts`
- `tests/editor-utils.test.ts`

## GitHub Pages

Deployment is configured via GitHub Actions.

- Workflow: `.github/workflows/deploy-pages.yml`
- Vite base path: `/groove-strata/`

## Codespaces

Dev container is configured for browser-based development (including iPad).

- Config: `.devcontainer/devcontainer.json`
- Post-create installs:
  - project dependencies (`npm ci`)
  - Codex CLI globally (`npm i -g @openai/codex`)
- Port 4444 is forwarded for Vite.
