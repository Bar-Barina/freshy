import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Bed, BedOops, FreshnessStatus, FreshnessBand } from '@/types';

// ─── Status bands ─────────────────────────────────────────────────────────────

interface BandDefinition {
  band: FreshnessBand;
  label: string;
  minScore: number;
}

const BANDS: BandDefinition[] = [
  { band: 'fresh', label: 'Fresh and cozy', minScore: 85 },
  { band: 'ok', label: 'Still okay', minScore: 65 },
  { band: 'soon', label: 'Maybe soon', minScore: 40 },
  { band: 'warning', label: 'We need to talk', minScore: 20 },
  { band: 'biohazard', label: 'I have seen things', minScore: 0 },
];

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Pure function — accepts `now` explicitly for deterministic testing.
 * Never calls new Date() internally.
 */
export function calculateFreshness(bed: Bed, now: Date): FreshnessStatus {
  if (bed.lastChangedAt === null) {
    return {
      score: 0,
      band: 'biohazard',
      label: 'Not tracked yet',
      daysSinceChange: -1,
    };
  }

  const lastChanged = parseISO(bed.lastChangedAt);
  const daysSinceChange = differenceInCalendarDays(now, lastChanged);

  const dailyDecayRate = 100 / bed.preferredChangeIntervalDays;
  const baseScore = 100 - daysSinceChange * dailyDecayRate;

  const oopsPenalty = sumOopsPenalties(bed.oops, bed.lastChangedAt);

  const score = clamp(baseScore - oopsPenalty, 0, 100);
  const { band, label } = getStatusBand(score);

  return { score, band, label, daysSinceChange };
}

// ─── Oops penalties ───────────────────────────────────────────────────────────

/**
 * Sums penalties for oops logged AFTER lastChangedAt.
 * Oops before the last sheet change are ignored — they've been "washed away".
 */
export function sumOopsPenalties(oops: BedOops[], lastChangedAt: string): number {
  const cutoff = parseISO(lastChangedAt);
  return oops.reduce((total, item) => {
    const oopsDate = parseISO(item.createdAt);
    if (oopsDate > cutoff) {
      return total + item.penalty;
    }
    return total;
  }, 0);
}

// ─── Status band ─────────────────────────────────────────────────────────────

export function getStatusBand(score: number): { band: FreshnessBand; label: string } {
  const clamped = clamp(score, 0, 100);
  for (const def of BANDS) {
    if (clamped >= def.minScore) {
      return { band: def.band, label: def.label };
    }
  }
  return { band: 'biohazard', label: 'I have seen things' };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function wholeDaysBetween(from: Date, to: Date): number {
  return differenceInCalendarDays(to, from);
}

// ─── Default oops penalties ───────────────────────────────────────────────────

export const DEFAULT_OOPS_PENALTIES: Record<string, number> = {
  pet: 5,
  sweaty: 8,
  sick: 12,
  ate_in_bed: 6,
  guest: 7,
  skipped_shower: 5,
};