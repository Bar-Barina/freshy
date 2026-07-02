# Freshy — Living Handoff Document

> This file is updated at the end of every agent session.
> New agents: read this file first, then ARCHITECTURE.md and RISKS.md.
> Last updated: 2026-07-02

---

## Current Branch

`phase/3-main-ui` (active development branch)
PR open: https://github.com/Bar-Barina/freshy/pull/1

---

## Completed Work

### Phase 0 — Research (DONE, committed to main)
- `docs/RESEARCH.md` — all dependencies validated
- `docs/ARCHITECTURE.md` — all structural decisions
- `docs/RISKS.md` — 13 risks, all mitigated or deferred

### Phase 1 — Project Setup (DONE, committed to main)
- Expo SDK 56 + expo-router + TypeScript
- All dependencies installed (react-native-mmkv v4, @supabase/supabase-js, date-fns, reanimated, react-native-svg, view-shot, notifications, haptics)
- `app.json`, `eas.json`, `.env.example`, `.gitignore`, `README.md`, `.github/workflows/ci.yml`

Theme tokens (`src/theme/`): colors.ts, typography.ts, spacing.ts, index.ts

### Phase 2 — Core Bed Engine (DONE, folded into Phase 1 commit)

Types, storage, utilities, features, tests — all complete.
**56 tests passing, 97.5% line coverage** on calculator + serializers.

Navigation skeleton with placeholder screens in place.

### Phase 3 — Main UI (DONE — code complete, PR open)

Branch: `phase/3-main-ui`

New files:
- `src/components/BedIllustration.tsx` — SVG bed illustration, 5 freshness states
- `src/components/ScoreRing.tsx` — circular progress ring with `children` support
- `eslint.config.js` — ESLint v10 flat config (migrated from `.eslintrc.js`)
- `plugins/withGradleProperties.js` — pins Gradle to 8.x after every prebuild

Updated files:
- `app/(tabs)/index.tsx` — ScoreRing wraps BedIllustration
- `app/(onboarding)/welcome.tsx` — BedIllustration band="fresh"
- `app/_layout.tsx` — useEffect + router.replace() for onboarding redirect (fixes infinite loop)
- `src/features/bed/useBed.ts` — lazy useState initializer
- `src/features/settings/useSettings.ts` — lazy useState initializer
- `src/services/storage/mmkv.ts` — fixed for react-native-mmkv v4 (createMMKV, remove not delete)
- `src/services/storage/serializers.ts` — type-safe filter guard
- `src/utils/generateId.ts` — fallback for missing Web Crypto API on Hermes
- `app/(tabs)/_layout.tsx` — TAB_ICONS map renders emoji (will be replaced with Lucide icons)
- `app.json` — removed react-native-reanimated/plugin and expo-widgets (not config plugins)
- `tsconfig.json` — ignoreDeprecations: "6.0", exclude __tests__
- `package.json` — updated lint script, added react-native-worklets + react-native-nitro-modules

Quality gate at merge: tsc 0 errors | eslint 0 warnings | 56/56 tests

---

## Build Environment (Windows-specific)

The app builds and runs on Android emulator. Key constraints:

- **NEVER run Android builds from Cursor's integrated terminal** — Cursor sandboxes `GRADLE_USER_HOME` to a long temp path that exceeds Windows 260-char limit with React Native's boost headers.
- Always build from a regular Windows Terminal with these env vars:
  ```powershell
  $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
  $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
  $env:ANDROID_HOME = "C:\Users\itsba\AppData\Local\Android\Sdk"
  $env:GRADLE_USER_HOME = "C:\Users\itsba\.gradle"
  npx expo run:android
  ```
- If `.cxx` cache issues occur: `Get-ChildItem . -Recurse -Filter ".cxx" -Directory | Remove-Item -Recurse -Force`
- Gradle pinned to 8.13 via `plugins/withGradleProperties.js` (RN 0.83 incompatible with Gradle 9)
- `android/local.properties` must exist with `sdk.dir=C\\:\\Users\\itsba\\AppData\\Local\\Android\\Sdk`
- After `npx expo prebuild --clean`, re-run prebuild to regenerate (plugin handles Gradle pin, but local.properties needs ANDROID_HOME env var set)

---

## What Needs to Be Built Next

### IMMEDIATE: UI Polish Pass (plan file exists)

Branch: stay on `phase/3-main-ui` or create `phase/ui-polish`

