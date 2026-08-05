import { describe, expect, it } from 'vitest';
import { signals } from '../content/signals';
import { recommendSignals } from './planner';
import type { Evidence } from './types';

describe('recommendSignals', () => {
  it('returns deterministic recommendations for a location', () => {
    const first = recommendSignals(signals, [], 'home', 0)[0];
    expect(first.signal.officialNumber).toBe('101');
    expect(first.side).toBe('left');
  });

  it('holds back recommendations whose prerequisites are not learned', () => {
    const recommendations = recommendSignals(signals, [], 'club', 0);
    expect(recommendations.some((item) => item.signal.officialNumber === '102')).toBe(false);
    expect(recommendations.some((item) => item.signal.officialNumber === '101')).toBe(true);
  });

  it('releases the next signal once its prerequisite is learned on that side', () => {
    const prerequisite = signals.find((item) => item.officialNumber === '101')!;
    const evidence: Evidence[] = Array.from({ length: 10 }, (_, index) => ({ signalId: prerequisite.id, compatibilityKey: prerequisite.progressCompatibilityKey, side: 'left', practiceContext: 'individual', result: index < 7 ? 'autonomous' : 'assisted', recordedAt: index, localDate: index < 5 ? '2026-08-04' : '2026-08-05' }));
    const recommendations = recommendSignals(signals, evidence, 'home', 20);
    expect(recommendations.some((item) => item.signal.officialNumber === '102' && item.side === 'left')).toBe(true);
    expect(recommendations.some((item) => item.signal.officialNumber === '102' && item.side === 'right')).toBe(false);
  });
});
