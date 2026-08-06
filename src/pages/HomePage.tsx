import { Link, useNavigate } from 'react-router-dom';
import { signals } from '../content/signals';
import { db, discardSession, ensureSettings, finishSession, getEvidence, getOpenSession } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { recommendSignals } from '../domain/planner';
import { StatusBadge } from '../components/StatusBadge';
import { OfficialSignalSign } from '../components/OfficialSignalSign';

export function HomePage() {
  const navigate = useNavigate();
  const settings = useLiveData(ensureSettings, [], undefined);
  const dog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const evidence = useLiveData(async () => dog ? getEvidence(dog.id) : [], [dog?.id], []);
  const completedSessions = useLiveData(async () => dog ? db.sessions.where('[dogId+status]').equals([dog.id, 'completed']).count() : 0, [dog?.id], 0);
  const activeSession = useLiveData(getOpenSession, [], undefined);
  const activeBlock = useLiveData(async () => activeSession ? db.blocks.where('sessionId').equals(activeSession.id).first() : undefined, [activeSession?.id], undefined);
  const activeRecords = useLiveData(async () => activeSession ? db.records.where('sessionId').equals(activeSession.id).count() : 0, [activeSession?.id], 0);
  const recommendation = recommendSignals(signals, evidence, settings?.preferredLocation ?? 'home', Date.now(), settings?.availableMaterialIds)[0];
  const activeSignal = activeBlock ? signals.find((signal) => signal.id === activeBlock.signalId) : undefined;

  if (!dog || !recommendation) return null;
  return <>
    <section className="hero compact">
      <p className="eyebrow">Hoy con {dog.name}</p>
      <h1>¿Qué entrenamos?</h1>
      <p>Entrena una o varias señales, con descansos cuando los necesitéis.</p>
    </section>
    {activeSession && activeBlock && activeSignal && <section className="card active-reminder"><p className="eyebrow">Sesión {activeSession.status === 'paused' ? 'pausada' : 'en curso'}</p><div className="signal-reference"><OfficialSignalSign signal={activeSignal} compact /><h2>{activeSignal.name}{(activeSession.trainingMode === 'circuit') ? ' · Circuito' : ''}</h2></div><p>Tienes {activeRecords} resultado{activeRecords === 1 ? '' : 's'} guardado{activeRecords === 1 ? '' : 's'}. Elige cómo continuar.</p><div className="active-reminder-actions"><Link className="button button--primary" to={`/session/${activeSession.id}`}>Continuar sesión</Link><button className="button button--secondary" onClick={async () => { await finishSession(activeSession.id, 'ended-from-home'); navigate('/progress'); }}>Finalizar y guardar</button><button className="danger-link" onClick={async () => { if (window.confirm('¿Descartar la sesión abierta? Sus resultados no contarán en el progreso.')) await discardSession(activeSession.id); }}>Descartar sesión</button></div></section>}
    {completedSessions > 0 && (!settings?.lastBackupAt || Date.now() - settings.lastBackupAt >= 30 * 86_400_000) && <Link className="backup-reminder" to="/dogs"><strong>Guarda una copia de seguridad</strong><span>Protege tu historial con un archivo local.</span></Link>}
    <section className="card recommendation">
      <div className="card-row"><span className="number">{recommendation.signal.officialNumber}</span><StatusBadge state={recommendation.progress.state} /></div>
      <OfficialSignalSign signal={recommendation.signal} className="official-sign--recommendation" />
      <h2>{recommendation.signal.name}</h2>
      <p>{recommendation.reason}</p>
      <p className="meta">Lado {recommendation.side === 'left' ? 'izquierdo' : recommendation.side === 'right' ? 'derecho' : 'no aplicable'} · Puedes añadir más señales</p>
      <Link className="button button--primary" to={`/train?select=${encodeURIComponent(recommendation.signal.id)}&side=${recommendation.side}`}>Crear sesión</Link>
    </section>
    <div className="quick-grid">
      <Link className="secondary-card" to="/train"><strong>Elegir señales</strong><span>Una sola o varias en la misma sesión</span></Link>
      <Link className="secondary-card" to="/progress"><strong>Ver progreso</strong><span>Resultados por señal y lado</span></Link>
      <Link className="secondary-card" to="/courses"><strong>Construir pista</strong><span>Ordena una secuencia Debutante</span></Link>
      <Link className="secondary-card" to="/exam"><strong>Modo examen</strong><span>Comprueba si reconoces las señales</span></Link>
    </div>
  </>;
}
