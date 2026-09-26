import type { Location, Side } from '../domain/types';

const storageKey = 'rally-o-trainer:pending-training-selection:v1';
const maximumAgeMs = 60 * 60 * 1_000;
const validLocations = new Set<Location>(['home', 'outdoor-small', 'club']);
const validSides = new Set<Side>(['left', 'right', 'not-applicable']);

export type PendingTrainingSelection = {
  signalIds: string[];
  preferredSignal: string | null;
  preferredSide: Side | null;
  location: Location | null;
  sides: Record<string, Side>;
  savedAt: number;
};

function storage(): Storage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

export function savePendingTrainingSelection(input: Omit<PendingTrainingSelection, 'savedAt'>): void {
  try {
    storage()?.setItem(storageKey, JSON.stringify({ ...input, signalIds: [...new Set(input.signalIds)], savedAt: Date.now() }));
  } catch {
    // The URL remains the primary transport when local storage is unavailable.
  }
}

export function loadPendingTrainingSelection(now = Date.now()): PendingTrainingSelection | null {
  const target = storage();
  if (!target) return null;
  try {
    const value = JSON.parse(target.getItem(storageKey) ?? 'null') as Partial<PendingTrainingSelection> | null;
    if (!value || !Array.isArray(value.signalIds) || !value.signalIds.every((id) => typeof id === 'string') || !value.signalIds.length || typeof value.savedAt !== 'number' || now - value.savedAt > maximumAgeMs) {
      target.removeItem(storageKey);
      return null;
    }
    const sides = Object.fromEntries(Object.entries(value.sides ?? {}).filter((entry): entry is [string, Side] => typeof entry[0] === 'string' && validSides.has(entry[1] as Side)));
    return {
      signalIds: [...new Set(value.signalIds)],
      preferredSignal: typeof value.preferredSignal === 'string' ? value.preferredSignal : null,
      preferredSide: validSides.has(value.preferredSide as Side) ? value.preferredSide as Side : null,
      location: validLocations.has(value.location as Location) ? value.location as Location : null,
      sides,
      savedAt: value.savedAt
    };
  } catch {
    target.removeItem(storageKey);
    return null;
  }
}

export function clearPendingTrainingSelection(): void {
  try { storage()?.removeItem(storageKey); } catch { /* Nothing to clear. */ }
}

export function resolveTrainingSignalIds(urlSignalIds: string[], pending: PendingTrainingSelection | null): string[] {
  const uniqueUrlIds = [...new Set(urlSignalIds.filter(Boolean))];
  return uniqueUrlIds.length ? uniqueUrlIds : pending?.signalIds ?? [];
}
