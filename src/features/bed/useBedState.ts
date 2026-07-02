import { useState, useCallback } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Bed, BedOops, FreshnessStatus, BedOopsType } from '@/types';
import { calculateFreshness, DEFAULT_OOPS_PENALTIES } from '@/utils/freshnessCalculator';
import { loadBed, saveBed, createDefaultBed } from './bedStore';
import { generateId } from '@/utils/generateId';
import { useSettings } from '@/features/settings/useSettings';
import { rescheduleNotifications } from '@/services/notifications/notificationService';
import { hasOopsTypeToday } from '@/utils/oopsUtils';

export type AddOopsResult = 'ok' | 'already_today';

export interface UseBedReturn {
  bed: Bed;
  status: FreshnessStatus;
  isLoaded: boolean;
  initializeBed: () => void;
  markSheetsChanged: () => void;
  addOops: (type: BedOopsType, label: string, customPenalty?: number) => AddOopsResult;
  deleteOops: (oopsId: string) => void;
}

export function useBedState(): UseBedReturn {
  const { settings } = useSettings();

  const [bed, setBed] = useState<Bed>(() => loadBed());
  const [isLoaded, setIsLoaded] = useState(true);

  const status = calculateFreshness(bed, new Date());

  const updateAndPersist = useCallback(
    (updater: (prev: Bed) => Bed) => {
      setBed((prev) => {
        const next = updater(prev);
        saveBed(next);
        void rescheduleNotifications(next, settings);
        return next;
      });
    },
    [settings]
  );

  const initializeBed = useCallback(() => {
    const existing = loadBed();
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
    const now = new Date();
    const nowISO = now.toISOString();
    updateAndPersist((prev) => {
      let nextStreak = 1;
      if (prev.lastChangedAt) {
        const daysSinceLast = differenceInCalendarDays(now, parseISO(prev.lastChangedAt));
        nextStreak =
          daysSinceLast <= prev.preferredChangeIntervalDays ? prev.streak + 1 : 1;
      }
      return {
        ...prev,
        lastChangedAt: nowISO,
        updatedAt: nowISO,
        streak: nextStreak,
        lastChangedByName: undefined,
        // Previous oops were washed away with the old sheets
        oops: [],
      };
    });
  }, [updateAndPersist]);

  const addOops = useCallback(
    (type: BedOopsType, label: string, customPenalty?: number): AddOopsResult => {
      let result: AddOopsResult = 'ok';

      setBed((prev) => {
        if (hasOopsTypeToday(prev, type)) {
          result = 'already_today';
          return prev;
        }

        const penalty = customPenalty ?? DEFAULT_OOPS_PENALTIES[type] ?? 5;
        const oops: BedOops = {
          id: generateId(),
          type,
          label,
          penalty,
          createdAt: new Date().toISOString(),
        };
        const next = {
          ...prev,
          oops: [...prev.oops, oops],
          updatedAt: new Date().toISOString(),
        };
        saveBed(next);
        void rescheduleNotifications(next, settings);
        return next;
      });

      return result;
    },
    [settings]
  );

  const deleteOops = useCallback(
    (oopsId: string) => {
      updateAndPersist((prev) => ({
        ...prev,
        oops: prev.oops.filter((o) => o.id !== oopsId),
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateAndPersist]
  );

  return {
    bed,
    status,
    isLoaded,
    initializeBed,
    markSheetsChanged,
    addOops,
    deleteOops,
  };
}
