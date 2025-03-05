/**
 * Context index file
 * 
 * This file exports all context-related hooks, providers, and utilities
 * to provide a clean, centralized import for the rest of the application.
 */

// Re-export from the correctly cased file
export * from './GameContext';

// Export default components explicitly 
import GameProvider from './GameProvider';
import GameStateContext from './GameStateContext';
import GameDispatchContext from './GameDispatchContext';
import { ThemeProviderWrapper } from './ThemeContext';

export {
  GameProvider,
  GameStateContext,
  GameDispatchContext,
  ThemeProviderWrapper
};

// Export default for convenience
export default GameProvider;
