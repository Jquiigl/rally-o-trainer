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
import Dexie, { type EntityTable } from 'dexie';
import type { AppSettings, Course, CourseItem, Dog, PracticeBlock, PracticeRecord, TrainingSession } from '../domain/types';
import { validateCourseSignals } from '../domain/course';
import { effectiveTrainingMs, findLastRecord, getSessionStep } from '../domain/trainingSession';

class RallyDatabase extends Dexie {
  dogs!: EntityTable<Dog, 'id'>;
  settings!: EntityTable<AppSettings, 'id'>;
  sessions!: EntityTable<TrainingSession, 'id'>;
  blocks!: EntityTable<PracticeBlock, 'id'>;
  records!: EntityTable<PracticeRecord, 'id'>;
  courses!: EntityTable<Course, 'id'>;
  courseItems!: EntityTable<CourseItem, 'id'>;

  constructor() {
    super('rally-o-trainer');
    this.version(1).stores({
      dogs: 'id, nameNormalized, archivedAt, updatedAt',
      settings: 'id, activeDogId',
      sessions: 'id, dogId, status, startedAt, [dogId+startedAt], [dogId+status]',
      blocks: 'id, sessionId, signalId, [sessionId+sequence], [signalId+side]',
      records: 'id, blockId, sessionId, recordedAt, [blockId+sequence]'
    });
    this.version(2).stores({
      dogs: 'id, nameNormalized, archivedAt, updatedAt',
      settings: 'id, activeDogId',
      sessions: 'id, dogId, status, startedAt, [dogId+startedAt], [dogId+status]',
      blocks: 'id, sessionId, signalId, [sessionId+sequence], [signalId+side]',
      records: 'id, blockId, sessionId, recordedAt, [blockId+sequence]',
      courses: 'id, rulesetId, updatedAt',
      courseItems: 'id, courseId, [courseId+sequence], signalId'
    });
    this.version(3).stores({
      dogs: 'id, nameNormalized, archivedAt, updatedAt',
      settings: 'id, activeDogId',
      sessions: 'id, dogId, status, startedAt, [dogId+startedAt], [dogId+status]',
      blocks: 'id, sessionId, signalId, [sessionId+sequence], [signalId+side]',
      records: 'id, blockId, sessionId, recordedAt, [blockId+sequence]',
      courses: 'id, rulesetId, updatedAt',
      courseItems: 'id, courseId, [courseId+sequence], signalId'
    }).upgrade(async (transaction) => {
      const now = Date.now();
      await transaction.table('sessions').toCollection().modify((session) => {
        session.trainingMode ??= 'repetition';
        session.targetAttempts ??= 10;
        session.breakCount ??= 0;
        session.quickImpressions ??= [];
        session.effectiveTrainingMs ??= session.endedAt ? Math.max(0, session.endedAt - session.startedAt) : session.status === 'active' ? Math.max(0, now - session.startedAt) : 0;
        session.activeSince ??= session.status === 'active' ? now : null;
        session.restCycleStartedAt ??= session.status === 'active' ? now : null;
        session.pausedAt ??= null;
        session.pauseKind ??= null;
      });
      await transaction.table('blocks').toCollection().modify((block) => { block.note ??= ''; });
    });
  }
}

export const db = new RallyDatabase();

export const defaultSettings = (): AppSettings => ({
  id: 'settings',
  activeDogId: null,
  theme: 'system',
  preferredLocation: 'home',
  availableMaterialIds: ['cone', 'natural-marker'],
  lastBackupAt: null,
  updatedAt: Date.now()
});

export async function ensureSettings(): Promise<AppSettings> {
  const existing = await db.settings.get('settings');
  if (existing) return existing;
  const settings = defaultSettings();
  await db.settings.put(settings);
  return settings;
}

export function localDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function createDog(name: string, breed: string): Promise<Dog> {
  const now = Date.now();
  const dog: Dog = {
    id: crypto.randomUUID(),
    name: name.trim(),
    nameNormalized: name.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es'),
    breed: breed.trim(),
    createdAt: now,
    updatedAt: now,
    archivedAt: null
  };
  await db.transaction('rw', db.dogs, db.settings, async () => {
    await db.dogs.add(dog);
    const settings = await ensureSettings();
    if (!settings.activeDogId) {
      await db.settings.update('settings', { activeDogId: dog.id, updatedAt: now });
    }
  });
  return dog;
}

export async function setActiveDog(dogId: string): Promise<void> {
  const activeSession = await getOpenSession();
  if (activeSession && activeSession.dogId !== dogId) throw new Error('Finaliza la sesión activa antes de cambiar de perro.');
  await ensureSettings();
  await db.settings.update('settings', { activeDogId: dogId, updatedAt: Date.now() });
}

export async function getActiveDog(): Promise<Dog | undefined> {
  const settings = await ensureSettings();
  return settings.activeDogId ? db.dogs.get(settings.activeDogId) : undefined;
}

export async function getOpenSession(): Promise<TrainingSession | undefined> {
  return db.sessions.where('status').anyOf('active', 'paused').first();
}

