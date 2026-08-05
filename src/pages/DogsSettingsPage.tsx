import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { downloadBackup, restoreBackup } from '../data/backup';
import { createDog, db, deleteAllData, deleteDog, ensureSettings, setActiveDog } from '../data/db';
import { useLiveData } from '../data/useLiveData';

export function DogsSettingsPage() {
  const dogs = useLiveData(() => db.dogs.filter((dog) => dog.archivedAt === null).sortBy('createdAt'), [], []);
  const settings = useLiveData(ensureSettings, [], undefined);
  const activeSession = useLiveData(() => db.sessions.where('status').equals('active').first(), [], undefined);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function add(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !breed.trim()) return;
    const dog = await createDog(name, breed);
    await setActiveDog(dog.id);
    setName(''); setBreed(''); setAdding(false);
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`¿Eliminar a ${name} y todos sus entrenamientos?`)) return;
    if (!window.confirm('Esta acción no se puede deshacer. ¿Confirmas el borrado?')) return;
    await deleteDog(id);
  }

  async function importFile(file?: File) {
    if (!file) return;
    if (!window.confirm('La restauración reemplazará todos los datos actuales. ¿Continuar?')) return;
    try { await restoreBackup(await file.text()); setMessage('Copia restaurada correctamente.'); }
    catch { setMessage('No se pudo restaurar: el archivo no es una copia válida.'); }
  }

  async function removeEverything() {
    if (!window.confirm('¿Borrar todos los perros, entrenamientos, pistas y ajustes de este dispositivo?')) return;
    if (!window.confirm('No se puede deshacer sin una copia. ¿Confirmas el borrado total?')) return;
    await deleteAllData();
  }

  return <>
    <Link className="back-link" to="/">‹ Inicio</Link>
    <div className="page-heading"><p className="eyebrow">Datos locales</p><h1>Perros y ajustes</h1><p>Sin cuentas: tú controlas todos los datos.</p></div>
    <section className="card"><div className="card-row"><h2>Perros</h2><button className="text-button" onClick={() => setAdding(!adding)}>+ Añadir</button></div>
      {adding && <form className="form-stack inset-form" onSubmit={add}><label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Raza<input value={breed} onChange={(event) => setBreed(event.target.value)} required /></label><button className="button button--primary">Guardar</button></form>}
      {activeSession && <p className="notice">Finaliza la sesión activa antes de cambiar de perro o eliminar al que está entrenando.</p>}
      <div className="dog-list">{dogs.map((dog) => { const blocked = Boolean(activeSession && activeSession.dogId !== dog.id); const activeDogInSession = activeSession?.dogId === dog.id; return <div key={dog.id}><button disabled={blocked} className={`dog-select ${settings?.activeDogId === dog.id ? 'active' : ''}`} onClick={() => setActiveDog(dog.id)}><span>{settings?.activeDogId === dog.id ? '✓' : '○'}</span><span><strong>{dog.name}</strong><small>{dog.breed}</small></span></button>{dogs.length > 1 && <button disabled={activeDogInSession} className="delete-button" aria-label={`Eliminar a ${dog.name}`} onClick={() => remove(dog.id, dog.name)}>Eliminar</button>}</div>; })}</div>
    </section>
    <section className="card"><h2>Apariencia</h2><label>Tema<select value={settings?.theme ?? 'system'} onChange={(event) => db.settings.update('settings', { theme: event.target.value as 'system' | 'light' | 'dark', updatedAt: Date.now() })}><option value="system">Según el dispositivo</option><option value="light">Claro</option><option value="dark">Oscuro</option></select></label></section>
    <section className="card"><h2>Contexto de entrenamiento</h2><label>Lugar habitual<select value={settings?.preferredLocation ?? 'home'} onChange={(event) => db.settings.update('settings', { preferredLocation:event.target.value as 'home' | 'outdoor-small' | 'club', updatedAt:Date.now() })}><option value="home">Casa</option><option value="outdoor-small">Exterior reducido</option><option value="club">Club</option></select></label><h3>Material disponible</h3><p>Es opcional. Solo ajusta las recomendaciones; nunca impide elegir una señal.</p><div className="check-list">{[['cone','Conos'],['jump','Salto'],['distractions','Distracciones'],['ground-marker','Referencia de suelo'],['natural-marker','Elementos naturales']].map(([id,label]) => <label key={id}><input type="checkbox" checked={settings?.availableMaterialIds.includes(id) ?? false} onChange={(event) => { const current = settings?.availableMaterialIds ?? []; const next = event.target.checked ? [...new Set([...current,id])] : current.filter((item) => item !== id); db.settings.update('settings', { availableMaterialIds:next, updatedAt:Date.now() }); }} />{label}</label>)}</div></section>
    <section className="card"><h2>Copias de seguridad</h2><p>Guarda periódicamente un archivo fuera de la aplicación.</p><button className="button button--secondary" onClick={downloadBackup}>Exportar copia completa</button><button className="button button--ghost" onClick={() => fileRef.current?.click()}>Restaurar una copia</button><input ref={fileRef} className="sr-only" type="file" accept="application/json,.json" onChange={(event) => importFile(event.target.files?.[0])} />{message && <p role="status" className="notice">{message}</p>}</section>
    <section className="card legal-note"><h2>Sobre el contenido</h2><p>Rally O Trainer es una herramienta basada en fuentes RSCE/FCI. Sus explicaciones son redacción propia y no sustituyen los reglamentos oficiales.</p></section>
    <section className="card danger-zone"><h2>Borrar todos los datos</h2><p>Elimina perros, sesiones, progreso, pistas y configuración únicamente de este dispositivo.</p><button className="button button--danger" onClick={removeEverything}>Borrar todo</button></section>
  </>;
}
