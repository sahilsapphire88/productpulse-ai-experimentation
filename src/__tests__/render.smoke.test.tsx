import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import { ExperimentProvider } from '../store/experimentStore';

describe('render smoke tests', () => {
  it('renders Landing page', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    expect(screen.getByText(/ExperimentLab/i)).toBeInTheDocument();
  });

  it('renders Dashboard page with provider', () => {
    render(
      <MemoryRouter>
        <ExperimentProvider>
          <Dashboard />
        </ExperimentProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Experiment Dashboard/i)).toBeInTheDocument();
  });

  it('displays synthetic data badge on Landing', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/SYNTHETIC/i).length).toBeGreaterThan(0);
  });
});