export type SessionSignalInput = {
  signalId: string;
  signalRevisionId: string;
  compatibilityKey: string;
  side: 'left' | 'right' | 'not-applicable';
};

export async function startStructuredSession(input: {
  dogId: string;
  signals: SessionSignalInput[];
  mode: TrainingSession['trainingMode'];
  location: TrainingSession['location'];
}): Promise<TrainingSession> {
  if (!input.signals.length) throw new Error('Selecciona al menos una señal.');
  const now = Date.now();
  const session: TrainingSession = {
    id: crypto.randomUUID(),
    dogId: input.dogId,
    status: 'active',
    objective: 'learn',
    location: input.location,
    startedAt: now,
    startedLocalDate: localDate(now),
    endedAt: null,
    endReason: null,
    rating: null,
    note: '',
    plannerRulesVersion: '1',
    trainingMode: input.mode,
    targetAttempts: 10,
    breakCount: 0,
    quickImpressions: [],
    activeSince: now,
    effectiveTrainingMs: 0,
    restCycleStartedAt: now,
    pausedAt: null,
    pauseKind: null
  };
  const blocks: PracticeBlock[] = input.signals.map((signal, index) => ({
    id: crypto.randomUUID(), sessionId: session.id, sequence: index + 1,
    signalId: signal.signalId, signalRevisionId: signal.signalRevisionId,
    progressCompatibilityKey: signal.compatibilityKey, side: signal.side,
    practiceContext: input.mode === 'circuit' ? 'course' : 'individual',
    inputMode: 'attempt', dominantHelp: null, note: ''
  }));

  await db.transaction('rw', db.sessions, db.blocks, async () => {
    const active = await getOpenSession();
    if (active) throw new Error('Ya existe una sesión activa.');
    await db.sessions.add(session);
    await db.blocks.bulkAdd(blocks);
  });
  return session;
}

export async function recordStructuredAttempt(sessionId: string, result: 'autonomous' | 'incorrect'): Promise<void> {
  await db.transaction('rw', db.sessions, db.blocks, db.records, async () => {
    const session = await db.sessions.get(sessionId);
    if (!session || session.status !== 'active') throw new Error('La sesión no está activa.');
    const blocks = await db.blocks.where('sessionId').equals(sessionId).sortBy('sequence');
    const records = await db.records.where('sessionId').equals(sessionId).sortBy('recordedAt');
    const step = getSessionStep(session.trainingMode, blocks, records, session.targetAttempts);
    const block = step.block;
    if (!block || step.complete) throw new Error('La sesión ya tiene todos los intentos registrados.');
    const sequence = (await db.records.where('blockId').equals(block.id).count()) + 1;
    const now = Date.now();
    await db.records.add({
      id: crypto.randomUUID(),
      blockId: block.id,
      sessionId,
      sequence,
      result,
      recordedAt: now,
      localDate: localDate(now),
      sessionSequence: records.length + 1,
      repetitionNumber: sequence,
      circuitRound: session.trainingMode === 'circuit' ? step.circuitRound : undefined
    });
  });
}

export async function undoLastAttempt(sessionId: string): Promise<void> {
  const records = await db.records.where('sessionId').equals(sessionId).toArray();
  const last = findLastRecord(records);
  if (last) await db.records.delete(last.id);
}

export async function deleteDog(dogId: string): Promise<void> {
  const activeSession = (await getOpenSession())?.dogId === dogId;
  if (activeSession) throw new Error('Finaliza la sesión activa antes de eliminar el perro.');
  await db.transaction('rw', db.dogs, db.settings, db.sessions, db.blocks, db.records, async () => {
    const sessionIds = (await db.sessions.where('dogId').equals(dogId).primaryKeys()) as string[];
    const blocks = await db.blocks.where('sessionId').anyOf(sessionIds).toArray();
    const blockIds = blocks.map((block) => block.id);
    if (blockIds.length) await db.records.where('blockId').anyOf(blockIds).delete();
    if (sessionIds.length) {
      await db.blocks.where('sessionId').anyOf(sessionIds).delete();
      await db.sessions.where('dogId').equals(dogId).delete();
    }
    await db.dogs.delete(dogId);
    const settings = await ensureSettings();
    if (settings.activeDogId === dogId) {
      const nextDog = await db.dogs.filter((dog) => dog.archivedAt === null).first();
      await db.settings.update('settings', { activeDogId: nextDog?.id ?? null, updatedAt: Date.now() });
    }
  });
}

export async function completeSession(
  sessionId: string,
  rating: TrainingSession['rating'],
  endReason: string | null,
  note = ''
): Promise<void> {
  const session = await db.sessions.get(sessionId);
  if (!session || session.status !== 'active') throw new Error('La sesión no está activa.');
  await db.sessions.update(sessionId, {
    status: 'completed',
    endedAt: Date.now(),
    rating,
    endReason,
    note: note.trim(),
    effectiveTrainingMs: effectiveTrainingMs(session),
    activeSince: null,
    restCycleStartedAt: null,
    pausedAt: null,
    pauseKind: null
  });
}

