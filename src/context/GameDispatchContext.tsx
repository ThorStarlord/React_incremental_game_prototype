/**
 * @file GameDispatchContext.tsx
 * @description Defines the TypeScript types for game actions and creates a React context
 * for dispatching these actions throughout the application.
 * 
 * This module provides:
 * 1. Type definitions for all possible game actions
 * 2. A context for accessing the dispatch function with proper typing
 * 3. A custom hook for safely accessing the dispatch function
 * 4. Helper functions for creating common actions
 * 
 * The dispatch system follows the Redux pattern where each action has:
 * - A unique type identifier (from ACTION_TYPES constant)
 * - An optional payload containing data needed for the action
 */

import { createContext, useContext, Dispatch } from 'react';
import { GameState } from './initialStates/InitialStateComposer';
import { 
  ESSENCE_ACTIONS, 
  PLAYER_ACTIONS, 
  COMBAT_ACTIONS, 
  NOTIFICATION_ACTIONS,
  Action,
  ActionWithPayload
} from './types/ActionTypes';

/**
 * Generic Action interface with required payload
 */
export interface GameAction {
  type: string;
  payload: any;
}

/**
 * Common notification types
 */
export type NotificationType = 
  'info' | 'success' | 'warning' | 'error' | 
  'achievement' | 'discovery' | 'danger' | 
  'positive' | 'negative';

/**
 * Context for accessing the dispatch function throughout the application
 */
const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null);

/**
 * Custom hook to access the dispatch function with proper typing
 * 
 * @returns {Dispatch<GameAction>} The correctly typed dispatch function
 */
export const useGameDispatch = (): Dispatch<GameAction> => {
  const dispatch = useContext(GameDispatchContext);
  if (dispatch === null) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return dispatch;
};

/**
 * Common action creators for frequently used actions
 */
export const GameActions = {
  gainEssence: (amount: number, source?: string): GameAction => ({
    type: ESSENCE_ACTIONS.GAIN_ESSENCE,
    payload: { amount, source }
  }),
  
  gainExperience: (amount: number, source?: string): GameAction => ({
    type: PLAYER_ACTIONS.GAIN_EXPERIENCE,
    payload: { amount, source }
  }),
  
  addNotification: (
    message: string, 
    type: NotificationType = 'info',
    duration: number = 3000
  ): GameAction => ({
    type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
    payload: { message, type, duration }
  }),
  
  updatePlayer: (playerData: Partial<GameState['player']>): GameAction => ({
    type: PLAYER_ACTIONS.UPDATE_PLAYER,
    payload: playerData
  }),
  
  startCombat: (
    enemies: any[], 
    location?: string, 
    ambush: boolean = false
  ): GameAction => ({
    type: COMBAT_ACTIONS.START_COMBAT,
    payload: { enemies, location, ambush }
  })
};

export default GameDispatchContext;
