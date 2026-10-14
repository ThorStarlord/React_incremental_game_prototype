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
