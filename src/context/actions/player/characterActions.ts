/**
 * Character action type definitions
 * 
 * These constants define the action types for character management operations
 */

/**
 * Action types for character management
 */
export const CHARACTER_ACTION_TYPES = {
  /**
   * Set the active character in a multi-character party
   */
  SET_ACTIVE_CHARACTER: 'character/setActive',

  /**
   * Update the total play time for tracking purposes
   */
  UPDATE_PLAYTIME: 'character/updatePlaytime',

  /**
   * Create a new character in the roster
   */
  CREATE_CHARACTER: 'character/create',

  /**
   * Delete a character from the roster
   */
  DELETE_CHARACTER: 'character/delete',

  /**
   * Update character properties like name, appearance, etc.
   */
  UPDATE_CHARACTER: 'character/update'
};

/**
 * Character Management Actions
 * ===========================
 * 
 * Action creators for managing characters in a multi-character system
 */

import { 
  PLAYER_ACTIONS, 
  PlayerAction,
  ActiveCharacterPayload
} from '../../types/actions/playerActionTypes';
import { validateId, getTimestamp } from './utils';

/**
 * Set a character as the active one
 * 
 * @param id - Character ID to activate
 * @returns SET_ACTIVE_CHARACTER action
 */
export function setActiveCharacter(id: string): PlayerAction {
  validateId(id, 'Character ID');
  
  return {
    type: PLAYER_ACTIONS.SET_ACTIVE_CHARACTER,
    payload: {
      characterId: id,
      timestamp: getTimestamp()
    } as ActiveCharacterPayload
  };
}

/**
 * Switch to another character (with potential state handling)
 * 
 * @param id - Character ID to switch to
 * @returns SWITCH_CHARACTER action
 */
export function switchCharacter(id: string): PlayerAction {
  validateId(id, 'Character ID');
  
  return {
    type: PLAYER_ACTIONS.SWITCH_CHARACTER,
    payload: {
      characterId: id,
      timestamp: getTimestamp()
    }
  };
}
