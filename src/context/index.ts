/**
 * Context index file - exports all context-related hooks and providers
 * Provides unified access to game state management functionality
 */

// Import from the consolidated GameProvider file
import GameProvider, { 
  useGameState, 
  useGameDispatch, 
  GameStateContext, 
  GameDispatchContext 
} from './GameProvider';

import { ThemeContext, useTheme, ThemeProviderWrapper } from './ThemeContext';
import { ACTION_TYPES } from './actions/actionTypes';

// Export everything explicitly
export { 
  GameStateContext, 
  useGameState,
  GameDispatchContext,
  useGameDispatch, 
  GameProvider,
  ThemeContext, 
  useTheme, 
  ThemeProviderWrapper,
  ACTION_TYPES 
};

// Define type for action objects
export interface GameAction<T = any> {
  type: string;
  payload?: T;
}

/**
 * Helper function to create consistent actions with proper typing
 * 
 * @param type - The action type identifier, typically from ACTION_TYPES enum
 * @param payload - Optional data to include with the action
 * @returns A properly formatted action object
 */
export const createAction = <T = any>(type: string, payload: T = {} as T): GameAction<T> => ({
  type,
  payload
});

// Re-export types from initialState for convenience
export type { GameState, PlayerState, PlayerStats } from './initialState';
