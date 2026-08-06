import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { db, ensureSettings } from './data/db';
import './styles.css';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!reloading) { reloading = true; window.location.reload(); }
    });
    navigator.serviceWorker.register('./sw.js').then(async (registration) => {
      const offerUpdate = async (worker: ServiceWorker | null) => {
        if (!worker || await db.sessions.where('status').anyOf('active', 'paused').count()) return;
        if (window.confirm('Hay una versión nueva de Rally O Trainer. ¿Actualizar ahora?')) worker.postMessage({ type: 'SKIP_WAITING' });
      };
      await offerUpdate(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) void offerUpdate(worker);
        });
      });
    }).catch((error: unknown) => {
      console.error('No se pudo registrar el modo offline.', error);
    });
  });
}

async function startApp() {
  await ensureSettings();
  createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
}

void startApp();
