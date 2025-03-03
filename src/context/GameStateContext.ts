import { createContext, useContext } from 'react';
import { GameState, initialState } from './initialState';

/**
 * Context for storing and accessing the current game state throughout the application
 * Uses the GameState interface to provide proper TypeScript typing
 */
const GameStateContext = createContext<GameState>(initialState);

/**
 * Custom hook for accessing the game state with proper typing
 * @returns The current game state
 * @throws Error if used outside of a GameStateContext.Provider
 */
export const useGameState = (): GameState => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

/**
 * Custom hook for accessing a specific part of the game state
 * @param selector A function that selects a portion of the game state
 * @returns The selected portion of the state
 * @throws Error if used outside of a GameStateContext.Provider
 */
export function useGameStateSelector<Selected>(
  selector: (state: GameState) => Selected
): Selected {
  const state = useGameState();
  return selector(state);
}

// Example usage:
// const playerStats = useGameStateSelector(state => state.player.stats);
// const inventory = useGameStateSelector(state => state.inventory);
// const isInCombat = useGameStateSelector(state => state.combat.inCombat);

export default GameStateContext;
