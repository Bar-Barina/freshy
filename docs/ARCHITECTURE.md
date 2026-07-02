# Phase 0 — Architecture Decisions

> Documents every structural decision made before writing production code.
> Last updated: 2026-06-26

---

## 1. Folder Structure Rationale

```
freshy/
├── app/                    # expo-router file-based routes ONLY
│   ├── (onboarding)/       # Gated by root layout redirect
│   ├── (tabs)/             # Main app — visible after onboarding
│   ├── privacy.tsx
│   ├── terms.tsx
│   └── _layout.tsx         # Root: font loading, auth init, onboarding gate
├── src/                    # All application logic — no routing here
│   ├── components/         # Presentational, reusable UI
│   ├── features/           # Feature modules (co-located state + logic)
│   │   ├── bed/
│   │   ├── events/
│   │   ├── partner/
│   │   ├── settings/
│   │   └── widget/
│   ├── services/           # External integrations
│   │   ├── storage/
│   │   ├── notifications/
│   │   └── supabase/
│   ├── utils/              # Pure functions only — no side effects
│   ├── widgets/            # expo-widgets component (isolated runtime)
│   ├── theme/              # Design tokens only
│   └── types/              # Shared TypeScript interfaces
├── supabase/migrations/    # SQL files only
├── assets/illustrations/   # SVG source + PNG widget exports
├── __tests__/              # Calculator and serializer tests
├── docs/                   # This directory
└── .github/workflows/      # CI only
```

Why app/ only for routing: Mixing logic into route files couples navigation to business
logic. All logic lives in src/ and is imported by route files.

Why features/ instead of flat components/: Features bundle related state + UI.
features/bed/ owns everything about the bed entity. Prevents "where does this go?" uncertainty.

Why utils/ for freshnessCalculator.ts: Pure function, zero side effects, zero React
dependency. Can be tested in isolation and imported anywhere including widget sync service.

Why widgets/ separate from features/widget/: BedStatusWidget.tsx uses the widget directive
and runs in an isolated non-React runtime. Keeping it separate makes the isolation explicit.

---

## 2. State Management Decision

No global state library (no Redux, no Zustand, no Jotai).

Rationale: The app has one primary entity (a single Bed). Custom hooks (useBed,
useSettings) reading from MMKV provide equivalent composition without indirection.
Adding a state library now would be premature optimization.

Migration path: If state complexity grows (multiple beds), introduce Zustand.
Hook-based architecture makes migration straightforward.

---

## 3. Data Flow

User action (tap CTA)
  -> useBed hook (in-memory, immediate)
  -> freshnessCalculator.ts (pure, synchronous)
  -> (parallel)
     bedStore.ts -> MMKV (persist local)
     widgetSync.ts -> expo-widgets updateSnapshot
     notificationService.ts -> reschedule
     partnerSyncService.ts -> Supabase upsert (if shared bed)
       -> Realtime subscription on partner device
       -> Partner recalculates + updates UI

Key: UI updates immediately from local calculation. All side effects are fire-and-forget.

---

## 4. Local-First Architecture

App must work completely offline. Supabase is an enhancement, not a requirement.

On launch:
  1. Render from MMKV immediately
  2. Pull from Supabase in background (if shared)
  3. Merge using updated_at conflict resolution
  4. Re-render if remote is newer

On offline:
  1. Write mutations to MMKV offline queue
  2. Show optimistic UI
  3. Replay queue on reconnect in order

---

## 5. TypeScript Configuration

Strict mode. Required settings:
  - strict: true
  - noImplicitAny: true
  - strictNullChecks: true
  - noUnusedLocals: true
  - noUnusedParameters: true

Zero `any` allowed in src/. Use `unknown` and narrow if type is genuinely unknown.
Supabase responses typed via generated types (supabase gen types typescript).

---

## 6. Dependency Coupling Rules

freshnessCalculator.ts has zero app dependencies (date-fns only).
UI components import types but not stores directly.
Features import services; services do not import features.
Widget file imports nothing from app (enforced by widget runtime).

---

## 7. Authentication Architecture

On first launch:
  1. Check SecureStore for existing Supabase session
  2. Found -> restore session
  3. Not found -> signInAnonymously() -> store in SecureStore

Always authenticated (anonymous or named). No email/password friction on first launch.
Display name prompted when sharing a bed.

App reinstall scenario: Session lost (SecureStore cleared). New anonymous session created.
Shared bed access lost. User shown prompt to rejoin via invite code. Documented in MVP_REVIEW.

---

## 8. Security Architecture

Principle: defense in depth. Never trust the client.

RLS policies are the only access control that matters. Client cannot bypass RLS.

Table access:
  profiles: own row only (read/write)
  beds: member only (read/write), authenticated (insert)
  bed_members: own rows only (read), via RPC only (insert)
  bed_events: member of bed (read/write/insert)

Invite code design:
  Generation: crypto.getRandomValues(16 bytes) -> Crockford base32 -> 12 chars
  Entropy: ~62 bits
  Rate limit: 10 attempts per user per hour via attempt log table
  Expiry: 30 days
  join_bed_by_invite is SECURITY DEFINER — client never reads beds table by code

EXPO_PUBLIC_SUPABASE_ANON_KEY is safe for client use. It does not bypass RLS.
Service role key is never used in the mobile app.

---

## 9. Git Workflow

main <- protected default; all phase PRs merge here
  phase/0-research
  phase/1-setup
  phase/2-bed-engine
  phase/3-main-ui
  phase/4-animations
  phase/5-notifications
  phase/6-history-events
  phase/7-partner-sync
  phase/8-widget
  phase/9-polish
  phase/10-release

Each phase: one PR into `main`. Squash merge with conventional commit message.
Tag releases on `main` (e.g. `v0.1.0`).
