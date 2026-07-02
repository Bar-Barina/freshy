import { createMMKV } from 'react-native-mmkv';

/**
 * Primary MMKV instance for all app data.
 * Not encrypted — data is non-sensitive (bed dates, preferences).
 * Auth session is stored in expo-secure-store, not here.
 *
 * react-native-mmkv v4 uses the createMMKV() factory instead of `new MMKV()`.
 */
export const storage = createMMKV({ id: 'freshy-main' });

// ─── Typed helpers ────────────────────────────────────────────────────────────

export function storageGet<T>(key: string): T | undefined {
  const raw = storage.getString(key);
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function storageSet<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function storageDelete(key: string): void {
  // v4 uses remove() instead of delete()
  storage.remove(key);
}

export function storageHas(key: string): boolean {
  return storage.contains(key);
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  BED: 'bed_v1',
  EVENTS_PREFIX: 'event_v1_',
  SETTINGS: 'settings_v1',
  LAST_NOTIFIED_AT: 'last_notified_at',
  OFFLINE_QUEUE: 'offline_queue_v1',
  WIDGET_LAST_SYNCED: 'widget_last_synced',
} as const;
