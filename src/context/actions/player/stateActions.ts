/**
 * Player state actions
 * 
 * Actions for general player state management
 */
import { PlayerUpdatePayload, PLAYER_ACTIONS, PlayerAction } from '../../types/playerActionTypes';
import { validateString } from './utils';
import { PlayerInitialState } from '../../initialStates/PlayerInitialState';

/**
 * Update player properties
 * 
 * @param {PlayerUpdatePayload} updates - Object containing properties to update
 * @returns {PlayerAction} The UPDATE_PLAYER action
 * 
 * @example
 * // Update player name
 * updatePlayer({ name: "Sir Galahad" })
 */
export const updatePlayer = (updates: PlayerUpdatePayload): PlayerAction => ({
  type: PLAYER_ACTIONS.UPDATE_PLAYER,
  payload: {
    ...updates,
    timestamp: updates.timestamp || Date.now()
  }
});

/**
 * Set the player's name
 * 
 * @param {string} name - New name for the player
 * @returns {PlayerAction} The SET_NAME action
 * 
 * @example
 * // Change character name
 * setPlayerName("Elrond the Wise")
 */
export const setPlayerName = (name: string): PlayerAction => {
  validateString(name, 'Player name');
  return {
    type: PLAYER_ACTIONS.SET_NAME,
    payload: name
  };
};

/**
 * Reset the player to initial state
 * 
 * @param {boolean} [keepName=false] - Whether to keep the player's name after reset
 * @returns {PlayerAction} The RESET_PLAYER action
 * 
 * @example
 * // Complete reset
 * resetPlayer()
 * 
 * @example
 * // Reset but keep name
 * resetPlayer(true)
 */
export const resetPlayer = (keepName: boolean = false): PlayerAction => ({
  type: PLAYER_ACTIONS.RESET_PLAYER,
  payload: { keepName }
});
