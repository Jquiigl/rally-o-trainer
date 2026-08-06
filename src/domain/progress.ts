import type { Evidence, ProgressResult, ProgressState, Side } from './types';

const DAY_MS = 86_400_000;

export function calculateProgress(evidence: Evidence[], side: Side, now = Date.now()): ProgressResult {
  const comparable = evidence
    .filter((item) => item.side === side)
    .sort((a, b) => a.recordedAt - b.recordedAt);
  const latestTen = comparable.slice(-10);
  const counts = {
    incorrect: latestTen.filter((item) => item.result === 'incorrect').length,
    assisted: latestTen.filter((item) => item.result === 'assisted').length,
    autonomous: latestTen.filter((item) => item.result === 'autonomous').length,
    days: new Set(latestTen.map((item) => item.localDate)).size
  };
  const last = comparable.at(-1)?.recordedAt ?? null;
  const windows = comparable.length < 10
    ? []
    : comparable.slice(9).map((_, index) => comparable.slice(index, index + 10));
  const learnedWindow = windows.find((window) =>
    window.filter((item) => item.result === 'autonomous').length >= 7 &&
    new Set(window.map((item) => item.localDate)).size >= 2
  );
  const learnedAt = learnedWindow?.at(-1)?.recordedAt ?? null;
  const currentlyMeetsLearned = latestTen.length === 10 && counts.autonomous >= 7 && counts.days >= 2;
  const consolidatedWindow = learnedAt === null ? undefined : windows.find((window) =>
    (window.at(-1)?.recordedAt ?? 0) - learnedAt >= 14 * DAY_MS &&
    window.filter((item) => item.result === 'autonomous').length >= 8 &&
    new Set(window.map((item) => item.localDate)).size >= 3
  );
  const consolidatedAt = consolidatedWindow?.at(-1)?.recordedAt ?? null;
  const reviewReasons: string[] = [];
  const afterLearned = learnedAt === null ? [] : comparable.filter((item) => item.recordedAt > learnedAt);

  if (learnedAt !== null && last !== null && now - last >= 30 * DAY_MS) reviewReasons.push('overdue-30d');
  if (afterLearned.slice(-2).length === 2 && afterLearned.slice(-2).every((item) => item.result === 'incorrect')) {
    reviewReasons.push('two-errors');
  }
  if (afterLearned.slice(-5).length === 5 && afterLearned.slice(-5).filter((item) => item.result !== 'autonomous').length >= 3) {
    reviewReasons.push('help-returned');
  }
  if (learnedAt !== null && !currentlyMeetsLearned) reviewReasons.push('below-window');

  let state: ProgressState = 'not-started';
  if (comparable.length > 0) state = 'in-progress';
  if (currentlyMeetsLearned) state = consolidatedAt !== null ? 'consolidated' : 'learned';
  if (reviewReasons.length > 0) state = 'needs-review';
  const nextReviewAt = last === null ? null : state === 'needs-review' ? now :
    state === 'consolidated' ? last + 30 * DAY_MS :
    state === 'learned' ? last + 7 * DAY_MS : last + 2 * DAY_MS;

  return {
    state,
    side,
    totalEvidence: comparable.length,
    window: counts,
    lastPracticedAt: last,
    learnedAt,
    consolidatedAt,
    nextReviewAt,
    reviewReasons
  };
}

export function progressLabel(state: ProgressState): string {
  return {
    'not-started': 'Sin practicar',
    'in-progress': 'En progreso',
    learned: 'Aprendida',
    consolidated: 'Consolidada',
    'needs-review': 'Necesita repaso'
  }[state];
}
