import { addDays, setHours, setMinutes, setSeconds, setMilliseconds, isBefore, parseISO } from 'date-fns';
import type { Bed } from '@/types';
import { calculateFreshness } from '@/utils/freshnessCalculator';

/** Notification identifier constants — used for cancel/reschedule. */
export const NOTIFICATION_IDS = {
  INTERVAL: 'freshy-interval-reminder',
  THRESHOLD: 'freshy-threshold-alert',
} as const;

export const NOTIFICATION_COOLDOWN_MS = 24 * 60 * 60 * 1000;

/**
 * Sets a date to the configured reminder hour (local time), zero seconds/ms.
 */
export function atReminderHour(date: Date, reminderHour: number): Date {
  return setMilliseconds(
    setSeconds(setMinutes(setHours(date, reminderHour), 0), 0),
    0
  );
}

/**
 * Returns the next valid fire date at reminderHour, rolling forward if already passed.
 */
export function nextReminderSlot(from: Date, reminderHour: number): Date {
  let candidate = atReminderHour(from, reminderHour);
  if (!isBefore(from, candidate)) {
    candidate = atReminderHour(addDays(from, 1), reminderHour);
  }
  return candidate;
}

/**
 * When sheets are due for a change (lastChanged + interval), at reminderHour.
 * Returns null if never tracked.
 */
export function computeIntervalReminderDate(
  lastChangedAt: string | null,
  intervalDays: number,
  reminderHour: number,
  now: Date
): Date | null {
  if (lastChangedAt === null) return null;

  const dueDay = addDays(parseISO(lastChangedAt), intervalDays);
  let fireAt = atReminderHour(dueDay, reminderHour);

  if (!isBefore(now, fireAt)) {
    fireAt = nextReminderSlot(now, reminderHour);
  }

  return fireAt;
}

/**
 * Estimates when the score will drop below the threshold, at reminderHour that day.
 * Returns null if already below threshold or never tracked.
 */
export function computeThresholdReminderDate(
  bed: Bed,
  threshold: number,
  reminderHour: number,
  now: Date
): Date | null {
  if (bed.lastChangedAt === null) return null;

  const status = calculateFreshness(bed, now);
  if (status.score <= threshold) return null;

  const dailyDecay = 100 / bed.preferredChangeIntervalDays;
  if (dailyDecay <= 0) return null;

  const daysUntilThreshold = (status.score - threshold) / dailyDecay;
  const targetDay = addDays(now, Math.ceil(daysUntilThreshold));
  let fireAt = atReminderHour(targetDay, reminderHour);

  if (!isBefore(now, fireAt)) {
    fireAt = nextReminderSlot(now, reminderHour);
  }

  return fireAt;
}

/**
 * If two fire dates fall within 24h, keep the earlier and drop the later.
 */
export function dedupeWithinCooldown(
  dates: { id: string; date: Date }[]
): { id: string; date: Date }[] {
  if (dates.length <= 1) return dates;

  const sorted = [...dates].sort((a, b) => a.date.getTime() - b.date.getTime());
  const kept: { id: string; date: Date }[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = kept[kept.length - 1];
    const gap = sorted[i].date.getTime() - prev.date.getTime();
    if (gap >= NOTIFICATION_COOLDOWN_MS) {
      kept.push(sorted[i]);
    }
  }

  return kept;
}

/**
 * Returns true if a notification was delivered within the cooldown window.
 */
export function isWithinNotificationCooldown(lastNotifiedAt: string | undefined, now: Date): boolean {
  if (lastNotifiedAt === undefined) return false;
  const elapsed = now.getTime() - parseISO(lastNotifiedAt).getTime();
  return elapsed < NOTIFICATION_COOLDOWN_MS;
}
