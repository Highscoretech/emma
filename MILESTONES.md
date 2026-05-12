# CGPA Calculator — React Native Build Plan

A generic CGPA calculator for Nigerian universities (5-point scale), rebuilt in React Native from the original Flutter design. Based on `Sample Outputs.pdf` and the reference transcript screenshot.

**Source design:** Student / Course / Grade class diagram + 8 screens (Splash → Onboarding ×3 → Home → Calculator → Grade Entry → CGPA Output).

---

## Milestone 1 — Project Foundation ✅

- [x] Initialize Expo + TypeScript app in `app/`
- [x] Navigation: `@react-navigation/native` + native-stack with 6 screens wired
- [x] Folder structure: `src/screens`, `src/navigation`, `src/models`, `src/store`, `src/theme`
- [x] Theme system: `src/theme/theme.ts` (colors, gradient, spacing, radius, typography)
- [x] State management: Zustand store (`src/store/appStore.ts`)
- [x] Local persistence: AsyncStorage installed (wired in M2 for `hasSeenOnboarding`)
- [x] TypeScript compiles cleanly (`tsc --noEmit` → 0 errors)

**Stack locked in:** Expo SDK 54, RN 0.81, Zustand + AsyncStorage, Nigerian 5-point scale, fully local.

**Done when:** App boots, navigation skeleton runs, theme tokens applied. ✅

---

## Milestone 2 — Onboarding Flow ✅

- [x] Splash Screen — gradient + 1.5s minimum delay, hydrates store then routes to Onboarding or Home
- [x] Onboarding × 3 — horizontal `FlatList` with paging (Track / Calculate / Aim)
- [x] Skip / Next / Get Started CTAs with active dot indicator
- [x] `hasSeenOnboarding` persisted via AsyncStorage in `appStore`
- [x] TypeScript clean

**Done when:** First-launch user lands on Home; returning user skips onboarding. ✅

---

## Milestone 3 — Data Model & Storage ✅

- [x] Simplified model: `CourseEntry` (code, title, units, type, score) embedded in `Semester` — denormalized for simpler persistence; Student class collapsed into the store itself since v1 is single-user/local
- [x] `Semester` entity with level + session + term
- [x] Nigerian 5-point grading scale (`src/models/grading.ts`) — A=5 (≥70), B=4 (≥60), C=3 (≥50), D=2 (≥45), E=1 (≥40), F=0
- [x] CRUD repo via `useSemesterStore` (Zustand) — add/update/delete semester and course, persisted to AsyncStorage on every mutation
- [x] CGPA math (`src/utils/cgpa.ts`) — per-semester GPA, cumulative CGPA, outstandings, academic standing (First Class / 2:1 / 2:2 / 3rd / Pass / Probation)
- [x] `id` utility, store hydration wired into SplashScreen
- [x] TypeScript clean

**Class-of-degree boundaries (5-point):** 1st ≥ 4.5, 2:1 ≥ 3.5, 2:2 ≥ 2.4, 3rd ≥ 1.5, Pass ≥ 1.0, Probation < 1.0. Pass mark: 40.

**Done when:** Can create/read/update/delete a semester with courses + grades, fully offline. ✅

---

## Milestone 4 — Home & Calculator Screens ✅

- [x] Home — gradient header, live CGPA card (value + units + standing), semester count + outstandings tiles, "Go to Calculator" CTA
- [x] Calculator — back button, semester list (newest first) with per-semester GPA/units/outstandings, empty state, floating "+" button
- [x] Add Semester modal — bottom sheet capturing Level / Session / Term (First/Second), creates semester and routes to GradeEntry
- [x] Reusable components: `CGPACard`, `SemesterCard`, `AddSemesterModal`, `PrimaryButton`
- [x] TypeScript clean

**Done when:** User can navigate Home → Calculator → empty semester list. ✅

---

## Milestone 5 — Grade Entry ✅

- [x] `CourseRow` component — Code (autocaps), Title, Units, Type (Core/Elective chips), Score → live Grade + Grade Point + Quality Points
- [x] Inline validation: units > 0, score 0–100 (red border + error message)
- [x] Add Course (dashed-border button with default 2 units / Core)
- [x] Remove Course (per-row confirm dialog)
- [x] Delete entire semester (header action)
- [x] Live summary bar — courses count, total units, semester GPA
- [x] Auto-save: every change persists to AsyncStorage via the store (no Save button needed)
- [x] "Calculate CGPA" footer button — disabled until all rows are complete and valid
- [x] KeyboardAvoidingView for entry on iOS
- [x] TypeScript clean

