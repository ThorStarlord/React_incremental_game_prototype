/**
 * Game State Exports - Central hub for game state management
 * Provides unified access to all game state contexts, hooks, actions, and types
 */

// Import from the correct source files
import GameProvider from './GameProvider';
import GameStateContext, { useGameState, useGameStateSelector, EnhancedGameState } from './GameStateContext';
import GameDispatchContext, { useGameDispatch, GameAction } from './GameDispatchContext';
import { ACTION_TYPES } from './actions/actionTypes';
import { 
  GameState, 
  PlayerState, 
  PlayerStats,
  PlayerAttributes,
  ResourceState,
  InventoryState,
  EquipmentState,
  ProgressionState,
  CombatState,
  SettingsState,
  StatisticsState,
  MetaState
} from './types/GameStateTypes';
import { PlayerInitialState, resetPlayerState } from './initialStates/PlayerInitialState';
import { ThemeContext, useTheme, ThemeProviderWrapper } from './ThemeContext';

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
  ACTION_TYPES,
  PlayerInitialState,
  resetPlayerState
};

/**
 * Helper function to create consistent actions with proper typing
 * 
 * @param type - The action type identifier, typically from ACTION_TYPES enum
 * @param payload - Optional data to include with the action
 * @returns A properly formatted action object
 */
export const createAction = <T = any>(type: string, payload: T): GameAction => ({
  type,
  payload
});

// Re-export types (originally defined in GameStateTypes.ts)
export type {
  GameState,
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  ResourceState,
  InventoryState,
  EquipmentState,
  ProgressionState,
  CombatState,
  SettingsState,
  StatisticsState,
  MetaState,
  EnhancedGameState,
  GameAction
};
