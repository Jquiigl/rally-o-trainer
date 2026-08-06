import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSignal } from '../content/signals';
import {
  db, discardSession, finishSession, pauseSession, recordStructuredAttempt, resumeSession,
  continueAfterRestNotice, startStructuredSession, undoLastAttempt, updateSessionImpressions, updateSignalNote
} from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { effectiveTrainingMs, getSessionStep, restDue, summarizeSession } from '../domain/trainingSession';
import { OfficialSignalSign } from '../components/OfficialSignalSign';

const quickOptions = [
  'Muy concentrado', 'Buena motivación', 'Se distrae', 'Necesita ayuda', 'Responde con fluidez',
  'Dificultad con la posición', 'Dificultad con el guía', 'Entorno con distracciones', 'Fatiga',
  'Mejor que la sesión anterior'
];

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1_000));
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  return hours ? `${hours} h ${minutes} min` : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function SessionPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  const session = useLiveData(() => db.sessions.get(sessionId), [sessionId], undefined);
  const blocks = useLiveData(() => db.blocks.where('sessionId').equals(sessionId).sortBy('sequence'), [sessionId], []);
  const records = useLiveData(() => db.records.where('sessionId').equals(sessionId).sortBy('recordedAt'), [sessionId], []);
  const dog = useLiveData(async () => session ? db.dogs.get(session.dogId) : undefined, [session?.dogId], undefined);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1_000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { if (session) setNote(session.note); }, [session?.id]);

  const step = useMemo(() => session ? getSessionStep(session.trainingMode, blocks, records, session.targetAttempts) : null, [session, blocks, records]);
  const summaries = useMemo(() => summarizeSession(blocks, records), [blocks, records]);
  const currentSignal = step?.block ? getSignal(step.block.signalId) : undefined;
  const totalCorrect = summaries.reduce((sum, item) => sum + item.correctCount, 0);
  const totalAttempts = summaries.reduce((sum, item) => sum + item.total, 0);
  const globalRate = totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 0;

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    try { await action(); } finally { setBusy(false); }
  }

  async function saveNotes(impressions = session?.quickImpressions ?? [], nextNote = note) {
    if (session) await updateSessionImpressions(session.id, impressions, nextNote);
  }

  function toggleImpression(value: string) {
    if (!session) return;
    const next = session.quickImpressions.includes(value) ? session.quickImpressions.filter((item) => item !== value) : [...session.quickImpressions, value];
    void saveNotes(next);
  }

  async function createContinuation(signalIds: string[]) {
    if (!session) return;
    const selectedBlocks = blocks.filter((block) => signalIds.includes(block.signalId));
    await finishSession(session.id);
    const next = await startStructuredSession({
      dogId: session.dogId, mode: session.trainingMode, location: session.location,
      signals: selectedBlocks.map((block) => ({ signalId: block.signalId, signalRevisionId: block.signalRevisionId, compatibilityKey: block.progressCompatibilityKey, side: block.side }))
    });
    navigate(`/session/${next.id}`, { replace: true });
  }

  if (!session || !blocks.length || !dog) return <section className="center-card"><p>Cargando sesión…</p></section>;
  if (session.status === 'completed' || session.status === 'discarded') return <section className="center-card"><h1>{session.status === 'completed' ? 'Sesión guardada' : 'Sesión descartada'}</h1><button className="button button--primary" onClick={() => navigate(session.status === 'completed' ? '/progress' : '/')}>{session.status === 'completed' ? 'Ver historial' : 'Volver al inicio'}</button></section>;

  if (summaryOpen || step?.complete) return <section className="session-summary">
    <div className="page-heading"><p className="eyebrow">Resumen</p><h1>Sesión con {dog.name}</h1><p>{new Date(session.startedAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
    <div className="summary-stats"><div><strong>{globalRate}%</strong><span>acierto global</span></div><div><strong>{formatDuration(effectiveTrainingMs(session, now))}</strong><span>entrenamiento</span></div><div><strong>{session.breakCount}</strong><span>descansos</span></div></div>
    <p className="meta">Duración total {formatDuration(now - session.startedAt)} · Modo {session.trainingMode === 'circuit' ? 'circuito' : 'repetición'}</p>
    <div className="summary-signal-list">{summaries.map((item) => { const signal = getSignal(item.block.signalId); return <article key={item.block.id} className="summary-signal">
      <OfficialSignalSign signal={signal} compact /><div><strong>{signal.officialNumber} · {signal.name}</strong><span>{item.correctCount} correctas · {item.incorrectCount} incorrectas · {item.successRate}%</span>{item.block.note && <small>Nota: {item.block.note}</small>}</div><span className={`result-state ${item.passed ? 'passed' : 'pending'}`}>{item.passed ? 'Superada' : 'Pendiente'}</span>
    </article>; })}</div>
    {(session.quickImpressions.length > 0 || session.note) && <section className="card"><h2>Impresiones</h2>{session.quickImpressions.length > 0 && <p>{session.quickImpressions.join(' · ')}</p>}{session.note && <p>{session.note}</p>}</section>}
    <div className="summary-actions">
      <button className="button button--primary" disabled={busy} onClick={() => run(async () => { await finishSession(session.id); navigate('/progress'); })}>Guardar sesión</button>
      <button className="button button--secondary" disabled={busy} onClick={() => run(() => createContinuation(blocks.map((block) => block.signalId)))}>Continuar entrenando</button>
      <button className="button button--ghost" disabled={busy || summaries.every((item) => item.passed)} onClick={() => run(() => createContinuation(summaries.filter((item) => !item.passed).map((item) => item.block.signalId)))}>Repetir pendientes</button>
      <button className="danger-link" disabled={busy} onClick={() => { if (window.confirm('¿Descartar esta sesión? Sus resultados no contarán en el progreso.')) void run(async () => { await discardSession(session.id); navigate('/'); }); }}>Descartar sesión</button>
    </div>
  </section>;

  if (session.status === 'paused') return <section className="session-overlay break-screen">
    <span className="break-icon" aria-hidden="true">☕</span><p className="eyebrow">Sesión pausada</p><h1>Momento de recuperar</h1>
    <p>Deja que {dog.name} beba, olfatee o descanse. Reanuda cuando ambos estéis preparados.</p>
    <p className="meta">{session.pauseKind === 'break' ? `Descanso ${session.breakCount}` : 'Pausa manual'} · El tiempo de pausa no cuenta como entrenamiento.</p>
    <button className="button button--primary" disabled={busy} onClick={() => run(() => resumeSession(session.id))}>Reanudar sesión</button>
    <button className="button button--ghost" onClick={() => setSummaryOpen(true)}>Finalizar sesión</button>
  </section>;

  if (restDue(session, now) && !summaryOpen) return <section className="session-overlay rest-reminder">
    <span className="break-icon" aria-hidden="true">15</span><p className="eyebrow">Recordatorio de descanso</p><h1>{dog.name} lleva 15 minutos trabajando</h1>
    <p>Una pausa breve ayuda a mantener la motivación y la calidad. Puedes continuar si el perro sigue cómodo y concentrado.</p>
    <button className="button button--primary" disabled={busy} onClick={() => run(() => pauseSession(session.id, 'break'))}>Iniciar descanso</button>
    <button className="button button--ghost" disabled={busy} onClick={() => run(() => continueAfterRestNotice(session.id))}>Continuar sin descanso</button>
  </section>;

  if (!step || !step.block || !currentSignal) return <section className="center-card"><p>No se pudo recuperar el siguiente intento.</p></section>;
  const currentSummary = summaries.find((item) => item.block.id === step.block?.id);
  const progress = step.totalAttempts ? Math.round(step.completedAttempts / step.totalAttempts * 100) : 0;
  return <section className="active-session">
    <header className="session-toolbar"><button className="text-button" disabled={busy} onClick={() => run(() => pauseSession(session.id, 'manual'))}>Pausar</button><span>{session.trainingMode === 'circuit' ? 'Circuito' : 'Repetición'}</span><button className="text-button" onClick={() => setSummaryOpen(true)}>Finalizar</button></header>
    <div className="session-counters"><span>{session.trainingMode === 'circuit' ? `Vuelta ${step.circuitRound} de 10` : `Señal ${step.signalIndex + 1} de ${blocks.length}`}</span><strong>{session.trainingMode === 'circuit' ? `Señal ${step.signalIndex + 1} de ${blocks.length}` : `Intento ${step.repetition} de 10`}</strong></div>
    <div className="session-progress" aria-label={`${progress}% de la sesión completado`}><span style={{ width: `${progress}%` }} /></div>
    <div className="session-signal-title"><span className="number">{currentSignal.officialNumber}</span><h1>{currentSignal.name}</h1></div>
    <OfficialSignalSign signal={currentSignal} className="official-sign--session" />
    <p className="regulatory-prompt">{currentSignal.regulatoryDescription}</p>
    <div className="binary-attempts">
      <button className="attempt attempt--wrong" disabled={busy} onClick={() => run(() => recordStructuredAttempt(session.id, 'incorrect'))}><span>×</span>Incorrecta <small>{currentSummary?.incorrectCount ?? 0}</small></button>
      <button className="attempt attempt--good" disabled={busy} onClick={() => run(() => recordStructuredAttempt(session.id, 'autonomous'))}><span>✓</span>Correcta <small>{currentSummary?.correctCount ?? 0}</small></button>
    </div>
    <button className="button button--ghost undo-button" disabled={busy || !records.length} onClick={() => run(() => undoLastAttempt(session.id))}>Deshacer último resultado</button>
    <button className="notes-toggle" onClick={() => setNotesOpen((value) => !value)}>Impresiones y notas {notesOpen ? '−' : '+'}</button>
    {notesOpen && <section className="session-notes">
      <div className="impression-chips">{quickOptions.map((option) => <button key={option} className={session.quickImpressions.includes(option) ? 'selected' : ''} onClick={() => toggleImpression(option)}>{option}</button>)}</div>
      <label>Nota general (opcional)<textarea value={note} onChange={(event) => setNote(event.target.value)} onBlur={() => void saveNotes()} placeholder="Algo útil para la próxima sesión" /></label>
      <label>Nota de esta señal (opcional)<textarea defaultValue={step.block.note} key={step.block.id} onBlur={(event) => void updateSignalNote(step.block!.id, event.target.value)} placeholder="Detalle concreto de la señal" /></label>
    </section>}
  </section>;
}
