import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Player Reducer - Manages player character state and progression
 */

interface GameState {
  player: PlayerState;
  gameData?: GameData;
  [key: string]: any;
}

interface PlayerState {
  name: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  inventory: InventoryItem[];
  equippedItems?: Record<string, string>;
  attributes?: Record<string, number>;
  attributePoints?: number;
  skills?: Skill[];
  traits?: Record<string, any>;
  acquiredTraits?: string[];
  equippedTraits?: string[];
  activeEffects?: StatusEffect[];
  characters?: Character[];
  activeCharacter?: string;
  stats?: Record<string, any>;
  [key: string]: any;
}

interface GameData {
  experienceCurve?: Array<number>;
  attributes?: Record<string, AttributeData>;
  skills?: Record<string, SkillData>;
  [key: string]: any;
}

interface InventoryItem {
  id: string;
  quantity: number;
  [key: string]: any;
}

interface Skill {
  id: string;
  level: number;
  experience: number;
  [key: string]: any;
}

interface SkillData {
  name: string;
  description: string;
  maxLevel: number;
  [key: string]: any;
}

interface AttributeData {
  name: string;
  description: string;
  baseValue: number;
  maxValue: number;
  [key: string]: any;
}

interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  [key: string]: any;
}

interface Character {
  id: string;
  name: string;
  level: number;
  [key: string]: any;
}

// Helper functions
const calculateLevelUpRequirements = (level: number, curve: number[] = [100, 200, 350, 550, 800]) => {
  if (level <= curve.length) return curve[level - 1];
  // Exponential scaling for levels beyond the predefined curve
  return Math.floor(100 * Math.pow(level, 1.8));
};

