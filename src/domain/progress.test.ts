import { describe, expect, it } from 'vitest';
import type { Evidence, PracticeResult } from './types';
import { calculateProgress } from './progress';

const day = 86_400_000;

function evidence(results: PracticeResult[], dates?: number[]): Evidence[] {
  return results.map((result, index) => {
    const recordedAt = (dates?.[index] ?? index) * day;
    return {
      signalId: 'fci:signal:101', compatibilityKey: 'v1', side: 'left',
      practiceContext: 'individual', result, recordedAt,
      localDate: new Date(recordedAt).toISOString().slice(0, 10)
    };
  });
}

describe('calculateProgress', () => {
  it('requires ten attempts, seven autonomous executions and two days', () => {
    const result = calculateProgress(evidence([
      'autonomous', 'autonomous', 'autonomous', 'assisted', 'incorrect',
      'autonomous', 'autonomous', 'autonomous', 'autonomous', 'assisted'
    ], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]), 'left', 2 * day);
    expect(result.state).toBe('learned');
    expect(result.learnedAt).toBe(day);
  });

  it('does not count course evidence as individual learning evidence', () => {
    const rows = evidence(Array(10).fill('autonomous'));
    rows.forEach((row) => { row.practiceContext = 'course'; });
    expect(calculateProgress(rows, 'left').state).toBe('not-started');
  });

  it('marks a previously learned signal for review after regression', () => {
    const rows = evidence([
      ...Array(8).fill('autonomous'), 'assisted', 'incorrect',
      ...Array(8).fill('incorrect'), 'assisted', 'autonomous'
    ], [...Array(10).fill(0), ...Array(10).fill(2)]);
    const result = calculateProgress(rows, 'left', 3 * day);
    expect(result.state).toBe('needs-review');
    expect(result.reviewReasons).toContain('below-window');
  });

  it('marks a learned signal overdue after thirty days', () => {
    const rows = evidence(Array(10).fill('autonomous'), [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
    const result = calculateProgress(rows, 'left', 32 * day);
    expect(result.state).toBe('needs-review');
    expect(result.reviewReasons).toContain('overdue-30d');
  });

  it('detects the return of recurrent help after learning', () => {
    const rows = evidence([
      ...Array(10).fill('autonomous'), 'assisted', 'autonomous', 'incorrect', 'autonomous', 'assisted'
    ], [...Array(5).fill(0), ...Array(5).fill(1), ...Array(5).fill(2)]);
    const result = calculateProgress(rows, 'left', 3 * day);
    expect(result.state).toBe('needs-review');
    expect(result.reviewReasons).toContain('help-returned');
  });

  it('schedules an in-progress signal two days after the latest practice', () => {
    const result = calculateProgress(evidence(['assisted'], [4]), 'left', 4 * day);
    expect(result.nextReviewAt).toBe(6 * day);
  });

  it('consolidates after a later strong window across at least three days', () => {
    const results: PracticeResult[] = [...Array(20).fill('autonomous')];
    const dates = [...Array(5).fill(0), ...Array(5).fill(1), ...Array(5).fill(15), ...Array(5).fill(16)];
    const result = calculateProgress(evidence(results, dates), 'left', 17 * day);
    expect(result.state).toBe('consolidated');
    expect(result.consolidatedAt).toBe(15 * day);
  });
});