**Done when:** A full semester (like the 400 Level First Semester sample) can be entered and saved. ✅

---

## Milestone 6 — CGPA Calculation & Output ✅

- [x] CGPA Output Screen — gradient header with cumulative CGPA card (value, total units, semester count, standing)
- [x] `SemesterTranscript` component — banner header + horizontally scrollable table (S/N, Code, Title, Unit, Type, Score, Grade, Pt) mirroring the reference screenshot
- [x] Running CGPA — "Semester's CGPA" line shows cumulative-to-date after each semester
- [x] Per-semester footer: Total No of Units, GPA, Semester's CGPA, Outstandings (failed course codes), Academic Standing
- [x] Per-semester actions: Edit (routes to GradeEntry) and Delete (with confirm)
- [x] Failed grades shown in red, alternating row stripes, sticky-feel headers
- [x] Empty state when no semesters exist
- [x] Home gets a secondary "View Transcript" button once data exists
- [x] TypeScript clean

**Done when:** App reproduces the screenshot output for any entered data. ✅

---

## Milestone 7 — Polish & Extras ✅ (dark mode deferred to v2)

- [x] PDF export via `expo-print` — branded HTML template (`utils/transcriptHtml.ts`) replicates the on-screen transcript with running CGPA, outstandings, standing
- [x] Share sheet via `expo-sharing` — "Export" button in the Transcript header opens the system share UI
- [x] Empty/loading/error states — Splash already hydrates stores before navigating; CGPAOutput and Calculator have empty states; export wraps errors in `Alert`
- [x] Feedback form — `FeedbackModal` (envelope icon on Home) collects name + message and opens the user's mail client via `Linking` (mailto deeplink)
- [x] App branding in `app.json`: name "CGPA Calculator", bundle id `app.cgpacalculator`, splash background brand blue `#1976FF`
- [ ] Light/dark mode — **deferred** to v2 (current theme is hardcoded blue/white; supporting dark needs a token-level refactor)
- [ ] App icon + splash images — placeholders still in `assets/` (need brand artwork from the user)
- [x] TypeScript clean

**Outstanding (not blockers for v1):** real icon/splash images, dark mode.

**Done when:** Production-feeling app. ✅ (with the asset/dark-mode caveats above)

---

## Milestone 8 — Testing & Release ✅ (build/QA hand-off pending)

- [x] Jest + ts-jest configured (`npm test`, `npm run test:watch`, `npm run typecheck`)
- [x] **43 unit tests passing** across two suites:
  - `src/models/__tests__/grading.test.ts` — score→grade boundaries (every cutoff), grade→point, pass mark at exactly 40
  - `src/utils/__tests__/cgpa.test.ts` — empty semester (no divide-by-zero), Σ(point × units)/Σ(units), outstandings detection, pass/fail edge at 40/39, electives counted same as core, cumulative aggregation, classify() boundaries for every degree class
- [x] EAS linkage in `app.json` (`extra.eas.projectId` = `a9487c12-7f1c-4bf8-bcd6-f71ab2f07cbb`, `owner` = `valiantjoe`)
- [x] `eas.json` with three build profiles: `development`, `preview` (internal APK), `production` (auto-increment, store-ready)
- [ ] Component tests with React Native Testing Library — deferred (CGPA math is the high-risk part; pure-function tests cover it)
- [ ] Manual QA on Android + iOS — requires running on a device (user side)
- [ ] Play Store + App Store listings — requires user accounts + assets

**Done when:** Signed builds ready to submit. ✅ (tests + EAS configs ready; user runs `eas login` + `eas build` to produce binaries)

---

## Hand-off — how to ship

1. `cd app && eas login` (one-time, opens browser)
2. `eas build --profile preview --platform android` — produces an internal APK for sideloading / TestFlight-style testing
3. `eas build --profile production --platform all` — produces signed builds for both stores
4. `eas submit --platform ios` / `--platform android` — submits the built binaries

Before production submission:
- Replace `app/assets/icon.png` (1024×1024) and `app/assets/splash-icon.png` with proper branded artwork
- Grading thresholds use the standard Nigerian 5-point scale — adjust `grading.ts` / `cgpa.ts` if your school differs
- Update `FEEDBACK_EMAIL` in `app/src/components/FeedbackModal.tsx` to a real address

---

## Resolved decisions

1. **Toolchain:** Expo (SDK 54)
2. **State + storage:** Zustand + AsyncStorage
3. **Scope:** Generic Nigerian universities — 5-point scale (A=5, B=4, C=3, D=2, E=1, F=0)
4. **Backend:** Fully local (no accounts, no sync) for v1
