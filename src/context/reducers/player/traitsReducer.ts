import { PlayerState } from '../../types/gameStates/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { isActionOfType } from '../playerReducer';

/**
 * Typed interfaces for action payloads
 */
interface TraitActionPayload {
  traitId: string;
}

interface EquipTraitPayload extends TraitActionPayload {
  slotIndex?: number;
}

/**
 * Validates if a trait ID exists in the player's acquired traits
 * @param state - Current player state
 * @param traitId - Trait ID to validate
 * @returns Whether the trait is owned by the player
 */
function isTraitOwned(state: PlayerState, traitId: string): boolean {
  return Array.isArray(state.acquiredTraits) && state.acquiredTraits.includes(traitId);
}

/**
 * Validates if a trait is already equipped
 * @param state - Current player state
 * @param traitId - Trait ID to validate
 * @returns Whether the trait is already equipped
 */
function isTraitEquipped(state: PlayerState, traitId: string): boolean {
  return Array.isArray(state.equippedTraits) && state.equippedTraits.includes(traitId);
}

/**
 * Checks if the player has available trait slots
 * @param state - Current player state
 * @returns Whether the player has available trait slots
 */
function hasAvailableTraitSlot(state: PlayerState): boolean {
  const equippedCount = state.equippedTraits?.length || 0;
  const maxSlots = state.traitSlots || 0;
  return equippedCount < maxSlots;
}

/**
 * Safely accesses an array on the state, creating it if undefined
 * @param array - Array to access safely
 * @returns Existing array or empty array if undefined
 */
function safeArray<T>(array: T[] | undefined): T[] {
  return array || [];
}

/**
 * Traits reducer - manages player traits/perks system
 * 
 * Responsible for:
 * - Adding and removing traits from the player
 * - Equipping and unequipping traits
 * - Handling trait acquisition and management
 * - Managing trait slots
 */
export const traitsReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.EQUIP_TRAIT: {
      // Type guard for EQUIP_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.EQUIP_TRAIT)) {
        return state;
      }
      
      // Extract and validate payload
      if (!action.payload || typeof action.payload !== 'object') {
        console.warn('Invalid EQUIP_TRAIT payload', action.payload);
        return state;
      }
      
      const payload = action.payload as EquipTraitPayload;
      const { traitId, slotIndex } = payload;
      
      // Validate trait ownership and availability
      if (!isTraitOwned(state, traitId)) {
        console.warn(`Cannot equip trait: ${traitId} not owned`);
        return state;
      }
      
      if (isTraitEquipped(state, traitId)) {
        console.warn(`Trait ${traitId} is already equipped`);
        return state;
      }
      
      if (!hasAvailableTraitSlot(state)) {
        console.warn(`Cannot equip trait: No available trait slots`);
        return state;
      }
      
      // If slotIndex is provided, implement slot-specific logic here
      // For now, just add to the equipped traits array
      return {
        ...state,
        equippedTraits: [...safeArray(state.equippedTraits), traitId]
      };
    }

    case PLAYER_ACTIONS.UNEQUIP_TRAIT: {
      // Type guard for UNEQUIP_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.UNEQUIP_TRAIT)) {
        return state;
      }
      
      // Extract and validate payload
      if (!action.payload || typeof action.payload !== 'object') {
        console.warn('Invalid UNEQUIP_TRAIT payload', action.payload);
        return state;
      }
      
      const payload = action.payload as TraitActionPayload;
      const { traitId } = payload;
      
      // Check if trait is equipped
      if (!isTraitEquipped(state, traitId)) {
        console.warn(`Cannot unequip trait: ${traitId} is not equipped`);
        return state;
      }
      
      // Remove trait from equipped traits
      return {
        ...state,
        equippedTraits: safeArray(state.equippedTraits).filter(id => id !== traitId)
      };
    }

    case PLAYER_ACTIONS.ADD_TRAIT: {
      // Type guard for ADD_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ADD_TRAIT)) {
        return state;
      }
      
      // Validate payload and extract trait ID
      const traitId = action.payload;
      if (typeof traitId !== 'string') {
        console.warn('Invalid ADD_TRAIT payload, expected string traitId', action.payload);
        return state;
      }
      
      // Don't add if already owned
      if (isTraitOwned(state, traitId)) {
        console.info(`Trait ${traitId} already owned, skipping addition`);
        return state;
      }
      
      // Add trait to acquired traits
      return {
        ...state,
        acquiredTraits: [...safeArray(state.acquiredTraits), traitId]
      };
    }

    case PLAYER_ACTIONS.REMOVE_TRAIT: {
      // Type guard for REMOVE_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.REMOVE_TRAIT)) {
        return state;
      }
      
      // Validate payload and extract trait ID
      const traitId = action.payload;
      if (typeof traitId !== 'string') {
        console.warn('Invalid REMOVE_TRAIT payload, expected string traitId', action.payload);
        return state;
      }
      
      // If trait isn't owned, nothing to do
      if (!isTraitOwned(state, traitId)) {
        return state;
      }
      
      // Remove from equipped traits if it's equipped
      const newEquippedTraits = isTraitEquipped(state, traitId)
        ? safeArray(state.equippedTraits).filter(id => id !== traitId)
        : state.equippedTraits;
      
      // Remove from acquired traits
      return {
        ...state,
        acquiredTraits: safeArray(state.acquiredTraits).filter(id => id !== traitId),
        equippedTraits: newEquippedTraits
      };
    }

    case PLAYER_ACTIONS.ACQUIRE_TRAIT: {
      // Type guard for ACQUIRE_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ACQUIRE_TRAIT)) {
        return state;
      }
      
      // Validate payload structure
      if (!action.payload || typeof action.payload !== 'object' || !('traitId' in action.payload)) {
        console.warn('Invalid ACQUIRE_TRAIT payload, expected object with traitId', action.payload);
        return state;
      }
      
      const { traitId } = action.payload;
      if (typeof traitId !== 'string') {
        console.warn('Invalid traitId in ACQUIRE_TRAIT, expected string', traitId);
        return state;
      }
      
      // Don't add if already owned
      if (isTraitOwned(state, traitId)) {
        console.info(`Trait ${traitId} already owned, skipping acquisition`);
        return state;
      }
      
      // Add to acquired traits
      return {
        ...state,
        acquiredTraits: [...safeArray(state.acquiredTraits), traitId]
      };
    }

    default:
      return state;
  }
};
