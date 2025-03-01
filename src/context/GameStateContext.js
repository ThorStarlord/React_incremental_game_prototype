import React, { createContext, useReducer, useContext } from 'react';
import GameDispatchContext from './GameDispatchContext';
import { rootReducer } from './reducers/rootReducer';
import { initialState } from './initialState';
import { ACTION_TYPES } from './actions/actionTypes';

// Lazy initializer to load from storage or fall back to initialState
function loadState() {
  try {
    const savedData = localStorage.getItem('gameState');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return {
        ...parsed,
        notifications: parsed.notifications || []
      };
    }
  } catch {}
  // Fallback
  return {
    ...initialState,
    notifications: initialState.notifications || []
  };
}

/**
 * GameStateContext
 * 
 * Purpose: Provides access to the global game state throughout the application.
 * 
 * This context:
 * 1. Stores the current state of the game (player data, resources, game time, etc.)
 * 2. Acts as a read-only source of truth for all components
 * 3. Is consumed by components that need to access but not modify state
 * 4. Prevents prop drilling by making state accessible at any level of the component tree
 */
export const GameStateContext = createContext(null); // Default value can be null

/**
 * GameProvider Component
 * 
 * This provider component wraps the application and provides both state and
 * dispatch contexts to all child components. It initializes the game state
 * using useReducer with the rootReducer and initialState.
 */
export function GameProvider({ children }) { // Functional component, takes children
  const [state, dispatch] = useReducer(rootReducer, initialState); // Initialize useReducer

  if (!state) { // Optional: Loading state handling
    return <div>Loading...</div>;
  }

  return (
    <GameStateContext.Provider value={state}> {/* Provide state */}
      <GameDispatchContext.Provider value={dispatch}> {/* Provide dispatch */}
        {children} {/* Render children components */}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

// Export contexts and provider for use in other components
/**
 * Action creator for adding essence to the player's reserves
 */
export const createEssenceAction = (amount) => ({
  type: ACTION_TYPES.GAIN_ESSENCE,
  payload: { amount }
});

export default GameStateContext;

// playerReducer.js  (Example of exporting reducer - you should have this in playerReducer.js)
export function playerReducer(state, action) {
  switch (action.type) {
    // ...
    default:
      return state;
  }
}