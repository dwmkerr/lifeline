# lifeline

[![main](https://github.com/dwmkerr/lifeline/actions/workflows/main.yaml/badge.svg)](https://github.com/dwmkerr/lifeline/actions/workflows/main.yaml) [![codecov](https://codecov.io/gh/dwmkerr/lifeline/graph/badge.svg?token=lI5Swxa2tj)](https://codecov.io/gh/dwmkerr/lifeline)

Visualise and track key life events with an interactive timeline.

https://lifeline.rocks

<!-- vim-markdown-toc GFM -->

- [Developer Guide](#developer-guide)
    - [Firebase](#firebase)
- [Releasing](#releasing)
- [Goals](#goals)
- [Building the line](#building-the-line)
- [TODO](#todo)
    - [Epic - Blur Categories](#epic---blur-categories)
    - [Epic - Demo lifelines](#epic---demo-lifelines)
    - [Epic - Manage Categories](#epic---manage-categories)
    - [Epic Import Preview](#epic-import-preview)
    - [Events to add](#events-to-add)
    - [Feedback](#feedback)

<!-- vim-markdown-toc -->

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

Deploy indexes and rules with:

```bash
firebase deploy --only firestore:rules firestore:indexes

```

## Releasing

This project uses [Release Please](https://github.com/googleapis/release-please) to manage releases. As long as you use [Conventional Commit messages](https://www.conventionalcommits.org/en/v1.0.0/), release please will open up a 'release' pull request on the `main` branch when changes are merged. Merging the release pull request will trigger a full release to NPM.

```bash
VERSION="0.1.0" git commit --allow-empty -m "chore: release ${VERSION}" -m "Release-As: ${VERSION}"
```

Note that currently firestore configuration (security rules and indexes) is not deployed as part of this process, to avoid unexpected downtime while indexes rebuild. Manually deploy these changes as needed.

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
- [x] bug: if cancel during import the menu stays open
- [x] refactor: cleanup import button and fix styles
- [x] build: fix up main build
- [x] favicon (heart?)
- [x] add event as modal to save space
- [x] add event / edit event modal errors
- [x] add/edit event required fields
- [x] retire 'add event' from the top bar
- [x] feat: deploy to firebase on build
- [x] search bar
- [x] feat: major/minor events
- [x] feat: user settings (DOB, show age)
- [x] feat: show age in timeline
- [x] feat: filter by date, refactor into a filters object
- [x] feat: emoji for categories
- [x] feat: emoji in category dot
- [x] feat: filters select all select none
- [x] bug: add events resets filters (e.g. category)
- [ ] bug: cannot key in a category in add/edit event

**Demoable**

- [x] feat: welcome page
- [x] feat: on start, show welcome screen if not logged in
- [x] feat: loading spinner
- [x] feat: show warning to regularly export events
- [x] feat: use cloud firestore rather than local
- [x] feat: feedback option
- [x] feat: show version number in menu
- [ ] fix: all events are viewable by all users
- [ ] build: 'yes/no' step on build to deploy firebase changes - can you dry-run firebase for changes? If so the website deploy should also be gated in the same 'yes/no' step
- [ ] feat: fix up autocomplete to use the same style of text entry as for tripweather

**v0.3**

- [ ] chore: fix version number to 0.x series

- [ ] feat: watch for firestore errors, test with new site
- [ ] feat: consider moving search and filters into a filters context so it can be set from anywhere, e.g. on a dropdown from the life events letting you filter to similar events
- [ ] feat: filters button on navbar, side drawer without overlay / close panel icon

- [ ] bug: hard bug - category selection in the filters should be preserved when adding/deleting/changing events, first try caused them all to blank out, next try didn't pick up new ones, etc

- [ ] minor bug: prevent focus for emoji picker?

- [ ] feat: for emotional impact, option to toggle between category and impact in the timeline view

Link domain
“Search” category for events that need research
“Don’t know” emoji for impact / severity
add starting therapy in uk
add cheltenham

### Epic - Blur Categories

Option to 'blur' categories so when sharing the screen the details are kept private.

### Epic - Demo lifelines

On new user sign up show a demo lifeline and add a user setting 'demo', when this setting is on offer an alert on startup showing it is a demo with the option to remove all values.

### Epic - Manage Categories

- [ ] feat: suggest categories in drop down list for new events
- [ ] feat: for category select in add/edit, consider the categories in autocomplete with an 'add' button to add a new category

### Epic Import Preview

- [ ] feat: import preview / back to column map
- [ ] feat: show warning messages on import preview
- [ ] bug: check autofocus on import/export

### Events to add

- adopted
- remarry / ruth
- remarry / guy
- meet / patrick

### Feedback

Ideas from Michelle:

Adverse child experiences scoring. For life events, can you categorise the event as e.g. 'moving', 'depression', 'psychiatric event', 'relationship'. These could be thought of as life-transitions. You could then see that for example prior to a depressive episode there were a series of life transitions that were stressful.

In terms of your own attitude about things that happened; was this event for you happy or dreadful? Could you also add how you feel about it.

Also look at 'impact' as major/minor. The size of the icon could be the majority of the event. Things could be color coded or icons could be sized to see how impactful the event is but also then what the impact is.

When you click and collapse into chronological order. Consider an emoji for how you feel about it.

- [ ] feat: 'major' should be re-classified as 'impact', which could be minor/intense/etc, this should be an emoji based system
- [ ] feat: 'category' should offer an emoji, major events should show larger so that they can be more easily seen
