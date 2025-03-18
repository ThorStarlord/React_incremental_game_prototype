/**
 * @file GameContext.ts
 * @description Compatibility layer for legacy imports that use GameContext
 * 
 * This file re-exports all necessary context hooks and components from GameStateExports
 * to support backward compatibility with code importing from 'GameContext'.
 */

import {
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
  createAction
} from './GameStateExports';

// Re-export everything for backward compatibility
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
  createAction
};

// Export a default object for components that might use default import
export default {
  GameProvider,
  useGameState,
  useGameDispatch
};
