import { createContext, useContext } from 'react';
import GameStateContext from './GameStateContext';

/**
 * GameDispatchContext
 * 
* Purpose: Provides the dispatch function throughout the application to update game state.
 * 
 * This context:
 * 1. Stores the dispatch function from useReducer
 * 2. Allows components to trigger state changes without direct access to state
 * 3. Provides a clean way to separate state reading from state updating
 * 4. Should be used with action creators to maintain code organization
 * 5. Enables components deep in the tree to dispatch actions without prop drilling
 */
const GameDispatchContext = createContext(null);

/**
 * Custom hook to access the game state
 * Provides type safety and helpful error messages if used outside provider
 */
export function useGameState() {
  const state = useContext(GameStateContext);
  if (state === null) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return state;
}

/**
 * Custom hook to access the dispatch function
 * Provides type safety and helpful error messages if used outside provider
 */
export function useGameDispatch() {
  const dispatch = useContext(GameDispatchContext);
  if (dispatch === null) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return dispatch;
}

export default GameDispatchContext;