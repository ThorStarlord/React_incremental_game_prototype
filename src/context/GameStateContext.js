import React, { createContext, useReducer, useContext } from 'react';
import rootReducer from './reducers/rootReducer';
import { initialState } from './initialState';

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

export const GameStateContext = createContext();
export const GameDispatchContext = createContext();

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(rootReducer, initialState, loadState);

  // ...rest of your code that references state.notifications safely...

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

export const createEssenceAction = (amount) => ({
  type: 'GAIN_ESSENCE',
  payload: amount
});

// playerReducer.js
export function playerReducer(state, action) {
  switch (action.type) {
    // ...
    default:
      return state; // Return the full state, not just part of it
  }
}