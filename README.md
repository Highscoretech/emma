# CGPA Calculator

A mobile CGPA calculator for Nigerian universities (5-point scale), built with React Native + Expo. Fully offline — all data lives on the device.

## Quick start

```
cd app
npm install
npm start
```

Then scan the QR code with [Expo Go](https://expo.dev/go) on your Android or iPhone.

## Documentation

- **[RUNNING.md](RUNNING.md)** — beginner-friendly setup guide: prerequisites, running locally, testing on a real phone, building APKs
- **[MILESTONES.md](MILESTONES.md)** — full project plan, milestone-by-milestone breakdown, decisions log

## What's inside

- [app/](app/) — the React Native source
- [corrections/](corrections/) — reference screenshots used during development
- `Sample Outputs.pdf` — original Flutter design reference

## Stack

- Expo SDK 54 + React Native 0.81
- TypeScript (strict)
- Zustand for state + AsyncStorage for persistence
- Jest + ts-jest for unit tests (44 passing)
- EAS Build for store-ready Android/iOS binaries

## Grading scale

Standard Nigerian 5-point scale: A=5 (≥70), B=4 (≥60), C=3 (≥50), D=2 (≥45), E=1 (≥40), F=0. Pass mark 40. To adapt for a different school, edit `app/src/models/grading.ts` and `app/src/utils/cgpa.ts`.
