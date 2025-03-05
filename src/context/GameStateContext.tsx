import { createContext, useContext } from 'react';
import { GameState, initialState } from './initialState';
import { EnhancedGameState } from './GameProvider';

// Create the context with the proper type and default value
// Use a type assertion to make TypeScript happy with the default value
const GameStateContext = createContext<EnhancedGameState>(initialState as unknown as EnhancedGameState);

/**
 * Custom hook for accessing the game state with proper typing
 */
export const useGameState = (): EnhancedGameState => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

/**
 * Helper hook for selecting specific parts of state
 * @param selector - Function that extracts a part of the state
 * @returns The selected portion of state
 * 
 * @example
 * const playerHealth = useGameStateSelector(state => state.player.health);
 */
export const useGameStateSelector = <T,>(selector: (state: EnhancedGameState) => T): T => {
  const state = useGameState();
  return selector(state);
};

export default GameStateContext;
