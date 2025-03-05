import React, { createContext, useContext, Dispatch } from 'react';
import { GameAction } from './actions/types';

// Create context with null as initial value
const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null);

/**
 * Custom hook for accessing the dispatch function
 */
export const useGameDispatch = (): Dispatch<GameAction> => {
  const dispatch = useContext(GameDispatchContext);
  if (dispatch === null) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return dispatch;
};

// Helper action creators
export const GameActions = {
  updatePlayer: (playerData: any) => ({
    type: 'UPDATE_PLAYER',
    payload: playerData
  }),
  // Other actions can be added here
};

export default GameDispatchContext;
