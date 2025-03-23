/**
 * Player Reducer System
 * =====================
 * 
 * This module brings together all player-related reducers in a modular architecture.
 * Each sub-reducer handles a specific domain of player functionality, keeping the
 * code organized and maintainable.
 */
import { PlayerState } from '../../types/gameStates/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';

// Import all sub-reducers
import { attributesReducer } from './attributesReducer';
import { statsReducer } from './statsReducer';
import { skillsReducer } from './skillsReducer';
import { traitsReducer } from './traitsReducer';
import { statusReducer } from './statusReducer';
import { coreReducer } from './coreReducer';

/**
 * Map of action types to their corresponding sub-reducer
 * This improves performance by directly mapping actions to the correct handler
 */
const REDUCER_MAP: Record<string, (state: PlayerState, action: PlayerAction) => PlayerState> = {
  // Core player actions
  [PLAYER_ACTIONS.UPDATE_PLAYER]: coreReducer,
  [PLAYER_ACTIONS.SET_NAME]: coreReducer,
  [PLAYER_ACTIONS.RESET_PLAYER]: coreReducer,
  [PLAYER_ACTIONS.REST]: coreReducer,
  [PLAYER_ACTIONS.MODIFY_HEALTH]: coreReducer,
  [PLAYER_ACTIONS.MODIFY_ENERGY]: coreReducer,
  [PLAYER_ACTIONS.SET_ACTIVE_CHARACTER]: coreReducer,
  [PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME]: coreReducer,
  
  // Attribute actions
  [PLAYER_ACTIONS.UPDATE_ATTRIBUTE]: attributesReducer,
  [PLAYER_ACTIONS.UPDATE_ATTRIBUTES]: attributesReducer,
  [PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE]: attributesReducer,
  [PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS]: attributesReducer,
  [PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS]: attributesReducer,
  
  // Stats actions
  [PLAYER_ACTIONS.UPDATE_STAT]: statsReducer,
  [PLAYER_ACTIONS.UPDATE_STATS]: statsReducer,
  
  // Skills actions
  [PLAYER_ACTIONS.UPDATE_SKILL]: skillsReducer,
  [PLAYER_ACTIONS.LEARN_SKILL]: skillsReducer,
  [PLAYER_ACTIONS.UPGRADE_SKILL]: skillsReducer,
  
  // Traits actions
  [PLAYER_ACTIONS.EQUIP_TRAIT]: traitsReducer,
  [PLAYER_ACTIONS.UNEQUIP_TRAIT]: traitsReducer,
  [PLAYER_ACTIONS.ADD_TRAIT]: traitsReducer,
  [PLAYER_ACTIONS.REMOVE_TRAIT]: traitsReducer,
  [PLAYER_ACTIONS.ACQUIRE_TRAIT]: traitsReducer,
  
  // Status effects actions
  [PLAYER_ACTIONS.ADD_STATUS_EFFECT]: statusReducer,
  [PLAYER_ACTIONS.REMOVE_STATUS_EFFECT]: statusReducer,
};

/**
 * Combined player reducer that efficiently delegates to specific sub-reducers
 * based on action type using a direct mapping approach.
 * 
 * Each sub-reducer handles a specific domain:
 * - Core: Basic player properties and actions
 * - Attributes: Strength, intelligence, etc.
 * - Stats: Health, mana, derived statistics
 * - Skills: Character skills and progression
 * - Traits: Character traits/perks
 * - Status Effects: Temporary effects on the player
 * 
 * @param state - Current player state
 * @param action - Action to process
 * @returns Updated player state
 */
export const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  // Look up the correct reducer based on action type
  const reducer = REDUCER_MAP[action.type];
  
  if (reducer) {
    // We have a specific reducer for this action type
    return reducer(state, action);
  }
  
  // No specific reducer found, default to core reducer for fallback handling
  return coreReducer(state, action);
};

/**
 * Type guard to check if an action is of a specific type
 * Used by sub-reducers to ensure type safety
 * 
 * @param action - The action to check
 * @param type - The specific action type to check for
 * @returns Type guard assertion
 */
export function isActionOfType<T extends string>(
  action: PlayerAction, 
  type: T
): action is PlayerAction & { type: T } {
  return action.type === type;
}

// Re-export all the sub-reducers for direct access
export { 
  attributesReducer,
  statsReducer,
  skillsReducer,
  traitsReducer,
  statusReducer,
  coreReducer
};

// Export default for backward compatibility
export default playerReducer;
