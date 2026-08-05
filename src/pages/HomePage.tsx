import { Link } from 'react-router-dom';
import { signals } from '../content/signals';
import { db, ensureSettings, getEvidence } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { recommendSignals } from '../domain/planner';
import { StatusBadge } from '../components/StatusBadge';

export function HomePage() {
  const settings = useLiveData(ensureSettings, [], undefined);
  const dog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const evidence = useLiveData(async () => dog ? getEvidence(dog.id) : [], [dog?.id], []);
  const completedSessions = useLiveData(async () => dog ? db.sessions.where('[dogId+status]').equals([dog.id, 'completed']).count() : 0, [dog?.id], 0);
  const activeSession = useLiveData(() => db.sessions.where('status').equals('active').first(), [], undefined);
  const activeBlock = useLiveData(async () => activeSession ? db.blocks.where('sessionId').equals(activeSession.id).first() : undefined, [activeSession?.id], undefined);
  const recommendation = recommendSignals(signals, evidence, settings?.preferredLocation ?? 'home', Date.now(), settings?.availableMaterialIds)[0];

  if (!dog || !recommendation) return null;
  return <>
    <section className="hero compact">
      <p className="eyebrow">Hoy con {dog.name}</p>
      <h1>¿Qué entrenamos?</h1>
      <p>Una sesión breve, clara y adaptada a tu progreso.</p>
    </section>
    {activeSession && activeBlock && <section className="card active-reminder"><p className="eyebrow">Sesión en curso</p><h2>{signals.find((signal) => signal.id === activeBlock.signalId)?.name ?? 'Entrenamiento'}</h2><p>Continúa donde lo dejaste; el cronómetro conserva la hora de inicio.</p><Link className="button button--primary" to={`/session/${activeSession.id}`}>Continuar sesión</Link></section>}
    {completedSessions > 0 && (!settings?.lastBackupAt || Date.now() - settings.lastBackupAt >= 30 * 86_400_000) && <Link className="backup-reminder" to="/dogs"><strong>Guarda una copia de seguridad</strong><span>Protege tu historial con un archivo local.</span></Link>}
    <section className="card recommendation">
      <div className="card-row"><span className="number">{recommendation.signal.officialNumber}</span><StatusBadge state={recommendation.progress.state} /></div>
      <h2>{recommendation.signal.name}</h2>
      <p>{recommendation.reason}</p>
      <p className="meta">Lado {recommendation.side === 'left' ? 'izquierdo' : recommendation.side === 'right' ? 'derecho' : 'no aplicable'} · 15 min máximo</p>
      <Link className="button button--primary" to={`/train/prepare/${encodeURIComponent(recommendation.signal.id)}?side=${recommendation.side}`}>Preparar sesión</Link>
    </section>
    <div className="quick-grid">
      <Link className="secondary-card" to="/train"><strong>Elegir otra señal</strong><span>Siempre tienes la decisión final</span></Link>
      <Link className="secondary-card" to="/progress"><strong>Ver progreso</strong><span>Resultados por señal y lado</span></Link>
      <Link className="secondary-card" to="/courses"><strong>Construir pista</strong><span>Ordena una secuencia Debutante</span></Link>
      <Link className="secondary-card" to="/exam"><strong>Modo examen</strong><span>Comprueba si reconoces las señales</span></Link>
    </div>
  </>;
}
