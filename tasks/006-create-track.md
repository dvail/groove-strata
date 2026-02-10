# Task 006 - Track creation

## Goal

This task will allow the user to create, edit, and export tracks so that they can be uploaded to the library.

## Acceptance

Multiple sub steps, each one should be verified and committed separately.

1. A new UI element to "create track" is added. Maybe a FAB? This element opens a track viewer in edit mode.

2. The edit mode track viewer has the following functionality

- The title, author, tonic, and tempo should be editable fields
- A single empty measure is present by default. A cursor is added as a new overlay on the first beat of this measure. This cursor will simulate where the user is changing the track. This measure will be in 4/4 time, and have 16 dashes representing incremenets
- The actions are keyboard driven.
- The following keys map to the following natural notes:
  Z -> C
  X -> D
  C -> E
  V -> F
  B -> G
  N -> A
  M -> B
  S -> C#
  D -> D#
  G -> F#
  H -> G#
  J -> A#
- Pressing one of these keys without modifiers adds the note in place, using the octave defined by the current tonic.
- Pressing one of these keys with LEFT shift held down adds the note an octave below.
- Pressing one of these keys with RIGHT shift held down adds the note an octave above.
- The note should be added upon _release_ of the key. This is important as it pertains to how we handle note length.
- Pressing a note key down, and pressing the right arrow key will extend the length of the note by one increment. When the letter key is released, it will add a note the length of the selected increments.
- Pressing the left and right arrow keys when a note is not pressed will move the cursor backwards or forwards, respectively.
- Pressing spacebar will delete any note under the cursor, and move the cursor one increment to the right.
- Pressing delete will delete the note under the cursor, and not move the cursor.
- If a note is deleted, or a note is added on top of where another note is present, it will delete or replace the entire length of the note that is affected.

3. The green button in the card header will now become an export button. Clicking this button will download the track as a JSON file.
