import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OfficialSignalSign } from '../components/OfficialSignalSign';
import { commonSignalErrors } from '../content/commonSignalErrors';
import { getSignal, signals } from '../content/signals';

export function SignalsPage() {
  const [query, setQuery] = useState('');
  const [authority, setAuthority] = useState<'rsce' | 'fci'>('rsce');
  const [ruleset, setRuleset] = useState('rsce:debutante');
  const activeRuleset = authority === 'fci' ? 'fci:international' : ruleset;
  const totalByRuleset: Record<string, number> = { 'rsce:debutante': 33, 'rsce:grade-1': 55, 'rsce:grade-2': 78, 'rsce:grade-3': 89, 'fci:international': 89 };
  const available = signals.filter((signal) => signal.assignments.some((assignment) => assignment.regulationId === activeRuleset));
  const filtered = useMemo(() => available.filter((signal) =>
    `${signal.officialNumber} ${signal.name}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))
  ), [query, activeRuleset]);
  return <>
    <div className="page-heading"><p className="eyebrow">Biblioteca</p><h1>Señales</h1><p>RSCE tiene prioridad; FCI se consulta en una pestaña independiente.</p></div>
    <div className="segmented" aria-label="Autoridad"><button className={authority === 'rsce' ? 'active' : ''} onClick={() => setAuthority('rsce')}>RSCE</button><button className={authority === 'fci' ? 'active' : ''} onClick={() => setAuthority('fci')}>FCI internacional</button></div>
    {authority === 'rsce' && <div className="grade-tabs" aria-label="Grado RSCE">{[
      ['rsce:debutante','Debutante'],['rsce:grade-1','Grado 1'],['rsce:grade-2','Grado 2'],['rsce:grade-3','Grado 3']
    ].map(([id,label]) => <button key={id} className={ruleset === id ? 'active' : ''} onClick={() => setRuleset(id)}>{label}</button>)}</div>}
    <p className="content-coverage"><strong>{available.length} de {totalByRuleset[activeRuleset]}</strong> fichas revisadas disponibles.{available.length < totalByRuleset[activeRuleset] ? ' Las restantes están redactadas, pero ocultas hasta completar tu revisión editorial.' : ''}</p>
    <label className="search"><span className="sr-only">Buscar señal</span><input type="search" placeholder="Número o nombre" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <div className="list">
      {filtered.map((signal) => <Link className="list-item" key={signal.id} to={`/signals/${encodeURIComponent(signal.id)}`}>
        <OfficialSignalSign signal={signal} compact /><span><strong>{signal.officialNumber} · {signal.name}</strong><small>{signal.plainExplanation}</small><span className="list-cta">Ver señal oficial, descripción y errores</span></span><span aria-hidden="true">›</span>
      </Link>)}
    </div>
  </>;
}

export function SignalDetailPage() {
  const { signalId = '' } = useParams();
  const signal = getSignal(signalId);
  return <article>
    <Link className="back-link" to="/signals">‹ Señales</Link>
    <div className="detail-title"><span className="number">{signal.officialNumber}</span><div><p className="eyebrow">Grupo {signal.exerciseGroup} · Área {signal.exerciseArea}</p><h1>{signal.name}</h1></div></div>
    <OfficialSignalSign signal={signal} />
    <section className="card"><h2>En palabras sencillas</h2><p>{signal.plainExplanation}</p></section>
    <section className="card"><h2>Descripción reglamentaria</h2><p>{signal.regulatoryDescription}</p><p className="source-note">Redacción propia fiel al reglamento. No sustituye la fuente oficial.</p></section>
    <section className="card card--accent"><h2>Consejo de entrenamiento</h2><p>{signal.trainingAdvice}</p></section>
    <section className="card"><h2>Qué observar</h2><ul>{signal.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></section>
    <section className="card"><h2>Errores frecuentes</h2><ul>{commonSignalErrors(signal).map((error) => <li key={error}>{error}</li>)}</ul></section>
    <Link className="button button--primary" to={`/train/prepare/${encodeURIComponent(signal.id)}`}>Entrenar esta señal</Link>
  </article>;
}
