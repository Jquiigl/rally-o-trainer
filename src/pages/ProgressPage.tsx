import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { signals } from '../content/signals';
import { db, ensureSettings, getEvidence } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { calculateProgress } from '../domain/progress';
import type { Side } from '../domain/types';

export function ProgressPage() {
  const settings = useLiveData(ensureSettings, [], undefined);
  const dog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const evidence = useLiveData(async () => dog ? getEvidence(dog.id) : [], [dog?.id], []);
  const sessions = useLiveData(async () => dog ? db.sessions.where('dogId').equals(dog.id).reverse().sortBy('startedAt') : [], [dog?.id], []);
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
  const recentCounts = { autonomous: recent.filter((item) => item.result === 'autonomous').length, assisted: recent.filter((item) => item.result === 'assisted').length, incorrect: recent.filter((item) => item.result === 'incorrect').length };
  return <>
    <div className="page-heading"><p className="eyebrow">{dog?.name ?? 'Tu perro'}</p><h1>Progreso</h1><p>Resultados sencillos para decidir el próximo entrenamiento.</p></div>
    <div className="stat-grid"><div><strong>{sessions.filter((item) => item.status === 'completed').length}</strong><span>sesiones</span></div><div><strong>{trained}</strong><span>señales iniciadas</span></div><div><strong>{learned}</strong><span>dominadas</span></div></div>
    <section className="card"><div className="card-row"><h2>Últimos {recent.length || 0} intentos</h2><strong>{recent.length ? Math.round(recentCounts.autonomous / recent.length * 100) : 0}% autónomos</strong></div><div className="result-bar" aria-label={`${recentCounts.autonomous} autónomos, ${recentCounts.assisted} con ayuda y ${recentCounts.incorrect} incorrectos`}><span className="autonomous" style={{ flex: recentCounts.autonomous }} /><span className="assisted" style={{ flex: recentCounts.assisted }} /><span className="incorrect" style={{ flex: recentCounts.incorrect }} /></div><div className="legend"><span>● Autónoma {recentCounts.autonomous}</span><span>● Con ayuda {recentCounts.assisted}</span><span>● Incorrecta {recentCounts.incorrect}</span></div></section>
    <h2 className="section-title">Por señal y lado</h2>
    <div className="list">
      {rows.map(({ signal, progress }) => <Link className="progress-item" key={signal.id} to={`/signals/${encodeURIComponent(signal.id)}`}>
        <span className="number number--small">{signal.officialNumber}</span><span className="progress-main"><strong>{signal.name}</strong><span className="side-statuses">{progress.map((item) => <span key={item.side}><small>{item.side === 'left' ? 'Izq.' : item.side === 'right' ? 'Der.' : 'General'}</small><StatusBadge state={item.state} /></span>)}</span></span><span aria-hidden="true">›</span>
      </Link>)}
    </div>
    <h2 className="section-title">Últimas sesiones</h2>
    <div className="card history">{sessions.filter((item) => item.status === 'completed').slice(0, 5).map((session) => <div key={session.id}><span>{new Date(session.startedAt).toLocaleDateString('es-ES')}</span><strong>{session.rating === 'easy' ? 'Fácil' : session.rating === 'difficult' ? 'Difícil' : 'Adecuada'}</strong></div>)}{!sessions.some((item) => item.status === 'completed') && <p>Aún no hay sesiones completadas.</p>}</div>
  </>;
}
