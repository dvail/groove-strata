# Tonal-centric vs chord-centric

## Default: tonal-centric

Compute intervals relative to the global tonic (tonal center). This matches how many modern bass lines behave:

- strong tonal gravity
- riff/loop-based repetition
- modes/pitch collections more than explicit chord spelling

## Optional: chord-centric toggle

Compute intervals relative to the current chord root (when chord metadata exists).
Useful for:

- harmony correctness checks
- walking bass / functional harmony moments
- debugging clashes

Chord-centric should never be the only view; it is a lens.

## Overlays

When intent repeats but harmonic context changes, show pattern intent via overlays (brackets, motif markers),
rather than collapsing interval truth.
