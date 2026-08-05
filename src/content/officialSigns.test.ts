import { describe, expect, it } from 'vitest';
import { signals } from './signals';
import { getOfficialSignSource } from './officialSigns';

describe('official sign assets', () => {
  it('maps every published signal to the correct authority and a traceable page', () => {
    const sources = signals.map(getOfficialSignSource);
    expect(sources).toHaveLength(33);
    expect(sources.every((source) => source.page > 0 && source.imagePath.endsWith('.webp'))).toBe(true);
    expect(sources.filter((source) => source.authority === 'FCI')).toHaveLength(22);
    expect(sources.filter((source) => source.authority === 'RSCE')).toHaveLength(11);
  });

  it('maps FCI 101 to page 5 and RSCE 13 to page 8', () => {
    expect(getOfficialSignSource(signals.find((signal) => signal.id === 'fci:signal:101')!)).toMatchObject({ authority: 'FCI', page: 5 });
    expect(getOfficialSignSource(signals.find((signal) => signal.id === 'rsce:national:13')!)).toMatchObject({ authority: 'RSCE', page: 8 });
  });
});
