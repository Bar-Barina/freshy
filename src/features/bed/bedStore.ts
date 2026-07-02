import { Bed } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/services/storage/mmkv';
import { deserializeBed } from '@/services/storage/serializers';
import { generateId } from '@/utils/generateId';

export function loadBed(): Bed {
  const raw = storageGet<unknown>(STORAGE_KEYS.BED);
  return deserializeBed(raw);
}

export function saveBed(bed: Bed): void {
  storageSet(STORAGE_KEYS.BED, bed);
}

export function createDefaultBed(intervalDays: number = 7): Bed {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: 'My Bed',
    lastChangedAt: null,
    preferredChangeIntervalDays: intervalDays,
    streak: 0,
    oops: [],
    createdAt: now,
    updatedAt: now,
    sharedWith: [],
  };
}
