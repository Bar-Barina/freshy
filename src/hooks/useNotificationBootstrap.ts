import { useEffect } from 'react';
import { useBed } from '@/features/bed/useBed';
import { useSettings } from '@/features/settings/useSettings';
import {
  configureNotificationHandler,
  rescheduleNotifications,
  cancelAllReminders,
  subscribeToNotificationDelivery,
} from '@/services/notifications/notificationService';

/**
 * Bootstraps notification handler and syncs schedule when the main app loads.
 */
export function useNotificationBootstrap(): void {
  const { bed } = useBed();
  const { settings } = useSettings();

  useEffect(() => {
    configureNotificationHandler();

    const unsubscribe = subscribeToNotificationDelivery();

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (settings.notificationsEnabled) {
      void rescheduleNotifications(bed, settings);
    } else {
      void cancelAllReminders();
    }
  }, [
    bed,
    settings,
    settings.notificationsEnabled,
    settings.reminderHour,
    settings.freshnessThreshold,
    bed.lastChangedAt,
    bed.preferredChangeIntervalDays,
    bed.updatedAt,
    bed.oops.length,
  ]);
}
