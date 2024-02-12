# lifeline

[![codecov](https://codecov.io/gh/dwmkerr/lifeline/graph/badge.svg?token=lI5Swxa2tj)](https://codecov.io/gh/dwmkerr/lifeline)

Visualise and track key life events with an interactive timeline

## Developer Guide

| Command | Description |
| ------- | ----------- |
| `npm run lint` | Lint the code with eslint/prettier |
| `npm run lint:fix` | Fix the code with eslint/prettier |

### Firebase

Use the [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) to help when working with Firebase.

Setup looks like this:

```bash

# Install firebase CLI tools, then login.
curl -sL firebase.tools | bash
firebase login

# Initialise the firebase project (not needed for most users, only if you are
# forking and building your own project from scratch).
#
# firebase init
#
# Choose: Firestore, Emulators. Lifeline project. Default options seem to be fine.

# Start the emulator, optionally open the web interface.
firebase emulators:start
open http://localhost:4000
```

## Releasing

This project uses [Release Please](https://github.com/googleapis/release-please) to manage releases. As long as you use [Conventional Commit messages](https://www.conventionalcommits.org/en/v1.0.0/), release please will open up a 'release' pull request on the `main` branch when changes are merged. Merging the release pull request will trigger a full release to NPM.

```bash
VERSION="0.1.0" git commit --allow-empty -m "chore: release ${VERSION}" -m "Release-As: ${VERSION}"
```

## Goals

- Build multiple timelines of key life events
- Events might be: where I lived, work, travel, holidays, climbing, medical, etc
- Events can be major or minor, to allow a high level view or detailed view
- Filter that lets you choose which lifelines to show

## Building the line

Could be text based:

```
2021-01-01: home - *moved to UK*
2021-02-03: home - lived in US for a week
```

## TODO

Quick and dirty task list:

- [x] refactor: initial page structure with joyui
- [x] feat: setup firebase login
- [x] feat: setup firebase collection and repository
- [x] feat: csv import
- [x] feat: sort events, sort option in UI for direction
- [x] feat: filter by category
- [x] feat: color category codes
- [x] build: coverage badge
- [x] feat: release please and badge
- [x] feat: edit event
- [x] feat: delete event
- [x] chore: close dialog button on filters
- [x] feat: dialog for import
- [x] feat: delete existing events

- [ ] feat: csv export
- [ ] bug: if cancel during import the menu stays open
- [ ] refactor: cleanup import button and fix styles
- [x] build: fix up main build
- [ ] feat: deploy to firebase on build

### Epic Import Preview

- [ ] feat: import preview / back to column map
- [ ] feat: show warning messages on import preview
