# Freshy — Bed Status

> A cozy bed freshness tracker. Fun reminder tool — not medical advice.

---

## What is Freshy?

Freshy tracks how fresh your bed is — based on when you last changed your sheets and events you log (pets, sweaty nights, sick days, etc.). It gives you a score from 0–100, a fun visual, and gentle reminders. It is a fun app, not a hygiene tool.

**Disclaimer:** Freshy is a fun reminder tool and does not provide medical or hygiene advice.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| App | Expo SDK 56 + React Native + TypeScript |
| Navigation | expo-router |
| Local storage | react-native-mmkv + expo-secure-store |
| Backend (partner sync) | Supabase |
| Notifications | expo-notifications (local only) |
| Widget | expo-widgets (iOS 16.4+, SDK 56 stable) |
| Animations | react-native-reanimated v3 |
| Tests | Jest + jest-expo |

---

## Prerequisites

- Node.js 20.x or higher (20.19.4+ recommended for full engine compatibility)
- npm 10.x
- EAS CLI: `npm install -g eas-cli`
- Xcode 15+ (for iOS builds — macOS required)
- Apple Developer account (for device builds and widgets)
- Supabase account (for partner sync — optional)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Bar-Barina/freshy.git
cd freshy
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (only needed for partner sync).
The app works fully offline without Supabase for all local features.

### 4. Run tests

```bash
npm test
```

### 5. Typecheck

```bash
npm run typecheck
```

---

## Building for iOS

The app requires a native build — Expo Go is NOT supported (react-native-mmkv and expo-widgets both require native modules).

### EAS development build (recommended)

```bash
# Build for physical device
eas build --profile development --platform ios

# Build for simulator
eas build --profile development-simulator --platform ios
```

### Local prebuild

```bash
npx expo prebuild --platform ios
npx expo run:ios
```

---

## iOS Home Screen Widget

The widget uses expo-widgets (stable in Expo SDK 56).

**Requirements:**
- EAS iOS build (not testable in Expo Go or iOS Simulator)
- Physical iOS device running iOS 16.4+
- App Group: group.com.freshy.app (handled automatically by expo-widgets config plugin)

**Testing:**
1. `eas build --profile development --platform ios`
2. Install on device
3. Long press home screen → Add Widget → search "Bed Status"

The widget shows your freshness score, status text, and days since last change.
It updates immediately when you tap "I changed the sheets" in the app.

---

## Supabase Setup (Partner Sync — Optional)

Partner sync lets two people share a bed status with an invite code.

### 1. Create a project at app.supabase.com

### 2. Run migrations

Copy and run the SQL from `supabase/migrations/` in the Supabase SQL editor.

### 3. Add to `.env`

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Never add the service_role key to the app.

---

## Project Structure

```
app/                    expo-router screens (routes only — no business logic)
  (onboarding)/         3-screen onboarding flow
  (tabs)/               Main app: Home, History, Settings
  privacy.tsx           Privacy policy screen
  terms.tsx             Terms of service screen

src/
  components/           Reusable UI components
  features/
    bed/                useBed hook + bedStore (core entity)
    events/             Event sheet + presets
    partner/            Partner sync service
    settings/           useSettings hook
    widget/             widgetSync service
  services/
    storage/            MMKV wrapper + serializers
    notifications/      Local notification service
    supabase/           Supabase client + auth
  utils/
    freshnessCalculator.ts   Pure freshness formula (tested)
    generateId.ts            Crypto UUID + invite code
  theme/                Colors, typography, spacing tokens
  types/                All TypeScript interfaces
  widgets/              BedStatusWidget (expo-widgets isolated runtime)

supabase/migrations/    SQL schema + RLS policies
__tests__/              Unit tests (calculator, serializers)
docs/                   RESEARCH.md, ARCHITECTURE.md, RISKS.md
```

---

## Git Workflow

```
main          protected default branch — PRs merge here
phase/*       one branch per implementation phase
fix/*         bugfix branches
feat/*        feature branches
```

Each phase: feature branch → PR into `main`. Squash merge with conventional commit message.
Tag releases on `main` (e.g. `v0.1.0`).

Conventional commits: feat:, fix:, test:, chore:, docs:, refactor:

---

## Scripts

```bash
npm start              # Start Expo dev server
npm test               # Run all tests
npm run test:coverage  # Tests with coverage report (>90% required)
npm run typecheck      # TypeScript check
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier
npm run prebuild       # expo prebuild
```

---

## Known Limitations (MVP v0.1.0)

- iOS only (Android planned for v0.2.0)
- Widget requires EAS build + physical device
- Partner sync requires internet (no offline join)
- App reinstall clears partner session (rejoin via invite code)
- Anonymous auth only (no Sign in with Apple)
- No multiple beds (data model supports it; UI coming in v0.2.0)

See docs/MVP_REVIEW.md for the full audit after all phases are complete.

---

## License

MIT
