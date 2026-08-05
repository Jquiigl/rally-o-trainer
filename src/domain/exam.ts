import type { SignalContent } from './types';

export type ExamQuestion = { signalId: string; prompt: string; options: string[] };

function hashSeed(value: string): number {
  return [...value].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
}

function shuffled<T>(values: T[], seed: number): T[] {
  const result = [...values]; let state = seed || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function buildExamQuestions(signals: SignalContent[], seedText: string, count = 10): ExamQuestion[] {
  if (signals.length < 4) throw new Error('Se necesitan al menos cuatro señales para crear un examen.');
  const selected = shuffled(signals, hashSeed(seedText)).slice(0, Math.min(count, signals.length));
  return selected.map((signal, index) => {
    const alternatives = shuffled(signals.filter((item) => item.id !== signal.id), hashSeed(`${seedText}:${index}`)).slice(0, 3);
    const options = shuffled([signal.id, ...alternatives.map((item) => item.id)], hashSeed(`${seedText}:options:${index}`));
    return { signalId: signal.id, prompt: signal.plainExplanation, options };
  });
}