Tasks (in order):
1. **Tab bar:** Replace emoji icons with `lucide-react-native` SVG icons. Remove circle background on active. Color-only active state.
2. **Remove all emojis from UI:** Quick actions, notification screen bell — use Lucide icons.
3. **Bed illustration redesign:** Grey/white hotel palette (not brown wood). Wrinkle paths for dirty states.
4. **Celebration overlay:** Full-screen confetti + "Cleannnn!" text on sheets changed (reanimated).
5. **Onboarding personality:**
   - Green CTA (not red — red reads as error)
   - New questions: gender (male/female/skip), partner, AC
   - Friendlier copy: "Let's get to know you better!", "no judgment, promise"
6. **Motivational copy system:** `src/content/motivationalCopy.ts` — lines personalized by gender + partner
7. **Onboarding back navigation:** Show back chevron on preferences + notifications screens
8. **Sound (optional):** expo-av sparkle chime on celebration (requires native rebuild)

### Phase 4 — Animations (after polish)
- Reanimated spring on CTA
- Animated score counter
- BedIllustration crossfade between band states
- `useReducedMotion()` hook

### Phase 5–10 — See bottom of this file

---

## Key Tech Decisions (do not revisit)

- jest@29 (NOT 30) — required for jest-expo 56 compatibility
- `npm install --legacy-peer-deps` for all installs
- No state management library — hooks + MMKV only
- Local-first: lazy useState initializers for synchronous MMKV reads
- react-native-mmkv v4: `createMMKV()` factory, `storage.remove()` not `storage.delete()`
- ESLint v10: flat config in `eslint.config.js`, React version pinned to '19'
- `react-native-reanimated/plugin` is a Babel plugin auto-configured by babel-preset-expo — do NOT put it in app.json plugins
- Widget uses updateSnapshot on user action + 14 midnight timeline entries
- Invite code: Crockford base32, 12 chars, SECURITY DEFINER RPC
- `crypto.randomUUID()` not available on Hermes — `src/utils/generateId.ts` has a fallback
- Navigation: never use `<Redirect>` as sole return in a layout — use `useEffect` + `router.replace()` guarded by `useSegments()`

---

## Cursor Setup

- **Rules:** `.cursor/rules/` — workflow.mdc, code-quality.mdc, expo-react-native.mdc
- **Skills:** `.cursor/skills/learn-from-bar/` — learnings.md with session history

---

## Later Phases (reference)

### Phase 5 — Notifications
- Schedule interval + threshold reminders, 1/24h cooldown, cancel on sheet change

### Phase 6 — History and Events
- EventSheet, date-grouped list, swipe-to-delete

### Phase 7 — Partner Sync
- Supabase migrations, client, auth, realtime, offline queue

### Phase 8 — iOS Widget
- expo-widgets, updateSnapshot, midnight timeline

### Phase 9 — Polish
- ShareCard + view-shot, accessibility audit

### Phase 10 — Release
- MVP_REVIEW.md, EAS production build, v0.1.0 tag

---

## Handoff Prompt

```
You are a senior Staff Mobile Engineer continuing work on the "Freshy" app (Bed Status tracker).

MANDATORY FIRST ACTIONS:
1. Read docs/HANDOFF.md (this file) for full project state
2. Read docs/ARCHITECTURE.md and docs/RISKS.md
3. Read .cursor/skills/learn-from-bar/learnings.md for working style preferences
4. Do NOT re-scaffold, re-install deps, or re-create anything already built

CURRENT TASK: Execute the UI Polish plan (tasks listed in docs/HANDOFF.md under "IMMEDIATE: UI Polish Pass").
Branch: phase/3-main-ui (or create phase/ui-polish from it)

The plan has 8 ordered tasks. Execute them in order. The app is already running on an Android emulator — JS changes hot-reload instantly, no rebuild needed unless you add a native dependency.

CRITICAL BUILD RULE: Do NOT run Android builds from Cursor's terminal. Bar runs builds manually from Windows Terminal. Only make JS/TS changes.

Key dependency to install first: lucide-react-native (JS-only, no rebuild)

Quality rules:
- Zero `any` in src/
- No hardcoded secrets
- Every async has error handling
- npm install --legacy-peer-deps
- jest@29 (not 30)
- Read exact Expo SDK 56 docs: https://docs.expo.dev/versions/v56.0.0/
- react-native-mmkv v4: use createMMKV(), use storage.remove() not storage.delete()
- ESLint v10 flat config in eslint.config.js
- No emojis in UI — use proper SVG icons
- Theme tokens only — no inline colors
- Think like a designer. The app should look like a real shipped product, not AI-generated.

Bar's preferences:
- Ask before committing
- Explain decisions that teach something new
- Keep it simple — no over-engineering
- One copy-paste block for terminal commands
- Direct, no-fluff communication
```
