import { calculateFreshness, getStatusBand, sumEventPenalties, clamp } from '../src/utils/freshnessCalculator';
import { Bed, BedEvent } from '../src/types';

// ─── Test helpers ─────────────────────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000;

function makeDate(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * DAY_MS).toISOString();
}

function makeBed(overrides: Partial<Bed> = {}): Bed {
  return {
    id: 'test-bed',
    name: 'Test Bed',
    lastChangedAt: makeDate(0),
    preferredChangeIntervalDays: 7,
    events: [],
    createdAt: makeDate(0),
    updatedAt: makeDate(0),
    sharedWith: [],
    ...overrides,
  };
}

function makeEvent(daysAgo: number, penalty: number): BedEvent {
  return {
    id: `event-${daysAgo}`,
    type: 'custom',
    label: 'Test event',
    penalty,
    createdAt: makeDate(daysAgo),
  };
}

const NOW = new Date('2024-06-15T12:00:00.000Z');

// ─── calculateFreshness ───────────────────────────────────────────────────────

describe('calculateFreshness', () => {
  it('returns score 100 when changed today with no events', () => {
    const bed = makeBed({ lastChangedAt: NOW.toISOString() });
    const result = calculateFreshness(bed, NOW);
    expect(result.score).toBe(100);
    expect(result.band).toBe('fresh');
    expect(result.daysSinceChange).toBe(0);
  });

  it('decays linearly over 7 days (default interval)', () => {
    const sevenDaysAgo = new Date(NOW.getTime() - 7 * DAY_MS);
    const bed = makeBed({ lastChangedAt: sevenDaysAgo.toISOString() });
    const result = calculateFreshness(bed, NOW);
    // 100 - (7 * (100/7)) = 0
    expect(result.score).toBeCloseTo(0, 1);
    expect(result.band).toBe('biohazard');
  });

  it('uses preferredChangeIntervalDays in decay rate', () => {
    const threeDaysAgo = new Date(NOW.getTime() - 3 * DAY_MS);
    const bed = makeBed({
      lastChangedAt: threeDaysAgo.toISOString(),
      preferredChangeIntervalDays: 6,
    });
    const result = calculateFreshness(bed, NOW);
    // dailyDecay = 100/6 ≈ 16.67; 3 days = 50 reduction → score ≈ 50
    expect(result.score).toBeCloseTo(50, 0);
  });

  it('returns score 0 and biohazard band when lastChangedAt is null', () => {
    const bed = makeBed({ lastChangedAt: null });
    const result = calculateFreshness(bed, NOW);
    expect(result.score).toBe(0);
    expect(result.band).toBe('biohazard');
    expect(result.daysSinceChange).toBe(-1);
  });

  it('clamps score to 0 — cannot go negative', () => {
    const twentyDaysAgo = new Date(NOW.getTime() - 20 * DAY_MS);
    const bed = makeBed({
      lastChangedAt: twentyDaysAgo.toISOString(),
      preferredChangeIntervalDays: 7,
    });
    const result = calculateFreshness(bed, NOW);
    expect(result.score).toBe(0);
  });

  it('clamps score to 100 — cannot exceed 100', () => {
    const bed = makeBed({
      lastChangedAt: NOW.toISOString(),
      preferredChangeIntervalDays: 7,
      events: [],
    });
    const result = calculateFreshness(bed, NOW);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('subtracts event penalties from score', () => {
    const yesterday = new Date(NOW.getTime() - DAY_MS);
    const event: BedEvent = {
      id: 'ev1',
      type: 'sick',
      label: 'Sick day',
      penalty: 12,
      createdAt: NOW.toISOString(), // event happened today
    };
    const bed = makeBed({
      lastChangedAt: yesterday.toISOString(),
      events: [event],
    });
    const result = calculateFreshness(bed, NOW);
    // 1 day decay = 100/7 ≈ 14.28; minus 12 penalty ≈ 73.7
    expect(result.score).toBeCloseTo(100 - 100 / 7 - 12, 0);
  });

  it('ignores events that happened before lastChangedAt', () => {
    const threeDaysAgo = new Date(NOW.getTime() - 3 * DAY_MS);
    const fiveDaysAgo = new Date(NOW.getTime() - 5 * DAY_MS);
    const event: BedEvent = {
      id: 'old-event',
      type: 'pet',
      label: 'Pet',
      penalty: 5,
      createdAt: fiveDaysAgo.toISOString(), // before lastChangedAt
    };
    const bed = makeBed({
      lastChangedAt: threeDaysAgo.toISOString(),
      events: [event],
    });
    const resultWithOldEvent = calculateFreshness(bed, NOW);
    const bedNoEvents = makeBed({ lastChangedAt: threeDaysAgo.toISOString() });
    const resultNoEvents = calculateFreshness(bedNoEvents, NOW);
    expect(resultWithOldEvent.score).toBe(resultNoEvents.score);
  });

  it('accumulates multiple event penalties', () => {
    const yesterday = new Date(NOW.getTime() - DAY_MS);
    const events: BedEvent[] = [
      { id: '1', type: 'pet', label: 'Pet', penalty: 5, createdAt: NOW.toISOString() },
      { id: '2', type: 'sweaty', label: 'Sweaty', penalty: 8, createdAt: NOW.toISOString() },
      { id: '3', type: 'sick', label: 'Sick', penalty: 12, createdAt: NOW.toISOString() },
    ];
    const bed = makeBed({ lastChangedAt: yesterday.toISOString(), events });
    const result = calculateFreshness(bed, NOW);
    const expected = 100 - 100 / 7 - (5 + 8 + 12);
    expect(result.score).toBeCloseTo(Math.max(0, expected), 0);
  });
});

// ─── getStatusBand ────────────────────────────────────────────────────────────

describe('getStatusBand', () => {
  it('maps 100 to fresh', () => expect(getStatusBand(100).band).toBe('fresh'));
  it('maps 85 to fresh', () => expect(getStatusBand(85).band).toBe('fresh'));
  it('maps 84 to ok', () => expect(getStatusBand(84).band).toBe('ok'));
  it('maps 65 to ok', () => expect(getStatusBand(65).band).toBe('ok'));
  it('maps 64 to soon', () => expect(getStatusBand(64).band).toBe('soon'));
  it('maps 40 to soon', () => expect(getStatusBand(40).band).toBe('soon'));
  it('maps 39 to warning', () => expect(getStatusBand(39).band).toBe('warning'));
  it('maps 20 to warning', () => expect(getStatusBand(20).band).toBe('warning'));
  it('maps 19 to biohazard', () => expect(getStatusBand(19).band).toBe('biohazard'));
  it('maps 0 to biohazard', () => expect(getStatusBand(0).band).toBe('biohazard'));
  it('clamps negative score to biohazard', () => expect(getStatusBand(-10).band).toBe('biohazard'));
  it('clamps >100 score to fresh', () => expect(getStatusBand(110).band).toBe('fresh'));

  it('returns correct labels for each band', () => {
    expect(getStatusBand(90).label).toBe('Fresh and cozy');
    expect(getStatusBand(70).label).toBe('Still okay');
    expect(getStatusBand(50).label).toBe('Maybe soon');
    expect(getStatusBand(30).label).toBe('We need to talk');
    expect(getStatusBand(10).label).toBe('I have seen things');
  });
});

// ─── sumEventPenalties ────────────────────────────────────────────────────────

describe('sumEventPenalties', () => {
  it('returns 0 for empty events array', () => {
    expect(sumEventPenalties([], NOW.toISOString())).toBe(0);
  });

  it('sums penalties for events after lastChangedAt', () => {
    const afterNow = new Date(NOW.getTime() + DAY_MS);
    const events: BedEvent[] = [
      { id: '1', type: 'pet', label: 'Pet', penalty: 5, createdAt: afterNow.toISOString() },
      { id: '2', type: 'sweaty', label: 'Sweaty', penalty: 8, createdAt: afterNow.toISOString() },
    ];
    expect(sumEventPenalties(events, NOW.toISOString())).toBe(13);
  });

  it('ignores events before lastChangedAt', () => {
    const beforeNow = new Date(NOW.getTime() - DAY_MS);
    const events: BedEvent[] = [
      { id: '1', type: 'pet', label: 'Pet', penalty: 5, createdAt: beforeNow.toISOString() },
    ];
    expect(sumEventPenalties(events, NOW.toISOString())).toBe(0);
  });
});

// ─── clamp ────────────────────────────────────────────────────────────────────

describe('clamp', () => {
  it('returns value within range unchanged', () => expect(clamp(50, 0, 100)).toBe(50));
  it('clamps below min to min', () => expect(clamp(-5, 0, 100)).toBe(0));
  it('clamps above max to max', () => expect(clamp(150, 0, 100)).toBe(100));
  it('returns min when value equals min', () => expect(clamp(0, 0, 100)).toBe(0));
  it('returns max when value equals max', () => expect(clamp(100, 0, 100)).toBe(100));
});

// ─── wholeDaysBetween ─────────────────────────────────────────────────────────

describe('wholeDaysBetween', () => {
  it('returns 0 for same date', () => {
    const d = new Date('2024-06-15T00:00:00.000Z');
    const { wholeDaysBetween } = require('../src/utils/freshnessCalculator');
    expect(wholeDaysBetween(d, d)).toBe(0);
  });

  it('returns 1 for next day', () => {
    const { wholeDaysBetween } = require('../src/utils/freshnessCalculator');
    const from = new Date('2024-06-14T00:00:00.000Z');
    const to = new Date('2024-06-15T00:00:00.000Z');
    expect(wholeDaysBetween(from, to)).toBe(1);
  });

  it('returns 7 for one week apart', () => {
    const { wholeDaysBetween } = require('../src/utils/freshnessCalculator');
    const from = new Date('2024-06-08T00:00:00.000Z');
    const to = new Date('2024-06-15T00:00:00.000Z');
    expect(wholeDaysBetween(from, to)).toBe(7);
  });
});

// ─── DEFAULT_EVENT_PENALTIES ──────────────────────────────────────────────────

describe('DEFAULT_EVENT_PENALTIES', () => {
  it('has penalty entries for all standard event types', () => {
    const { DEFAULT_EVENT_PENALTIES } = require('../src/utils/freshnessCalculator');
    expect(DEFAULT_EVENT_PENALTIES['pet']).toBe(5);
    expect(DEFAULT_EVENT_PENALTIES['sweaty']).toBe(8);
    expect(DEFAULT_EVENT_PENALTIES['sick']).toBe(12);
    expect(DEFAULT_EVENT_PENALTIES['ate_in_bed']).toBe(6);
    expect(DEFAULT_EVENT_PENALTIES['guest']).toBe(7);
    expect(DEFAULT_EVENT_PENALTIES['skipped_shower']).toBe(5);
  });
});
