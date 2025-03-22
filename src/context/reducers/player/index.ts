import { PlayerState } from '../../types/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { attributesReducer } from './attributesReducer';
import { statsReducer } from './statsReducer';
import { skillsReducer } from './skillsReducer';
import { traitsReducer } from './traitsReducer';
import { statusReducer } from './statusReducer';
import { coreReducer } from './coreReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';

/**
 * Combined player reducer that delegates to specific sub-reducers based on action type
 * 
 * Each sub-reducer handles a specific domain of player functionality:
 * - Attributes: Strength, intelligence, etc.
 * - Stats: Health, mana, derived statistics
 * - Skills: Character skills and progression
 * - Traits: Character traits/perks
 * - Status Effects: Temporary effects on the player
 * - Core: Basic player properties and actions
 */
export const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  // First apply the action to the core reducer
  const nextState = coreReducer(state, action);
  
  // If the state changed, return it (core reducer handled the action)
  if (nextState !== state) {
    return nextState;
  }
  
  // Based on action type, delegate to the appropriate sub-reducer
  switch (action.type) {
    // Attributes-related actions
    case PLAYER_ACTIONS.UPDATE_ATTRIBUTE:
    case PLAYER_ACTIONS.UPDATE_ATTRIBUTES:
    case PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE:
    case PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS:
    case PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS:
      return attributesReducer(state, action);
      
    // Stats-related actions
    case PLAYER_ACTIONS.UPDATE_STAT:
    case PLAYER_ACTIONS.UPDATE_STATS:
      return statsReducer(state, action);
      
    // Skills-related actions
    case PLAYER_ACTIONS.UPDATE_SKILL:
    case PLAYER_ACTIONS.LEARN_SKILL:
    case PLAYER_ACTIONS.UPGRADE_SKILL:
      return skillsReducer(state, action);
      
    // Traits-related actions
    case PLAYER_ACTIONS.EQUIP_TRAIT:
    case PLAYER_ACTIONS.UNEQUIP_TRAIT:
    case PLAYER_ACTIONS.ADD_TRAIT:
    case PLAYER_ACTIONS.REMOVE_TRAIT:
    case PLAYER_ACTIONS.ACQUIRE_TRAIT:
      return traitsReducer(state, action);
      
    // Status effects-related actions
    case PLAYER_ACTIONS.ADD_STATUS_EFFECT:
    case PLAYER_ACTIONS.REMOVE_STATUS_EFFECT:
      return statusReducer(state, action);
      
    // Default - no changes
    default:
      return state;
  }
};

// Re-export all the sub-reducers for direct access
export { 
  attributesReducer,
  statsReducer,
  skillsReducer,
  traitsReducer,
  statusReducer,
  coreReducer
};

// Re-export the type guard for use in sub-reducers
export { isActionOfType } from '../playerReducer';

// Export default for backward compatibility
export default playerReducer;
