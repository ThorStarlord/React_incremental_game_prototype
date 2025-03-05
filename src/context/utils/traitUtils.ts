/**
 * @file traitUtils.ts
 * @description Utilities for managing character traits and their effects in the incremental RPG.
 * 
 * This module provides functions to handle the trait system, which allows players
 * to gain and manage special abilities and passive effects. Traits can be:
 * - Equipped in trait slots
 * - Learned permanently
 * - Copied from NPCs
 * - Acquired from quests and special events
 * 
 * The trait system adds depth to character progression by allowing players to:
 * - Customize their character's abilities
 * - Specialize in specific play styles
 * - Gain advantages in different game aspects
 * - Unlock special interactions and dialogue options
 * 
 * Each trait can have various effects on the player's stats, abilities,
 * and interactions with the game world.
 * 
 * @example
 * // Apply all trait effects to update player stats
 * const updatedState = applyTraitEffects(currentState);
 * 
 * // Copy a trait from an NPC
 * const newState = handleCopyTrait(
 *   currentState, 
 *   { traitId: 'persuasion', essenceCost: 25, npcId: 'merchant' }
 * );
 */
import { ACTION_TYPES } from '../actions/actionTypes';
import { GameState, PlayerState } from '../initialState';

/**
 * Interface for trait effects that can be applied to player
 */
interface TraitEffects {
  /** Flat bonus to max health */
  maxHealthBonus?: number;
  
  /** Percentage multiplier for max health (e.g., 1.1 = +10%) */
  maxHealthMultiplier?: number;
  
  /** Flat bonus to damage dealt */
  damageBonus?: number;
  
  /** Bonus to defense/damage reduction */
  defenseBonus?: number;
  
  /** Allow for other effect types */
  [key: string]: number | undefined;
}

/**
 * Interface for a trait definition
 */
interface Trait {
  /** Unique identifier for the trait */
  id: string;
  
  /** Display name of the trait */
  name: string;
  
  /** Description of the trait's effects and flavor text */
  description?: string;
  
  /** Effects this trait provides when active */
  effects?: TraitEffects;
  
  /** Category the trait belongs to (e.g., "combat", "social", "survival") */
  category?: string;
  
  /** Tier/power level of the trait (higher tiers are more powerful) */
  tier?: number;
  
  /** Additional trait properties */
  [key: string]: any;
}

/**
 * Type for player state with trait properties
 */
interface PlayerWithTraits extends PlayerState {
  acquiredTraits: string[];
  equippedTraits: string[];
  permanentTraits: string[];
  traitSlots: number;
  health?: number; // Add missing health property
  baseMaxHealth?: number; // Add missing baseMaxHealth property
  maxHealth?: number; // Add maxHealth property
  damageMultiplier?: number; // Add damage multiplier
  defenseMultiplier?: number; // Add defense multiplier
}

/**
 * Extended game state with traits and player traits
 */
interface GameStateWithTraits {
  /** Player state with trait properties */
  player: PlayerWithTraits;
  /** Any additional trait-related state */
  traits?: {
    copyableTraits: Record<string, any>;
    [key: string]: any;
  };
  /** Essence resource */
  essence?: number; // Add missing essence property
  /** Notifications */
  notifications?: Array<{id: number, message: string, type: string, duration: number}>; // Add missing notifications property
}

/**
 * Payload for copying a trait
 */
interface CopyTraitPayload {
  /** ID of the trait to copy */
  traitId: string;
  
  /** Essence cost to copy this trait */
  essenceCost: number;
  
  /** Optional ID of the NPC the trait is being copied from */
  npcId?: string;
}

/**
 * Payload for adding a permanent trait
 */
interface AddTraitPayload {
  /** ID of the trait to add */
  traitId: string;
}

/**
 * Apply all equipped trait effects to player stats
 * 
 * This function recalculates derived player stats based on equipped and permanent
 * traits. It should be called whenever traits change or when initializing the player.
 * 
 * The function:
 * 1. Resets player stats to base values
 * 2. Collects all active traits (equipped + permanent)
 * 3. Applies each trait's effects in order
 * 4. Ensures health doesn't exceed new maximum
 * 
 * @param state Current game state
 * @returns Updated game state with applied trait effects
 * 
 * @example
 * // Apply trait effects after equipping a new trait
 * useEffect(() => {
 *   if (traitsChanged) {
 *     dispatch({
 *       type: 'UPDATE_STATE',
 *       payload: applyTraitEffects(currentState)
 *     });
 *   }
 * }, [player.equippedTraits, player.permanentTraits]);
 */
