import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSignal, signals } from '../content/signals';
import { db, ensureSettings, getEvidence, startSession } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { recommendSignals } from '../domain/planner';
import type { Location, SessionObjective, Side } from '../domain/types';

const locationLabels: Record<Location, string> = { home: 'Casa', 'outdoor-small': 'Exterior reducido', club: 'Club' };
const objectiveLabels: Record<SessionObjective, string> = { learn: 'Aprender', autonomy: 'Ganar autonomía', precision: 'Mejorar precisión', review: 'Repasar', side: 'Trabajar el otro lado' };
const materialLabels: Record<string, string> = { 'ground-marker': 'Referencia en el suelo', cone: 'Cono', 'natural-marker': 'Referencia natural' };

export function TrainPage() {
  const settings = useLiveData(ensureSettings, [], undefined);
  const evidence = useLiveData(async () => settings?.activeDogId ? getEvidence(settings.activeDogId) : [], [settings?.activeDogId], []);
  const [chosenLocation, setChosenLocation] = useState<Location | null>(null);
  const location = chosenLocation ?? settings?.preferredLocation ?? 'home';
  const recommendations = recommendSignals(signals, evidence, location, Date.now(), settings?.availableMaterialIds);
  const firstBySignal = new Map<string, (typeof recommendations)[number]>();
  recommendations.forEach((item) => { if (!firstBySignal.has(item.signal.id)) firstBySignal.set(item.signal.id, item); });
  const uniqueSignals = signals.filter((signal) => signal.locations.includes(location)).sort((a, b) => {
    const aScore = firstBySignal.get(a.id)?.score ?? -1; const bScore = firstBySignal.get(b.id)?.score ?? -1;
    return bScore - aScore || a.officialNumber.localeCompare(b.officialNumber, 'es', { numeric: true });
  });
  return <>
    <div className="page-heading"><p className="eyebrow">Sesión individual</p><h1>Elige qué practicar</h1><p>Te recomendamos una opción, pero puedes seleccionar cualquier señal.</p></div>
    <div className="segmented" aria-label="Lugar de entrenamiento">
      {(Object.keys(locationLabels) as Location[]).map((value) => <button key={value} className={location === value ? 'active' : ''} onClick={() => setChosenLocation(value)}>{locationLabels[value]}</button>)}
    </div>
    <div className="list">
      {uniqueSignals.map((signal, index) => { const item = firstBySignal.get(signal.id); const defaultSide = signal.trainingSideMode === 'right-only' ? 'right' : signal.trainingSideMode === 'not-applicable' ? 'not-applicable' : 'left'; return <Link className="list-item train-choice" key={signal.id} to={`/train/prepare/${encodeURIComponent(signal.id)}?location=${location}&side=${item?.side ?? defaultSide}`}>
        <span className="number number--small">{signal.officialNumber}</span><span><strong>{signal.name}</strong><small>{index === 0 && item ? `Recomendada · ${item.reason}` : item ? 'Disponible para elegir' : 'Elección manual · comprueba el material necesario'}</small></span><span aria-hidden="true">›</span>
      </Link>; })}
    </div>
  </>;
}

export function PreparePage() {
  const { signalId = '' } = useParams();
  const signal = getSignal(signalId);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const settings = useLiveData(ensureSettings, [], undefined);
  const activeDog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const contentDefaultSide: Side = signal.trainingSideMode === 'both' || signal.trainingSideMode === 'left-only'
    ? 'left' : signal.trainingSideMode === 'right-only' ? 'right' : 'not-applicable';
  const defaultSide: Side = (params.get('side') as Side | null) ?? contentDefaultSide;
  const [side, setSide] = useState<Side>(defaultSide);
  const [chosenLocation, setChosenLocation] = useState<Location | null>((params.get('location') as Location | null) ?? null);
  const location = chosenLocation ?? settings?.preferredLocation ?? 'home';
  const [objective, setObjective] = useState<SessionObjective>('learn');
  const [busy, setBusy] = useState(false);
  const usefulMaterials = signal.materials.filter((item) => item.usefulForLearning || item.requiredForFinalExecution);

  async function begin() {
    if (!activeDog) return;
    setBusy(true);
    try {
      const session = await startSession({ dogId: activeDog.id, signalId: signal.id, signalRevisionId: signal.revisionId, compatibilityKey: signal.progressCompatibilityKey, side, objective, location });
      navigate(`/session/${session.id}`);
    } catch (error) {
      const active = await db.sessions.where('status').equals('active').first();
      if (active) navigate(`/session/${active.id}`);
      else throw error;
    }
  }

  return <>
    <Link className="back-link" to="/train">‹ Cambiar señal</Link>
    <div className="detail-title"><span className="number">{signal.officialNumber}</span><div><p className="eyebrow">Preparar sesión</p><h1>{signal.name}</h1></div></div>
    <section className="card"><h2>Antes de empezar</h2><dl className="prep-list"><div><dt>Duración</dt><dd>15 minutos máximo</dd></div><div><dt>Espacio</dt><dd>{signal.space === 'static' ? 'Muy reducido' : 'Recorrido corto'}</dd></div><div><dt>Material</dt><dd>{usefulMaterials.length ? usefulMaterials.map((item) => materialLabels[item.id] ?? item.id).join(', ') : 'Nada especial'}</dd></div></dl></section>
    {signal.trainingSideMode === 'both' && <fieldset><legend>Lado</legend><div className="segmented"><button className={side === 'left' ? 'active' : ''} onClick={() => setSide('left')}>Izquierdo</button><button className={side === 'right' ? 'active' : ''} onClick={() => setSide('right')}>Derecho</button></div></fieldset>}
    <label>Objetivo<select value={objective} onChange={(event) => setObjective(event.target.value as SessionObjective)}>{(Object.keys(objectiveLabels) as SessionObjective[]).map((value) => <option key={value} value={value}>{objectiveLabels[value]}</option>)}</select></label>
    <label>Lugar<select value={location} onChange={(event) => setChosenLocation(event.target.value as Location)}>{(Object.keys(locationLabels) as Location[]).map((value) => <option key={value} value={value}>{locationLabels[value]}</option>)}</select></label>
    <p className="tip"><strong>Plan:</strong> 2 min de activación · 10–11 min de trabajo · 2–3 min de cierre positivo.</p>
    <button className="button button--primary" onClick={begin} disabled={busy}>{busy ? 'Preparando…' : 'Empezar sesión'}</button>
  </>;
}
