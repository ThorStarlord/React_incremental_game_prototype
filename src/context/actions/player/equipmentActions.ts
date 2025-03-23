/**
 * Equipment Actions
 * ================
 * 
 * Action creators for managing player equipment
 */

import { 
  PLAYER_ACTIONS, 
  PlayerAction,
  EquipItemPayload,
  UnequipItemPayload
} from '../../types/actions/playerActionTypes';
import { validateId, validateString } from './utils';

/**
 * Equip an item in a specific slot
 * 
 * @param itemId - ID of the item to equip
 * @param slot - Slot to equip the item in
 * @returns EQUIP_ITEM action
 */
export function equipItem(itemId: string, slot: string): PlayerAction {
  validateId(itemId, 'Item ID');
  validateString(slot, 'Equipment slot');
  
  return {
    type: PLAYER_ACTIONS.EQUIP_ITEM,
    payload: { itemId, slot } as EquipItemPayload
  };
}

/**
 * Unequip an item from a specific slot
 * 
 * @param slot - Slot to unequip
 * @returns UNEQUIP_ITEM action
 */
export function unequipItem(slot: string): PlayerAction {
  validateString(slot, 'Equipment slot');
  
  return {
    type: PLAYER_ACTIONS.UNEQUIP_ITEM,
    payload: { slot } as UnequipItemPayload
  };
}
