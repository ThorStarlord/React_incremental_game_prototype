/**
 * Game state reset functionality
 * 
 * This file provides functions to reset the game state to
 * initial values, either completely or specific parts of it.
 */

import { deepClone } from '../utils/stateUtils';
import { GameState } from '../types/gameStates/GameStateTypes';
import { InitialState } from './InitialStateComposer';
import { PlayerState } from '../types/gameStates/PlayerGameStateTypes';
import { resetPlayerState as resetPlayer } from './PlayerInitialState';

/**
 * Reset the entire game state to initial values
 * 
 * Creates a fresh, mutable copy of the initial state.
 * This is intentionally mutable to allow for changes during gameplay.
 * 
 * @returns {GameState} A fresh copy of the initial state
 */
export const resetGameState = (): GameState => {
  return deepClone(InitialState);
};

/**
 * Reset only the player state to initial values
 * 
 * @returns {PlayerState} A fresh player state
 */
export const resetPlayerState = (): PlayerState => {
  return resetPlayer();
};

/**
 * Reset a specific slice of the game state to initial values
 * 
 * @param stateSlice The name of the state slice to reset
 * @returns The initial state for that slice
 */
export const resetStateSlice = <K extends keyof GameState>(stateSlice: K): GameState[K] => {
  return deepClone(InitialState[stateSlice]);
};
