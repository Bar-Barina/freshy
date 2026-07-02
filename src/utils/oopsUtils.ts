import { isSameDay, parseISO } from 'date-fns';
import type { Bed, BedOops, BedOopsType } from '@/types';

/** Oops logged after the last sheet change — these affect the score. */
export function getActiveOops(bed: Bed): BedOops[] {
  if (bed.lastChangedAt === null) return bed.oops;

  const cutoff = parseISO(bed.lastChangedAt);
  return bed.oops.filter((oops) => parseISO(oops.createdAt) > cutoff);
}

/** Whether this oops type was already logged today (local calendar day). */
export function hasOopsTypeToday(bed: Bed, type: BedOopsType, now: Date = new Date()): boolean {
  return bed.oops.some(
    (oops) => oops.type === type && isSameDay(parseISO(oops.createdAt), now)
  );
}

/** Types already logged today — used to disable options in the oops sheet. */
export function getOopsTypesLoggedToday(bed: Bed, now: Date = new Date()): BedOopsType[] {
  const types = new Set<BedOopsType>();
  for (const oops of bed.oops) {
    if (isSameDay(parseISO(oops.createdAt), now)) {
      types.add(oops.type);
    }
  }
  return [...types];
}
