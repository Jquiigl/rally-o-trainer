import { describe, expect, it } from 'vitest';
import type { PracticeBlock, PracticeRecord, TrainingSession } from './types';
import { effectiveTrainingMs, findLastRecord, getSessionStep, restDue, shouldPauseBeforeNextSignal, summarizeSession } from './trainingSession';

const blocks = ['a', 'b', 'c'].map((id, index) => ({ id, sessionId: 's', sequence: index + 1, signalId: id, signalRevisionId: `${id}:1`, progressCompatibilityKey: 'v1', side: 'left', practiceContext: 'individual', inputMode: 'attempt', dominantHelp: null, note: '' })) as PracticeBlock[];
const record = (blockId: string, sequence: number, result: PracticeRecord['result'] = 'autonomous'): PracticeRecord => ({ id: `${blockId}-${sequence}`, blockId, sessionId: 's', sequence, result, recordedAt: sequence, localDate: '2026-08-06' });

describe('structured training session', () => {
  it('finishes ten repetitions before moving to the next signal', () => {
    const firstNine = Array.from({ length: 9 }, (_, index) => record('a', index + 1));
    const tenthStep = getSessionStep('repetition', blocks, firstNine);
    expect(tenthStep).toMatchObject({ signalIndex: 0, repetition: 10 });
    expect(shouldPauseBeforeNextSignal('repetition', tenthStep, blocks.length)).toBe(true);
    expect(getSessionStep('repetition', blocks, [...firstNine, record('a', 10)])).toMatchObject({ signalIndex: 1, repetition: 1 });
  });

  it('does not pause after the last individual signal or between circuit attempts', () => {
    const lastSignalStep = { ...getSessionStep('repetition', blocks, []), signalIndex: 2, repetition: 10 };
    expect(shouldPauseBeforeNextSignal('repetition', lastSignalStep, blocks.length)).toBe(false);
    expect(shouldPauseBeforeNextSignal('circuit', { ...lastSignalStep, signalIndex: 0 }, blocks.length)).toBe(false);
  });

  it('cycles through every signal for ten rounds', () => {
    const firstRound = blocks.map((block, index) => record(block.id, index + 1));
    expect(getSessionStep('circuit', blocks, firstRound)).toMatchObject({ signalIndex: 0, circuitRound: 2 });
    const all = Array.from({ length: 30 }, (_, index) => record(blocks[index % 3].id, index + 1));
    expect(getSessionStep('circuit', blocks, all).complete).toBe(true);
  });

  it('passes with seven correct attempts and keeps six pending', () => {
    const seven = Array.from({ length: 10 }, (_, index) => record('a', index + 1, index < 7 ? 'autonomous' : 'incorrect'));
    const six = Array.from({ length: 10 }, (_, index) => record('b', index + 1, index < 6 ? 'autonomous' : 'incorrect'));
    const summary = summarizeSession(blocks.slice(0, 2), [...seven, ...six]);
    expect(summary[0]).toMatchObject({ correctCount: 7, passed: true, successRate: 70 });
    expect(summary[1]).toMatchObject({ correctCount: 6, passed: false, successRate: 60 });
  });

  it('tracks effective time and a recurring rest interval', () => {
    const session = { status: 'active', activeSince: 1_000, effectiveTrainingMs: 2_000, restCycleStartedAt: 1_000 } as TrainingSession;
    expect(effectiveTrainingMs(session, 6_000)).toBe(7_000);
    expect(restDue(session, 1_000 + 15 * 60_000)).toBe(true);
  });

  it('undoes the globally latest circuit result even when timestamps match', () => {
    const first = { ...record('a', 1), recordedAt: 100, sessionSequence: 1 };
    const second = { ...record('b', 1), recordedAt: 100, sessionSequence: 2 };
    expect(findLastRecord([first, second])?.id).toBe(second.id);
    expect(getSessionStep('circuit', blocks, [first])).toMatchObject({ signalIndex: 1, circuitRound: 1 });
  });
});
