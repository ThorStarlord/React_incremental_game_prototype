import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerStats from '../PlayerStats';
import { GameStateContext, GameDispatchContext } from '../../context/GameStateContext';

describe('PlayerStats', () => {
  const mockDispatch = jest.fn();
  const defaultPlayerState = {
    player: {
      name: 'Test Player',
      hp: 100,
      attack: 10,
      defense: 5,
      essence: 50,
      gold: 1000,
      statPoints: 3
    }
  };

  const renderPlayerStats = (state = defaultPlayerState) => {
    return render(
      <GameStateContext.Provider value={state}>
        <GameDispatchContext.Provider value={mockDispatch}>
          <PlayerStats />
        </GameDispatchContext.Provider>
      </GameStateContext.Provider>
    );
  };

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('renders player stats correctly', () => {
    renderPlayerStats();
    
    expect(screen.getByText(/Test Player/)).toBeInTheDocument();
    expect(screen.getByText(/HP: 100/)).toBeInTheDocument();
    expect(screen.getByText(/Attack: 10/)).toBeInTheDocument();
    expect(screen.getByText(/Defense: 5/)).toBeInTheDocument();
    expect(screen.getByText(/Essence: 50/)).toBeInTheDocument();
    expect(screen.getByText(/Gold: 1000/)).toBeInTheDocument();
  });

  it('expands and collapses accordion when clicked', () => {
    renderPlayerStats();
    
    const accordionButton = screen.getByRole('button', { name: /Player Stats/i });
    
    // Initially expanded
    expect(screen.getByText(/HP: 100/)).toBeVisible();
    
    // Click to collapse
    fireEvent.click(accordionButton);
    expect(screen.queryByText(/HP: 100/)).not.toBeVisible();
    
    // Click to expand
    fireEvent.click(accordionButton);
    expect(screen.getByText(/HP: 100/)).toBeVisible();
  });

  it('maintains state between renders', () => {
    const { rerender } = renderPlayerStats();
    
    const updatedState = {
      player: {
        ...defaultPlayerState.player,
        hp: 150,
        attack: 15
      }
    };

    rerender(
      <GameStateContext.Provider value={updatedState}>
        <GameDispatchContext.Provider value={mockDispatch}>
          <PlayerStats />
        </GameDispatchContext.Provider>
      </GameStateContext.Provider>
    );

    expect(screen.getByText(/HP: 150/)).toBeInTheDocument();
    expect(screen.getByText(/Attack: 15/)).toBeInTheDocument();
  });

  // New test cases
  it('displays correct number of stat points', () => {
    const stateWithStatPoints = {
      player: {
        ...defaultPlayerState.player,
        statPoints: 5
      }
    };
    renderPlayerStats(stateWithStatPoints);
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('handles player with no stat points correctly', () => {
    const stateWithNoStatPoints = {
      player: {
        ...defaultPlayerState.player,
        statPoints: 0
      }
    };
    renderPlayerStats(stateWithNoStatPoints);
    expect(screen.queryByText(/statPoints: 0/)).toBeInTheDocument();
  });

  it('handles negative values correctly', () => {
    const stateWithNegativeValues = {
      player: {
        ...defaultPlayerState.player,
        hp: -10,
        gold: -50
      }
    };
    renderPlayerStats(stateWithNegativeValues);
    expect(screen.getByText(/HP: -10/)).toBeInTheDocument();
    expect(screen.getByText(/Gold: -50/)).toBeInTheDocument();
  });

  it('handles empty player name', () => {
    const stateWithEmptyName = {
      player: {
        ...defaultPlayerState.player,
        name: ''
      }
    };
    renderPlayerStats(stateWithEmptyName);
    expect(screen.getByText(/Name:/)).toBeInTheDocument();
  });

  it('applies correct styling to accordion header', () => {
    renderPlayerStats();
    const header = screen.getByRole('button', { name: /Player Stats/i });
    const styles = window.getComputedStyle(header);
    expect(styles.backgroundColor).toBe('lightblue');
    expect(styles.color).toBe('white');
  });
});