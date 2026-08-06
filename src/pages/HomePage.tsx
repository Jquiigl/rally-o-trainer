import { Link, useNavigate } from 'react-router-dom';
import { signals } from '../content/signals';
import { db, discardSession, ensureSettings, finishSession, getOpenSession } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { OfficialSignalSign } from '../components/OfficialSignalSign';

export function HomePage() {
  const navigate = useNavigate();
  const settings = useLiveData(ensureSettings, [], undefined);
  const dog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const completedSessions = useLiveData(async () => dog ? db.sessions.where('[dogId+status]').equals([dog.id, 'completed']).count() : 0, [dog?.id], 0);
  const activeSession = useLiveData(getOpenSession, [], undefined);
  const activeBlock = useLiveData(async () => activeSession ? db.blocks.where('sessionId').equals(activeSession.id).first() : undefined, [activeSession?.id], undefined);
  const activeRecords = useLiveData(async () => activeSession ? db.records.where('sessionId').equals(activeSession.id).count() : 0, [activeSession?.id], 0);
  const activeSignal = activeBlock ? signals.find((signal) => signal.id === activeBlock.signalId) : undefined;

  if (!dog) return null;
  return <>
    <section className="welcome-visual" aria-labelledby="welcome-title">
      <div className="sr-only">
        <h1 id="welcome-title">Bienvenido a Rally O Trainer</h1>
        <p>Tu aplicación para entrenar Rally Obedience de forma fácil, organizada y efectiva.</p>
      </div>
      <img src="./images/rally-obedience-home.webp" alt="Guía y perro entrenando juntos en una pista de Rally Obedience" />
      <Link className="welcome-hotspot welcome-hotspot--instructions" to="/instructions" aria-label="Abrir las instrucciones de uso">
        <span className="welcome-hotspot-icon" aria-hidden="true">?</span>
        <span><strong>Instrucciones de uso</strong><small>Cómo funciona la aplicación</small></span>
      </Link>
      <Link className="welcome-hotspot welcome-hotspot--training" to="/train" aria-label="Configurar un entrenamiento">
        <span className="welcome-hotspot-icon" aria-hidden="true">⚙</span>
        <span><strong>Configurar entrenamiento</strong><small>Elige señales y modalidad</small></span>
      </Link>
    </section>
    <section className="home-tools" aria-labelledby="home-tools-title">
      <h2 id="home-tools-title">Accesos rápidos</h2>
      <div>
        <Link className="home-tool" to="/progress"><span aria-hidden="true">↗</span><strong>Progreso</strong></Link>
        <Link className="home-tool" to="/exam"><span aria-hidden="true">?</span><strong>Examen</strong></Link>
        <Link className="home-tool" to="/signals"><span aria-hidden="true">▤</span><strong>Señales</strong></Link>
        <Link className="home-tool" to="/courses"><span aria-hidden="true">⌁</span><strong>Pistas</strong></Link>
      </div>
    </section>
    {activeSession && activeBlock && activeSignal && <section className="card active-reminder"><p className="eyebrow">Sesión {activeSession.status === 'paused' ? 'pausada' : 'en curso'}</p><div className="signal-reference"><OfficialSignalSign signal={activeSignal} compact /><h2>{activeSignal.name}{(activeSession.trainingMode === 'circuit') ? ' · Circuito' : ''}</h2></div><p>Tienes {activeRecords} resultado{activeRecords === 1 ? '' : 's'} guardado{activeRecords === 1 ? '' : 's'}. Elige cómo continuar.</p><div className="active-reminder-actions"><Link className="button button--primary" to={`/session/${activeSession.id}`}>Continuar sesión</Link><button className="button button--secondary" onClick={async () => { await finishSession(activeSession.id, 'ended-from-home'); navigate('/progress'); }}>Finalizar y guardar</button><button className="danger-link" onClick={async () => { if (window.confirm('¿Descartar la sesión abierta? Sus resultados no contarán en el progreso.')) await discardSession(activeSession.id); }}>Descartar sesión</button></div></section>}
    {completedSessions > 0 && (!settings?.lastBackupAt || Date.now() - settings.lastBackupAt >= 30 * 86_400_000) && <Link className="backup-reminder" to="/dogs"><strong>Guarda una copia de seguridad</strong><span>Protege tu historial con un archivo local.</span></Link>}
  </>;
}
