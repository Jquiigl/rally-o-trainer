import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSignal } from '../content/signals';
import { completeSession, db, recordAttempt, undoLastAttempt } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import type { PracticeResult, TrainingSession } from '../domain/types';
import { OfficialSignalSign } from '../components/OfficialSignalSign';

const MAX_SECONDS = 15 * 60;

export function SessionPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  const session = useLiveData(() => db.sessions.get(sessionId), [sessionId], undefined);
  const block = useLiveData(() => db.blocks.where('sessionId').equals(sessionId).first(), [sessionId], undefined);
  const records = useLiveData(() => db.records.where('sessionId').equals(sessionId).sortBy('recordedAt'), [sessionId], []);
  const [now, setNow] = useState(Date.now());
  const [finishing, setFinishing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [endReason, setEndReason] = useState('ended-early');
  const [dominantHelp, setDominantHelp] = useState('');
  const elapsed = session ? Math.max(0, Math.floor((now - session.startedAt) / 1000)) : 0;
  const remaining = Math.max(0, MAX_SECONDS - elapsed);
  const phase = elapsed < 120 ? 'Activación' : elapsed < 12 * 60 ? 'Trabajo' : 'Cierre positivo';
  const signal = block ? getSignal(block.signalId) : undefined;
  const counts = useMemo(() => ({
    incorrect: records.filter((item) => item.result === 'incorrect').length,
    assisted: records.filter((item) => item.result === 'assisted').length,
    autonomous: records.filter((item) => item.result === 'autonomous').length
  }), [records]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  async function add(result: PracticeResult) {
    setBusy(true);
    try { await recordAttempt(sessionId, result); } finally { setBusy(false); }
  }

  async function finish(rating: TrainingSession['rating'], reason: string | null) {
    if (dominantHelp && block) await db.blocks.update(block.id, { dominantHelp });
    await completeSession(sessionId, rating, reason);
    navigate('/progress');
  }

  if (!session || !block || !signal) return <p>Cargando sesión…</p>;
  if (session.status === 'completed') return <section className="center-card"><h1>Sesión finalizada</h1><button className="button button--primary" onClick={() => navigate('/progress')}>Ver progreso</button></section>;

  if (finishing) return <section className="finish-panel">
    <p className="eyebrow">Último paso</p><h1>¿Cómo ha ido?</h1><p>Una valoración rápida basta.</p>
    {remaining > 0 && <label>Motivo de finalización<select value={endReason} onChange={(event) => setEndReason(event.target.value)}><option value="ended-early">Sesión breve suficiente</option><option value="dog-state">Estado del perro</option><option value="environment">Entorno o interrupción</option><option value="handler-state">Estado del guía</option><option value="other">Otro motivo</option></select></label>}
    {counts.assisted > 0 && <label>Ayuda predominante (opcional)<select value={dominantHelp} onChange={(event) => setDominantHelp(event.target.value)}><option value="">Sin indicar</option><option value="verbal-extra">Orden verbal adicional</option><option value="gesture">Gesto adicional</option><option value="visible-lure">Señuelo visible</option><option value="leash">Uso de correa</option><option value="position-help">Ayuda de posición</option><option value="other">Otra</option></select></label>}
    <div className="rating-buttons"><button onClick={() => finish('difficult', remaining > 0 ? endReason : null)}>Difícil</button><button onClick={() => finish('appropriate', remaining > 0 ? endReason : null)}>Adecuada</button><button onClick={() => finish('easy', remaining > 0 ? endReason : null)}>Fácil</button></div>
    <button className="button button--ghost" onClick={() => setFinishing(false)}>Seguir entrenando</button>
  </section>;

  return <section className="active-session">
    <div className="session-head"><span className="number">{signal.officialNumber}</span><div><p className="eyebrow">{phase}</p><h1>{signal.name}</h1></div></div>
    <OfficialSignalSign signal={signal} compact className="official-sign--session" />
    <div className="timer" role="timer" aria-label={`${Math.floor(remaining / 60)} minutos y ${remaining % 60} segundos restantes`}><strong>{String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</strong><span>{remaining === 0 ? 'Puedes cerrar cuando quieras' : 'restantes'}</span></div>
    <p className="session-prompt">Registra cada intento con un solo toque.</p>
    <div className="attempt-buttons">
      <button className="attempt attempt--wrong" disabled={busy} onClick={() => add('incorrect')}><span>×</span>Incorrecta <small>{counts.incorrect}</small></button>
      <button className="attempt attempt--help" disabled={busy} onClick={() => add('assisted')}><span>≈</span>Con ayuda <small>{counts.assisted}</small></button>
      <button className="attempt attempt--good" disabled={busy} onClick={() => add('autonomous')}><span>✓</span>Autónoma <small>{counts.autonomous}</small></button>
    </div>
    <div className="session-actions"><button className="button button--ghost" disabled={!records.length} onClick={() => undoLastAttempt(sessionId)}>Deshacer último</button><button className="button button--secondary" onClick={() => setFinishing(true)}>Finalizar</button></div>
  </section>;
}
