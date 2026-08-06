import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { APP_VERSION } from '../config/app';
import { AuthorshipPage } from './AuthorshipPage';

describe('authorship and intellectual property', () => {
  it('separates original application authorship from third-party materials', () => {
    render(<MemoryRouter><AuthorshipPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Autoría y propiedad intelectual' })).toBeInTheDocument();
    expect(screen.getByText('José María Quirós Iglesias', { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText(APP_VERSION, { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText(/no constituye un producto oficial de la RSCE ni de la FCI/)).toBeInTheDocument();
    expect(screen.getByText(/no reivindica ningún derecho de propiedad intelectual/)).toBeInTheDocument();
  });
});
