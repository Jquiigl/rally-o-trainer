import { z } from 'zod';
import { CONTENT_PACKAGE_VERSION } from '../content/signals';
import { db, defaultSettings } from './db';

const id = z.string().min(1);
const timestamp = z.number().int().nonnegative();
const dogSchema = z.object({ id, name: z.string(), nameNormalized: z.string(), breed: z.string(), createdAt: timestamp, updatedAt: timestamp, archivedAt: timestamp.nullable() });
const settingsSchema = z.object({ id: z.literal('settings'), activeDogId: id.nullable(), theme: z.enum(['system', 'light', 'dark']), preferredLocation: z.enum(['home', 'outdoor-small', 'club']), availableMaterialIds: z.array(z.string()), lastBackupAt: timestamp.nullable(), updatedAt: timestamp });
const sessionSchema = z.object({ id, dogId: id, status: z.enum(['active', 'completed']), objective: z.enum(['learn', 'autonomy', 'precision', 'review', 'side']), location: z.enum(['home', 'outdoor-small', 'club']), startedAt: timestamp, startedLocalDate: z.string(), endedAt: timestamp.nullable(), endReason: z.string().nullable(), rating: z.enum(['difficult', 'appropriate', 'easy']).nullable(), note: z.string(), plannerRulesVersion: z.literal('1') });
const blockSchema = z.object({ id, sessionId: id, sequence: z.number().int().positive(), signalId: id, signalRevisionId: id, progressCompatibilityKey: id, side: z.enum(['left', 'right', 'not-applicable']), practiceContext: z.enum(['individual', 'course']), inputMode: z.literal('attempt'), dominantHelp: z.string().nullable() });
const recordSchema = z.object({ id, blockId: id, sessionId: id, sequence: z.number().int().positive(), result: z.enum(['incorrect', 'assisted', 'autonomous']), recordedAt: timestamp, localDate: z.string() });
const courseSchema = z.object({ id, name: z.string(), rulesetId: z.enum(['rsce:debutante', 'rsce:grade-1', 'rsce:grade-2', 'rsce:grade-3', 'fci:international']), createdAt: timestamp, updatedAt: timestamp });
const courseItemSchema = z.object({ id, courseId: id, sequence: z.number().int().positive(), signalId: id, side: z.enum(['left', 'right', 'not-applicable']) });

const backupSchema = z.object({
  format: z.literal('rally-o-trainer-backup'),
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  contentPackageVersion: z.string(),
  data: z.object({
    dogs: z.array(dogSchema),
    settings: z.array(settingsSchema).max(1),
    sessions: z.array(sessionSchema),
    blocks: z.array(blockSchema),
    records: z.array(recordSchema),
    courses: z.array(courseSchema).default([]),
    courseItems: z.array(courseItemSchema).default([])
  })
});

export function parseBackup(raw: string) {
  const parsed = backupSchema.parse(JSON.parse(raw));
  const ensureUnique = (values: string[], label: string) => {
    if (new Set(values).size !== values.length) throw new Error(`La copia contiene identificadores duplicados en ${label}.`);
  };
  ensureUnique(parsed.data.dogs.map((item) => item.id), 'perros');
  ensureUnique(parsed.data.sessions.map((item) => item.id), 'sesiones');
  ensureUnique(parsed.data.blocks.map((item) => item.id), 'bloques');
  ensureUnique(parsed.data.records.map((item) => item.id), 'resultados');
  ensureUnique(parsed.data.courses.map((item) => item.id), 'pistas');
  ensureUnique(parsed.data.courseItems.map((item) => item.id), 'elementos de pista');
  const dogIds = new Set(parsed.data.dogs.map((item) => item.id));
  const sessionIds = new Set(parsed.data.sessions.map((item) => item.id));
  const blockIds = new Set(parsed.data.blocks.map((item) => item.id));
  const blockById = new Map(parsed.data.blocks.map((item) => [item.id, item]));
  const courseIds = new Set(parsed.data.courses.map((item) => item.id));
  const activeDogId = parsed.data.settings[0]?.activeDogId;
  if (activeDogId && !dogIds.has(activeDogId)) throw new Error('La copia señala un perro activo inexistente.');
  if (parsed.data.sessions.some((item) => !dogIds.has(item.dogId))) throw new Error('La copia contiene sesiones sin perro.');
  if (parsed.data.blocks.some((item) => !sessionIds.has(item.sessionId))) throw new Error('La copia contiene bloques sin sesión.');
  if (parsed.data.records.some((item) => !sessionIds.has(item.sessionId) || !blockIds.has(item.blockId) || blockById.get(item.blockId)?.sessionId !== item.sessionId)) throw new Error('La copia contiene resultados huérfanos o incoherentes.');
  if (parsed.data.courseItems.some((item) => !courseIds.has(item.courseId))) throw new Error('La copia contiene elementos de pista huérfanos.');
  if (parsed.data.sessions.filter((item) => item.status === 'active').length > 1) throw new Error('La copia contiene más de una sesión activa.');
  return parsed;
}

export async function createBackup(): Promise<string> {
  const backupTime = Date.now();
  await db.settings.update('settings', { lastBackupAt: backupTime, updatedAt: backupTime });
  const data = {
    dogs: await db.dogs.toArray(), settings: await db.settings.toArray(),
    sessions: await db.sessions.toArray(), blocks: await db.blocks.toArray(), records: await db.records.toArray(),
    courses: await db.courses.toArray(), courseItems: await db.courseItems.toArray()
  };
  return JSON.stringify({
    format: 'rally-o-trainer-backup', schemaVersion: 1,
    exportedAt: new Date().toISOString(), contentPackageVersion: CONTENT_PACKAGE_VERSION, data
  }, null, 2);
}

export async function downloadBackup(): Promise<void> {
  const content = await createBackup();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  link.download = `rally-o-trainer-${new Date().toISOString().slice(0, 10)}.json`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1_000);
}

export async function restoreBackup(raw: string): Promise<void> {
  const parsed = parseBackup(raw);
  await db.transaction('rw', [db.dogs, db.settings, db.sessions, db.blocks, db.records, db.courses, db.courseItems], async () => {
    await Promise.all([db.records.clear(), db.blocks.clear(), db.sessions.clear(), db.dogs.clear(), db.settings.clear(), db.courseItems.clear(), db.courses.clear()]);
    await db.dogs.bulkAdd(parsed.data.dogs);
    await db.sessions.bulkAdd(parsed.data.sessions);
    await db.blocks.bulkAdd(parsed.data.blocks);
    await db.records.bulkAdd(parsed.data.records);
    await db.courses.bulkAdd(parsed.data.courses);
    await db.courseItems.bulkAdd(parsed.data.courseItems);
    if (parsed.data.settings.length) await db.settings.bulkAdd(parsed.data.settings);
    else await db.settings.add(defaultSettings());
  });
}
