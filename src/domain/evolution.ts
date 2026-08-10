export type EvolutionTrend = 'insufficient' | 'improving' | 'stable' | 'declining';

export function compareRecentRates(ratesNewestFirst: number[]): { trend: EvolutionTrend; difference: number | null } {
  if (ratesNewestFirst.length < 2) return { trend: 'insufficient', difference: null };
  const difference = ratesNewestFirst[0] - ratesNewestFirst[1];
  if (difference > 5) return { trend: 'improving', difference };
  if (difference < -5) return { trend: 'declining', difference };
  return { trend: 'stable', difference };
}
