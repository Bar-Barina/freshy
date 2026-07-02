import { deserializeBed, deserializeSettings, deserializeBedOops } from '../src/services/storage/serializers';
import { DEFAULT_SETTINGS } from '../src/types';

// ─── deserializeBed ───────────────────────────────────────────────────────────

describe('deserializeBed', () => {
  it('returns safe default for null input', () => {
    const result = deserializeBed(null);
    expect(result.id).toBe('');
    expect(result.lastChangedAt).toBeNull();
    expect(result.oops).toEqual([]);
  });

  it('returns safe default for undefined input', () => {
    const result = deserializeBed(undefined);
    expect(result).toBeDefined();
    expect(result.oops).toEqual([]);
  });

  it('returns safe default for corrupted string input', () => {
    const result = deserializeBed('invalid json string');
    expect(result.oops).toEqual([]);
  });

  it('returns safe default for unexpected type', () => {
    const result = deserializeBed(42);
    expect(result.oops).toEqual([]);
  });

  it('deserializes valid bed correctly', () => {
    const raw = {
      id: 'abc-123',
      name: 'My Bed',
      lastChangedAt: '2024-06-01T08:00:00.000Z',
      preferredChangeIntervalDays: 7,
      oops: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-06-01T08:00:00.000Z',
      sharedWith: [],
    };
    const result = deserializeBed(raw);
    expect(result.id).toBe('abc-123');
    expect(result.lastChangedAt).toBe('2024-06-01T08:00:00.000Z');
    expect(result.preferredChangeIntervalDays).toBe(7);
  });

  it('migrates legacy events key to oops', () => {
    const raw = {
      id: 'abc',
      events: [
        { id: 'e1', type: 'pet', label: 'Pet', penalty: 5, createdAt: '2024-01-01T00:00:00.000Z' },
      ],
    };
    const result = deserializeBed(raw);
    expect(result.oops).toHaveLength(1);
    expect(result.oops[0].type).toBe('pet');
  });

  it('falls back to default interval for invalid value', () => {
    const result = deserializeBed({ preferredChangeIntervalDays: -5 });
    expect(result.preferredChangeIntervalDays).toBe(7);
  });

  it('preserves null lastChangedAt', () => {
    const result = deserializeBed({ lastChangedAt: null });
    expect(result.lastChangedAt).toBeNull();
  });

  it('rejects non-string lastChangedAt', () => {
    const result = deserializeBed({ lastChangedAt: 12345 });
    expect(result.lastChangedAt).toBeNull();
  });
});

// ─── deserializeSettings ──────────────────────────────────────────────────────

describe('deserializeSettings', () => {
  it('returns DEFAULT_SETTINGS for null input', () => {
    const result = deserializeSettings(null);
    expect(result).toEqual(DEFAULT_SETTINGS);
  });

  it('returns DEFAULT_SETTINGS for corrupted input', () => {
    const result = deserializeSettings('bad');
    expect(result).toEqual(DEFAULT_SETTINGS);
  });

  it('deserializes valid settings correctly', () => {
    const raw = {
      notificationsEnabled: true,
      reminderHour: 20,
      freshnessThreshold: 30,
      theme: 'dark' as const,
      hasPets: true,
      sweatsOften: false,
      sharesBed: true,
      defaultIntervalDays: 10,
      onboardingComplete: true,
    };
    const result = deserializeSettings(raw);
    expect(result.notificationsEnabled).toBe(true);
    expect(result.reminderHour).toBe(20);
    expect(result.theme).toBe('dark');
    expect(result.onboardingComplete).toBe(true);
  });

  it('rejects out-of-range reminderHour and uses default', () => {
    const result = deserializeSettings({ reminderHour: 25 });
    expect(result.reminderHour).toBe(DEFAULT_SETTINGS.reminderHour);
  });

  it('rejects out-of-range freshnessThreshold and uses default', () => {
    const result = deserializeSettings({ freshnessThreshold: 150 });
    expect(result.freshnessThreshold).toBe(DEFAULT_SETTINGS.freshnessThreshold);
  });

  it('rejects invalid theme and uses default', () => {
    const result = deserializeSettings({ theme: 'purple' });
    expect(result.theme).toBe(DEFAULT_SETTINGS.theme);
  });
});

// ─── deserializeBedOops ──────────────────────────────────────────────────────

describe('deserializeBedOops', () => {
  it('returns null for incomplete oops', () => {
    expect(deserializeBedOops({ id: 'x' })).toBeNull();
  });

  it('returns null for null input', () => {
    expect(deserializeBedOops(null)).toBeNull();
  });

  it('ensures penalty is non-negative', () => {
    const raw = { id: 'e1', type: 'pet', label: 'Pet', penalty: -5, createdAt: '2024-01-01T00:00:00.000Z' };
    const result = deserializeBedOops(raw);
    expect(result?.penalty).toBe(0);
  });

  it('deserializes valid oops correctly', () => {
    const raw = { id: 'e1', type: 'sick', label: 'Sick', penalty: 12, createdAt: '2024-01-01T00:00:00.000Z' };
    const result = deserializeBedOops(raw);
    expect(result?.id).toBe('e1');
    expect(result?.penalty).toBe(12);
  });

  it('preserves optional createdByUserId', () => {
    const raw = { id: 'e2', type: 'pet', label: 'Pet', penalty: 5, createdAt: '2024-01-01T00:00:00.000Z', createdByUserId: 'user-abc' };
    const result = deserializeBedOops(raw);
    expect(result?.createdByUserId).toBe('user-abc');
  });
});

// ─── deserializeQueue ─────────────────────────────────────────────────────────

describe('deserializeQueue', () => {
  it('returns empty array for null input', () => {
    const { deserializeQueue } = require('../src/services/storage/serializers');
    expect(deserializeQueue(null)).toEqual([]);
  });

  it('returns empty array for non-array input', () => {
    const { deserializeQueue } = require('../src/services/storage/serializers');
    expect(deserializeQueue('bad')).toEqual([]);
  });

  it('returns valid mutations and filters invalid ones', () => {
    const { deserializeQueue } = require('../src/services/storage/serializers');
    const input = [
      { id: 'm1', type: 'sheet_change', payload: {}, createdAt: '2024-01-01T00:00:00.000Z', retryCount: 0 },
      { id: 'm2' },
      null,
    ];
    const result = deserializeQueue(input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('m1');
  });
});
