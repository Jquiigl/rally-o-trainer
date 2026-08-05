import Dexie, { type EntityTable } from 'dexie';
import type { AppSettings, Course, CourseItem, Dog, PracticeBlock, PracticeRecord, TrainingSession } from '../domain/types';
import { validateCourseSignals } from '../domain/course';

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
  await db.settings.add(settings);
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
  const activeSession = await db.sessions.where('status').equals('active').first();
  if (activeSession && activeSession.dogId !== dogId) throw new Error('Finaliza la sesión activa antes de cambiar de perro.');
  await ensureSettings();
  await db.settings.update('settings', { activeDogId: dogId, updatedAt: Date.now() });
}

export async function getActiveDog(): Promise<Dog | undefined> {
  const settings = await ensureSettings();
  return settings.activeDogId ? db.dogs.get(settings.activeDogId) : undefined;
}

export async function startSession(input: {
  dogId: string;
  signalId: string;
  signalRevisionId: string;
  compatibilityKey: string;
  side: 'left' | 'right' | 'not-applicable';
  objective: TrainingSession['objective'];
  location: TrainingSession['location'];
}): Promise<TrainingSession> {
  const now = Date.now();
  const session: TrainingSession = {
    id: crypto.randomUUID(),
    dogId: input.dogId,
    status: 'active',
    objective: input.objective,
    location: input.location,
    startedAt: now,
    startedLocalDate: localDate(now),
    endedAt: null,
    endReason: null,
    rating: null,
    note: '',
    plannerRulesVersion: '1'
  };
  const block: PracticeBlock = {
    id: crypto.randomUUID(),
    sessionId: session.id,
    sequence: 1,
    signalId: input.signalId,
    signalRevisionId: input.signalRevisionId,
    progressCompatibilityKey: input.compatibilityKey,
    side: input.side,
    practiceContext: 'individual',
    inputMode: 'attempt',
    dominantHelp: null
  };

  await db.transaction('rw', db.sessions, db.blocks, async () => {
    const active = await db.sessions.where('status').equals('active').first();
    if (active) throw new Error('Ya existe una sesión activa.');
    await db.sessions.add(session);
    await db.blocks.add(block);
  });
  return session;
}

export async function recordAttempt(sessionId: string, result: PracticeRecord['result']): Promise<void> {
  await db.transaction('rw', db.sessions, db.blocks, db.records, async () => {
    const session = await db.sessions.get(sessionId);
    if (!session || session.status !== 'active') throw new Error('La sesión no está activa.');
    const block = await db.blocks.where('sessionId').equals(sessionId).first();
    if (!block) throw new Error('La sesión no contiene un bloque de práctica.');
    const sequence = (await db.records.where('blockId').equals(block.id).count()) + 1;
    const now = Date.now();
    await db.records.add({
      id: crypto.randomUUID(),
      blockId: block.id,
      sessionId,
      sequence,
      result,
      recordedAt: now,
      localDate: localDate(now)
    });
  });
}

export async function undoLastAttempt(sessionId: string): Promise<void> {
  const records = await db.records.where('sessionId').equals(sessionId).toArray();
  const last = records.sort((a, b) => b.recordedAt - a.recordedAt || b.sequence - a.sequence)[0];
  if (last) await db.records.delete(last.id);
}

export async function deleteDog(dogId: string): Promise<void> {
  const activeSession = await db.sessions.where('[dogId+status]').equals([dogId, 'active']).first();
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
    note: note.trim()
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
