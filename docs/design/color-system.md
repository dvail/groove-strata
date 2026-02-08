# Interval color system (v1)

This is a **function-first** palette for bass-line visualization.
Default interpretation is **tonal-centric** (interval relative to tonic).

## Core principles

- Root/octave = authoritative neutral
- 3rds define tonal identity (major vs minor)
- 5th = stable structural support, neutral
- m7 = common extension, important but not identity-defining
- M7 = rarer, directional/fragile; distinct but related to m7
- 2nds = motion/friction
- 6ths = modal/emotional color
- tritone = abrasive/unstable

## Mapping (interval -> color)

**Note - these colors should be defined in a central location. They _will not_ remain what is stated here indefinitely.**

Authority / structure:

- Root / Octave: `#111111`
- Perfect 5th: `#FFFFFF`
- Perfect 4th: `#D0D0D0` (light gray, weaker than 5th)
- Tritone (b5/#4): `#7A4A2E` (rusty, abrasive)

Tonal identity:

- Major 3rd: `#D7263D` (red)
- Minor 3rd: `#1F77B4` (blue)

7ths:

- Minor 7th: `#F2C200` (yellow)
- Major 7th: `#FFE0B8` (peach, biased toward yellow vs orange)

2nds (motion):

- Major 2nd: `#5EC962` (green)
- Minor 2nd: `#A6E22E` (acid green)

6ths (modal/emotional):

- Minor 6th: `#5A3E85` (deep purple)
- Major 6th: `#9B7EDB` (lighter lavender)
