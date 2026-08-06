/**
 * Rally Obedience Training Application
 *
 * Copyright © 2026 José María Quirós Iglesias
 * All rights reserved.
 *
 * Official Rally Obedience signs, regulatory descriptions and
 * third-party materials remain the property of their respective owners.
 *
 * See LICENSE and THIRD_PARTY_NOTICES.md.
 */
import type { PracticeBlock, PracticeRecord, TrainingMode, TrainingSession } from './types';

export const ATTEMPTS_PER_SIGNAL = 10;
export const REST_INTERVAL_MS = 15 * 60 * 1_000;

export type SessionStep = {
  complete: boolean;
  block: PracticeBlock | null;
  signalIndex: number;
  repetition: number;
  circuitRound: number;
  completedAttempts: number;
  totalAttempts: number;
};

export type SignalSessionSummary = {
  block: PracticeBlock;
  correctCount: number;
  incorrectCount: number;
  total: number;
  successRate: number;
  passed: boolean;
};

export function getSessionStep(mode: TrainingMode, blocks: PracticeBlock[], records: PracticeRecord[], target = ATTEMPTS_PER_SIGNAL): SessionStep {
  const orderedBlocks = [...blocks].sort((a, b) => a.sequence - b.sequence);
  const completedAttempts = records.length;
  const totalAttempts = orderedBlocks.length * target;
  if (!orderedBlocks.length || completedAttempts >= totalAttempts) {
    return { complete: true, block: null, signalIndex: Math.max(0, orderedBlocks.length - 1), repetition: target, circuitRound: target, completedAttempts, totalAttempts };
  }

  if (mode === 'circuit') {
    const signalIndex = completedAttempts % orderedBlocks.length;
    return {
      complete: false,
      block: orderedBlocks[signalIndex],
      signalIndex,
      repetition: Math.floor(completedAttempts / orderedBlocks.length) + 1,
      circuitRound: Math.floor(completedAttempts / orderedBlocks.length) + 1,
      completedAttempts,
      totalAttempts
    };
  }

  for (let signalIndex = 0; signalIndex < orderedBlocks.length; signalIndex += 1) {
    const block = orderedBlocks[signalIndex];
    const count = records.filter((record) => record.blockId === block.id).length;
    if (count < target) {
      return { complete: false, block, signalIndex, repetition: count + 1, circuitRound: 1, completedAttempts, totalAttempts };
    }
  }
  return { complete: true, block: null, signalIndex: orderedBlocks.length - 1, repetition: target, circuitRound: target, completedAttempts, totalAttempts };
}

export function summarizeSession(blocks: PracticeBlock[], records: PracticeRecord[]): SignalSessionSummary[] {
  return [...blocks].sort((a, b) => a.sequence - b.sequence).map((block) => {
    const attempts = records.filter((record) => record.blockId === block.id);
    const correctCount = attempts.filter((record) => record.result === 'autonomous').length;
    const incorrectCount = attempts.length - correctCount;
    return {
      block,
      correctCount,
      incorrectCount,
      total: attempts.length,
      successRate: attempts.length ? Math.round(correctCount / attempts.length * 100) : 0,
      passed: attempts.length >= ATTEMPTS_PER_SIGNAL && correctCount >= 7
    };
  });
}

export function effectiveTrainingMs(session: TrainingSession, now = Date.now()): number {
  return session.effectiveTrainingMs + (session.status === 'active' && session.activeSince ? Math.max(0, now - session.activeSince) : 0);
}

export function restDue(session: TrainingSession, now = Date.now()): boolean {
  return session.status === 'active' && session.restCycleStartedAt !== null && now - session.restCycleStartedAt >= REST_INTERVAL_MS;
}

export function findLastRecord(records: PracticeRecord[]): PracticeRecord | undefined {
  return [...records].sort((a, b) => (b.sessionSequence ?? 0) - (a.sessionSequence ?? 0) || b.recordedAt - a.recordedAt || b.sequence - a.sequence)[0];
}
