import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSignal, signals } from '../content/signals';
import { db, ensureSettings, startStructuredSession } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import type { Location, Side, TrainingMode } from '../domain/types';
import { OfficialSignalSign } from '../components/OfficialSignalSign';

const locationLabels: Record<Location, string> = { home: 'Casa', 'outdoor-small': 'Exterior reducido', club: 'Club' };
const regulationLabels: Record<string, string> = {
  all: 'Todos los grados',
  'rsce:debutante': 'RSCE Debutante',
  'rsce:grade-1': 'RSCE Grado 1',
  'rsce:grade-2': 'RSCE Grado 2',
  'rsce:grade-3': 'RSCE Grado 3',
  'fci:international': 'FCI Internacional'
};

function defaultSide(signal: ReturnType<typeof getSignal>): Side {
  if (signal.trainingSideMode === 'right-only') return 'right';
  if (signal.trainingSideMode === 'not-applicable') return 'not-applicable';
  return 'left';
}

function signalLevel(signal: ReturnType<typeof getSignal>): string {
  const rsce = signal.assignments.find((item) => item.regulationId.startsWith('rsce:'));
  return rsce ? regulationLabels[rsce.regulationId] : 'FCI Internacional';
}

export function TrainPage() {
  const [params] = useSearchParams();
  const preset = params.get('select');
  const [query, setQuery] = useState('');
  const [regulation, setRegulation] = useState('all');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(() => new Set(preset && signals.some((signal) => signal.id === preset) ? [preset] : []));
  const categories = useMemo(() => [...new Set(signals.map((signal) => signal.exerciseArea))].sort(), []);
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    return signals.filter((signal) => {
      const matchesText = !normalized || `${signal.officialNumber} ${signal.name}`.toLocaleLowerCase('es').includes(normalized);
      const matchesRegulation = regulation === 'all' || signal.assignments.some((item) => item.regulationId === regulation);
      return matchesText && matchesRegulation && (category === 'all' || signal.exerciseArea === category);
    }).sort((a, b) => a.officialNumber.localeCompare(b.officialNumber, 'es', { numeric: true }));
  }, [query, regulation, category]);

  function toggle(signalId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(signalId)) next.delete(signalId); else next.add(signalId);
      return next;
    });
  }

  function selectVisible() {
    setSelected((current) => {
      const allVisibleSelected = visible.every((signal) => current.has(signal.id));
      const next = new Set(current);
      visible.forEach((signal) => allVisibleSelected ? next.delete(signal.id) : next.add(signal.id));
      return next;
    });
  }

  const preferredSide = params.get('side');
  const modeParams = [...selected].map((id) => `signals=${encodeURIComponent(id)}`).concat(preferredSide && preset && selected.has(preset) ? [`preferredSignal=${encodeURIComponent(preset)}`, `preferredSide=${encodeURIComponent(preferredSide)}`] : []).join('&');
  return <>
    <div className="page-heading"><p className="eyebrow">Nueva sesión</p><h1>Selecciona las señales</h1><p>Elige una o varias. Puedes cambiar la recomendación en cualquier momento.</p></div>
    <div className="signal-filters">
      <label>Buscar señal<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Número o nombre" /></label>
      <div className="filter-row">
        <label>Grado<select value={regulation} onChange={(event) => setRegulation(event.target.value)}>{Object.entries(regulationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Todas</option>{categories.map((value) => <option key={value} value={value}>Área {value}</option>)}</select></label>
      </div>
      <div className="selection-toolbar"><strong>{selected.size} seleccionada{selected.size === 1 ? '' : 's'}</strong><button className="text-button" type="button" onClick={selectVisible} disabled={!visible.length}>{visible.every((signal) => selected.has(signal.id)) ? 'Quitar visibles' : 'Seleccionar visibles'}</button></div>
      {selected.size > 10 && <p className="notice">Has elegido más de 10 señales. La sesión será larga, aunque podrás pausarla o terminarla cuando quieras.</p>}
    </div>
    <div className="signal-selection-list">
      {visible.map((signal) => {
        const checked = selected.has(signal.id);
        return <button type="button" className={`signal-select-card${checked ? ' selected' : ''}`} key={signal.id} onClick={() => toggle(signal.id)} aria-pressed={checked}>
          <OfficialSignalSign signal={signal} compact />
          <span className="signal-select-copy"><strong>{signal.officialNumber} · {signal.name}</strong><small>{signalLevel(signal)} · Área {signal.exerciseArea}</small></span>
          <span className="selection-check" aria-hidden="true">{checked ? '✓' : '+'}</span>
        </button>;
      })}
      {!visible.length && <p className="empty-state">No hay señales con estos filtros.</p>}
    </div>
    <div className="sticky-action"><Link className={`button button--primary${selected.size ? '' : ' disabled'}`} aria-disabled={!selected.size} to={selected.size ? `/train/mode?${modeParams}` : '/train'}>Continuar con {selected.size || 0}</Link></div>
  </>;
}

export function TrainingModePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const settings = useLiveData(ensureSettings, [], undefined);
  const dog = useLiveData(async () => settings?.activeDogId ? db.dogs.get(settings.activeDogId) : undefined, [settings?.activeDogId], undefined);
  const selectedSignals = [...new Set(params.getAll('signals'))].map((id) => signals.find((signal) => signal.id === id)).filter((signal): signal is (typeof signals)[number] => Boolean(signal));
  const requestedLocation = params.get('location');
  const [chosenLocation, setChosenLocation] = useState<Location | null>(requestedLocation && Object.hasOwn(locationLabels, requestedLocation) ? requestedLocation as Location : null);
  const location = chosenLocation ?? settings?.preferredLocation ?? 'home';
  const preferredSignal = params.get('preferredSignal');
  const preferredSide = params.get('preferredSide');
  const [sides, setSides] = useState<Record<string, Side>>(() => Object.fromEntries(selectedSignals.map((signal) => [signal.id, signal.id === preferredSignal && (preferredSide === 'left' || preferredSide === 'right') ? preferredSide : defaultSide(signal)])));
  const [busy, setBusy] = useState<TrainingMode | null>(null);

  async function begin(mode: TrainingMode) {
    if (!dog || !selectedSignals.length) return;
    setBusy(mode);
    try {
      const session = await startStructuredSession({
        dogId: dog.id, mode, location,
        signals: selectedSignals.map((signal) => ({ signalId: signal.id, signalRevisionId: signal.revisionId, compatibilityKey: signal.progressCompatibilityKey, side: sides[signal.id] ?? defaultSide(signal) }))
      });
      navigate(`/session/${session.id}`);
    } catch (error) {
      const open = await db.sessions.where('status').anyOf('active', 'paused').first();
      if (open) navigate(`/session/${open.id}`); else throw error;
    } finally { setBusy(null); }
  }

  if (!selectedSignals.length) return <Navigate to="/train" replace />;
  return <>
    <Link className="back-link" to="/train">‹ Cambiar selección</Link>
    <div className="page-heading"><p className="eyebrow">Paso 2 de 2</p><h1>¿Cómo quieres entrenar?</h1><p>{selectedSignals.length} señal{selectedSignals.length === 1 ? '' : 'es'} · 10 intentos por señal.</p></div>
    <div className="selected-signal-strip">{selectedSignals.map((signal) => <div key={signal.id}><OfficialSignalSign signal={signal} compact /><span>{signal.officialNumber}</span></div>)}</div>
    {selectedSignals.some((signal) => signal.trainingSideMode === 'both') && <fieldset className="side-choice-list"><legend>Lado de trabajo</legend>{selectedSignals.filter((signal) => signal.trainingSideMode === 'both').map((signal) => <div key={signal.id}><span><strong>{signal.officialNumber}</strong> {signal.name}</span><div className="segmented"><button type="button" aria-pressed={sides[signal.id] === 'left'} className={sides[signal.id] === 'left' ? 'active' : ''} onClick={() => setSides((current) => ({ ...current, [signal.id]: 'left' }))}>Izquierdo</button><button type="button" aria-pressed={sides[signal.id] === 'right'} className={sides[signal.id] === 'right' ? 'active' : ''} onClick={() => setSides((current) => ({ ...current, [signal.id]: 'right' }))}>Derecho</button></div></div>)}</fieldset>}
    <label>Lugar<select value={location} onChange={(event) => setChosenLocation(event.target.value as Location)}>{Object.entries(locationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <div className="mode-grid">
      <button className="mode-card" disabled={busy !== null} onClick={() => begin('repetition')}><span className="mode-icon">10×</span><strong>Por repetición</strong><span>Completa 10 intentos seguidos de cada señal antes de pasar a la siguiente.</span><small>Ideal para aprender o corregir una habilidad.</small></button>
      <button className="mode-card" disabled={busy !== null} onClick={() => begin('circuit')}><span className="mode-icon">↻</span><strong>En circuito</strong><span>Realiza todas las señales una vez y repite el conjunto durante 10 vueltas.</span><small>Ideal para fluidez, cambios y preparación de recorridos.</small></button>
    </div>
    <p className="tip"><strong>Descansos:</strong> cada 15 minutos te recordaremos que puedes hacer una pausa. No es un límite de sesión.</p>
  </>;
}

export function PreparePage() {
  const { signalId = '' } = useParams();
  const [params] = useSearchParams();
  const selected = signals.some((signal) => signal.id === signalId) ? signalId : '';
  const query = new URLSearchParams();
  if (selected) query.append('signals', selected);
  const location = params.get('location');
  if (location) query.set('location', location);
  return <Navigate to={selected ? `/train/mode?${query.toString()}` : '/train'} replace />;
}
