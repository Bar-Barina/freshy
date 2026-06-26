# Freshy — Living Handoff Document

> This file is updated at the end of every agent session.
> New agents: read this file first, then ARCHITECTURE.md and RISKS.md.
> Last updated: 2026-06-26

---

## Current Branch

`develop` (integration branch)
Phase 3 PR open: https://github.com/Bar-Barina/freshy/pull/1

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

### Phase 3 — Main UI (DONE — PR #1 open, awaiting merge to develop)

Branch: `phase/3-main-ui` → commit `5e328d5`

New files:
- `src/components/BedIllustration.tsx` — SVG bed illustration, 5 freshness states
- `src/components/ScoreRing.tsx` — circular progress ring with `children` support
- `docs/HANDOFF.md` (this file)
- `eslint.config.js` — ESLint v10 flat config (migrated from `.eslintrc.js`)

Updated files:
- `app/(tabs)/index.tsx` — ScoreRing wraps BedIllustration; no emoji
- `app/(onboarding)/welcome.tsx` — BedIllustration band="fresh"
- `src/features/bed/useBed.ts` — lazy useState initializer (removed redundant useEffect)
- `src/features/settings/useSettings.ts` — lazy useState initializer (removed redundant useEffect)
- `src/services/storage/mmkv.ts` — fixed for react-native-mmkv v4 (createMMKV, remove not delete)
- `src/services/storage/serializers.ts` — type-safe filter guard
- `app/(tabs)/_layout.tsx` — TAB_ICONS map renders emoji
- `app/_layout.tsx` — removed unused useEffect import
- `app/(onboarding)/preferences.tsx` — escaped apostrophe
- `app/terms.tsx` — escaped quotes
- `tsconfig.json` — ignoreDeprecations: "6.0", exclude __tests__
- `package.json` — updated lint script for ESLint v10

Quality gate at merge: tsc 0 errors | eslint 0 warnings | 56/56 tests

---

## What Needs to Be Built Next

### Phase 4 — Animations (next after Phase 3 PR merged)
Branch: `git checkout -b phase/4-animations` from `develop`

**Objectives:**
- Reanimated spring on "I changed the sheets" CTA (scale pulse on press)
- Animated score counter: `useSharedValue` + `useDerivedValue` + `useAnimatedProps` to animate the ring's `strokeDashoffset` and the score number (count up/down)
- BedIllustration crossfade between band states: track previous band, interpolate opacity between two BedIllustration instances
- `useReducedMotion()` hook — reads `AccessibilityInfo.isReduceMotionEnabled`, skip all animations when true

**Files to create:**
- `src/hooks/useReducedMotion.ts` (new)
- `src/components/AnimatedScoreRing.tsx` (new — wraps ScoreRing with animated strokeDashoffset)

**Files to update:**
- `src/components/BedIllustration.tsx` — accept optional `animated` prop, crossfade via Animated.View when band changes
- `app/(tabs)/index.tsx` — use AnimatedScoreRing, add spring press handler on CTA

### Phase 5 — Notifications
- `src/services/notifications/notificationService.ts`
- Schedule interval + threshold reminders
- Max 1/24h cooldown in MMKV
- Cancel/reschedule on sheet change
- In-app permission banner if denied

### Phase 6 — History and Events
- `src/features/events/EventSheet.tsx`
- `src/features/events/eventDefaults.ts`
- Wire Add Event button
- Date-grouped history list
- Swipe-to-delete

### Phase 7 — Partner Sync
- Supabase migrations, client, auth
- usePartnerSync, inviteCode
- Anonymous sign-in + SecureStore
- Realtime subscription + offline queue

### Phase 8 — iOS Widget
- `src/widgets/BedStatusWidget.tsx` — 'widget' directive, @expo/ui/swift-ui only
- `src/features/widget/widgetSync.ts` — updateSnapshot + midnight timeline
- Requires EAS dev build + physical device

### Phase 9 — Polish
- ShareCard + react-native-view-shot
- Accessibility audit

### Phase 10 — Release
- docs/MVP_REVIEW.md, EAS production build, v0.1.0 tag

---

## Key Tech Decisions (do not revisit)

- jest@29 (NOT 30) — required for jest-expo 56 compatibility
- `npm install --legacy-peer-deps` for all installs
- No state management library — hooks + MMKV only
- Local-first: lazy useState initializers for synchronous MMKV reads
- react-native-mmkv v4: `createMMKV()` factory, `storage.remove()` not `storage.delete()`
- ESLint v10: flat config in `eslint.config.js`, React version pinned to '19'
- Widget uses updateSnapshot on user action + 14 midnight timeline entries
- Invite code: Crockford base32, 12 chars, SECURITY DEFINER RPC

---

## Handoff Prompt (copy-paste to start a new session)

```
You are a senior Staff Mobile Engineer continuing work on the "Freshy" iOS app (Bed Status tracker).

Read docs/HANDOFF.md for the living project state.
Read docs/RISKS.md and docs/ARCHITECTURE.md for architectural decisions.
Do NOT re-scaffold or re-install anything.

Current branch: develop
Phase 3 PR is open at https://github.com/Bar-Barina/freshy/pull/1 — merge it first.
Next task: Phase 4 — Animations (create branch phase/4-animations from develop after merge)

See docs/HANDOFF.md for full Phase 4 spec.

Quality rules:
- Zero `any` in src/
- No hardcoded secrets
- Every async has error handling
- npm install --legacy-peer-deps
- jest@29 (not 30)
- Read exact Expo SDK 56 docs before writing any Expo API code: https://docs.expo.dev/versions/v56.0.0/
- react-native-mmkv v4: use createMMKV(), use storage.remove() not storage.delete()
- ESLint v10 flat config is in eslint.config.js (not .eslintrc.js)
```