export const applyTraitEffects = (state: GameStateWithTraits): GameStateWithTraits => {
  // Reset player to base stats first
  const player = {
    ...state.player,
    // Reset derived stats
    maxHealth: state.player.baseMaxHealth || 100,
    damageMultiplier: 1,
    defenseMultiplier: 1
  };
  
  // Get all equipped trait IDs
  let equippedTraitIds: string[] = [];
  
  // Handle different possible structures for equippedTraits
  if (Array.isArray(player.equippedTraits)) {
    equippedTraitIds = player.equippedTraits;
  } else if (player.equippedTraits && typeof player.equippedTraits === 'object') {
    equippedTraitIds = Object.values(player.equippedTraits);
  }
  
  // Add permanent traits
  const allTraits = [
    ...equippedTraitIds,
    ...(player.permanentTraits || [])
  ];
  
  // Apply each trait's effects
  allTraits.forEach(traitId => {
    const trait = state.traits?.copyableTraits[traitId]; // Use optional chaining
    if (!trait || !trait.effects) return;
    
    // Apply specific effects
    if (trait.effects.maxHealthBonus) {
      player.maxHealth += trait.effects.maxHealthBonus;
    }
    
    if (trait.effects.maxHealthMultiplier) {
      player.maxHealth = Math.round(player.maxHealth * trait.effects.maxHealthMultiplier);
    }
    
    if (trait.effects.damageBonus) {
      player.damageMultiplier += trait.effects.damageBonus;
    }
    
    if (trait.effects.defenseBonus) {
      player.defenseMultiplier += trait.effects.defenseBonus;
    }
    
    // Other effect types can be added here
  });
  
  // Ensure health doesn't exceed new max
  player.health = Math.min(player.health || 100, player.maxHealth);
  
  return { ...state, player };
};

/**
 * Handle copying a trait from an NPC or other source to the player
 * 
 * This function:
 * 1. Checks if the player already has the trait
 * 2. Verifies the player has enough essence to copy it
 * 3. Adds the trait to the player's acquired traits
 * 4. Subtracts the essence cost
 * 5. Adds a notification about the result
 * 
 * @param state Current game state
 * @param payload Information about trait to copy and cost
 * @returns Updated game state with trait copied (or error notification)
 * 
 * @example
 * // Copy a trait from an NPC during dialogue
 * function handleCopyTraitClick(traitId) {
 *   const traitCost = calculateTraitCost(traitId);
 *   
 *   dispatch({
 *     type: 'UPDATE_STATE',
 *     payload: handleCopyTrait(state, {
 *       traitId,
 *       essenceCost: traitCost,
 *       npcId: currentNpc.id
 *     })
 *   });
 * }
 */
export const handleCopyTrait = (
  state: GameStateWithTraits, 
  payload: CopyTraitPayload
): GameStateWithTraits => {
  const { traitId, essenceCost, npcId } = payload;
  const trait = state.traits?.copyableTraits[traitId]; // Use optional chaining
  
  // Check if player already has this trait
  if (state.player.acquiredTraits.includes(traitId)) {
    return {
      ...state,
      notifications: [
        ...(state.notifications || []),
        {
          id: Date.now(),
          message: `You already possess the ${trait?.name || traitId} trait.`,
          type: 'warning',
          duration: 3000
        }
      ]
    };
  }
  
  // Check if player has enough essence
  if ((state.essence || 0) < essenceCost) {
    return {
      ...state,
      notifications: [
        ...(state.notifications || []),
        {
          id: Date.now(),
          message: `Not enough essence to copy this trait. Need ${essenceCost} essence.`,
          type: 'error',
          duration: 3000
        }
      ]
    };
  }
  
  // If all checks pass, add the trait and subtract essence
  return {
    ...state,
    essence: (state.essence || 0) - essenceCost,
    player: {
      ...state.player,
      acquiredTraits: [...state.player.acquiredTraits, traitId]
    },
    notifications: [
      ...(state.notifications || []),
      {
        id: Date.now(),
        message: `Successfully copied ${trait?.name || traitId} trait!`,
        type: 'success',
        duration: 3000
      }
    ]
  };
};

