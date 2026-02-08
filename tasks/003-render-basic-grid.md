# Task 003 - Render basic grid and dots

## Goal

Render a simple timeline grid and note dots from a hardcoded sample song JSON.

## Scope

- A single track view
- X axis: time in beats (simple fixed grid)

## Acceptance

- The default React/Vite UI boilerplate is removed
- A track view should be a contained window within the app. We will add multiple track views in a window in a later task.
- The bassline section of a view should be essentially three rows. The top and bottom rows are dim '-' characters for spacing. The middle row is either the '-' character if there is no note, or an ellipse when a note is being played.
- Note ellipses should be rendered based on the length of the note, and the number of '-' characters in a single bar. For now, a standard 4/4 measure should have 16 '-' per row to represent 16th notes.
- Measures are started and terminated with a vertical line
- The "beat" is denoted by a dim vertical line behind the grid.
- The tonic of the track is displayed somewhere in the track window
- The psycho killer minimal snippet is loaded into a track window by default as a visual test
- Do not worry about ellipse coloration yet, just render each black, but do attach metadata about the notes midi pitch
