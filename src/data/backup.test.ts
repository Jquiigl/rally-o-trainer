import { describe, expect, it } from 'vitest';
import { parseBackup } from './backup';

const emptyBackup = JSON.stringify({
  format: 'rally-o-trainer-backup', schemaVersion: 1, exportedAt: '2026-08-05T00:00:00.000Z',
  contentPackageVersion: '0.2.0', data: { dogs: [], settings: [], sessions: [], blocks: [], records: [], courses: [], courseItems: [] }
});

describe('backup validation', () => {
  it('accepts an empty but structurally valid backup', () => {
    expect(parseBackup(emptyBackup).format).toBe('rally-o-trainer-backup');
  });

  it('keeps version-one backups compatible when they have no course tables', () => {
    const payload = JSON.parse(emptyBackup);
    delete payload.data.courses; delete payload.data.courseItems;
    const parsed = parseBackup(JSON.stringify(payload));
    expect(parsed.data.courses).toEqual([]);
    expect(parsed.data.courseItems).toEqual([]);
  });

  it('adds structured-session defaults when importing an old session', () => {
    const payload = JSON.parse(emptyBackup);
    payload.data.dogs.push({ id: 'd', name: 'Luna', nameNormalized: 'luna', breed: 'Mestiza', createdAt: 0, updatedAt: 0, archivedAt: null });
    payload.data.sessions.push({ id: 's', dogId: 'd', status: 'completed', objective: 'learn', location: 'home', startedAt: 1, startedLocalDate: '2026-08-05', endedAt: 1001, endReason: null, rating: 'appropriate', note: '', plannerRulesVersion: '1' });
    const parsed = parseBackup(JSON.stringify(payload));
    expect(parsed.data.sessions[0]).toMatchObject({ trainingMode: 'repetition', targetAttempts: 10, breakCount: 0, quickImpressions: [], effectiveTrainingMs: 1000 });
  });

  it('rejects unknown formats and invalid record results', () => {
    const payload = JSON.parse(emptyBackup);
    payload.format = 'other-app';
    expect(() => parseBackup(JSON.stringify(payload))).toThrow();
    payload.format = 'rally-o-trainer-backup';
    payload.data.records.push({ id: 'r', blockId: 'b', sessionId: 's', sequence: 1, result: 'perfect', recordedAt: 0, localDate: '2026-08-05' });
    expect(() => parseBackup(JSON.stringify(payload))).toThrow();
  });

  it('rejects broken relationships before touching the database', () => {
    const payload = JSON.parse(emptyBackup);
    payload.data.sessions.push({ id: 's', dogId: 'missing', status: 'completed', objective: 'learn', location: 'home', startedAt: 0, startedLocalDate: '2026-08-05', endedAt: 1, endReason: null, rating: 'appropriate', note: '', plannerRulesVersion: '1' });
    expect(() => parseBackup(JSON.stringify(payload))).toThrow('sesiones sin perro');
  });

  it('rejects duplicate primary identifiers', () => {
    const payload = JSON.parse(emptyBackup);
    const dog = { id: 'd', name: 'Luna', nameNormalized: 'luna', breed: 'Mestiza', createdAt: 0, updatedAt: 0, archivedAt: null };
    payload.data.dogs.push(dog, dog);
    expect(() => parseBackup(JSON.stringify(payload))).toThrow('identificadores duplicados');
  });
});
