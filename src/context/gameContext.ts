/**
 * Game Context - exports all context-related hooks and providers
 * Provides unified access to game state management functionality
 */

// Import from the correct source files
import GameProvider from './GameProvider';
import GameStateContext, { useGameState, useGameStateSelector } from './GameStateContext';
import GameDispatchContext, { useGameDispatch, GameAction as DispatchGameAction } from './GameDispatchContext';
import { EnhancedGameState } from './GameProvider';
import { ThemeContext, useTheme, ThemeProviderWrapper } from './ThemeContext';
import { ACTION_TYPES } from './actions/actionTypes';

// Export everything explicitly
export { 
  GameStateContext, 
  useGameState,
  useGameStateSelector,
  GameDispatchContext,
  useGameDispatch, 
  GameProvider,
  ThemeContext, 
  useTheme, 
  ThemeProviderWrapper,
  ACTION_TYPES 
};

// Define type for action objects (using the one from GameDispatchContext)
export type GameAction<T = any> = DispatchGameAction;

/**
 * Helper function to create consistent actions with proper typing
 * 
 * @param type - The action type identifier, typically from ACTION_TYPES enum
 * @param payload - Optional data to include with the action
 * @returns A properly formatted action object
 */
export const createAction = <T = any>(type: string, payload: T): GameAction<T> => ({
  type,
  payload
});

// Re-export types from initialState and GameProvider
export type { GameState, PlayerState, PlayerStats } from './initialState';
export type { EnhancedGameState };
