import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * Apply all equipped trait effects to player stats
 */
export const applyTraitEffects = (state) => {
  // Reset player to base stats first
  const player = {
    ...state.player,
    // Reset derived stats
    maxHealth: state.player.baseMaxHealth || 100,
    damageMultiplier: 1,
    defenseMultiplier: 1
  };
  
  // Get all equipped trait IDs
  const equippedTraitIds = Object.values(player.equippedTraits || {});
  
  // Add permanent traits
  const allTraits = [
    ...equippedTraitIds,
    ...(player.permanentTraits || [])
  ];
  
  // Apply each trait's effects
  allTraits.forEach(traitId => {
    const trait = state.traits.copyableTraits[traitId];
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

export const handleCopyTrait = (state, payload) => {
  const { traitId, essenceCost, npcId } = payload;
  const trait = state.traits.copyableTraits[traitId];
  
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
  if (state.essence < essenceCost) {
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
    essence: state.essence - essenceCost,
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

export const handleAddPermanentTrait = (state, payload) => {
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
      acquiredTraits: [...state.player.acquiredTraits, traitId]
    }
  };
};

// Add other trait-related utility functions