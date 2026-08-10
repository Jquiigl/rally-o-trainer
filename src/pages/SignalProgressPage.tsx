import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { OfficialSignalSign } from '../components/OfficialSignalSign';
import { getSignal } from '../content/signals';
import { db, ensureSettings, getEvidence } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { calculateProgress } from '../domain/progress';
import { compareRecentRates } from '../domain/evolution';
import { summarizeSession } from '../domain/trainingSession';
import type { Side } from '../domain/types';

function sideLabel(side: Side): string {
  return side === 'left' ? 'Izquierda' : side === 'right' ? 'Derecha' : 'General';
}

export function SignalProgressPage() {
  const { signalId = '' } = useParams();
  let signal;
  try { signal = getSignal(signalId); } catch { return <Navigate to="/progress" replace />; }
  const settings = useLiveData(ensureSettings, [], undefined);
  const dog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const sessions = useLiveData(async () => dog ? (await db.sessions.where('[dogId+status]').equals([dog.id, 'completed']).toArray()).sort((a, b) => b.startedAt - a.startedAt) : [], [dog?.id], []);
  const blocks = useLiveData(() => db.blocks.where('signalId').equals(signalId).toArray(), [signalId], []);
  const records = useLiveData(() => db.records.toArray(), [], []);
  const evidence = useLiveData(async () => dog ? getEvidence(dog.id) : [], [dog?.id], []);
  const sides: Side[] = signal.trainingSideMode === 'both' ? ['left', 'right'] : signal.trainingSideMode === 'left-only' ? ['left'] : signal.trainingSideMode === 'right-only' ? ['right'] : ['not-applicable'];
  const progress = sides.map((side) => calculateProgress(evidence.filter((item) => item.signalId === signal.id && item.compatibilityKey === signal.progressCompatibilityKey), side));
  const completedIds = useMemo(() => new Set(sessions.map((session) => session.id)), [sessions]);
  const entries = blocks.filter((block) => completedIds.has(block.sessionId)).map((block) => {
    const session = sessions.find((item) => item.id === block.sessionId)!;
    const summary = summarizeSession([block], records.filter((record) => record.blockId === block.id))[0];
    return { block, session, summary };
  }).sort((a, b) => b.session.startedAt - a.session.startedAt);
  const rates = entries.filter((item) => item.summary.total > 0).map((item) => item.summary.successRate);
  const comparison = compareRecentRates(rates);
  const trend = comparison.trend === 'insufficient' ? 'Faltan sesiones para comparar' : comparison.trend === 'improving' ? 'Mejora respecto a la sesión anterior' : comparison.trend === 'declining' ? 'Baja respecto a la sesión anterior' : 'Resultado estable';

  return <>
    <Link className="back-link" to="/progress">‹ Progreso</Link>
    <div className="page-heading"><p className="eyebrow">Evolución por señal</p><h1>{signal.officialNumber} · {signal.name}</h1><p>{dog?.name ?? 'Tu perro'} · historial cronológico real</p></div>
    <OfficialSignalSign signal={signal} />
    <div className="signal-progress-states">{progress.map((item) => <div className="card" key={item.side}><strong>{sideLabel(item.side)}</strong><span>{item.window.autonomous}/{item.window.autonomous + item.window.incorrect + item.window.assisted} aciertos recientes</span><small>{item.totalEvidence} intentos registrados</small></div>)}</div>
    <section className="card trend-card"><h2>Tendencia reciente</h2><p className={comparison.trend === 'declining' ? 'trend-down' : 'trend-neutral'}>{trend}{comparison.difference !== null ? ` (${comparison.difference > 0 ? '+' : ''}${comparison.difference} puntos)` : ''}</p></section>
    <h2 className="section-title">Sesiones</h2>
    <div className="evolution-list">{entries.map(({ block, session, summary }) => <Link className="card evolution-item" key={block.id} to={`/history/${session.id}`}>
      <div className="card-row"><div><strong>{new Date(session.startedAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</strong><small>{session.trainingMode === 'circuit' ? 'Circuito' : 'Repeticiones'} · {sideLabel(block.side)}</small></div><strong>{summary.successRate}%</strong></div>
      <div className="history-results"><span>{summary.correctCount}/{summary.total} correctas</span><span>{summary.incorrectCount} errores</span><span>{summary.passed ? 'Superada' : 'Necesita trabajo'}</span></div>
      {block.note && <p className="history-note">{block.note}</p>}
    </Link>)}{!entries.length && <p className="empty-state">Esta señal aún no aparece en ninguna sesión guardada.</p>}</div>
    <Link className="button button--primary" to={`/train/prepare/${encodeURIComponent(signal.id)}`}>Entrenar esta señal</Link>
  </>;
}
