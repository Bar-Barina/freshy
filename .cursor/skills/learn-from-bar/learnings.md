# Learnings — Working with Bar

## 2026-06-26 — Phase 3 Build & Environment Setup

**Learned:**
- Bar is a senior Staff Engineer but new to mobile/React Native. Don't assume RN build tooling knowledge.
- He values understanding WHY things work, not just getting them done. Explain when teaching moments arise.
- He gets frustrated by cascading environmental issues that feel unrelated to actual app code.
- He questions complexity — "are we over-complicated?" — and wants honest answers.

**Mistakes to avoid:**
- Added `react-native-reanimated/plugin` to `app.json` plugins array — it's a Babel plugin, NOT an Expo config plugin. This caused the `_internal.projectRoot` crash and wasted significant time.
- Didn't install `react-native-nitro-modules` (peer dep of mmkv v4) initially.
- Didn't account for Windows 260-char path limit with Gradle caches in Cursor's sandbox.
- Used `<Redirect>` in root layout as sole return — causes infinite re-render loop in Expo Router. Must use `useEffect` + `router.replace()`.
- Running builds from Cursor's terminal causes Gradle home to be sandboxed to a long temp path. Always build from external terminal on Windows.

**Bar's preferences:**
- Wants things simple. If something feels over-engineered, explain whether the complexity is essential or accidental.
- Prefers direct, no-fluff answers. Short > long.
- Wants to approve commits before they happen.
- Asks good questions about risk: "can this harm my PC?", "any risk to my Cursor spending?"
- Cares about learning from the process, not just shipping.
- Has strong design opinions — thinks like a product person, not just a coder.
- Hates things that look "AI-generated" — emojis as icons, generic copy, cheap visual shortcuts.
- Values personality in the app: encouraging, buddy-like tone, personalized to the user.
- Wants the app to feel addictive/fun, not clinical.

---

## 2026-07-02 — Build Debugging (Windows Path Limit)

**Learned:**
- The Cursor sandbox `GRADLE_USER_HOME` path is the root cause of all 260-char build failures.
- LongPathsEnabled registry fix doesn't help because `ninja.exe` doesn't have a long-path manifest.
- The only reliable fix is: build outside Cursor's terminal + set `GRADLE_USER_HOME` to a short path + clear stale `.cxx` caches.
- Bar is patient but needs clear "this is the last step" signals. Multiple failed attempts erode trust.

**Mistakes to avoid:**
- Don't try multiple partial fixes. Diagnose fully, then give one clean solution.
- Don't run Android builds from Cursor's integrated terminal on Windows.
- When cleaning `.cxx` dirs, clean ALL of them — including `android/app/.cxx`, not just `node_modules/**/.cxx`.

**Bar's preferences:**
- Wants to understand if something can harm his system before running it.
- Prefers one clear instruction block he can copy-paste, not multiple steps across messages.
- Appreciates analogies for unfamiliar concepts (registry key = "speed limit on an empty road").
