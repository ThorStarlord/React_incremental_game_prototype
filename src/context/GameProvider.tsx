import React, { useReducer, useEffect, ReactNode } from 'react';
import GameStateContext from './GameStateContext';
import GameDispatchContext from './GameDispatchContext';
import rootReducer from './reducers/rootReducer';
import { initialState, GameState } from './initialState';
import { ACTION_TYPES } from './actions/actionTypes';

interface GameProviderProps {
  children: ReactNode;
}

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
const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, dispatch] = useReducer(rootReducer, initialState);

  // Load saved game on mount
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem('savedGame');
      if (savedGame) {
        const parsedSavedGame = JSON.parse(savedGame) as GameState;
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
