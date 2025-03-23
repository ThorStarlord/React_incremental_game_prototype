/**
 * Player State Actions
 * ===================
 * 
 * Action creators for managing general player state
 */

import { 
  PLAYER_ACTIONS, 
  PlayerAction, 
  PlayerUpdatePayload,
  ResetPlayerPayload
} from '../../types/actions/playerActionTypes';
import { validateString } from './utils';

/**
 * Update player properties
 * 
 * @param updates - Object containing properties to update
 * @returns UPDATE_PLAYER action
 */
export function updatePlayer(updates: PlayerUpdatePayload): PlayerAction {
  return {
    type: PLAYER_ACTIONS.UPDATE_PLAYER,
    payload: {
      ...updates,
      timestamp: updates.timestamp || Date.now()
    }
  };
}

/**
 * Set the player's name
 * 
 * @param name - New name for the player
 * @returns SET_NAME action
 */
export function setPlayerName(name: string): PlayerAction {
  validateString(name, 'Player name');
  return {
    type: PLAYER_ACTIONS.SET_NAME,
    payload: name
  };
}

/**
 * Reset the player to initial state
 * 
 * @param keepName - Whether to keep the player's name after reset
 * @returns RESET_PLAYER action
 */
export function resetPlayer(keepName: boolean = false): PlayerAction {
  return {
    type: PLAYER_ACTIONS.RESET_PLAYER,
    payload: { keepName } as ResetPlayerPayload
  };
}

/**
 * Update the player's total playtime
 * 
 * @param seconds - Seconds to add to playtime
 * @returns UPDATE_TOTAL_PLAYTIME action
 */
export function updateTotalPlayTime(seconds: number): PlayerAction {
  return {
    type: PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME,
    payload: seconds
  };
}
