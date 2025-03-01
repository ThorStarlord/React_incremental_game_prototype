import { ACTION_TYPES } from '../actions/actionTypes';
import { handleCopyTrait, handleAddPermanentTrait, applyTraitEffects } from '../utils/traitUtils';
import { handleLearnSkill } from '../utils/skillUtils';
import { addNotification } from '../utils/notificationUtils';

// Handler functions
const handleEquipTrait = (state, payload) => {
  const { traitId, slotId } = payload;
  
  // Check if trait exists and is acquired - fixed to safely handle undefined acquiredTraits
  if (!state.acquiredTraits || !state.acquiredTraits.includes(traitId)) {
    return addNotification(state, {
      message: "You don't have this trait.",
      type: "error"
    });
  }
  
  // Update equipped traits
  const newState = {
    ...state,
    equippedTraits: {
      ...state.equippedTraits,
      [slotId]: traitId
    }
  };
  
  // Apply trait effects
  return applyTraitEffects(newState);
};

const handleUnequipTrait = (state, payload) => {
  const { slotId } = payload;
  
  // Create a new equipped traits object without the specified slot
  const newEquippedTraits = { ...(state.equippedTraits || {}) };
  delete newEquippedTraits[slotId];
  
  const newState = {
    ...state,
    equippedTraits: newEquippedTraits
  };
  
  // Reapply trait effects for remaining traits
  return applyTraitEffects(newState);
};

/**
 * Player Reducer
 * 
 * Purpose: Manages the player character's state and attributes
 * - Handles updates to player properties (stats, level, etc.)
 * - Centralizes all player-related state changes
 * 
 * This reducer is responsible for maintaining the integrity of the player object
 * which represents the user's character in the game world. It ensures proper
 * updating of player attributes while preserving existing state values.
 */
export const playerReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_PLAYER: {
      // Merge provided properties with existing player state
      // This allows for partial updates to the player object
      return {
        ...state,
        player: {
          ...state.player,
          ...action.payload
        }
      };
    }
    case ACTION_TYPES.COPY_TRAIT:
      return handleCopyTrait(state, action.payload);
      
    case ACTION_TYPES.LEARN_SKILL:
      return handleLearnSkill(state, action.payload);
      
    case ACTION_TYPES.EQUIP_TRAIT:
      return handleEquipTrait(state, action.payload);
      
    case ACTION_TYPES.UNEQUIP_TRAIT:
      return handleUnequipTrait(state, action.payload);
      
    case ACTION_TYPES.UPGRADE_TRAIT_SLOTS:
      return {
        ...state,
        traitSlots: action.payload.newTotal
      };
      
    case ACTION_TYPES.ADD_PERMANENT_TRAIT:
      return handleAddPermanentTrait(state, action.payload);
      
    case ACTION_TYPES.DISCOVER_NPC:
      const { npcId } = action.payload;
      if (state.discoveredNPCs?.includes(npcId)) {
        return state;
      }
      
      // Use the addNotification utility for consistency
      return addNotification(
        {
          ...state,
          discoveredNPCs: [
            ...(state.discoveredNPCs || []),
            npcId
          ]
        },
        {
          message: `You have discovered ${npcId}!`,
          type: 'info',
          duration: 3000
        }
      );
      
    default:
      return state;
  }
};