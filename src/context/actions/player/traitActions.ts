/**
 * Player trait actions
 * 
 * Actions for managing player traits including acquiring, equipping, and removing
 */
import { 
  TraitPayload, 
  EquipTraitPayload, 
  PLAYER_ACTIONS, 
  PlayerAction 
} from '../../types/playerActionTypes';
import { validateString, validateNonNegative } from './utils';

/**
 * Add a new trait to the player's acquired traits
 * 
 * @param {string} traitId - ID of the trait to acquire
 * @returns {PlayerAction} The ADD_TRAIT action
 * 
 * @example
 * // Acquire a trait
 * acquireTrait("trait_firestarter")
 */
export const acquireTrait = (traitId: string): PlayerAction => {
  validateString(traitId, 'Trait ID');
  return {
    type: PLAYER_ACTIONS.ADD_TRAIT,
    payload: traitId
  };
};

/**
 * Equip a trait in one of the player's trait slots
 * 
 * @param {string} traitId - ID of the trait to equip
 * @param {number} [slotIndex] - Slot index to equip the trait in (auto-assigns if omitted)
 * @returns {PlayerAction} The EQUIP_TRAIT action
 * 
 * @example
 * // Equip a trait in a specific slot
 * equipTrait("trait_quickthinking", 2)
 */
export const equipTrait = (traitId: string, slotIndex?: number): PlayerAction => {
  validateString(traitId, 'Trait ID');
  if (slotIndex !== undefined) validateNonNegative(slotIndex, 'Slot index');
  
  return {
    type: PLAYER_ACTIONS.EQUIP_TRAIT,
    payload: { 
      traitId, 
      slotIndex,
      timestamp: Date.now()
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
      timestamp: Date.now()
    } as TraitPayload
  };
};
