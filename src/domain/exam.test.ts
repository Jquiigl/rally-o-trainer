import { describe, expect, it } from 'vitest';
import { signals } from '../content/signals';
import { buildExamQuestions } from './exam';

describe('exam generator', () => {
  it('creates ten distinct deterministic questions with four valid choices', () => {
    const first = buildExamQuestions(signals, '2026-08-05');
    const second = buildExamQuestions(signals, '2026-08-05');
    expect(first).toEqual(second);
    expect(new Set(first.map((item) => item.signalId)).size).toBe(10);
    first.forEach((item) => {
      expect(item.options).toHaveLength(4);
      expect(item.options).toContain(item.signalId);
    });
  });
});
