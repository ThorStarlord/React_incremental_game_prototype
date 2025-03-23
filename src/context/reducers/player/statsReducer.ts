import { PlayerState, PlayerStats } from '../../types/gameStates/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { isActionOfType } from '../playerReducer';

/**
 * Interfaces for properly typed payloads
 */
interface UpdateStatPayload {
  stat: string;
  value: number;
  min?: number;
  max?: number;
}

interface UpdateStatsPayload {
  [key: string]: number;
}

/**
 * Validates a single stat value against bounds
 * 
 * @param value - Value to validate
 * @param min - Optional minimum value
 * @param max - Optional maximum value
 * @returns Validated value within bounds
 */
const validateStatValue = (value: number, min?: number, max?: number): number => {
  if (min !== undefined && value < min) {
    console.warn(`Stat value ${value} below minimum ${min}, clamping to minimum`);
    return min;
  }
  if (max !== undefined && value > max) {
    console.warn(`Stat value ${value} above maximum ${max}, clamping to maximum`);
    return max;
  }
  return value;
};

/**
 * Safely updates player stats
 * 
 * @param currentStats - Current player stats
 * @param updates - Stats to update
 * @returns Updated stats object
 */
const updatePlayerStats = (
  currentStats: PlayerStats = { 
    health: 0, 
    maxHealth: 100, 
    mana: 0, 
    maxMana: 100, 
    healthRegen: 1, 
    manaRegen: 1,
    attack: 5,
    defense: 5,
    accuracy: 0.9,
    evasion: 0.05,
    critChance: 0.05,
    critMultiplier: 1.5,
    speed: 10,
    physicalDamage: 5,
    magicalDamage: 5,
    armor: 0,
    magicResistance: 0
  }, 
  updates: Record<string, number>
): PlayerStats => {
  const result = { ...currentStats };
  
  Object.entries(updates).forEach(([key, value]) => {
    if (typeof value === 'number' && !isNaN(value)) {
      // Apply common validation rules based on stat type
      if (key.startsWith('max') || key === 'health' || key === 'mana') {
        // Health/mana/max stats shouldn't be negative
        result[key] = Math.max(0, value);
      } else if (key.includes('resistance') || key.includes('defense') || key.includes('armor')) {
        // Cap resistance/defense stats for balance
        result[key] = Math.min(95, Math.max(-95, value));
      } else if (key.includes('chance')) {
        // Chance values should be between 0 and 1 (0-100%)
        result[key] = Math.min(1, Math.max(0, value));
      } else {
        // General case
        result[key] = value;
      }
    } else {
      console.warn(`Invalid stat value for ${key}:`, value);
    }
  });
  
  return result;
};

/**
 * Stats reducer - manages player stats independent of attributes
 * 
 * Responsible for:
 * - Direct stat updates (not derived from attributes)
 * - Managing specific stat values with validation
 * - Ensuring stats stay within game balance limits
 */
export const statsReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.UPDATE_STAT: {
      // Type guard for UPDATE_STAT action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_STAT)) {
        return state;
      }
      
      // Check payload shape with better error message
      if (!action.payload || typeof action.payload !== 'object' || 
          !('stat' in action.payload) || !('value' in action.payload)) {
        console.error('Invalid UPDATE_STAT payload structure:', action.payload);
        return state;
      }
      
      const payload = action.payload as UpdateStatPayload;
      const { stat, value, min, max } = payload;
      
      // Validate the incoming value
      const validValue = validateStatValue(value, min, max);
      
      // Ensure stats object exists with safe fallback
      const currentStats = state.stats || {};
      
      return {
        ...state,
        stats: {
          ...currentStats,
          [stat]: validValue
        }
      };
    }

    case PLAYER_ACTIONS.UPDATE_STATS: {
      // Type guard for UPDATE_STATS action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_STATS)) {
        return state;
      }
      
      // Check payload validity
      if (!action.payload || typeof action.payload !== 'object') {
        console.error('Invalid UPDATE_STATS payload:', action.payload);
        return state;
      }
      
      // Use helper function to update stats with validation
      const updatedStats = updatePlayerStats(
        state.stats || {}, 
        action.payload as UpdateStatsPayload
      );
      
      // Return updated state with new stats
      return {
        ...state,
        stats: updatedStats
      };
    }

    default:
      return state;
  }
};
