// ─── Freshness ───────────────────────────────────────────────────────────────

export type FreshnessBand = 'fresh' | 'ok' | 'soon' | 'warning' | 'biohazard';

export interface FreshnessStatus {
  /** 0–100, always clamped */
  score: number;
  band: FreshnessBand;
  /** Human-readable label for the current band */
  label: string;
  /** Whole days since last sheet change; -1 if never changed */
  daysSinceChange: number;
}

// ─── Bed ─────────────────────────────────────────────────────────────────────

export interface Bed {
  id: string;
  name: string;
  /** ISO 8601 datetime string, or null if sheets have never been changed */
  lastChangedAt: string | null;
  preferredChangeIntervalDays: number;
  /** Consecutive on-time sheet changes. Resets if interval is exceeded. */
  streak: number;
  oops: BedOops[];
  createdAt: string;
  updatedAt: string;
  sharedWith: SharedBedMember[];
  /** Supabase bed UUID when shared; undefined for local-only beds */
  remoteBedId?: string;
  /** Display name of last user who changed the sheets (partner sync) */
  lastChangedByName?: string;
}

// ─── Oops (bed freshness moments) ────────────────────────────────────────────

export type BedOopsType =
  | 'pet'
  | 'sweaty'
  | 'sick'
  | 'ate_in_bed'
  | 'guest'
  | 'skipped_shower'
  | 'custom';

export interface BedOops {
  id: string;
  type: BedOopsType;
  label: string;
  /** Positive number; subtracted from score */
  penalty: number;
  /** ISO 8601 datetime string */
  createdAt: string;
  createdByUserId?: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export type Gender = 'male' | 'female' | 'skip';

export interface UserSettings {
  notificationsEnabled: boolean;
  /** 0–23 hour of day for reminder notification */
  reminderHour: number;
  /** 0–100; send threshold reminder when score drops below this */
  freshnessThreshold: number;
  theme: 'light' | 'dark' | 'system';
  gender: Gender;
  hasPets: boolean;
  sweatsOften: boolean;
  sharesBed: boolean;
  hasAC: boolean;
  defaultIntervalDays: number;
  onboardingComplete: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  notificationsEnabled: false,
  reminderHour: 9,
  freshnessThreshold: 40,
  theme: 'system',
  gender: 'skip',
  hasPets: false,
  sweatsOften: false,
  sharesBed: false,
  hasAC: false,
  defaultIntervalDays: 7,
  onboardingComplete: false,
};

// ─── Partner ─────────────────────────────────────────────────────────────────

export interface SharedBedMember {
  userId: string;
  displayName: string;
  joinedAt: string;
}

// ─── Widget ──────────────────────────────────────────────────────────────────

export interface WidgetProps {
  score: number;
  statusLabel: string;
  /** ISO 8601 or null */
  lastChangedAtISO: string | null;
  bedState: FreshnessBand;
  daysSinceChange: number;
}

// ─── Storage ─────────────────────────────────────────────────────────────────

/** Shape of bed data persisted to MMKV */
export interface PersistedBed extends Omit<Bed, 'oops'> {
  oopsIds: string[];
}

/** Shape of the offline mutation queue item */
export interface QueuedMutation {
  id: string;
  type: 'sheet_change' | 'add_oops' | 'delete_oops';
  payload: Record<string, unknown>;
  createdAt: string;
  retryCount: number;
}
