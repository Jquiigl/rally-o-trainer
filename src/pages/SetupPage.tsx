import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <p className="eyebrow">Tu entrenador personal</p>
    <h1>Empecemos por tu perro</h1>
    <p>Solo necesitamos dos datos. Permanecerán en este dispositivo.</p>
    <form onSubmit={submit} className="form-stack">
      <label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" maxLength={40} required /></label>
      <label>Raza<input value={breed} onChange={(event) => setBreed(event.target.value)} autoComplete="off" maxLength={60} required /></label>
      <button className="button button--primary" disabled={busy}>{busy ? 'Guardando…' : 'Crear perfil'}</button>
    </form>
  </section>;
}
