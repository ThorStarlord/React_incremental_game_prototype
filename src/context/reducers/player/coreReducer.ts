import { PlayerState } from '../../types/gameStates/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { PlayerInitialState } from '../../initialStates/PlayerInitialState';
import { isActionOfType } from '../playerReducer';

// Interfaces for typed payloads
interface ModifyHealthPayload {
  amount: number;
  reason?: string;
  timestamp?: number;
}

interface ModifyEnergyPayload {
  amount: number;
  reason?: string;
  timestamp?: number;
}

interface RestPayload {
  duration: number;
  location?: string;
  timestamp?: number;
}

interface ResetPlayerPayload {
  keepName?: boolean;
}

interface ActiveCharacterPayload {
  characterId: string;
  timestamp?: number;
}

/**
 * Safely applies rest effect to restore health and mana
 */
function applyRest(state: PlayerState, duration: number, location?: string): PlayerState {
  // Get current stats with safe defaults
  const stats = state.stats || { health: 0, maxHealth: 100, mana: 0, maxMana: 100, healthRegen: 1, manaRegen: 1 };
  
  // Calculate recovery amounts
  const healthRecovery = Math.min(
    stats.maxHealth - stats.health,
    Math.floor((stats.healthRegen || 1) * duration)
  );
  
  const manaRecovery = Math.min(
    stats.maxMana - stats.mana,
    Math.floor((stats.manaRegen || 1) * duration)
  );
  
  return {
    ...state,
    stats: {
      ...stats,
      health: stats.health + healthRecovery,
      mana: stats.mana + manaRecovery
    },
    lastRestLocation: location,
    lastRestTime: Date.now()
  };
}

/**
 * Core player reducer - handles basic player state properties
 * 
 * Responsible for:
 * - Basic player state updates
 * - Name management
 * - Health/energy modification
 * - Rest mechanics
 * - Character management
 * - Player reset
 */
export const coreReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.UPDATE_PLAYER:
      // Ensure payload is a valid object
      if (!action.payload || typeof action.payload !== 'object') {
        console.warn('Invalid UPDATE_PLAYER payload', action.payload);
        return state;
      }
      
      return {
        ...state,
        ...action.payload
      };

    case PLAYER_ACTIONS.SET_NAME:
      // Type guard for SET_NAME action
      if (!isActionOfType(action, PLAYER_ACTIONS.SET_NAME)) {
        return state;
      }
      
      // Ensure name is a valid string
      const name = action.payload;
      if (typeof name !== 'string' || name.trim() === '') {
        console.warn('Invalid player name provided', name);
        return state;
      }
      
      return {
        ...state,
        name
      };

    case PLAYER_ACTIONS.RESET_PLAYER:
      // Type guard for RESET_PLAYER action
      if (!isActionOfType(action, PLAYER_ACTIONS.RESET_PLAYER)) {
        return state;
      }
      
      // Extract keepName option with safe default
      const payload = action.payload as ResetPlayerPayload || {};
      const keepName = payload.keepName === true;
      
      // Create a deep copy of the initial state
      const newState = JSON.parse(JSON.stringify(PlayerInitialState));
      
      // Preserve name if requested
      if (keepName && state.name) {
        newState.name = state.name;
      }
      
      // Preserve creation date or set a new one
      newState.creationDate = state.creationDate || new Date().toISOString();
      
      return newState;

    case PLAYER_ACTIONS.REST:
      // Type guard for REST action
      if (!isActionOfType(action, PLAYER_ACTIONS.REST)) {
        return state;
      }
      
      // Extract payload with safe defaults
      const restPayload = action.payload as RestPayload || {};
      const duration = typeof restPayload.duration === 'number' ? restPayload.duration : 1;
      const location = typeof restPayload.location === 'string' ? restPayload.location : undefined;
      
      // Apply rest effect
      return applyRest(state, duration, location);

    case PLAYER_ACTIONS.MODIFY_HEALTH:
      // Type guard for MODIFY_HEALTH action
      if (!isActionOfType(action, PLAYER_ACTIONS.MODIFY_HEALTH)) {
        return state;
      }
      
      // Extract payload with safe handling
      const healthPayload = action.payload as ModifyHealthPayload || {};
      if (typeof healthPayload.amount !== 'number') {
        console.warn('Invalid health modification amount', healthPayload);
        return state;
      }
      
      // Ensure stats object exists
      const currentStats = state.stats || { health: 0, maxHealth: 100 };
      
      // Calculate new health value with caps
      const healthAmount = healthPayload.amount;
      const newHealth = Math.max(0, Math.min(currentStats.maxHealth, currentStats.health + healthAmount));
      
      return {
        ...state,
        stats: {
          ...currentStats,
          health: newHealth
        }
      };

    case PLAYER_ACTIONS.MODIFY_ENERGY:
      // Type guard for MODIFY_ENERGY action
      if (!isActionOfType(action, PLAYER_ACTIONS.MODIFY_ENERGY)) {
        return state;
      }
      
      // Extract payload with safe handling
      const energyPayload = action.payload as ModifyEnergyPayload || {};
      if (typeof energyPayload.amount !== 'number') {
        console.warn('Invalid energy modification amount', energyPayload);
        return state;
      }
      
      // Ensure stats object exists
      const currentEnergyStats = state.stats || { mana: 0, maxMana: 100 };
      
      // Calculate new mana value with caps
      const energyAmount = energyPayload.amount;
      const newEnergy = Math.max(0, Math.min(currentEnergyStats.maxMana, currentEnergyStats.mana + energyAmount));
      
      return {
        ...state,
        stats: {
          ...currentEnergyStats,
          mana: newEnergy
        }
      };

    case PLAYER_ACTIONS.SET_ACTIVE_CHARACTER:
      // Type guard for SET_ACTIVE_CHARACTER action
      if (!isActionOfType(action, PLAYER_ACTIONS.SET_ACTIVE_CHARACTER)) {
        return state;
      }
      
      // Extract payload with validation
      const charPayload = action.payload as ActiveCharacterPayload;
      if (!charPayload || typeof charPayload.characterId !== 'string') {
        console.warn('Invalid character ID', charPayload);
        return state;
      }
      
      return {
        ...state,
        activeCharacterId: charPayload.characterId
      };

    case PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME:
      // Type guard for UPDATE_TOTAL_PLAYTIME action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME)) {
        return state;
      }
      
      // Ensure payload is a number
      const seconds = action.payload;
      if (typeof seconds !== 'number' || seconds <= 0) {
        console.warn('Invalid playtime update value', seconds);
        return state;
      }
      
      // Use current value with safe default
      const currentPlayTime = state.totalPlayTime || 0;
      
      return {
        ...state,
        totalPlayTime: currentPlayTime + seconds
      };

    default:
      return state;
  }
};
