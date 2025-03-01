import React, { useReducer, useEffect } from 'react';
import GameStateContext from './GameStateContext';
import GameDispatchContext from './GameDispatchContext';
import rootReducer from './reducers/rootReducer';
import { initialState } from './initialState';
import { ACTION_TYPES } from './actions/actionTypes';

/**
 * Game Provider Component
 * 
 * Purpose: Sets up the game state management system and provides both state and
 * dispatch function to the application via React Context.
 * 
 * This component:
 * 1. Initializes the game state using useReducer with rootReducer and initialState
 * 2. Handles loading saved game data from localStorage on mount
 * 3. Saves game state to localStorage when it changes
 * 4. Provides both state and dispatch to child components via context
 */
const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(rootReducer, initialState);

  // Load saved game on mount
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem('savedGame');
      if (savedGame) {
        const parsedSavedGame = JSON.parse(savedGame);
        dispatch({
          type: ACTION_TYPES.INITIALIZE_GAME_DATA,
          payload: parsedSavedGame
        });
      }
    } catch (error) {
      console.error('Failed to load saved game:', error);
      // Optionally show an error notification to the user
    }
  }, []);

  // Save game state when it changes
  useEffect(() => {
    try {
      localStorage.setItem('savedGame', JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game:', error);
      // Optionally show an error notification to the user
    }
  }, [gameState]);

  return (
    <GameStateContext.Provider value={gameState}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

export default GameProvider;

// In your App.js or index.js:
import React from 'react';
import GameProvider from './context/GameProvider';
import Game from './Game';

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

// In any component that needs to access the game state or dispatch:
import React, { useContext } from 'react';
import GameStateContext from './context/GameStateContext';
import GameDispatchContext from './context/GameDispatchContext';
import { ACTION_TYPES } from './context/actions/actionTypes';

function PlayerComponent() {
  const gameState = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  const handleAdvanceTime = () => {
    dispatch({ type: ACTION_TYPES.ADVANCE_TIME });
  };
  
  return (
    <div>
      <h1>Player: {gameState.player.name}</h1>
      <p>Day: {gameState.gameTime.day}, Period: {gameState.gameTime.period}</p>
      <button onClick={handleAdvanceTime}>Advance Time</button>
    </div>
  );
}

// src/context/reducers/essenceReducer.js
import { ACTION_TYPES } from '../actions/actionTypes';

export const essenceReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_ESSENCE: {
      return {
        ...state,
        essence: state.essence + action.payload.amount,
      };
    }
    case ACTION_TYPES.SPEND_ESSENCE: {
      return {
        ...state,
        essence: state.essence - action.payload.amount,
      };
    }
    default:
      return state;
  }
};

// src/context/reducers/playerReducer.js
import { ACTION_TYPES } from '../actions/actionTypes';

export const playerReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_PLAYER: {
      return {
        ...state,
        ...action.payload, // Merge payload into the player state
      };
    }
    default:
      return state;
  }
};

// src/context/GameStateContext.js

import React, { createContext, useReducer, useContext } from 'react'; // Import necessary React hooks
import rootReducer from './reducers/rootReducer'; // Import your rootReducer
import { initialState } from './initialState'; // Import your initialState

// Create GameStateContext
export const GameStateContext = createContext(null); // Default value can be null

// Create GameDispatchContext
export const GameDispatchContext = createContext(null); // Default value can be null

export function GameProvider({ children }) { // Functional component, takes children
  const [state, dispatch] = useReducer(rootReducer, initialState); // Initialize useReducer

  if (!state) { // Optional: Loading state handling
    return <div>Loading...</div>;
  }

  return (
    <GameStateContext.Provider value={state}> {/* Provide state */}
      <GameDispatchContext.Provider value={dispatch}> {/* Provide dispatch */}
        {children} {/* Render children components */}
      </GameStateContext.Provider>
    </GameStateContext.Provider>
  );
}

// Export contexts and provider for use in other components
export const createEssenceAction = (amount) => ({ // Example action creator - you can add more here or in actionCreators.js
  type: 'GAIN_ESSENCE',
  payload: amount
});

// playerReducer.js  (Example of exporting reducer - you should have this in playerReducer.js)
export function playerReducer(state, action) {
  switch (action.type) {
    // ...
    default:
      return state;
  }
}

// src/App.js
import React, { useContext } from 'react';
import { GameProvider, GameStateContext, GameDispatchContext, createEssenceAction } from './context/GameStateContext'; // Import GameProvider and contexts

const App = () => {
  const gameState = useContext(GameStateContext); // Consume GameStateContext
  const dispatch = useContext(GameDispatchContext); // Consume GameDispatchContext

  const handleGainEssence = () => {
    dispatch(createEssenceAction(10)); // Dispatch an action using GameDispatchContext
  };

  return (
    <GameProvider> {/* Wrap your app with GameProvider */}
      <div className="App">
        <h1>Essence: {gameState.essence.essence}</h1> {/* Access state from GameStateContext */}
        <button onClick={handleGainEssence}>Gain 10 Essence</button>
        {/* ... rest of your App component */}
      </div>
    </GameProvider>
  );
};

export default App;