/**
 * Add a permanent trait to the player (often from quests or special events)
 * 
 * Unlike copied traits which need to be equipped, permanent traits are
 * always active. This function is typically used for quest rewards, milestone
 * bonuses, or special events.
 * 
 * @param state Current game state
 * @param payload Information about trait to add
 * @returns Updated game state with trait added
 * 
 * @example
 * // Award a permanent trait for completing a quest
 * function completeMainQuest() {
 *   // Add quest completion logic...
 *   
 *   // Award the permanent trait
 *   dispatch({
 *     type: 'UPDATE_STATE',
 *     payload: handleAddPermanentTrait(state, { traitId: 'hero_of_the_realm' })
 *   });
 *   
 *   // Then apply the effects
 *   dispatch({
 *     type: 'UPDATE_STATE',
 *     payload: applyTraitEffects(state)
 *   });
 * }
 */
export const handleAddPermanentTrait = (
  state: GameStateWithTraits, 
  payload: AddTraitPayload
): GameStateWithTraits => {
  const { traitId } = payload;
  
  // Check if player already has this trait
  if (state.player.acquiredTraits.includes(traitId)) {
    return state;
  }
  
  // Add the trait
  return {
    ...state,
    player: {
      ...state.player,
      acquiredTraits: [...state.player.acquiredTraits, traitId],
      permanentTraits: [
        ...(state.player.permanentTraits || []),
        traitId
      ]
    }
  };
};

/**
 * Equip a trait to a specific trait slot
 * 
 * @param state Current game state
 * @param traitId ID of the trait to equip
 * @param slotIndex Index of the slot to equip the trait in
 * @returns Updated game state with the trait equipped
 * 
 * @example
 * function equipTraitToSlot(traitId, slotIndex) {
 *   const updatedState = equipTrait(currentState, traitId, slotIndex);
 *   dispatch({ type: 'UPDATE_STATE', payload: updatedState });
 *   
 *   // Apply effects after equipping
 *   const withEffects = applyTraitEffects(updatedState);
 *   dispatch({ type: 'UPDATE_STATE', payload: withEffects });
 * }
 */
export const equipTrait = (
  state: GameStateWithTraits,
  traitId: string,
  slotIndex: number
): GameStateWithTraits => {
  // Verify player has the trait
  if (!state.player.acquiredTraits.includes(traitId)) {
    return {
      ...state,
      notifications: [
        ...(state.notifications || []),
        {
          id: Date.now(),
          message: "You don't have this trait to equip.",
          type: 'error',
          duration: 3000
        }
      ]
    };
  }
  
  // Create equippedTraits array if it doesn't exist or is an object
  let equippedTraits: string[] = [];
  
  if (Array.isArray(state.player.equippedTraits)) {
    equippedTraits = [...state.player.equippedTraits];
  } else if (state.player.equippedTraits) {
    // Convert object to array
    const traitEntries = Object.entries(state.player.equippedTraits as Record<string, string>);
    equippedTraits = new Array(traitEntries.length);
    
    // Place each trait in the correct position
    traitEntries.forEach(([slot, id]) => {
      const slotNumber = parseInt(slot);
      if (!isNaN(slotNumber)) {
        equippedTraits[slotNumber] = id as string;
      }
    });
  }
  
  // Ensure array is big enough
  while (equippedTraits.length <= slotIndex) {
    equippedTraits.push('');
  }
  
  // Equip the trait
  equippedTraits[slotIndex] = traitId;
  
  return {
    ...state,
    player: {
      ...state.player,
      equippedTraits
    }
  };
};

/**
 * Unequip a trait from a specific slot
 * 
 * @param state Current game state
 * @param slotIndex Index of the slot to empty
 * @returns Updated game state with the trait removed
 */
export const unequipTrait = (
  state: GameStateWithTraits,
  slotIndex: number
): GameStateWithTraits => {
  // Handle different trait storage formats
  if (Array.isArray(state.player.equippedTraits)) {
    const equippedTraits = [...state.player.equippedTraits];
    
    if (slotIndex >= equippedTraits.length || !equippedTraits[slotIndex]) {
      return state; // No trait in that slot
    }
    
    equippedTraits[slotIndex] = ''; // Clear the slot
    
    return {
      ...state,
      player: {
        ...state.player,
        equippedTraits
      }
    };
  } else if (state.player.equippedTraits) {
    // Get a copy of the equipped traits as an object
    const equippedTraitsObj = { ...(state.player.equippedTraits as Record<string, string>) };
    
    if (!equippedTraitsObj[slotIndex]) {
      return state; // No trait in that slot
    }
    
    delete equippedTraitsObj[slotIndex]; // Remove the trait
    
    // Always return as an array to match the interface type
    return {
      ...state,
      player: {
        ...state.player,
        equippedTraits: Object.values(equippedTraitsObj)
      }
    };
  }
  
  return state; // No equipped traits to modify
};
