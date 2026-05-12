# How to Run the CGPA Calculator

A complete, beginner-friendly guide to setting up, running, and testing this app — whether you're on the same computer that built it or starting fresh on a new machine.

If a step looks unfamiliar, do it exactly as written. Each section assumes you've done the one above it.

---

## 1. What this project actually is

- A mobile app written in **React Native** using **Expo**.
- "React Native" = the framework. "Expo" = the toolkit that makes React Native easier (no Xcode/Android Studio required for daily work).
- Source code lives in [app/](app/). The PDF and reference screenshots at the project root are design artifacts.
- The app stores everything locally on the phone using **AsyncStorage** — no servers, no accounts, no internet required to use it.

---

## 2. Before you start — install these once

You only do this section the first time, on each computer you'll work from.

### 2a. Install Node.js

Node is the program that runs JavaScript outside a browser. Expo needs it.

1. Go to https://nodejs.org
2. Download the **LTS** version (the green button on the left).
3. Run the installer, click Next through every screen, finish.
4. Open a new terminal (PowerShell on Windows, Terminal on Mac).
5. Type `node --version` and press Enter. You should see something like `v20.x.x` or higher. If you do, Node is installed.

### 2b. Install the Expo Go app on your phone

This is the app on YOUR PHONE that previews your work in real time during development.

- **Android:** Open Google Play, search "Expo Go", install.
- **iPhone:** Open the App Store, search "Expo Go", install.

You only need it for live development. For the released APK we built on EAS, you don't need Expo Go at all (more on that in section 5).

---

## 3. First-time project setup

Do this once, after you've cloned/copied the project to a new computer.

Open a terminal in the project folder (`emma/`), then run:

```
cd app
npm install
```

`npm install` reads the list of libraries the project depends on (in `app/package.json`) and downloads them into a folder called `node_modules/`. It can take 2–5 minutes the first time. When it's done, you'll see a summary like "added 700 packages".

That's the entire setup. The project is now ready to run.

---

## 4. Running the app in development (live preview on your phone)

This is the day-to-day workflow. You edit code, save the file, and the app on your phone updates immediately.

### Step-by-step

1. **Both devices on the same Wi-Fi.** Your computer and your phone must be on the same network. (If you can't share a network, see "Tunnel mode" below.)
2. **Start the dev server.** In the terminal, from inside the `app/` folder:
   ```
   npm start
   ```
3. **Wait for the QR code.** After a few seconds you'll see a big QR code in your terminal and a message like:
   ```
   › Metro waiting on exp://192.168.x.x:8081
   › Press a │ open Android
   › Press w │ open web
   ```
4. **Open Expo Go on your phone** and tap **"Scan QR code"** (Android) or use your iPhone camera to scan the QR code (iOS will offer to open it in Expo Go).
5. The app downloads to your phone and launches. You should see the blue gradient splash screen → onboarding.

That's it. Now edit any file in [app/src/](app/src/), save, and the phone will update within seconds. This is called **hot reload**.

### Useful keys while `npm start` is running

| Key | What it does |
|-----|--------------|
| `r` | Reload the app (if something looks stuck) |
| `j` | Open the in-app debugger |
| `w` | Open the app in your web browser (fastest for layout tweaks) |
| `Ctrl+C` | Stop the dev server |

### If "same Wi-Fi" isn't possible — Tunnel mode

If your computer and phone aren't on the same network (e.g. you're on a campus network that blocks device-to-device), run:

```
npx expo start --tunnel
```

This routes the connection through Expo's servers. It's slower but works anywhere with internet.

---

## 5. Testing the EAS preview APK (the build we deployed)

Different from section 4 — this installs a real, standalone Android app on your phone. No Expo Go needed; no computer needed once the APK is installed.

### Step-by-step

1. On your **Android phone**, open the browser and go to:
   ```
   https://expo.dev/accounts/valiantjoe/projects/emmanuel/builds
   ```
2. Sign in with the same Expo account you used to log in (`valiantcodez@gmail.com`).
3. Find the most recent **preview** build and tap it.
4. When the build status says **Finished**, you'll see a big "Install" button and a QR code.
5. Tap **Install** (or scan the QR code from another device).
6. Android will warn that you're installing an app from outside the Play Store. Tap **Settings → Allow from this source** for your browser, then go back and tap **Install** again.
7. The APK installs as "CGPA Calculator". Tap it to launch.

The APK is signed but **not published to the Play Store**. It's an internal-distribution build — perfect for testing on your own phone or sharing with a small group of testers. To put it on the Play Store you'd run a **production** build (`eas build --profile production --platform android`) and then submit it via `eas submit`.

### Sharing with testers

