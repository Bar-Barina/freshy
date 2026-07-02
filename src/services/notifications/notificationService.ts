import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Bed, UserSettings } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/services/storage/mmkv';
import {
  NOTIFICATION_IDS,
  computeIntervalReminderDate,
  computeThresholdReminderDate,
  dedupeWithinCooldown,
  isWithinNotificationCooldown,
} from './scheduleHelpers';

let handlerConfigured = false;

/**
 * Configure foreground notification behaviour once at app start.
 */
export function configureNotificationHandler(): void {
  if (handlerConfigured) return;
  handlerConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Request OS notification permission. Returns true if granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Cancel all Freshy scheduled notifications and optionally reschedule.
 */
export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Non-fatal — app works without notifications
  }
}

/**
 * Reschedule interval + threshold reminders based on current bed/settings.
 * Max 2 pending; dedupes if within 24h of each other.
 */
export async function rescheduleNotifications(
  bed: Bed,
  settings: UserSettings
): Promise<void> {
  configureNotificationHandler();

  await cancelAllReminders();

  if (!settings.notificationsEnabled) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('freshness-reminders', {
        name: 'Freshness reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    } catch {
      // Channel may already exist
    }
  }

  const now = new Date();
  const lastNotifiedAt = storageGet<string>(STORAGE_KEYS.LAST_NOTIFIED_AT);

  if (isWithinNotificationCooldown(lastNotifiedAt, now)) {
    return;
  }

  const candidates: { id: string; date: Date; title: string; body: string }[] = [];

  const intervalDate = computeIntervalReminderDate(
    bed.lastChangedAt,
    bed.preferredChangeIntervalDays,
    settings.reminderHour,
    now
  );
  if (intervalDate !== null) {
    candidates.push({
      id: NOTIFICATION_IDS.INTERVAL,
      date: intervalDate,
      title: 'Time for fresh sheets?',
      body: `It's been about ${bed.preferredChangeIntervalDays} days — your bed could use a refresh.`,
    });
  }

  const thresholdDate = computeThresholdReminderDate(
    bed,
    settings.freshnessThreshold,
    settings.reminderHour,
    now
  );
  if (thresholdDate !== null) {
    candidates.push({
      id: NOTIFICATION_IDS.THRESHOLD,
      date: thresholdDate,
      title: 'Bed freshness dropping',
      body: 'Your estimated freshness is getting low. Maybe tonight is sheet night?',
    });
  }

  const deduped = dedupeWithinCooldown(
    candidates.map(({ id, date }) => ({ id, date }))
  );
  const toSchedule = candidates.filter((c) =>
    deduped.some((d) => d.id === c.id)
  );

  for (const notification of toSchedule) {
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: notification.id,
        content: {
          title: notification.title,
          body: notification.body,
          sound: true,
          data: { type: notification.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notification.date,
          channelId: Platform.OS === 'android' ? 'freshness-reminders' : undefined,
        },
      });
    } catch {
      // Skip individual failures — other reminders may still schedule
    }
  }
}

/**
 * Record delivery timestamp for 24h cooldown enforcement.
 */
export function recordNotificationDelivered(at: Date = new Date()): void {
  storageSet(STORAGE_KEYS.LAST_NOTIFIED_AT, at.toISOString());
}

/**
 * Subscribe to notification delivery events. Returns unsubscribe cleanup.
 */
export function subscribeToNotificationDelivery(): () => void {
  const subscription = Notifications.addNotificationReceivedListener(() => {
    recordNotificationDelivered();
  });
  return () => subscription.remove();
}
