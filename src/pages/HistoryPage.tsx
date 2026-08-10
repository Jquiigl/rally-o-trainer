import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { OfficialSignalSign } from '../components/OfficialSignalSign';
import { getSignal } from '../content/signals';
import { db, deleteCompletedSession, ensureSettings, updateSessionReview } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { summarizeSession } from '../domain/trainingSession';

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
}

function formatDuration(milliseconds: number): string {
  const minutes = Math.max(0, Math.round(milliseconds / 60_000));
  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

export function HistoryPage() {
  const settings = useLiveData(ensureSettings, [], undefined);
  const dog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const sessions = useLiveData(async () => dog ? (await db.sessions.where('[dogId+status]').equals([dog.id, 'completed']).toArray()).sort((a, b) => b.startedAt - a.startedAt) : [], [dog?.id], []);
  const blocks = useLiveData(() => db.blocks.toArray(), [], []);
  const records = useLiveData(() => db.records.toArray(), [], []);

  return <>
    <div className="page-heading"><p className="eyebrow">{dog?.name ?? 'Tu perro'}</p><h1>Historial</h1><p>Sesiones guardadas, resultados y anotaciones.</p></div>
    <div className="history-cards">{sessions.map((session) => {
      const summary = summarizeSession(blocks.filter((block) => block.sessionId === session.id), records.filter((record) => record.sessionId === session.id));
      const correct = summary.reduce((sum, item) => sum + item.correctCount, 0);
      const total = summary.reduce((sum, item) => sum + item.total, 0);
      return <Link className="card history-session history-session-link" key={session.id} to={`/history/${session.id}`}>
        <div className="card-row"><div><strong>{formatDateTime(session.startedAt)}</strong><small>{session.trainingMode === 'circuit' ? 'Circuito' : 'Repeticiones'} · {summary.length} señal{summary.length === 1 ? '' : 'es'}</small></div><strong>{total ? Math.round(correct / total * 100) : 0}%</strong></div>
        <div className="history-results"><span>{total} repeticiones</span><span>{correct} aciertos</span><span>{total - correct} errores</span></div>
        {(session.finalAssessment || session.note) && <p className="history-note">{session.finalAssessment || session.note}</p>}
        <span className="history-open">Abrir sesión ›</span>
      </Link>;
    })}{!sessions.length && <p className="empty-state">Aún no hay sesiones guardadas.</p>}</div>
  </>;
}

export function SessionDetailPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  const sessionState = useLiveData(async () => ({ loaded: true, session: await db.sessions.get(sessionId) }), [sessionId], { loaded: false, session: undefined });
  const session = sessionState.session;
  const dog = useLiveData(async () => session ? db.dogs.get(session.dogId) : undefined, [session?.dogId], undefined);
  const blocks = useLiveData(() => db.blocks.where('sessionId').equals(sessionId).sortBy('sequence'), [sessionId], []);
  const records = useLiveData(() => db.records.where('sessionId').equals(sessionId).sortBy('recordedAt'), [sessionId], []);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [finalAssessment, setFinalAssessment] = useState('');
  const [blockNotes, setBlockNotes] = useState<Record<string, string>>({});
  const summary = useMemo(() => summarizeSession(blocks, records), [blocks, records]);

  useEffect(() => { if (session) { setNote(session.note); setFinalAssessment(session.finalAssessment); } }, [session?.id, editing]);
  useEffect(() => { setBlockNotes(Object.fromEntries(blocks.map((block) => [block.id, block.note]))); }, [sessionId, editing, blocks]);

  if (!sessionState.loaded) return <section className="card"><p>Cargando sesión…</p></section>;
  if (!session || session.status !== 'completed') return <Navigate to="/history" replace />;

  const correct = summary.reduce((sum, item) => sum + item.correctCount, 0);
  const total = summary.reduce((sum, item) => sum + item.total, 0);

  async function saveEdits() {
    if (!session) return;
    setBusy(true);
    try {
      await updateSessionReview({ sessionId: session.id, note, finalAssessment, blockNotes });
      setEditing(false);
    } finally { setBusy(false); }
  }

  async function removeSession() {
    if (!session || !window.confirm('¿Eliminar definitivamente esta sesión? Se borrarán sus resultados y notas, y dejará de contar en el progreso.')) return;
    setBusy(true);
    try {
      await deleteCompletedSession(session.id);
      navigate('/history', { replace: true });
    } finally { setBusy(false); }
  }

  return <>
    <Link className="back-link" to="/history">‹ Historial</Link>
    <div className="page-heading"><p className="eyebrow">Sesión guardada</p><h1>{formatDateTime(session.startedAt)}</h1><p>{dog?.name} · {session.trainingMode === 'circuit' ? 'Circuito' : 'Repeticiones'} · {formatDuration(session.effectiveTrainingMs)}</p></div>
    <div className="summary-stats"><div><strong>{total ? Math.round(correct / total * 100) : 0}%</strong><span>acierto</span></div><div><strong>{correct}/{total}</strong><span>correctas</span></div><div><strong>{session.breakCount}</strong><span>descansos</span></div></div>
    <div className="summary-signal-list">{summary.map((item) => { const signal = getSignal(item.block.signalId); return <article className="summary-signal history-signal-detail" key={item.block.id}>
      <OfficialSignalSign signal={signal} compact /><div><strong>{signal.officialNumber} · {signal.name}</strong><span>{item.correctCount}/{item.total} · {item.successRate}% · {item.incorrectCount} errores</span>{!editing && item.block.note && <small>{item.block.note}</small>}</div><span className={`result-state ${item.passed ? 'passed' : 'pending'}`}>{item.passed ? 'Superada' : 'Necesita trabajo'}</span>
      {editing && <label>Observación de la señal<textarea value={blockNotes[item.block.id] ?? ''} onChange={(event) => setBlockNotes((current) => ({ ...current, [item.block.id]: event.target.value }))} /></label>}
    </article>; })}</div>
    <section className="card session-review-detail">
      <h2>Anotaciones</h2>
      {editing ? <>
        <label>Observaciones generales<textarea value={note} onChange={(event) => setNote(event.target.value)} /></label>
        <label>Valoración final<textarea value={finalAssessment} onChange={(event) => setFinalAssessment(event.target.value)} /></label>
        <p className="dictation-hint">Puedes utilizar el micrófono del teclado del teléfono.</p>
      </> : <>
        {session.quickImpressions.length > 0 && <p>{session.quickImpressions.join(' · ')}</p>}
        <h3>Observaciones generales</h3><p>{session.note || 'Sin observaciones generales.'}</p>
        <h3>Valoración final</h3><p>{session.finalAssessment || 'Sin valoración final.'}</p>
      </>}
    </section>
    {editing ? <div className="edit-actions"><button className="button button--primary" disabled={busy} onClick={() => void saveEdits()}>Guardar anotaciones</button><button className="button button--ghost" disabled={busy} onClick={() => setEditing(false)}>Cancelar</button></div> : <div className="history-detail-actions"><button className="button button--secondary" disabled={busy} onClick={() => setEditing(true)}>Editar anotaciones</button><button className="danger-link" disabled={busy} onClick={() => void removeSession()}>Eliminar sesión</button></div>}
  </>;
}
