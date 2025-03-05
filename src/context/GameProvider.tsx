import React, { createContext, useReducer, useEffect, useContext, ReactNode, Dispatch } from 'react';
import { rootReducer } from './reducers/rootReducer';
import { initialState, GameState } from './initialState';
import { ACTION_TYPES } from './actions/actionTypes';
import { GameAction } from './actions/types';

// Create the context objects directly in this file
const GameStateContext = createContext<GameState>(initialState);
const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null);

// Export custom hooks to use the contexts
export const useGameState = (): GameState => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

export const useGameDispatch = (): Dispatch<GameAction> => {
  const dispatch = useContext(GameDispatchContext);
  if (dispatch === null) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return dispatch;
};

// Define the provider component props
interface GameProviderProps {
  children: ReactNode;
}

/**
 * Game Provider Component
 * 
 * Purpose: Sets up the game state management system and provides both state and
 * dispatch function to the application via React Context.
 */
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
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
    }
  }, []);

  // Save game state when it changes
  useEffect(() => {
    try {
      localStorage.setItem('savedGame', JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game:', error);
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

// Export the context objects for direct access if needed
export { GameStateContext, GameDispatchContext };

// Export the provider component as default
export default GameProvider;