Anyone can install the APK by:
- Visiting the build URL above (no Expo account needed for the link itself, but they can't see your dashboard).
- Or, you can download the APK file from the build page and send it to them directly (WhatsApp, email, etc.).

---

## 6. Running tests

These check that the math is right (CGPA calculations, grade lookups, degree-class boundaries).

From inside `app/`:

```
npm test
```

You should see something like:

```
Test Suites: 2 passed, 2 total
Tests:       44 passed, 44 total
```

If a test ever fails, **don't ignore it** — it means the math broke. Read the failure message, find the file (`src/utils/__tests__/cgpa.test.ts` or `src/models/__tests__/grading.test.ts`), and fix the underlying code, not the test.

### Other commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Re-run tests automatically when you save a file (great for TDD) |
| `npm run typecheck` | Check the TypeScript types without running the app |
| `npm start` | Start the dev server (section 4) |

---

## 7. Building a new APK

You'll do this any time you want testers to install a fresh version with your latest changes.

```
cd app
npx eas build --profile preview --platform android
```

What happens:
1. Your local code is uploaded to Expo's servers.
2. Their cloud machines build the APK (~10–15 minutes).
3. When done, you get an install URL and a QR code (same as section 5).

You can close the terminal once the upload finishes — the build continues in the cloud. Check the URL printed in the terminal to see progress.

### Build profiles

- `preview` → APK, internal distribution, good for testers.
- `production` → AAB (Android App Bundle), what you submit to Google Play.
- `development` → for working with a dev client (advanced; you don't need this yet).

---

## 8. If something breaks

| Problem | Try this |
|---------|----------|
| `npm start` says "command not found" | You're not in the `app/` folder. Run `cd app` first. |
| Phone says "Cannot connect to dev server" | Phone and computer on the same Wi-Fi? Try `npx expo start --tunnel`. |
| App boots to white screen | Press `r` in the terminal to reload, or shake the phone and tap "Reload". |
| Weird error after pulling new code | From `app/`: delete `node_modules/`, then `npm install` again. |
| TypeScript errors when typing | Run `npm run typecheck` to see all of them; fix the file the error points to. |
| EAS build fails | Click the build URL — Expo's build logs tell you exactly what went wrong. |
| Onboarding shows up every time | That's a bug. The "first launch" flag is stored in AsyncStorage — if it's not persisting, check `src/store/appStore.ts`. |

---

## 9. Project map (where things live)

Inside [app/src/](app/src/):

```
src/
├── screens/              ← One file per full screen
│   ├── SplashScreen.tsx     The blue gradient with "CGPA Calculator"
│   ├── OnboardingScreen.tsx The 3-slide intro
│   ├── HomeScreen.tsx       Landing screen with the CGPA card
│   ├── CalculatorScreen.tsx The list of semesters
│   ├── GradeEntryScreen.tsx Adding/editing courses for a semester
│   └── CGPAOutputScreen.tsx The transcript view
│
├── components/           ← Reusable pieces of UI
│   ├── CourseRow.tsx        One course card in the Grade Entry screen
│   ├── SemesterCard.tsx     One card in the semester list
│   ├── SemesterTranscript.tsx The table on the transcript screen
│   ├── AddSemesterModal.tsx The popup for creating a new semester
│   ├── FeedbackModal.tsx    The "Send Feedback" bottom sheet
│   ├── CGPACard.tsx         The big CGPA card on Home
│   └── PrimaryButton.tsx    The rounded buttons
│
├── store/                ← Data + persistence
│   ├── appStore.ts          App-wide state (e.g. "have you seen onboarding?")
│   └── semesterStore.ts     All your semesters + courses; saves to phone storage
│
├── models/               ← Type definitions + the grading scale
│   ├── index.ts             What a Semester, Course, etc. look like
│   └── grading.ts           A=5, B=4, C=3, D=2, E=1, F=0  ← edit here to change the scale
│
├── utils/                ← Pure functions
│   ├── cgpa.ts              The math (calcSemester, calcCumulative, classify)
│   ├── transcriptHtml.ts    Builds the HTML for the PDF export
│   ├── exportTranscript.ts  Runs the PDF + share flow
│   └── id.ts                Generates unique IDs
│
├── navigation/           ← How screens connect to each other
│   ├── RootNavigator.tsx
│   └── types.ts
│
└── theme/                ← Colors, fonts, spacing
    └── theme.ts
```

Tests live next to the file they test, inside a `__tests__/` folder:

```
src/utils/__tests__/cgpa.test.ts
src/models/__tests__/grading.test.ts
```

---

## 10. What to change for a different grading system

The app currently uses the standard Nigerian 5-point scale. If you need to support a different one:

- **Different grade points:** edit `GRADE_SCALE` in [src/models/grading.ts](app/src/models/grading.ts). Each entry has `grade`, `point`, `minScore`.
- **Different pass mark:** change `PASS_MARK` in the same file.
- **Different degree classes:** edit `classify()` in [src/utils/cgpa.ts](app/src/utils/cgpa.ts).
- **Different max GPA:** change `MAX_GPA` in [src/models/grading.ts](app/src/models/grading.ts).

After any change here, run `npm test`. Some tests will fail because they expect the old numbers — update them in `src/utils/__tests__/cgpa.test.ts` and `src/models/__tests__/grading.test.ts` to match.

---

## TL;DR — the 5 commands you'll use most

```
cd app                                    # Always start here
npm install                               # Once per machine
npm start                                 # Live preview during development
npm test                                  # Make sure the math still works
npx eas build --profile preview --platform android   # Make a new APK for testers
```
