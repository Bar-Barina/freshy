# Phase 0 — Risk Analysis

> All known risks identified before any production code is written.
> Last updated: 2026-06-26

---

## Risk Register

### RISK-001: expo-widgets isolated runtime — SVG not supported

Severity: HIGH
Probability: Certain (by design)
Mitigation: Use PNG exports in widgetsDirectory for widget bed illustrations.
            SVG used only in the main app via react-native-svg.
Status: MITIGATED (design decision made)

---

### RISK-002: expo-widgets requires EAS build — not testable in Expo Go

Severity: HIGH
Probability: Certain (by design)
Mitigation: Document clearly in README. Use Expo Go only for non-widget development.
            Phase 8 explicitly requires a physical device + EAS dev build.
Status: MITIGATED (accepted limitation, documented)

---

### RISK-003: react-native-mmkv requires prebuild

Severity: MEDIUM
Probability: Certain (native module)
Mitigation: Use expo-dev-client from Phase 1 onward. Expo Go not used after Phase 1.
            Unit tests mock MMKV with jest.mock.
Status: MITIGATED (architecture decision)

---

### RISK-004: Supabase anonymous session lost on app reinstall

Severity: MEDIUM
Probability: Certain (SecureStore cleared on reinstall)
Impact: User loses shared bed access after reinstall
Mitigation: Detect missing session on launch, create new anonymous session silently.
            Show "Rejoin via invite code" prompt if remote bed was previously connected.
            Document clearly in onboarding and MVP_REVIEW.md.
Status: MITIGATED (graceful degradation designed)

---

### RISK-005: Invite code brute force

Severity: HIGH
Probability: LOW (mitigated by entropy and rate limiting)
Details: 12-char Crockford base32 = ~62 bits entropy.
         At 1,000 guesses/hour: statistically impossible to exhaust.
Mitigation: Rate limit via invite_attempts table in Supabase (10 attempts/user/hour).
            join_bed_by_invite RPC is SECURITY DEFINER — no public table access.
            Invite codes expire after 30 days.
Status: MITIGATED (multi-layer defense)

---

### RISK-006: WidgetKit timeline budget exceeded

Severity: LOW
Probability: LOW for this use case
Details: WidgetKit gives ~40-70 system refreshes/day for actively viewed widgets.
         For a bed freshness tracker, the score only meaningfully changes once/day.
Mitigation: User actions (sheet change, event) use updateSnapshot immediately.
            Midnight timeline entries handle daily "Day N" rollover.
            No need for frequent background updates.
Status: MITIGATED (update strategy matches WidgetKit budget)

---

### RISK-007: Supabase Realtime duplicate events

Severity: LOW
Probability: MEDIUM (Realtime fires on own mutations too)
Impact: UI could re-render unnecessarily or show stale data
Mitigation: Deduplicate by comparing incoming updated_at with local updated_at.
            Ignore events where remote updated_at <= local updated_at.
Status: MITIGATED (conflict resolution logic documented)

---

### RISK-008: react-native-view-shot fails to capture off-screen ShareCard

Severity: MEDIUM
Probability: LOW
Mitigation: Render ShareCard in tree at opacity 0 (not display:none, which removes from layout).
            Capture only after layout is complete (useLayoutEffect or short delay).
Status: MITIGATED (approach validated in research)

---

### RISK-009: DST boundary causes incorrect "days since change" calculation

Severity: MEDIUM
Probability: LOW but predictable (twice/year for DST regions)
Impact: Score jumps by 1 day when clocks change
Mitigation: Use date-fns differenceInCalendarDays which handles DST via local timezone.
            Unit tests explicitly cover DST boundary using jest.setSystemTime.
Status: MITIGATED (tested)

---

### RISK-010: iOS notification permission denied — no re-prompt

Severity: MEDIUM
Probability: MEDIUM (users skip notification prompts)
Impact: User never receives reminders
Mitigation: In-app banner shown when permission is denied.
            Banner links to iOS Settings with expo-linking deep link.
            App is fully functional without notifications.
Status: MITIGATED (graceful degradation)

---

### RISK-011: expo-widgets API changes between SDK 56 patch releases

Severity: LOW
Probability: LOW (marked stable)
Mitigation: Pin to specific SDK 56 version in package.json.
            Review CHANGELOG before upgrading any Expo package.
Status: ACCEPTED (low probability; monitoring)

---

### RISK-012: Multiple simultaneous partner writes cause data inconsistency

Severity: MEDIUM
Probability: LOW (two people rarely tap "changed sheets" simultaneously)
Impact: One write is silently overwritten
Mitigation: Conflict resolution: latest updated_at wins. Sheet change is always authoritative.
            Supabase Realtime delivers the winning state to both clients within seconds.
            No data is lost — both writes succeed; latest persists.
Status: MITIGATED (last-write-wins acceptable for this use case)

---

### RISK-013: Corrupted MMKV data on first launch or upgrade

Severity: MEDIUM
Probability: LOW
Impact: App crashes or shows incorrect state
Mitigation: All MMKV reads go through serializers.ts which validates and returns safe defaults.
            Unit tests cover corrupted/missing data scenarios.
            Never call JSON.parse directly — always use safe deserializer.
Status: MITIGATED (tested)

---

## Deferred Risks (accepted for MVP)

| Risk | Decision |
|------|---------|
| Android widget | Deferred to v0.2.0 (Voltra or Glance) |
| Sign in with Apple | Deferred — anonymous auth sufficient |
| Push notifications (APNs) | Deferred — local notifications only |
| Multiple beds per user | Deferred — data model supports it |
| Apple Watch complication | Deferred — separate WatchKit target |
| Offline invite code join | Deferred — requires internet connection to validate |

---

## Definition of Done — Phase 0

- [x] RESEARCH.md: all dependencies validated
- [x] ARCHITECTURE.md: all structural decisions documented
- [x] RISKS.md: all known risks have mitigation or explicit deferral
- [x] No open "unknown" risks
- [x] Tech stack confirmed; no further evaluation needed
