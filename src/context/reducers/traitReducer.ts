import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

// Define interfaces
interface GameState {
  player: PlayerState;
  gameData?: GameData;
  stats?: GameStats;
  essence: EssenceState;
  [key: string]: any;
}

interface PlayerState {
  discoveredTraits?: string[];
  unlockedTraits?: string[];
  equippedTraits?: string[];
  traitSlots?: number;
  traitAffinities?: Record<string, number>;
  [key: string]: any;
}

interface GameData {
  traits?: Record<string, Trait>;
  [key: string]: any;
}

interface Trait {
  id: string;
  name: string;
  description: string;
  type: string;
  tier: number;
  category?: string;
  effects?: Record<string, any>;
  unlockRequirements?: TraitRequirements;
  evolutionPath?: string[];
  [key: string]: any;
}

interface TraitRequirements {
  essenceCost?: number;
  playerLevel?: number;
  traits?: string[];
  affinity?: { category: string; level: number };
  questCompleted?: string;
  encounterType?: string;
  achievements?: string[];
  [key: string]: any;
}

interface GameStats {
  traitsDiscovered?: number;
  traitsUnlocked?: number;
  traitsEquipped?: Record<string, number>;
  [key: string]: any;
}

interface EssenceState {
  amount: number;
  [key: string]: any;
}

/**
 * Trait Reducer - Manages character traits and abilities
 */
