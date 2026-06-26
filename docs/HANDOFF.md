# Freshy — Living Handoff Document

> This file is updated at the end of every agent session.
> New agents: read this file first, then ARCHITECTURE.md and RISKS.md.
> Last updated: 2026-06-26

---

## Current Branch

`develop` (integration branch)
Active phase branch: `phase/3-main-ui` (create from develop if not yet created)

---

## Completed Work

### Phase 0 — Research (DONE, committed to main)
- `docs/RESEARCH.md` — all dependencies validated
- `docs/ARCHITECTURE.md` — all structural decisions
- `docs/RISKS.md` — 13 risks, all mitigated or deferred

### Phase 1 — Project Setup (DONE, committed to main, folded into single commit)
- Expo SDK 56 + expo-router + TypeScript (blank-typescript template, App.tsx removed)
- `index.ts` → `import 'expo-router/entry'`
- All dependencies installed (react-native-mmkv, @supabase/supabase-js, date-fns, reanimated, react-native-svg, view-shot, notifications, haptics)
- ESLint + Prettier + tsconfig strict mode
- `app.json` — full expo config with expo-widgets plugin, expo-router, notifications, scheme "freshy", bundleId "com.freshy.app"
- `eas.json` — dev, dev-simulator, preview, production profiles
- `.env.example`, `.gitignore`, `README.md`, `.github/workflows/ci.yml`

Theme tokens (`src/theme/`):
- `colors.ts` — Colors object, getBandColor(), getBandLightColor()
- `typography.ts` — full scale (scoreXL, scoreLG, h1–h3, bodyLG/MD/SM, labelLG/MD/SM, caption)
- `spacing.ts` — Spacing, BorderRadius, Shadow, MIN_TAP_TARGET
- `index.ts` — re-exports all

### Phase 2 — Core Bed Engine (DONE, folded into Phase 1 commit)

Types (`src/types/index.ts`):
- FreshnessBand, Bed, BedEvent, BedEventType, UserSettings, DEFAULT_SETTINGS, FreshnessStatus, SharedBedMember, WidgetProps, PersistedBed, QueuedMutation

Storage (`src/services/storage/`):
- `mmkv.ts` — MMKV instance, storageGet/Set/Delete/Has, STORAGE_KEYS
- `serializers.ts` — deserializeBed, deserializeBedEvent, deserializeSettings, deserializeQueue (safe defaults on corrupted input)

Utilities:
- `src/utils/freshnessCalculator.ts` — calculateFreshness(), sumEventPenalties(), getStatusBand(), clamp(), wholeDaysBetween(), DEFAULT_EVENT_PENALTIES
- `src/utils/generateId.ts` — generateId() (crypto.randomUUID), generateInviteCode() (Crockford base32, 12 chars)

Features:
- `src/features/bed/bedStore.ts` — loadBed(), saveBed(), createDefaultBed()
- `src/features/bed/useBed.ts` — useBed() hook
- `src/features/settings/useSettings.ts` — useSettings() hook

Tests: **56 passing, 97.5% line coverage** on calculator + serializers

Navigation (placeholder content):
- `app/_layout.tsx` — root layout with onboarding gate
- `app/(onboarding)/_layout.tsx`, `welcome.tsx`, `preferences.tsx`, `notifications.tsx`
- `app/(tabs)/_layout.tsx`, `index.tsx` (Home), `history.tsx`, `settings.tsx`
- `app/privacy.tsx`, `app/terms.tsx`

### Phase 3 — Main UI (IN PROGRESS)

Components built this session:
- `src/components/BedIllustration.tsx` — SVG bed illustration, 5 freshness states (fresh/ok/soon/warning/biohazard), accepts `band` + `size` props
- `src/components/ScoreRing.tsx` — circular progress ring using SVG strokeDasharray, accepts `score`, `band`, `size`, `strokeWidth`, `children` props (bed illustration goes inside ring)

Screens updated:
- `app/(tabs)/index.tsx` — ScoreRing wraps BedIllustration; emoji placeholders removed
- `app/(onboarding)/welcome.tsx` — BedIllustration in 'fresh' state replaces emoji

Status: PR open for `phase/3-main-ui` → `develop`

---

## What Needs to Be Built Next

### Phase 4 — Animations (next after Phase 3 PR merged)
Branch: `git checkout -b phase/4-animations` from `develop`

- Reanimated spring on "I changed the sheets" CTA (scale pulse on press)
- Animated score counter: count up/down with spring easing (update ScoreRing number display)
- BedIllustration crossfade between band states (FadeTransition wrapper using Reanimated)
- Haptic feedback already imported — add ImpactFeedback on quick actions
- `useReducedMotion()` hook — skip animations when iOS reduces motion is enabled

Files:
- `src/hooks/useReducedMotion.ts` (new)
- `src/components/AnimatedScoreRing.tsx` (new, wraps ScoreRing with animated counter)
- `src/components/BedIllustration.tsx` (update — add crossfade via opacity interpolation)
- `app/(tabs)/index.tsx` (update — animated CTA button, use AnimatedScoreRing)

### Phase 5 — Notifications
- `src/services/notifications/notificationService.ts`
- Schedule interval + threshold reminders
- Max 1/24h cooldown in MMKV
- Cancel/reschedule on sheet change
- In-app permission banner if denied

### Phase 6 — History and Events
- `src/features/events/EventSheet.tsx` — bottom sheet with preset chips + custom event
- `src/features/events/eventDefaults.ts` — preset event list with penalties
- Wire Add Event button on Home screen
- Date-grouped history list in `app/(tabs)/history.tsx`
- Swipe-to-delete with confirmation

### Phase 7 — Partner Sync
- `supabase/migrations/001_initial.sql`, `002_rls_policies.sql`
- `src/services/supabase/client.ts`, `auth.ts`
- `src/features/partner/usePartnerSync.ts`, `inviteCode.ts`
- Anonymous sign-in on first launch, stored in expo-secure-store
- join_bed_by_invite RPC (SECURITY DEFINER)
- Realtime subscription on beds table
- Offline mutation queue (MMKV)

### Phase 8 — iOS Widget
- `src/widgets/BedStatusWidget.tsx` — 'widget' directive, @expo/ui/swift-ui only
- `src/features/widget/widgetSync.ts` — updateSnapshot on state changes, midnight timeline
- Requires EAS dev build + physical device

### Phase 9 — Polish
- `src/components/ShareCard.tsx` — react-native-view-shot + expo-sharing
- Accessibility audit (44pt targets, VoiceOver labels)

### Phase 10 — Release
- `docs/MVP_REVIEW.md`, EAS production build, v0.1.0 tag

---

## Key Tech Decisions (do not revisit)

- jest@29 (NOT 30) — required for jest-expo 56 compatibility
- `npm install --legacy-peer-deps` for all installs
- No state management library — hooks + MMKV only
- Local-first: render MMKV immediately, sync Supabase in background
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
Next task: Phase 4 — Animations (create branch phase/4-animations from develop)

See docs/HANDOFF.md "What Needs to Be Built Next" → Phase 4 for full spec.

Quality rules:
- Zero `any` in src/
- No hardcoded secrets
- Every async has error handling
- npm install --legacy-peer-deps
- jest@29 (not 30)
- Read exact Expo SDK 56 docs before writing any Expo API code: https://docs.expo.dev/versions/v56.0.0/
```
