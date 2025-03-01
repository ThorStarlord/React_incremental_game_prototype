import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Trait Reducer
 * 
 * Purpose: Manages the player's traits system including unlocking, equipping and upgrading traits
 * - Tracks trait discovery, unlocked traits and equipped traits
 * - Handles trait unlocking based on various requirements
 * - Manages trait equip/unequip mechanics
 * - Controls trait upgrading and evolution pathways
 * - Applies trait effectiveness calculations based on synergies
 * 
 * Traits are permanent or equipable character attributes that provide passive bonuses
 * or modify gameplay mechanics. They represent the character's innate abilities,
 * learned advantages, or special characteristics that differentiate them.
 * 
 * Actions:
 * - UNLOCK_TRAIT: When player meets requirements to permanently unlock a trait
 * - EQUIP_TRAIT: Equip an unlocked trait to one of the available trait slots
 * - UNEQUIP_TRAIT: Remove an equipped trait
 * - UPGRADE_TRAIT: Improve the effectiveness or change properties of a trait
 * - DISCOVER_TRAIT: Add trait to known traits list without unlocking
 * - INCREASE_TRAIT_AFFINITY: Raise affinity level for a trait category
 * - EVOLVE_TRAIT: Transform a trait into an advanced version when conditions are met
 */
export const traitReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UNLOCK_TRAIT: {
      const { trait, source } = action.payload;
      
      // Check if player already has this trait
      if (state.player.unlockedTraits?.some(t => t.id === trait.id)) {
        return state;
      }
      
      // Check if player meets requirements for trait
      if (trait.requirements) {
        const { level, stats, skills } = trait.requirements;
        
        // Level requirement check
        if (level && state.player.level < level) {
          return addNotification(state, {
            message: `You need to be level ${level} to unlock ${trait.name}`,
            type: 'warning'
          });
        }
        
        // Stat requirements check
        if (stats) {
          for (const [stat, value] of Object.entries(stats)) {
            if ((state.player.stats?.[stat] || 0) < value) {
              return addNotification(state, {
                message: `You need ${stat} of at least ${value} to unlock ${trait.name}`,
                type: 'warning'
              });
            }
          }
        }
        
        // Skill requirements check
        if (skills) {
          for (const [skillId, level] of Object.entries(skills)) {
            const playerSkill = state.player.skills?.find(s => s.id === skillId);
            if (!playerSkill || playerSkill.level < level) {
              return addNotification(state, {
                message: `You need higher proficiency in required skills to unlock ${trait.name}`,
                type: 'warning'
              });
            }
          }
        }
      }
      
      // Create new trait object
      const newTrait = {
        id: trait.id,
        name: trait.name,
        description: trait.description,
        level: 1,
        unlockedAt: Date.now(),
        unlockedFrom: source || 'unknown',
        category: trait.category,
        effects: trait.effects,
        isActive: false
      };
      
      // Add to unlocked traits
      const newState = {
        ...state,
        player: {
          ...state.player,
          unlockedTraits: [...(state.player.unlockedTraits || []), newTrait]
        }
      };
      
      return addNotification(newState, {
        message: `New trait unlocked: ${trait.name}`,
        type: 'achievement',
        duration: 6000
      });
    }
    
    case ACTION_TYPES.EQUIP_TRAIT: {
      const { traitId } = action.payload;
      
      // Find the trait
      const trait = state.player.unlockedTraits?.find(t => t.id === traitId);
      if (!trait) {
        return addNotification(state, {
          message: "Trait not found in your unlocked traits",
          type: 'error'
        });
      }
      
      // Calculate how many trait slots the player has based on level/progression
      const availableSlots = Math.floor(state.player.level / 5) + 1; // Base formula: 1 slot + 1 per 5 levels
      
      // Check if player has reached the equipped trait limit
      const currentlyEquipped = state.player.equippedTraits?.length || 0;
      if (currentlyEquipped >= availableSlots) {
        return addNotification(state, {
          message: `You can only equip ${availableSlots} traits at your current level`,
          type: 'warning'
        });
      }
      
      // Check for incompatible traits
      if (trait.incompatibleWith) {
        for (const incompatibleId of trait.incompatibleWith) {
          if (state.player.equippedTraits?.includes(incompatibleId)) {
            const incompatibleTrait = state.player.unlockedTraits.find(t => t.id === incompatibleId);
            return addNotification(state, {
              message: `${trait.name} is incompatible with your equipped trait: ${incompatibleTrait?.name || incompatibleId}`,
              type: 'warning'
            });
          }
        }
      }
      
      // Check for category restrictions (e.g., only one trait per category)
      if (trait.category && trait.exclusiveCategory) {
        const hasTraitFromSameCategory = state.player.equippedTraits?.some(id => {
          const equippedTrait = state.player.unlockedTraits.find(t => t.id === id);
          return equippedTrait?.category === trait.category;
        });
        
        if (hasTraitFromSameCategory) {
          return addNotification(state, {
            message: `You can only equip one trait from the ${trait.category} category`,
            type: 'warning'
          });
        }
      }
      
      // Equip the trait
      const newEquippedTraits = [
        ...(state.player.equippedTraits || []),
        traitId
      ];
      
      // Update trait status
      const updatedUnlockedTraits = state.player.unlockedTraits.map(t => 
        t.id === traitId ? {...t, isActive: true} : t
      );
      
      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: newEquippedTraits,
          unlockedTraits: updatedUnlockedTraits
        }
      };
    }
    
    case ACTION_TYPES.UNEQUIP_TRAIT: {
      const { traitId } = action.payload;
      
      // Check if trait is equipped
      if (!state.player.equippedTraits?.includes(traitId)) {
        return state;
      }
      
      // Check for forced traits that can't be unequipped
      const trait = state.player.unlockedTraits?.find(t => t.id === traitId);
      if (trait?.forcedEquip) {
        return addNotification(state, {
          message: `${trait.name} cannot be unequipped`,
          type: 'warning'
        });
      }
      
      // Remove trait from equipped list
      const newEquippedTraits = state.player.equippedTraits.filter(id => id !== traitId);
      
      // Update trait status
      const updatedUnlockedTraits = state.player.unlockedTraits.map(t => 
        t.id === traitId ? {...t, isActive: false} : t
      );
      
      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: newEquippedTraits,
          unlockedTraits: updatedUnlockedTraits
        }
      };
    }
    
    case ACTION_TYPES.UPGRADE_TRAIT: {
      const { traitId, paymentComplete } = action.payload;
      
      // Find the trait
      const traitIndex = state.player.unlockedTraits?.findIndex(t => t.id === traitId);
      if (traitIndex === -1) return state;
      
      const trait = state.player.unlockedTraits[traitIndex];
      
      // Check if trait can be upgraded
      const maxLevel = trait.maxLevel || 5; // Default max level is 5
      if (trait.level >= maxLevel) {
        return addNotification(state, {
          message: `${trait.name} is already at maximum level`,
          type: 'warning'
        });
      }
      
      // Check if upgrade cost has been paid (if not explicitly confirmed)
      if (!paymentComplete) {
        // Calculate upgrade cost
        const baseCost = trait.upgradeCost || 100;
        const scalingFactor = trait.costScaling || 1.5;
        const currentLevel = trait.level || 1;
        
        const upgradeCost = Math.round(baseCost * Math.pow(scalingFactor, currentLevel - 1));
        
        // Check if player has enough resources
        if (state.player.resources?.gold < upgradeCost) {
          return addNotification(state, {
            message: `You need ${upgradeCost} gold to upgrade ${trait.name}`,
            type: 'warning'
          });
        }
        
        // Deduct cost
        const newResources = {
          ...state.player.resources,
          gold: state.player.resources.gold - upgradeCost
        };
        
        // Update state with resource deduction
        state = {
          ...state,
          player: {
            ...state.player,
            resources: newResources
          }
        };
      }
      
      // Calculate upgraded effects
      const updatedEffects = {};
      if (trait.effects) {
        for (const [effectKey, effectValue] of Object.entries(trait.effects)) {
          // Scale effect based on level - more sophisticated scaling could be implemented
          const baseValue = effectValue.base || effectValue;
          const scaling = effectValue.scaling || 0.2; // 20% increase per level by default
          
          updatedEffects[effectKey] = baseValue * (1 + scaling * trait.level);
        }
      }
      
      // Create upgraded trait
      const updatedTrait = {
        ...trait,
        level: trait.level + 1,
        effects: updatedEffects,
        lastUpgraded: Date.now()
      };
      
      // Update trait in state
      const newState = {
        ...state,
        player: {
          ...state.player,
          unlockedTraits: state.player.unlockedTraits.map((t, idx) =>
            idx === traitIndex ? updatedTrait : t
          )
        }
      };
      
      return addNotification(newState, {
        message: `${trait.name} has been upgraded to level ${updatedTrait.level}`,
        type: 'achievement',
        duration: 4000
      });
    }
    
    case ACTION_TYPES.DISCOVER_TRAIT: {
      const { traitId, traitInfo } = action.payload;
      
      // Check if already discovered
      if (state.player.discoveredTraits?.some(t => t.id === traitId)) {
        return state;
      }
      
      // Add to discovered traits
      return addNotification({
        ...state,
        player: {
          ...state.player,
          discoveredTraits: [
            ...(state.player.discoveredTraits || []),
            {
              id: traitId,
              name: traitInfo.name,
              description: traitInfo.description,
              category: traitInfo.category,
              discoveredAt: Date.now()
            }
          ]
        }
      }, {
        message: `You've discovered information about the ${traitInfo.name} trait`,
        type: 'discovery'
      });
    }
    
    case ACTION_TYPES.INCREASE_TRAIT_AFFINITY: {
      const { category, amount } = action.payload;
      
      // Initialize affinities object if it doesn't exist
      const currentAffinities = state.player.traitAffinities || {};
      
      // Calculate new affinity value
      const currentAffinity = currentAffinities[category] || 0;
      const newAffinity = Math.min(100, currentAffinity + amount); // Cap at 100
      
      // Track if player reached a new affinity threshold
      const thresholds = [25, 50, 75, 100];
      const oldThresholdIndex = thresholds.findIndex(t => currentAffinity < t);
      const newThresholdIndex = thresholds.findIndex(t => newAffinity < t);
      
      const reachedNewThreshold = oldThresholdIndex !== -1 && 
        (newThresholdIndex === -1 || newThresholdIndex > oldThresholdIndex);
      
      // Update state
      let newState = {
        ...state,
        player: {
          ...state.player,
          traitAffinities: {
            ...currentAffinities,
            [category]: newAffinity
          }
        }
      };
      
      // Add notification if player reached a new threshold
      if (reachedNewThreshold) {
        const threshold = thresholds[oldThresholdIndex];
        newState = addNotification(newState, {
          message: `Your affinity with ${category} traits has reached ${threshold}%!`,
          type: 'achievement',
          duration: 5000
        });
      }
      
      return newState;
    }
    
    case ACTION_TYPES.EVOLVE_TRAIT: {
      const { traitId, chosenEvolution } = action.payload;
      
      // Find the trait
      const traitIndex = state.player.unlockedTraits?.findIndex(t => t.id === traitId);
      if (traitIndex === -1) return state;
      
      const trait = state.player.unlockedTraits[traitIndex];
      
      // Check if trait can evolve
      if (!trait.evolutions || trait.evolved) {
        return addNotification(state, {
          message: `${trait.name} cannot evolve further`,
          type: 'warning'
        });
      }
      
      // Find the chosen evolution path
      const evolutionPath = trait.evolutions.find(e => e.id === chosenEvolution);
      if (!evolutionPath) {
        return addNotification(state, {
          message: `Invalid evolution path selected`,
          type: 'error'
        });
      }
      
      // Check evolution requirements
      if (evolutionPath.requirements) {
        const { level, stats, resources } = evolutionPath.requirements;
        
        // Level requirement check
        if (level && trait.level < level) {
          return addNotification(state, {
            message: `Trait needs to be level ${level} to evolve`,
            type: 'warning'
          });
        }
        
        // Stat requirements check
        if (stats) {
          for (const [stat, value] of Object.entries(stats)) {
            if ((state.player.stats?.[stat] || 0) < value) {
              return addNotification(state, {
                message: `You need ${stat} of at least ${value} for this evolution`,
                type: 'warning'
              });
            }
          }
        }
        
        // Resource requirements check
        if (resources) {
          for (const [resource, amount] of Object.entries(resources)) {
            if ((state.player.resources?.[resource] || 0) < amount) {
              return addNotification(state, {
                message: `You need ${amount} ${resource} for this evolution`,
                type: 'warning'
              });
            }
          }
          
          // Deduct resources
          const newResources = {...state.player.resources};
          for (const [resource, amount] of Object.entries(resources)) {
            newResources[resource] -= amount;
          }
          
          // Update state with resource deduction
          state = {
            ...state,
            player: {
              ...state.player,
              resources: newResources
            }
          };
        }
      }
      
      // Create evolved trait
      const evolvedTrait = {
        ...trait,
        id: evolutionPath.resultId || `${trait.id}_evolved`,
        name: evolutionPath.name || `Evolved ${trait.name}`,
        description: evolutionPath.description || `Evolved version of ${trait.name}`,
        level: trait.level,
        effects: evolutionPath.effects || trait.effects,
        evolved: true,
        evolvedFrom: trait.id,
        evolvedAt: Date.now(),
        evolutionPath: chosenEvolution
      };
      
      // Update trait in state
      const newState = {
        ...state,
        player: {
          ...state.player,
          unlockedTraits: state.player.unlockedTraits.map((t, idx) =>
            idx === traitIndex ? evolvedTrait : t
          ),
          // Update equipped traits if necessary
          equippedTraits: state.player.equippedTraits?.map(id => 
            id === traitId ? evolvedTrait.id : id
          )
        }
      };
      
      return addNotification(newState, {
        message: `${trait.name} has evolved into ${evolvedTrait.name}!`,
        type: 'achievement',
        duration: 7000
      });
    }
    
    default:
      return state;
  }
};
