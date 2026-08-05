import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSignal, signals } from '../content/signals';
import { db, deleteCourse, saveCourse } from '../data/db';
import { useLiveData } from '../data/useLiveData';
import { validateCourseSignals } from '../domain/course';
import { OfficialSignalSign } from '../components/OfficialSignalSign';

export function CoursesPage() {
  const courses = useLiveData(() => db.courses.orderBy('updatedAt').reverse().toArray(), [], []);
  return <>
    <div className="page-heading"><p className="eyebrow">Recorridos de entrenamiento</p><h1>Mis pistas</h1><p>Prepara secuencias sencillas con el contenido Debutante revisado. No certifica recorridos de competición.</p></div>
    <Link className="button button--primary" to="/courses/new">Crear una pista</Link>
    <div className="list spaced-list">{courses.map((course) => <Link className="list-item" key={course.id} to={`/courses/${course.id}`}><span className="number number--small">▦</span><span><strong>{course.name}</strong><small>Debutante · Editada {new Date(course.updatedAt).toLocaleDateString('es-ES')}</small></span><span>›</span></Link>)}{!courses.length && <section className="card empty-state"><h2>Aún no hay pistas</h2><p>Empieza con pocas señales y aumenta la longitud cuando el recorrido sea cómodo.</p></section>}</div>
  </>;
}

export function CourseBuilderPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const existing = useLiveData(() => courseId && courseId !== 'new' ? db.courses.get(courseId) : Promise.resolve(undefined), [courseId], undefined);
  const existingItems = useLiveData(() => courseId && courseId !== 'new' ? db.courseItems.where('courseId').equals(courseId).sortBy('sequence') : Promise.resolve([]), [courseId], []);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existing && existingItems.length && loadedId !== existing.id) {
      setLoadedId(existing.id); setName(existing.name); setSelected(existingItems.map((item) => item.signalId));
    }
  }, [existing, existingItems, loadedId]);
  const effectiveSelected = selected;
  const debutanteSignals = signals.filter((signal) => signal.assignments.some((assignment) => assignment.regulationId === 'rsce:debutante'));

  function add(signalId: string) {
    if (effectiveSelected.length >= 10) return setError('Este incremento admite un máximo de 10 señales.');
    if (effectiveSelected.filter((id) => id === signalId).length >= 2) return setError('Una señal puede aparecer como máximo dos veces.');
    setSelected([...effectiveSelected, signalId]); setError('');
  }
  function move(index: number, delta: number) {
    const target = index + delta; if (target < 0 || target >= effectiveSelected.length) return;
    const copy = [...effectiveSelected]; [copy[index], copy[target]] = [copy[target], copy[index]]; setSelected(copy);
  }
  async function save() {
    const validationError = validateCourseSignals(effectiveSelected);
    if (validationError) return setError(validationError);
    const course = await saveCourse({ id: existing?.id, name, signalIds: effectiveSelected });
    navigate(`/courses/${course.id}`);
  }

  return <>
    <Link className="back-link" to="/courses">‹ Mis pistas</Link>
    <div className="page-heading"><p className="eyebrow">Constructor Debutante</p><h1>{existing ? 'Editar pista' : 'Nueva pista'}</h1><p>Ordena entre 1 y 10 señales. La misma señal puede repetirse dos veces.</p></div>
    <label>Nombre<input value={name} placeholder="Por ejemplo: Pista del martes" onChange={(event) => setName(event.target.value)} /></label>
    <h2 className="section-title">Secuencia · {effectiveSelected.length}/10</h2>
    <ol className="course-sequence">{effectiveSelected.map((signalId, index) => { const signal = getSignal(signalId); return <li key={`${signalId}-${index}`}><OfficialSignalSign signal={signal} compact /><strong>{signal.officialNumber} · {signal.name}</strong><span className="reorder"><button aria-label="Subir" onClick={() => move(index, -1)}>↑</button><button aria-label="Bajar" onClick={() => move(index, 1)}>↓</button><button aria-label="Quitar" onClick={() => setSelected(effectiveSelected.filter((_, itemIndex) => itemIndex !== index))}>×</button></span></li>; })}</ol>
    {error && <p className="notice" role="alert">{error}</p>}
    <h2 className="section-title">Añadir señal</h2>
    <div className="signal-picker">{debutanteSignals.map((signal) => <button key={signal.id} onClick={() => add(signal.id)}><OfficialSignalSign signal={signal} compact /><span><strong>{signal.officialNumber}</strong>{signal.name}</span></button>)}</div>
    <button className="button button--primary sticky-action" onClick={save}>Guardar pista</button>
  </>;
}

export function CourseDetailPage() {
  const { courseId = '' } = useParams(); const navigate = useNavigate();
  const course = useLiveData(() => db.courses.get(courseId), [courseId], undefined);
  const items = useLiveData(() => db.courseItems.where('courseId').equals(courseId).sortBy('sequence'), [courseId], []);
  if (!course) return <p>Cargando pista…</p>;
  return <>
    <Link className="back-link" to="/courses">‹ Mis pistas</Link>
    <div className="page-heading"><p className="eyebrow">Debutante · {items.length} señales</p><h1>{course.name}</h1><p>Vista de preparación. Comprueba el espacio y adapta distancias al perro.</p></div>
    <div className="course-preview">{items.map((item) => { const signal = getSignal(item.signalId); return <div key={item.id}><span>{item.sequence}</span><OfficialSignalSign signal={signal} compact /><strong>{signal.officialNumber} · {signal.name}</strong></div>; })}</div>
    <Link className="button button--secondary" to={`/courses/${course.id}/edit`}>Editar secuencia</Link>
    <button className="button button--ghost" onClick={async () => { if (window.confirm(`¿Eliminar la pista «${course.name}»?`)) { await deleteCourse(course.id); navigate('/courses'); } }}>Eliminar pista</button>
  </>;
}
