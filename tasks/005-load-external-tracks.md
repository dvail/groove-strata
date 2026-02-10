# Task 005 - Load external tracks

## Goal

Example tracks have been removed from this repo. We now want to add tracks from an external repository.

## Acceptance

This is a large change with many incremental steps. After each step, verify that the change works and then commit it separately.

Here are the order tasks to complete:

1. Add a collapsible sidebar to the left hand side of the page. The sidebar should have some clickable element to open/close it. Our component library may already have this.

2. When the page initially loads, reach out to https://github.com/dvail/groove-strata-library and grab the `index.json` file. This file is used to build the index of all tracks that are available. Make sure that the URL is in a configurable place, as we will want to change or add libraries in the future. When the index is loaded, list the tracks in the left hand sidebar.

3. When the sidebar is opened, clicking a track will open it in the main pane. You should allow multiple tracks to be opened at once, adding new tracks to the top of the viewer. These tracks should also have the ability to be closed by clicking some control on the top. Right now we are using the Daisy "Code Mockup" component. It would be great if this supported closing via the MacOS style dots on the top of each component. A single track should not be able to be opened more than once.
