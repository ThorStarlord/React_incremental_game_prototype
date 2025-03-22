import { PlayerState } from '../../types/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { PlayerInitialState } from '../../initialStates/PlayerInitialState';
import { isActionOfType } from '../playerReducer';

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
      // Make sure payload is a valid object before spreading
      if (action.payload && typeof action.payload === 'object') {
        return {
          ...state,
          ...action.payload
        };
      }
      return state;

    case PLAYER_ACTIONS.SET_NAME:
      // Type guard for SET_NAME action
      if (!isActionOfType(action, PLAYER_ACTIONS.SET_NAME)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is a string
      return {
        ...state,
        name: action.payload
      };

    case PLAYER_ACTIONS.RESET_PLAYER:
      // Type guard for RESET_PLAYER action
      if (!isActionOfType(action, PLAYER_ACTIONS.RESET_PLAYER)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is of type { keepName?: boolean } | undefined
      const keepName = action.payload?.keepName ?? false;
      
      // Make a deep copy of the initial state
      const newState = structuredClone(PlayerInitialState);
      if (keepName) {
        newState.name = state.name;
      }
      // Preserve creation date if it exists, otherwise set it to now
      newState.creationDate = state.creationDate || new Date().toISOString();
      return newState;

    case PLAYER_ACTIONS.REST:
      // Type guard for REST action
      if (!isActionOfType(action, PLAYER_ACTIONS.REST)) {
        return state;
      }

      // Set default values without using spread
      let duration = 1;
      let location = undefined;
      
      // Access payload properties safely
      if (action.payload && typeof action.payload === 'object') {
        if ('duration' in action.payload && typeof action.payload.duration === 'number') {
          duration = action.payload.duration;
        }
        if ('location' in action.payload && typeof action.payload.location === 'string') {
          location = action.payload.location;
        }
      }
      
      // Continue with the rest of the logic
      const healthRecovery = Math.min(
        state.stats.maxHealth - state.stats.health,
        Math.floor(state.stats.healthRegen * duration)
      );
      const manaRecovery = Math.min(
        state.stats.maxMana - state.stats.mana,
        Math.floor(state.stats.manaRegen * duration)
      );
      return {
        ...state,
        stats: {
          ...state.stats,
          health: state.stats.health + healthRecovery,
          mana: state.stats.mana + manaRecovery
        },
        lastRestLocation: location,
        lastRestTime: Date.now()
      };

    case PLAYER_ACTIONS.MODIFY_HEALTH:
      // Type guard for MODIFY_HEALTH action
      if (!isActionOfType(action, PLAYER_ACTIONS.MODIFY_HEALTH)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('amount' in action.payload)) {
        return state;
      }
      
      const healthAmount = action.payload.amount;
      const newHealth = Math.max(0, Math.min(state.stats.maxHealth, state.stats.health + healthAmount));
      return {
        ...state,
        stats: {
          ...state.stats,
          health: newHealth
        }
      };

    case PLAYER_ACTIONS.MODIFY_ENERGY:
      // Type guard for MODIFY_ENERGY action
      if (!isActionOfType(action, PLAYER_ACTIONS.MODIFY_ENERGY)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('amount' in action.payload)) {
        return state;
      }
      
      const energyAmount = action.payload.amount;
      const newEnergy = Math.max(0, Math.min(state.stats.maxMana, state.stats.mana + energyAmount));
      return {
        ...state,
        stats: {
          ...state.stats,
          mana: newEnergy
        }
      };

    case PLAYER_ACTIONS.SET_ACTIVE_CHARACTER:
      // Type guard for SET_ACTIVE_CHARACTER action
      if (!isActionOfType(action, PLAYER_ACTIONS.SET_ACTIVE_CHARACTER)) {
        return state;
      }
      
      // Now TypeScript knows that action.payload has a characterId property
      return {
        ...state,
        activeCharacterId: action.payload.characterId
      };

    case PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME:
      // Type guard for UPDATE_TOTAL_PLAYTIME action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is a number
      return {
        ...state,
        totalPlayTime: state.totalPlayTime + action.payload
      };

    default:
      return state;
  }
};
