import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SignalDetailPage, SignalsPage } from './SignalsPage';

describe('signal library', () => {
  it('separates RSCE levels and the FCI tab without exposing drafts', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignalsPage /></MemoryRouter>);
    expect(screen.getByText(/33 de 33/)).toBeInTheDocument();
    expect(screen.getByText(/Frente, regreso por detrás sin parada/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Grado 1' }));
    expect(screen.getByText(/33 de 55/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'FCI internacional' }));
    expect(screen.getByText(/22 de 89/)).toBeInTheDocument();
    expect(screen.queryByText(/Frente, regreso por detrás sin parada/)).not.toBeInTheDocument();
  });

  it('clearly distinguishes own regulatory wording from the official source', () => {
    render(<MemoryRouter initialEntries={['/signals/fci%3Asignal%3A101']}><Routes><Route path="/signals/:signalId" element={<SignalDetailPage />} /></Routes></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Descripción reglamentaria' })).toBeInTheDocument();
    expect(screen.getByText(/Redacción propia fiel al reglamento/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'En palabras sencillas' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Consejo de entrenamiento' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Esquema propio/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Errores frecuentes' })).toBeInTheDocument();
    expect(screen.getByText('Sentar al perro antes de pedir el tumbado.')).toBeInTheDocument();
  });
});
