import React, { createContext, useContext } from 'react';
import { GameState, initialState } from './initialState';

// Create context with explicit initial value
const GameStateContext = createContext<GameState>(initialState);

/**
 * Custom hook for accessing the game state
 */
export const useGameState = (): GameState => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

/**
 * Helper hook for selecting specific parts of state
 */
export const useGameStateSelector = <T,>(selector: (state: GameState) => T): T => {
  const state = useGameState();
  return selector(state);
};

export default GameStateContext;