export async function pauseSession(sessionId: string, kind: 'manual' | 'break'): Promise<void> {
  const session = await db.sessions.get(sessionId);
  if (!session || session.status !== 'active') throw new Error('La sesión no está activa.');
  const now = Date.now();
  await db.sessions.update(sessionId, {
    status: 'paused', effectiveTrainingMs: effectiveTrainingMs(session, now), activeSince: null,
    restCycleStartedAt: null, pausedAt: now, pauseKind: kind,
    breakCount: session.breakCount + (kind === 'break' ? 1 : 0)
  });
}

export async function resumeSession(sessionId: string): Promise<void> {
  const session = await db.sessions.get(sessionId);
  if (!session || session.status !== 'paused') throw new Error('La sesión no está pausada.');
  const now = Date.now();
  await db.sessions.update(sessionId, { status: 'active', activeSince: now, restCycleStartedAt: now, pausedAt: null, pauseKind: null });
}

export async function continueAfterRestNotice(sessionId: string): Promise<void> {
  const session = await db.sessions.get(sessionId);
  if (!session || session.status !== 'active') throw new Error('La sesión no está activa.');
  await db.sessions.update(sessionId, { restCycleStartedAt: Date.now() });
}

export async function updateSessionImpressions(sessionId: string, quickImpressions: string[], note: string): Promise<void> {
  await db.sessions.update(sessionId, { quickImpressions: [...new Set(quickImpressions)], note: note.trim() });
}

export async function updateSignalNote(blockId: string, note: string): Promise<void> {
  await db.blocks.update(blockId, { note: note.trim() });
}

export async function finishSession(sessionId: string, endReason: string | null = null): Promise<void> {
  const session = await db.sessions.get(sessionId);
  if (!session || !['active', 'paused'].includes(session.status)) throw new Error('La sesión no está abierta.');
  await db.sessions.update(sessionId, {
    status: 'completed', endedAt: Date.now(), endReason, rating: null,
    effectiveTrainingMs: effectiveTrainingMs(session), activeSince: null,
    restCycleStartedAt: null, pausedAt: null, pauseKind: null
  });
}

export async function discardSession(sessionId: string): Promise<void> {
  const session = await db.sessions.get(sessionId);
  if (!session || !['active', 'paused'].includes(session.status)) throw new Error('La sesión no está abierta.');
  await db.sessions.update(sessionId, {
    status: 'discarded', endedAt: Date.now(), endReason: 'discarded',
    effectiveTrainingMs: effectiveTrainingMs(session), activeSince: null,
    restCycleStartedAt: null, pausedAt: null, pauseKind: null
  });
}

export async function getEvidence(dogId: string): Promise<import('../domain/types').Evidence[]> {
  const sessions = await db.sessions.where('dogId').equals(dogId).toArray();
  const completedIds = new Set(sessions.filter((session) => session.status === 'completed').map((session) => session.id));
  const blocks = await db.blocks.toArray();
  const blockById = new Map(blocks.filter((block) => completedIds.has(block.sessionId)).map((block) => [block.id, block]));
  const records = await db.records.toArray();
  return records.flatMap((record) => {
    const block = blockById.get(record.blockId);
    if (!block) return [];
    return [{
      signalId: block.signalId,
      compatibilityKey: block.progressCompatibilityKey,
      side: block.side,
      practiceContext: block.practiceContext,
      result: record.result,
      recordedAt: record.recordedAt,
      localDate: record.localDate
    }];
  });
}

export async function saveCourse(input: { id?: string; name: string; signalIds: string[] }): Promise<Course> {
  const validationError = validateCourseSignals(input.signalIds);
  if (validationError) throw new Error(validationError);
  const now = Date.now();
  const current = input.id ? await db.courses.get(input.id) : undefined;
  const course: Course = { id: input.id ?? crypto.randomUUID(), name: input.name.trim() || 'Pista sin nombre', rulesetId: 'rsce:debutante', createdAt: current?.createdAt ?? now, updatedAt: now };
  const items: CourseItem[] = input.signalIds.map((signalId, index) => ({ id: crypto.randomUUID(), courseId: course.id, sequence: index + 1, signalId, side: 'left' }));
  await db.transaction('rw', db.courses, db.courseItems, async () => {
    await db.courses.put(course);
    await db.courseItems.where('courseId').equals(course.id).delete();
    await db.courseItems.bulkAdd(items);
  });
  return course;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await db.transaction('rw', db.courses, db.courseItems, async () => {
    await db.courseItems.where('courseId').equals(courseId).delete();
    await db.courses.delete(courseId);
  });
}

export async function deleteAllData(): Promise<void> {
  await db.transaction('rw', [db.records, db.blocks, db.sessions, db.courseItems, db.courses, db.dogs, db.settings], async () => {
    await Promise.all([db.records.clear(), db.blocks.clear(), db.sessions.clear(), db.courseItems.clear(), db.courses.clear(), db.dogs.clear(), db.settings.clear()]);
    await db.settings.add(defaultSettings());
  });
}