export const traitReducer = (state: GameState, action: {type: string; payload: any}): GameState => {
  switch (action.type) {
    case ACTION_TYPES.DISCOVER_TRAIT: {
      const { traitId, source = 'unknown' } = action.payload;
      
      // Check if already discovered
      if (state.player.discoveredTraits?.includes(traitId)) {
        return state;
      }
      
      const trait = state.gameData?.traits?.[traitId];
      if (!trait) {
        return state;
      }
      
      return addNotification({
        ...state,
        player: {
          ...state.player,
          discoveredTraits: [...(state.player.discoveredTraits || []), traitId],
        },
        stats: {
          ...state.stats,
          traitsDiscovered: (state.stats?.traitsDiscovered || 0) + 1
        }
      }, {
        message: `Discovered trait: ${trait.name}`,
        type: 'discovery',
        duration: 4000
      });
    }
    
    case ACTION_TYPES.UNLOCK_TRAIT: {
      const { traitId } = action.payload;
      
      // Check if already unlocked
      if (state.player.unlockedTraits?.includes(traitId)) {
        return addNotification(state, {
          message: "You've already unlocked this trait.",
          type: "info"
        });
      }
      
      // Get trait data
      const trait = state.gameData?.traits?.[traitId];
      if (!trait) {
        return state;
      }
      
      // Check requirements
      const reqs = trait.unlockRequirements || {};
      
      // Check essence cost
      if (reqs.essenceCost && state.essence.amount < reqs.essenceCost) {
        return addNotification(state, {
          message: `Not enough essence to unlock this trait. Need ${reqs.essenceCost}.`,
          type: "error"
        });
      }
      
      // Check player level
      if (reqs.playerLevel && state.player.level < reqs.playerLevel) {
        return addNotification(state, {
          message: `You must be level ${reqs.playerLevel} to unlock this trait.`,
          type: "error"
        });
      }
      
      // Check required traits
      if (reqs.traits && reqs.traits.some(id => !state.player.unlockedTraits?.includes(id))) {
        return addNotification(state, {
          message: `You need to unlock prerequisite traits first.`,
          type: "error"
        });
      }
      
      // Check trait affinity
      if (reqs.affinity && (state.player.traitAffinities?.[reqs.affinity.category] || 0) < reqs.affinity.level) {
        return addNotification(state, {
          message: `You need ${reqs.affinity.category} affinity ${reqs.affinity.level} to unlock this trait.`,
          type: "error"
        });
      }
      
      // Apply unlock cost
      let updatedState: GameState = {
        ...state,
        player: {
          ...state.player,
          unlockedTraits: [...(state.player.unlockedTraits || []), traitId]
        },
        stats: {
          ...state.stats,
          traitsUnlocked: (state.stats?.traitsUnlocked || 0) + 1
        }
      };
      
      // Deduct essence if needed
      if (reqs.essenceCost) {
        updatedState = {
          ...updatedState,
          essence: {
            ...updatedState.essence,
            amount: updatedState.essence.amount - reqs.essenceCost
          }
        };
      }
      
      return addNotification(updatedState, {
        message: `Unlocked new trait: ${trait.name}`,
        type: "success",
        duration: 5000
      });
    }
    
    case ACTION_TYPES.EQUIP_TRAIT: {
      const { traitId } = action.payload;
      
      // Check if trait is unlocked
      if (!state.player.unlockedTraits?.includes(traitId)) {
        return addNotification(state, {
          message: "You must unlock this trait before equipping it.",
          type: "error"
        });
      }
      
      // Check if trait is already equipped
      if (state.player.equippedTraits?.includes(traitId)) {
        return addNotification(state, {
          message: "This trait is already equipped.",
          type: "info"
        });
      }
      
      // Check if player has available trait slots
      const traitSlots = state.player.traitSlots || 3;
      if ((state.player.equippedTraits?.length || 0) >= traitSlots) {
        return addNotification(state, {
          message: `You cannot equip more than ${traitSlots} traits. Unequip a trait first.`,
          type: "warning"
        });
      }
      
      // Get trait data
      const trait = state.gameData?.traits?.[traitId];
      
      // Update equipped traits
      return addNotification({
        ...state,
        player: {
          ...state.player,
          equippedTraits: [...(state.player.equippedTraits || []), traitId]
        },
        stats: {
          ...state.stats,
          traitsEquipped: {
            ...(state.stats?.traitsEquipped || {}),
            [traitId]: ((state.stats?.traitsEquipped || {})[traitId] || 0) + 1
          }
        }
      }, {
        message: `Equipped trait: ${trait?.name || 'Unknown Trait'}`,
        type: "success"
      });
    }
    
    case ACTION_TYPES.UNEQUIP_TRAIT: {
      const { traitId } = action.payload;
      
      // Check if trait is equipped
      if (!state.player.equippedTraits?.includes(traitId)) {
        return addNotification(state, {
          message: "This trait is not equipped.",
          type: "info"
        });
      }
      
      // Get trait data
      const trait = state.gameData?.traits?.[traitId];
      
      // Remove from equipped traits
      return addNotification({
        ...state,
        player: {
          ...state.player,
          equippedTraits: state.player.equippedTraits.filter(id => id !== traitId)
        }
      }, {
        message: `Unequipped trait: ${trait?.name || 'Unknown Trait'}`,
        type: "info"
      });
    }
    
    case ACTION_TYPES.INCREASE_TRAIT_AFFINITY: {
      const { category, amount = 1 } = action.payload;
      
      const currentAffinity = state.player.traitAffinities?.[category] || 0;
      const newAffinity = currentAffinity + amount;
      
      // Check for level up
      const showLevelNotification = Math.floor(newAffinity / 10) > Math.floor(currentAffinity / 10);
      
      // Update affinity
      let updatedState = {
        ...state,
        player: {
          ...state.player,
          traitAffinities: {
            ...(state.player.traitAffinities || {}),
            [category]: newAffinity
          }
        }
      };
      
      // Show notification for significant increase
      if (showLevelNotification) {
        return addNotification(updatedState, {
          message: `${category} affinity increased to level ${Math.floor(newAffinity / 10) + 1}!`,
          type: "achievement"
        });
      }
      
      return updatedState;
    }
    
    case ACTION_TYPES.EVOLVE_TRAIT: {
      const { traitId, evolutionChoice } = action.payload;
      
      // Check if trait is unlocked
      if (!state.player.unlockedTraits?.includes(traitId)) {
        return addNotification(state, {
          message: "You don't have this trait unlocked.",
          type: "error"
        });
      }
      
      // Get trait data
      const trait = state.gameData?.traits?.[traitId];
      if (!trait?.evolutionPath?.includes(evolutionChoice)) {
        return addNotification(state, {
          message: "Invalid evolution choice for this trait.",
          type: "error"
        });
      }
      
      // Check evolution requirements
      const evolutionTrait = state.gameData?.traits?.[evolutionChoice];
      if (!evolutionTrait) {
        return state;
      }
      
      // Handle requirements checking similar to UNLOCK_TRAIT
      // ...
      
      // Evolution process
      let updatedState = {
        ...state,
        player: {
          ...state.player,
          unlockedTraits: [
            ...state.player.unlockedTraits.filter(id => id !== traitId),
            evolutionChoice
          ]
        }
      };
      
      // If original trait was equipped, replace it with evolution
      if (state.player.equippedTraits?.includes(traitId)) {
        updatedState.player.equippedTraits = updatedState.player.equippedTraits?.map(
          id => id === traitId ? evolutionChoice : id
        );
      }
      
      return addNotification(updatedState, {
        message: `${trait.name} evolved into ${evolutionTrait.name}!`,
        type: "achievement",
        duration: 5000
      });
    }
    
    default:
      return state;
  }
};
