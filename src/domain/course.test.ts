import { describe, expect, it } from 'vitest';
import { validateCourseSignals } from './course';

describe('course validation', () => {
  it('accepts one to ten signals and at most two repetitions', () => {
    expect(validateCourseSignals(['101'])).toBeNull();
    expect(validateCourseSignals(['101', '101', ...Array.from({ length: 8 }, (_, index) => String(102 + index))])).toBeNull();
  });

  it('rejects empty, oversized and triplicated sequences', () => {
    expect(validateCourseSignals([])).not.toBeNull();
    expect(validateCourseSignals(Array.from({ length: 11 }, (_, index) => String(index)))).not.toBeNull();
    expect(validateCourseSignals(['101', '101', '101'])).not.toBeNull();
  });
});
