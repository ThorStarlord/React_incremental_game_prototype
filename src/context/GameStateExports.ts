import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';

/**
 * Compatibility layer for transitioning from Context API to Redux
 * 
 * This file provides exports that mimic the old context-based GameState exports
 * but internally use Redux for state management.
 */

// Types from context that might be needed
export interface GameStateContextType {
  player: any;
  world: any;
  settings?: any;
  [key: string]: any;
}

// Hooks that mimic context usage
export const useGameState = (): GameStateContextType => {
  const player = useSelector((state: RootState) => state.player);
  const essence = useSelector((state: RootState) => state.essence);
  const traits = useSelector((state: RootState) => state.traits);
  
  // Return an object that mimics the old context structure
  return {
    player,
    essence,
    traits,
    // Add other slices as needed
    world: {},  // Placeholder until world slice is implemented
    settings: {} // Placeholder until settings slice is implemented
  };
};

// For updating state - provides a dispatch function similar to context
export const useGameDispatch = () => {
  return useDispatch();
};

// Export any specific actions that were commonly used with the old context
export const gameStateActions = {
  // Define actions here that map to Redux actions
};

// Constants that might have been in the original exports
export const GAME_VERSION = '0.1.0';

// Re-export any utility functions that might have been in the original exports
export * from './initialStates';
