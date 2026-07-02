import { useState, useCallback } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/services/storage/mmkv';
import { deserializeSettings } from '@/services/storage/serializers';

interface UseSettingsReturn {
  settings: UserSettings;
  isLoaded: boolean;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

export function useSettings(): UseSettingsReturn {
  // Lazy initializer — MMKV is synchronous, so state is populated on the first render.
  // No useEffect needed; this avoids a redundant re-render on mount.
  const [settings, setSettings] = useState<UserSettings>(() => {
    const raw = storageGet<unknown>(STORAGE_KEYS.SETTINGS);
    return deserializeSettings(raw);
  });
  const [isLoaded] = useState(true);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      storageSet(STORAGE_KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const fresh = { ...DEFAULT_SETTINGS };
    storageSet(STORAGE_KEYS.SETTINGS, fresh);
    setSettings(fresh);
  }, []);

  return { settings, isLoaded, updateSettings, resetSettings };
}
