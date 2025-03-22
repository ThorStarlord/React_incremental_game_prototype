/**
 * Character management actions
 * 
 * Actions for managing multiple characters and character profile information
 */
import { 
  ActiveCharacterPayload, 
  PLAYER_ACTIONS, 
  PlayerAction 
} from '../../types/playerActionTypes';
import { validateString, validatePositive } from './utils';

/**
 * Set the currently active character in a multi-character party
 * 
 * @param {string} characterId - ID of the character to make active
 * @returns {PlayerAction} The SET_ACTIVE_CHARACTER action
 * 
 * @example
 * // Switch to another character in party
 * setActiveCharacter("char-042")
 */
export const setActiveCharacter = (characterId: string): PlayerAction => {
  validateString(characterId, 'Character ID');
  return {
    type: PLAYER_ACTIONS.SET_ACTIVE_CHARACTER,
    payload: { 
      characterId,
      timestamp: Date.now() 
    } as ActiveCharacterPayload
  };
};

/**
 * Update the player's total play time
 * 
 * @param {number} seconds - Seconds to add to play time
 * @returns {PlayerAction} The UPDATE_TOTAL_PLAYTIME action
 * 
 * @example
 * // Add 300 seconds (5 minutes) of playtime
 * updatePlayTime(300)
 */
export const updatePlayTime = (seconds: number): PlayerAction => {
  validatePositive(seconds, 'Play time seconds');
  return {
    type: PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME,
    payload: seconds
  };
};
