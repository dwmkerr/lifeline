# lifeline

Visualise and track key life events with an interactive timeline

## Developer Guide

| Command | Description |
| ------- | ----------- |
| npm run lint | Lint the code with eslint/prettier |
| npm run lint:fix | Fix the code with eslint/prettier |

### Firebase

Use the [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) to help when working with Firebase.

Setup looks like this:

````bash

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

- [ ] refactor: initial page structure with joyui
- [ ] feat: setup firebase login
- [ ] feat: setup firebase collection and repository
