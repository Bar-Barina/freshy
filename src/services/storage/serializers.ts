import { Bed, BedEvent, UserSettings, DEFAULT_SETTINGS, QueuedMutation } from '@/types';

// ─── Bed ─────────────────────────────────────────────────────────────────────

const EMPTY_BED: Bed = {
  id: '',
  name: 'My Bed',
  lastChangedAt: null,
  preferredChangeIntervalDays: 7,
  events: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sharedWith: [],
};

export function deserializeBed(raw: unknown): Bed {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_BED };

  const obj = raw as Record<string, unknown>;

  return {
    id: typeof obj.id === 'string' ? obj.id : EMPTY_BED.id,
    name: typeof obj.name === 'string' ? obj.name : EMPTY_BED.name,
    lastChangedAt:
      typeof obj.lastChangedAt === 'string' || obj.lastChangedAt === null
        ? (obj.lastChangedAt as string | null)
        : EMPTY_BED.lastChangedAt,
    preferredChangeIntervalDays:
      typeof obj.preferredChangeIntervalDays === 'number' &&
      obj.preferredChangeIntervalDays > 0
        ? obj.preferredChangeIntervalDays
        : EMPTY_BED.preferredChangeIntervalDays,
    events: Array.isArray(obj.events)
      ? obj.events.map(deserializeBedEvent).filter((e): e is BedEvent => e !== null)
      : [],
    createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : EMPTY_BED.createdAt,
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : EMPTY_BED.updatedAt,
    sharedWith: Array.isArray(obj.sharedWith) ? obj.sharedWith : [],
    remoteBedId: typeof obj.remoteBedId === 'string' ? obj.remoteBedId : undefined,
    lastChangedByName:
      typeof obj.lastChangedByName === 'string' ? obj.lastChangedByName : undefined,
  };
}

export function deserializeBedEvent(raw: unknown): BedEvent | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (
    typeof obj.id !== 'string' ||
    typeof obj.type !== 'string' ||
    typeof obj.label !== 'string' ||
    typeof obj.penalty !== 'number' ||
    typeof obj.createdAt !== 'string'
  ) {
    return null;
  }

  return {
    id: obj.id,
    type: obj.type as BedEvent['type'],
    label: obj.label,
    penalty: Math.max(0, obj.penalty),
    createdAt: obj.createdAt,
    createdByUserId:
      typeof obj.createdByUserId === 'string' ? obj.createdByUserId : undefined,
  };
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function deserializeSettings(raw: unknown): UserSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SETTINGS };

  const obj = raw as Record<string, unknown>;

  return {
    notificationsEnabled:
      typeof obj.notificationsEnabled === 'boolean'
        ? obj.notificationsEnabled
        : DEFAULT_SETTINGS.notificationsEnabled,
    reminderHour:
      typeof obj.reminderHour === 'number' &&
      obj.reminderHour >= 0 &&
      obj.reminderHour <= 23
        ? obj.reminderHour
        : DEFAULT_SETTINGS.reminderHour,
    freshnessThreshold:
      typeof obj.freshnessThreshold === 'number' &&
      obj.freshnessThreshold >= 0 &&
      obj.freshnessThreshold <= 100
        ? obj.freshnessThreshold
        : DEFAULT_SETTINGS.freshnessThreshold,
    theme:
      obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'system'
        ? obj.theme
        : DEFAULT_SETTINGS.theme,
    gender:
      obj.gender === 'male' || obj.gender === 'female' || obj.gender === 'skip'
        ? obj.gender
        : DEFAULT_SETTINGS.gender,
    hasPets:
      typeof obj.hasPets === 'boolean' ? obj.hasPets : DEFAULT_SETTINGS.hasPets,
    sweatsOften:
      typeof obj.sweatsOften === 'boolean'
        ? obj.sweatsOften
        : DEFAULT_SETTINGS.sweatsOften,
    sharesBed:
      typeof obj.sharesBed === 'boolean' ? obj.sharesBed : DEFAULT_SETTINGS.sharesBed,
    hasAC:
      typeof obj.hasAC === 'boolean' ? obj.hasAC : DEFAULT_SETTINGS.hasAC,
    defaultIntervalDays:
      typeof obj.defaultIntervalDays === 'number' && obj.defaultIntervalDays > 0
        ? obj.defaultIntervalDays
        : DEFAULT_SETTINGS.defaultIntervalDays,
    onboardingComplete:
      typeof obj.onboardingComplete === 'boolean'
        ? obj.onboardingComplete
        : DEFAULT_SETTINGS.onboardingComplete,
  };
}

// ─── Offline queue ────────────────────────────────────────────────────────────

export function deserializeQueue(raw: unknown): QueuedMutation[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is QueuedMutation =>
      item !== null &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.type === 'string' &&
      typeof item.createdAt === 'string'
  );
}
