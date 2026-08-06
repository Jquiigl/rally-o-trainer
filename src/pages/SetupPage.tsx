import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createDog } from '../data/db';

export function SetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !breed.trim()) return;
    setBusy(true);
    await createDog(name, breed);
    navigate('/');
  }

  return <section className="center-card setup">
    <img className="setup-logo" src="./brand-symbol.png" alt="" />
    <h1 className="setup-brand">Rally O Trainer</h1>
    <p className="eyebrow">Tu entrenador personal</p>
    <h2 className="setup-question">Empecemos por tu perro</h2>
    <p>Solo necesitamos dos datos. Permanecerán en este dispositivo.</p>
    <form onSubmit={submit} className="form-stack">
      <label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" maxLength={40} required /></label>
      <label>Raza<input value={breed} onChange={(event) => setBreed(event.target.value)} autoComplete="off" maxLength={60} required /></label>
      <button className="button button--primary" disabled={busy}>{busy ? 'Guardando…' : 'Crear perfil'}</button>
    </form>
    <div className="setup-legal"><p>© 2026 José María Quirós Iglesias. Desarrollo independiente. Todos los derechos reservados sobre los elementos originales de la aplicación.</p><Link to="/authorship">Autoría y propiedad intelectual</Link></div>
  </section>;
}
