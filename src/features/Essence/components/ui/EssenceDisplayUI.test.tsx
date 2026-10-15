import React from 'react';
import { render, screen } from '@testing-library/react';
import EssenceDisplay from './EssenceDisplayUI';

describe('Essence generation rate presentation', () => {
  it('labels the canonical generation rate as per second, not per minute', () => {
    // EssenceState.generationRate is Essence per SECOND. No conversion is performed.
    render(<EssenceDisplay currentEssence={25} essenceRate={0.25} />);

    expect(screen.getByText(/\+0\.25\/sec/)).toBeTruthy();
    expect(screen.queryByText(/\/min/)).toBeNull();
  });

  it('preserves a zero-per-second rate rather than hiding it', () => {
    render(<EssenceDisplay currentEssence={0} essenceRate={0} />);

    expect(screen.getByText(/\+0\/sec/)).toBeTruthy();
  });
});


describe('uncapped Essence display', () => {
  it('does not invent a capacity or misleading progress for uncapped Essence', () => {
    render(<EssenceDisplay currentEssence={150} essenceRate={0.5} />);

    expect(screen.getByText('150')).toBeTruthy();
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.queryByText(/150\s*\/\s*1[,.]?000/)).toBeNull();
  });

  it('retains a meaningful progress bar when a genuine maximum is supplied', () => {
    render(<EssenceDisplay currentEssence={50} maxEssence={200} />);

    expect(screen.getByText(/50\s*\/\s*200/)).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('25');
  });

  it('does not treat an invalid maximum as a real capacity', () => {
    render(<EssenceDisplay currentEssence={1200} maxEssence={0} />);

    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
