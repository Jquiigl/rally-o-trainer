import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { InstructionsPage } from './InstructionsPage';

describe('instructions page', () => {
  it('explains the complete training flow and preserves the other capabilities', () => {
    render(<MemoryRouter><InstructionsPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Instrucciones de uso' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Configura el entrenamiento' })).toBeInTheDocument();
    expect(screen.getByText(/Entrenamiento individual/)).toBeInTheDocument();
    expect(screen.getByText(/Modo circuito/)).toBeInTheDocument();
    expect(screen.getByText(/Examen:/)).toBeInTheDocument();
    expect(screen.getByText(/Constructor de pistas:/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Configurar entrenamiento' })).toHaveAttribute('href', '/train');
  });
});
