import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { signals } from '../content/signals';
import { db, ensureSettings, getEvidence } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { calculateProgress } from '../domain/progress';
import { summarizeSession } from '../domain/trainingSession';
import type { Side } from '../domain/types';
import { OfficialSignalSign } from '../components/OfficialSignalSign';

export function ProgressPage() {
  const settings = useLiveData(ensureSettings, [], undefined);
  const dog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const evidence = useLiveData(async () => dog ? getEvidence(dog.id) : [], [dog?.id], []);
  const sessions = useLiveData(async () => dog ? (await db.sessions.where('dogId').equals(dog.id).toArray()).sort((a, b) => b.startedAt - a.startedAt) : [], [dog?.id], []);
  const blocks = useLiveData(() => db.blocks.toArray(), [], []);
  const records = useLiveData(() => db.records.toArray(), [], []);
  const rows = useMemo(() => signals.map((signal) => {
    const sides: Side[] = signal.trainingSideMode === 'both' ? ['left', 'right'] :
      signal.trainingSideMode === 'left-only' ? ['left'] :
      signal.trainingSideMode === 'right-only' ? ['right'] : ['not-applicable'];
    const signalEvidence = evidence.filter((item) => item.signalId === signal.id && item.compatibilityKey === signal.progressCompatibilityKey);
    return { signal, progress: sides.map((side) => calculateProgress(signalEvidence, side)) };
  }), [evidence]);
  const trained = rows.filter((row) => row.progress.some((item) => item.totalEvidence > 0)).length;
  const learned = rows.filter((row) => row.progress.every((item) => ['learned', 'consolidated'].includes(item.state))).length;
  const recent = [...evidence].sort((a, b) => b.recordedAt - a.recordedAt).slice(0, 30);
  const recentCounts = { correct: recent.filter((item) => item.result === 'autonomous').length, incorrect: recent.filter((item) => item.result !== 'autonomous').length };
  const completed = sessions.filter((item) => item.status === 'completed');
  return <>
    <div className="page-heading"><p className="eyebrow">{dog?.name ?? 'Tu perro'}</p><h1>Progreso</h1><p>Resultados sencillos para decidir el próximo entrenamiento.</p></div>
    <div className="stat-grid"><div><strong>{completed.length}</strong><span>sesiones</span></div><div><strong>{trained}</strong><span>señales iniciadas</span></div><div><strong>{learned}</strong><span>dominadas</span></div></div>
    <section className="card"><div className="card-row"><h2>Últimos {recent.length} intentos</h2><strong>{recent.length ? Math.round(recentCounts.correct / recent.length * 100) : 0}% correctos</strong></div><div className="result-bar" aria-label={`${recentCounts.correct} correctos y ${recentCounts.incorrect} incorrectos`}><span className="autonomous" style={{ flex: recentCounts.correct }} /><span className="incorrect" style={{ flex: recentCounts.incorrect }} /></div><div className="legend binary-legend"><span>● Correcta {recentCounts.correct}</span><span>● Incorrecta {recentCounts.incorrect}</span></div></section>
    <h2 className="section-title">Por señal y lado</h2>
    <div className="list">
      {rows.map(({ signal, progress }) => <Link className="progress-item" key={signal.id} to={`/signals/${encodeURIComponent(signal.id)}`}>
        <OfficialSignalSign signal={signal} compact /><span className="progress-main"><strong>{signal.officialNumber} · {signal.name}</strong><span className="side-statuses">{progress.map((item) => <span key={item.side}><small>{item.side === 'left' ? 'Izq.' : item.side === 'right' ? 'Der.' : 'General'}</small><StatusBadge state={item.state} /></span>)}</span></span><span aria-hidden="true">›</span>
      </Link>)}
    </div>
    <h2 className="section-title">Últimas sesiones</h2>
    <div className="history-cards">{completed.slice(0, 10).map((session) => {
      const sessionBlocks = blocks.filter((block) => block.sessionId === session.id);
      const summary = summarizeSession(sessionBlocks, records.filter((record) => record.sessionId === session.id));
      const correct = summary.reduce((sum, item) => sum + item.correctCount, 0);
      const total = summary.reduce((sum, item) => sum + item.total, 0);
      const names = summary.map((item) => signals.find((signal) => signal.id === item.block.signalId)?.name).filter(Boolean);
      return <article className="card history-session" key={session.id}>
        <div className="card-row"><div><strong>{new Date(session.startedAt).toLocaleDateString('es-ES')}</strong><small>{session.trainingMode === 'circuit' ? 'Circuito' : 'Repetición'} · {summary.length} señal{summary.length === 1 ? '' : 'es'}</small></div><strong>{total ? Math.round(correct / total * 100) : 0}%</strong></div>
        <p>{names.join(' · ') || 'Sesión histórica'}</p><div className="history-results"><span>{correct} correctas</span><span>{total - correct} incorrectas</span><span>{summary.filter((item) => item.passed).length}/{summary.length} superadas</span></div>
        {session.quickImpressions.length > 0 && <small>{session.quickImpressions.join(' · ')}</small>}{session.note && <p className="history-note">{session.note}</p>}
      </article>;
    })}{!completed.length && <p>Aún no hay sesiones completadas.</p>}</div>
  </>;
}
