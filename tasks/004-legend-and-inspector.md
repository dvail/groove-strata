# Task 004 - Legend + tap inspector (mobile-friendly)

## Goal

Add a legend showing swatches and their interval representation as text. Notes within the track visualization are colored based on their interval from the tonic.

## Acceptance

- Legend matches `docs/design/color-system.md`
- The legend is external to the track display, global on the top of the page
- Each dot same size as display within the track visualization
- Each dot has a text representation of its interval below it (root, m2, M2, m3, M3, P4, TRI... etc.)
- Notes within the visualization are colored based on their interval
- A note's interval is computed relative to its distance from the tonic. For octaves above and below, the color should remain the same
- Colors for each interval are abstracted in a place where their values can be easily tweaked globally. DO NOT set the color via Tailwind classes, unless these are custom classes that can be changed in a single location.
