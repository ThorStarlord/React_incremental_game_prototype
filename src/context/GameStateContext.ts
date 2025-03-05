import { createContext, useContext } from 'react';
import { GameState, initialState } from './initialState';

// Create the context with the proper type and default value
const GameStateContext = createContext<GameState>(initialState);

/**
 * Custom hook for accessing the game state with proper typing
 */
export const useGameState = (): GameState => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

// Selector hook implementation
export function useGameStateSelector<Selected>(
  selector: (state: GameState) => Selected
): Selected {
  const state = useGameState();
  return selector(state);
}

// Export only as default
export default GameStateContext;
