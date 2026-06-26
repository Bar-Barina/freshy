# Phase 0 — Technology Research and Validation

> Authored before any production code. All findings inform Phase 1 decisions.
> Last updated: 2026-06-26

---

## 1. expo-widgets (SDK 56) — iOS Home Screen Widget

### Status: VALIDATED — safe to proceed

**Source:** Official Expo blog (May 2026), expo/expo monorepo CHANGELOG, Expo SDK 56 docs

### Key Properties

| Property | Finding |
|----------|---------|
| Stability | Stable as of SDK 56 (May 2026); alpha in SDK 55 |
| Maintained by | Expo first-party (expo/expo monorepo) |
| iOS minimum | 16.4 (Expo SDK 56 minimum) |
| Android | Not stable — iOS only for MVP |
| Expo Go | Not supported — dev client required |
| Prebuild | Yes — config plugin generates Widget Extension + App Group |
| SwiftUI | Not required — layout via @expo/ui/swift-ui components |

### Widget Runtime Constraints (critical)

The widget directive creates an isolated JS runtime inside WidgetKit — NOT React Native:

- Cannot use React hooks (useState, useEffect, etc.)
- Cannot use react-native View, Text, etc.
- Cannot import other modules or reference module-level constants
- Cannot perform async work
- Function must be pure and return layout synchronously
- All data flows in through props at snapshot/timeline creation time

### Update Mechanisms

- updateSnapshot(props): immediate, triggered on user action — most reliable
- updateTimeline([{date, props}]): schedule entries for future dates
- System budget: ~40-70 reloads/day for actively-viewed widgets

Decision: updateSnapshot on all user actions + 14 midnight timeline entries for daily rollover.

### Fallback

If expo-widgets hits a blocker: @bacons/apple-targets with Swift WidgetKit + ExtensionStorage.
Props JSON contract stays identical — app-side sync code unchanged.

---

## 2. react-native-mmkv — Local Storage

### Status: VALIDATED — safe to proceed

- Version: 3.x, CNG/prebuild compatible with Expo SDK 56
- Synchronous read/write — no loading states for local data
- ~10x faster than AsyncStorage
- TypeScript built-in
- Requires native module; not compatible with Expo Go

Decision: MMKV for all app state. expo-secure-store exclusively for Supabase auth session.

---

## 3. @supabase/supabase-js — Backend Client

### Status: VALIDATED — safe to proceed

- Version: 2.x
- Works in React Native with expo-secure-store session adapter
- Realtime subscriptions via WebSocket
- Anonymous sign-in is first-class in Supabase Auth
- RLS enforced server-side; client cannot bypass

---

## 4. react-native-view-shot — Share Card Capture

### Status: VALIDATED — safe to proceed

- Version: 4.x, requires prebuild
- Captures off-screen components rendered at opacity 0
- Output to temp directory, passed to expo-sharing

---

## 5. react-native-reanimated v3 — Animations

### Status: VALIDATED — included in Expo SDK 56

- Worklets run on UI thread, 60fps guaranteed
- Spring physics for reset animation
- useReducedMotion hook for accessibility

---

## 6. react-native-svg — Illustrations

### Status: VALIDATED — included in Expo SDK 56

Critical: SVG cannot be used inside expo-widgets isolated runtime.
Decision: SVG for in-app, PNG exports for widget.

---

## 7. date-fns — Date Arithmetic

### Status: VALIDATED — safe to proceed

- Version: 3.x, pure JS, tree-shakeable
- differenceInCalendarDays handles DST correctly
- Accept `now` as parameter in calculator for deterministic tests

---

## 8. expo-notifications — Local Notifications

### Status: VALIDATED — included in Expo SDK 56

- Max ~64 pending scheduled notifications on iOS
- Cannot re-prompt after denial on iOS
- Decision: max 2 pending at any time, 24h cooldown in MMKV

---

## Validated Stack Summary

| Dependency | Version | Status |
|------------|---------|--------|
| Expo SDK | 56 | Stable |
| expo-router | 4.x | Stable |
| expo-widgets | 56.x | Stable (SDK 56) |
| @expo/ui | SDK 56 | Required for widgets |
| expo-dev-client | latest | Required — no Expo Go |
| expo-notifications | SDK 56 | Stable |
| expo-secure-store | SDK 56 | Stable |
| expo-sharing | SDK 56 | Stable |
| expo-haptics | SDK 56 | Stable |
| react-native-mmkv | 3.x | Stable (CNG) |
| react-native-reanimated | 3.x | Stable (SDK 56) |
| react-native-svg | 15.x | Stable (SDK 56) |
| react-native-view-shot | 4.x | Stable (CNG) |
| @supabase/supabase-js | 2.x | Stable |
| date-fns | 3.x | Stable |
| @testing-library/react-native | 12.x | Stable |
| jest-expo | SDK 56 | Stable |

No experimental dependencies selected.
