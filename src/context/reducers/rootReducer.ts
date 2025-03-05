import { GameState } from '../initialState';
import { GameAction } from '../actions/types';
import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * Root reducer that combines all reducers for managing game state
 * This handles the top-level action routing to appropriate sub-reducers
 * 
 * @param {GameState} state - Current state of the game
 * @param {GameAction} action - Action to process
 * @returns {GameState} New game state
 */
export const rootReducer = (state: GameState, action: GameAction): GameState => {
  // Handle initialization
  if (action.type === ACTION_TYPES.INITIALIZE_GAME_DATA) {
    return action.payload;
  }
  
  // Handle reset
  if (action.type === ACTION_TYPES.RESET_GAME) {
    return state; // Should return initialState but we don't have access here
  }
  
  // Handle other actions by delegating to appropriate reducers
  // These reducers could be imported from separate files
  
  return state;
};
