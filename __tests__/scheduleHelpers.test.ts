import {
  atReminderHour,
  nextReminderSlot,
  computeIntervalReminderDate,
  computeThresholdReminderDate,
  dedupeWithinCooldown,
  isWithinNotificationCooldown,
  NOTIFICATION_COOLDOWN_MS,
} from '@/services/notifications/scheduleHelpers';
import type { Bed } from '@/types';

function makeBed(overrides: Partial<Bed> = {}): Bed {
  return {
    id: 'test-bed',
    name: 'Test Bed',
    lastChangedAt: null,
    preferredChangeIntervalDays: 7,
    streak: 0,
    oops: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sharedWith: [],
    ...overrides,
  };
}

describe('scheduleHelpers', () => {
  const now = new Date('2026-07-02T14:00:00');

  describe('atReminderHour', () => {
    it('sets hour and zeroes minutes/seconds', () => {
      const result = atReminderHour(now, 9);
      expect(result.getHours()).toBe(9);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe('nextReminderSlot', () => {
    it('returns today when reminder hour is still ahead', () => {
      const morning = new Date('2026-07-02T08:00:00');
      const result = nextReminderSlot(morning, 9);
      expect(result.getDate()).toBe(2);
      expect(result.getHours()).toBe(9);
    });

    it('rolls to tomorrow when reminder hour already passed', () => {
      const afternoon = new Date('2026-07-02T14:00:00');
      const result = nextReminderSlot(afternoon, 9);
      expect(result.getDate()).toBe(3);
      expect(result.getHours()).toBe(9);
    });
  });

  describe('computeIntervalReminderDate', () => {
    it('returns null when never tracked', () => {
      expect(computeIntervalReminderDate(null, 7, 9, now)).toBeNull();
    });

    it('schedules on due day at reminder hour', () => {
      const lastChanged = '2026-06-25T10:00:00.000Z';
      const result = computeIntervalReminderDate(lastChanged, 7, 9, now);
      expect(result).not.toBeNull();
      expect(result!.getHours()).toBe(9);
    });
  });

  describe('computeThresholdReminderDate', () => {
    it('returns null when never tracked', () => {
      const bed = makeBed();
      expect(computeThresholdReminderDate(bed, 40, 9, now)).toBeNull();
    });

    it('returns null when already below threshold', () => {
      const bed = makeBed({ lastChangedAt: '2026-05-01T10:00:00.000Z' });
      expect(computeThresholdReminderDate(bed, 40, 9, now)).toBeNull();
    });

    it('schedules a future date when score is above threshold', () => {
      const bed = makeBed({ lastChangedAt: '2026-07-01T10:00:00.000Z' });
      const result = computeThresholdReminderDate(bed, 40, 9, now);
      expect(result).not.toBeNull();
      expect(result!.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('dedupeWithinCooldown', () => {
    it('drops notifications within 24h of each other', () => {
      const early = new Date('2026-07-02T09:00:00');
      const late = new Date('2026-07-02T20:00:00');
      const result = dedupeWithinCooldown([
        { id: 'a', date: early },
        { id: 'b', date: late },
      ]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('a');
    });

    it('keeps notifications more than 24h apart', () => {
      const early = new Date('2026-07-02T09:00:00');
      const late = new Date('2026-07-04T09:00:00');
      const result = dedupeWithinCooldown([
        { id: 'a', date: early },
        { id: 'b', date: late },
      ]);
      expect(result).toHaveLength(2);
    });
  });

  describe('isWithinNotificationCooldown', () => {
    it('returns false when never notified', () => {
      expect(isWithinNotificationCooldown(undefined, now)).toBe(false);
    });

    it('returns true within cooldown window', () => {
      const recent = new Date(now.getTime() - NOTIFICATION_COOLDOWN_MS + 1000).toISOString();
      expect(isWithinNotificationCooldown(recent, now)).toBe(true);
    });

    it('returns false after cooldown window', () => {
      const old = new Date(now.getTime() - NOTIFICATION_COOLDOWN_MS - 1000).toISOString();
      expect(isWithinNotificationCooldown(old, now)).toBe(false);
    });
  });
});
