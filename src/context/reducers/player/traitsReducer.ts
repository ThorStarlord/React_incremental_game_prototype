import { PlayerState } from '../../types/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { isActionOfType } from '../playerReducer';

/**
 * Traits reducer - manages player traits/perks system
 * 
 * Responsible for:
 * - Adding and removing traits from the player
 * - Equipping and unequipping traits
 * - Handling trait acquisition and management
 */
export const traitsReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.EQUIP_TRAIT:
      // Type guard for EQUIP_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.EQUIP_TRAIT)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('traitId' in action.payload)) {
        return state;
      }
      
      const traitId = action.payload.traitId;
      // For optional properties like slotIndex, check if they exist
      const slotIndex = 'slotIndex' in action.payload ? action.payload.slotIndex : undefined;
      
      // Ensure trait is owned and not already equipped
      if (!state.acquiredTraits?.includes(traitId) || 
          state.equippedTraits?.includes(traitId)) {
        return state;
      }
      // Check if we have available trait slots
      if ((state.equippedTraits?.length ?? 0) >= (state.traitSlots ?? 0)) {
        return state;
      }
      
      // If slotIndex is provided and valid, handle specific slot assignment
      // Otherwise just add to the equipped traits array
      return {
        ...state,
        equippedTraits: [...(state.equippedTraits || []), traitId]
      };

    case PLAYER_ACTIONS.UNEQUIP_TRAIT:
      // Type guard for UNEQUIP_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.UNEQUIP_TRAIT)) {
        return state;
      }
      
      // Now TypeScript knows this is specifically a UNEQUIP_TRAIT action
      const unequipTraitId = action.payload.traitId;
      
      return {
        ...state,
        equippedTraits: state.equippedTraits?.filter(id => id !== unequipTraitId) || []
      };

    case PLAYER_ACTIONS.ADD_TRAIT:
      // Type guard for ADD_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ADD_TRAIT)) {
        return state;
      }
      
      const addTraitId = action.payload;
      // Don't add if already owned
      if (state.acquiredTraits?.includes(addTraitId)) {
        return state;
      }
      return {
        ...state,
        acquiredTraits: [...(state.acquiredTraits || []), addTraitId]
      };

    case PLAYER_ACTIONS.REMOVE_TRAIT:
      // Type guard for REMOVE_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.REMOVE_TRAIT)) {
        return state;
      }
      
      const removeTraitId = action.payload;
      // Also remove from equipped if it's equipped
      const newEquippedTraits = state.equippedTraits?.filter(id => id !== removeTraitId) || [];
      return {
        ...state,
        acquiredTraits: state.acquiredTraits?.filter(id => id !== removeTraitId) || [],
        equippedTraits: newEquippedTraits
      };

    case PLAYER_ACTIONS.ACQUIRE_TRAIT:
      // Type guard for ACQUIRE_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ACQUIRE_TRAIT)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('traitId' in action.payload)) {
        return state;
      }
      
      const acquireTraitId = action.payload.traitId;
      if (state.acquiredTraits?.includes(acquireTraitId)) {
        return state;
      }
      
      // Only update acquiredTraits, since traits property doesn't exist in PlayerState
      return {
        ...state,
        acquiredTraits: [...(state.acquiredTraits || []), acquireTraitId]
      };

    default:
      return state;
  }
};
