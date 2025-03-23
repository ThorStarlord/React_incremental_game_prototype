/**
 * Trait-related action creators
 */
import {
  PLAYER_ACTIONS,
  PlayerAction,
  TraitPayload,
  EquipTraitPayload
} from '../../types/actions/playerActionTypes';
import { validateString, validateId, getTimestamp } from './utils';

/**
 * Acquire a new trait
 * 
 * @param {string} traitId - ID of the trait to acquire
 * @returns {PlayerAction} The ACQUIRE_TRAIT action
 * 
 * @example
 * // Acquire a trait
 * acquireTrait("trait_quickthinking")
 */
export const acquireTrait = (traitId: string): PlayerAction => {
  validateId(traitId, 'Trait ID');
  return {
    type: PLAYER_ACTIONS.ACQUIRE_TRAIT,
    payload: { 
      traitId,
      timestamp: getTimestamp()
    }
  };
};

/**
 * Equip a trait to an active slot
 * 
 * @param {string} traitId - ID of the trait to equip
 * @param {number} [slotIndex] - Optional slot index to equip to
 * @returns {PlayerAction} The EQUIP_TRAIT action
 * 
 * @example
 * // Equip a trait
 * equipTrait("trait_quickthinking")
 */
export const equipTrait = (traitId: string, slotIndex?: number): PlayerAction => {
  validateId(traitId, 'Trait ID');
  return {
    type: PLAYER_ACTIONS.EQUIP_TRAIT,
    payload: { 
      traitId,
      slotIndex,
      timestamp: getTimestamp()
    } as EquipTraitPayload
  };
};

/**
 * Remove a trait from the player's equipped traits
 * 
 * @param {string} traitId - ID of the trait to unequip
 * @returns {PlayerAction} The UNEQUIP_TRAIT action
 * 
 * @example
 * // Unequip a trait
 * unequipTrait("trait_quickthinking")
 */
export const unequipTrait = (traitId: string): PlayerAction => {
  validateString(traitId, 'Trait ID');
  return {
    type: PLAYER_ACTIONS.UNEQUIP_TRAIT,
    payload: { 
      traitId,
      timestamp: getTimestamp()
    } as TraitPayload
  };
};

/**
 * Add a trait to the player's collection
 * 
 * @param {string} traitId - ID of the trait to add
 * @returns {PlayerAction} The ADD_TRAIT action
 */
export const addTrait = (traitId: string): PlayerAction => {
  validateId(traitId, 'Trait ID');
  return {
    type: PLAYER_ACTIONS.ADD_TRAIT,
    payload: traitId
  };
};

/**
 * Remove a trait from the player's collection
 * 
 * @param {string} traitId - ID of the trait to remove
 * @returns {PlayerAction} The REMOVE_TRAIT action
 */
export const removeTrait = (traitId: string): PlayerAction => {
  validateId(traitId, 'Trait ID');
  return {
    type: PLAYER_ACTIONS.REMOVE_TRAIT,
    payload: traitId
  };
};
