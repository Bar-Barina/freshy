import { useState, useEffect, useCallback } from 'react';
import { Bed, BedEvent, FreshnessStatus, BedEventType } from '@/types';
import { calculateFreshness, DEFAULT_EVENT_PENALTIES } from '@/utils/freshnessCalculator';
import { loadBed, saveBed, createDefaultBed } from './bedStore';
import { generateId } from '@/utils/generateId';
import { useSettings } from '@/features/settings/useSettings';

interface UseBedReturn {
  bed: Bed;
  status: FreshnessStatus;
  isLoaded: boolean;
  initializeBed: () => void;
  markSheetsChanged: () => void;
  addEvent: (type: BedEventType, label: string, customPenalty?: number) => void;
  deleteEvent: (eventId: string) => void;
}

export function useBed(): UseBedReturn {
  const { settings } = useSettings();
  const [bed, setBed] = useState<Bed>(() => loadBed());
  const [isLoaded, setIsLoaded] = useState(false);

  // Recalculate freshness on each render/update — pure, fast, no side effects
  const status = calculateFreshness(bed, new Date());

  useEffect(() => {
    const loaded = loadBed();
    setBed(loaded);
    setIsLoaded(true);
  }, []);

  const updateAndPersist = useCallback((updater: (prev: Bed) => Bed) => {
    setBed((prev) => {
      const next = updater(prev);
      saveBed(next);
      return next;
    });
  }, []);

  const initializeBed = useCallback(() => {
    const existing = loadBed();
    // Only create if no bed exists yet
    if (!existing.id) {
      const fresh = createDefaultBed(settings.defaultIntervalDays);
      saveBed(fresh);
      setBed(fresh);
    } else {
      setBed(existing);
    }
    setIsLoaded(true);
  }, [settings.defaultIntervalDays]);

  const markSheetsChanged = useCallback(() => {
    const now = new Date().toISOString();
    updateAndPersist((prev) => ({
      ...prev,
      lastChangedAt: now,
      updatedAt: now,
      lastChangedByName: undefined,
    }));
  }, [updateAndPersist]);

  const addEvent = useCallback(
    (type: BedEventType, label: string, customPenalty?: number) => {
      const penalty = customPenalty ?? DEFAULT_EVENT_PENALTIES[type] ?? 5;
      const event: BedEvent = {
        id: generateId(),
        type,
        label,
        penalty,
        createdAt: new Date().toISOString(),
      };
      updateAndPersist((prev) => ({
        ...prev,
        events: [...prev.events, event],
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateAndPersist]
  );

  const deleteEvent = useCallback(
    (eventId: string) => {
      updateAndPersist((prev) => ({
        ...prev,
        events: prev.events.filter((e) => e.id !== eventId),
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateAndPersist]
  );

  return { bed, status, isLoaded, initializeBed, markSheetsChanged, addEvent, deleteEvent };
}
