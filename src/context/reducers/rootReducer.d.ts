import { GameState } from '../InitialState';
import { GameAction } from '../actions/types';

/**
 * Root reducer that combines all game state reducers
 * @param state Current game state
 * @param action Action to process
 * @returns Updated game state
 */
export function rootReducer(state: GameState, action: GameAction): GameState;