export const playerReducer = (state: GameState, action: { type: string; payload: any }): GameState => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_EXPERIENCE: {
      const { amount, source } = action.payload;
      const currentXP = state.player.experience + amount;
      
      // XP required for next level
      const requiredXP = calculateLevelUpRequirements(
        state.player.level,
        state.gameData?.experienceCurve
      );
      
      // Check if player should level up
      if (currentXP >= requiredXP) {
        // Calculate new level and remaining XP
        const newLevel = state.player.level + 1;
        const remainingXP = currentXP - requiredXP;
        
        // Calculate attribute points to award
        const attributePoints = (state.player.attributePoints || 0) + 3;
        
        // Calculate health and energy increases
        const constitutionBonus = (state.player.attributes?.constitution || 0) * 2;
        const intelligenceBonus = (state.player.attributes?.intelligence || 0) * 1.5;
        
        const healthIncrease = 10 + constitutionBonus;
        const energyIncrease = 5 + intelligenceBonus;
        
        // Create updated state with level up
        const updatedState = {
          ...state,
          player: {
            ...state.player,
            level: newLevel,
            experience: remainingXP,
            attributePoints,
            maxHealth: state.player.maxHealth + healthIncrease,
            health: state.player.maxHealth + healthIncrease, // Fully heal on level up
            maxEnergy: state.player.maxEnergy + energyIncrease,
            energy: state.player.maxEnergy + energyIncrease, // Fully restore energy on level up
            stats: {
              ...(state.player.stats || {}),
              timesLeveledUp: (state.player.stats?.timesLeveledUp || 0) + 1,
              highestLevelReached: Math.max(newLevel, state.player.stats?.highestLevelReached || 0)
            }
          }
        };
        
        return addNotification(updatedState, {
          message: `Level Up! You are now level ${newLevel}. Gained ${attributePoints - (state.player.attributePoints || 0)} attribute points!`,
          type: "achievement",
          duration: 5000
        });
      }
      
      // No level up, just add XP
      return {
        ...state,
        player: {
          ...state.player,
          experience: currentXP
        }
      };
    }
    
    case ACTION_TYPES.MODIFY_HEALTH: {
      const { amount, reason } = action.payload;
      
      // Calculate new health with bounds
      const newHealth = Math.max(0, Math.min(state.player.maxHealth, state.player.health + amount));
      
      // Player death check
      if (newHealth === 0 && state.player.health > 0) {
        const deathState = {
          ...state,
          player: {
            ...state.player,
            health: 0,
            stats: {
              ...(state.player.stats || {}),
              deaths: (state.player.stats?.deaths || 0) + 1,
              lastDeathReason: reason || 'unknown',
              lastDeathTime: Date.now()
            }
          }
        };
        
        return addNotification(deathState, {
          message: "You have been defeated!",
          type: "danger",
          duration: 5000
        });
      }
      
      // Health change only
      return {
        ...state,
        player: {
          ...state.player,
          health: newHealth
        }
      };
    }
    
    case ACTION_TYPES.MODIFY_ENERGY: {
      const { amount } = action.payload;
      
      // Calculate new energy with bounds
      const newEnergy = Math.max(0, Math.min(state.player.maxEnergy, state.player.energy + amount));
      
      return {
        ...state,
        player: {
          ...state.player,
          energy: newEnergy
        }
      };
    }
    
    case ACTION_TYPES.ALLOCATE_ATTRIBUTE: {
      const { attributeName, amount = 1 } = action.payload;
      
      // Check if player has enough attribute points
      if ((state.player.attributePoints || 0) < amount) {
        return addNotification(state, {
          message: "Not enough attribute points.",
          type: "error"
        });
      }
      
      // Check if attribute exists
      if (!state.gameData?.attributes?.[attributeName]) {
        return addNotification(state, {
          message: "Invalid attribute.",
          type: "error"
        });
      }
      
      // Get current attribute value
      const currentValue = state.player.attributes?.[attributeName] || 0;
      
      // Get max attribute value
      const maxValue = state.gameData.attributes[attributeName].maxValue || 100;
      
      // Check if attribute is already at max
      if (currentValue >= maxValue) {
        return addNotification(state, {
          message: `${state.gameData.attributes[attributeName].name} is already at maximum.`,
          type: "warning"
        });
      }
      
      // Calculate new value, capped at max
      const newValue = Math.min(maxValue, currentValue + amount);
      
      return {
        ...state,
        player: {
          ...state.player,
          attributePoints: (state.player.attributePoints || 0) - amount,
          attributes: {
            ...(state.player.attributes || {}),
            [attributeName]: newValue
          }
        }
      };
    }
    
    case ACTION_TYPES.ACQUIRE_TRAIT: {
      const { traitId } = action.payload;
      
      // Check if already acquired
      if (state.player.acquiredTraits?.includes(traitId)) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          acquiredTraits: [...(state.player.acquiredTraits || []), traitId]
        }
      };
    }
    
    case ACTION_TYPES.EQUIP_TRAIT: {
      const { traitId } = action.payload;
      
      // Check if player has this trait
      if (!state.player.acquiredTraits?.includes(traitId)) {
        return addNotification(state, {
          message: "You don't have this trait.",
          type: "error"
        });
      }
      
      // Check if already equipped
      if (state.player.equippedTraits?.includes(traitId)) {
        return state;
      }
      
      // Check if reached max equipped traits
      const maxTraits = 3; // Could be dynamic based on player level or other factors
      if ((state.player.equippedTraits?.length || 0) >= maxTraits) {
        return addNotification(state, {
          message: `You can only equip ${maxTraits} traits at once. Unequip one first.`,
          type: "warning"
        });
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: [...(state.player.equippedTraits || []), traitId]
        }
      };
    }
    
    case ACTION_TYPES.REST: {
      const { duration, location } = action.payload;
      const restEfficiency = location === 'inn' ? 2 : 1; // Example of location bonus
      
      // Calculate health and energy restored based on duration and location
      const healthRestored = Math.floor(duration * 5 * restEfficiency);
      const energyRestored = Math.floor(duration * 10 * restEfficiency);
      
      // Apply recovery with caps
      return {
        ...state,
        player: {
          ...state.player,
          health: Math.min(state.player.maxHealth, state.player.health + healthRestored),
          energy: Math.min(state.player.maxEnergy, state.player.energy + energyRestored),
          stats: {
            ...(state.player.stats || {}),
            timeSpentResting: (state.player.stats?.timeSpentResting || 0) + duration
          }
        }
      };
    }
    
    default:
      return state;
  }
};
