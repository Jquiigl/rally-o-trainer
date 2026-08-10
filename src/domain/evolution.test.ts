import { describe, expect, it } from 'vitest';
import { compareRecentRates } from './evolution';

describe('signal evolution', () => {
  it('requires two sessions before declaring a trend', () => {
    expect(compareRecentRates([70])).toEqual({ trend: 'insufficient', difference: null });
  });

  it('uses a five-point neutral band', () => {
    expect(compareRecentRates([80, 70])).toEqual({ trend: 'improving', difference: 10 });
    expect(compareRecentRates([65, 70])).toEqual({ trend: 'stable', difference: -5 });
    expect(compareRecentRates([60, 70])).toEqual({ trend: 'declining', difference: -10 });
  });
});
