/**
 * Status Effect Actions
 * ====================
 * 
 * Action creators for managing player status effects
 */

import { 
  PLAYER_ACTIONS, 
  PlayerAction,
  StatusEffectPayload
} from '../../types/actions/playerActionTypes';
import { StatusEffect } from '../../types/gameStates/PlayerGameStateTypes';
import { validateId } from './utils';

/**
 * Add a status effect to the player
 * 
 * @param effect - Status effect to add
 * @returns ADD_STATUS_EFFECT action
 */
export function addStatusEffect(effect: StatusEffect): PlayerAction {
  if (!effect || typeof effect !== 'object') {
    console.warn('Invalid status effect object');
    return {
      type: PLAYER_ACTIONS.ADD_STATUS_EFFECT,
      payload: { effect: null }
    };
  }
  
  // Ensure required properties
  if (!effect.id || !effect.name || typeof effect.duration !== 'number') {
    console.warn('Status effect missing required properties');
  }
  
  return {
    type: PLAYER_ACTIONS.ADD_STATUS_EFFECT,
    payload: { effect } as StatusEffectPayload
  };
}

/**
 * Remove a status effect from the player
 * 
 * @param effectId - ID of the effect to remove
 * @returns REMOVE_STATUS_EFFECT action
 */
export function removeStatusEffect(effectId: string): PlayerAction {
  validateId(effectId, 'Effect ID');
  
  return {
    type: PLAYER_ACTIONS.REMOVE_STATUS_EFFECT,
    payload: { effectId }
  };
}
