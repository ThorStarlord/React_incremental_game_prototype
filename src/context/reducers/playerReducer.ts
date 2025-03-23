/**
 * Player Reducer
 * ==============
 * 
 * This file serves as the entry point for the modularized player reducer system.
 * It re-exports the modular player reducer as the main reducer, while providing
 * type definitions and utility functions for player actions.
 * 
 * The actual reducer logic has been modularized into separate files within the
 * 'player/' directory, each responsible for a specific aspect of player state:
 * - Core: Basic player properties (name, health, etc.)
 * - Attributes: Player character attributes (strength, dexterity, etc.)
 * - Stats: Derived statistics from attributes and equipment
 * - Skills: Player skill progression and management
 * - Traits: Character traits and perks
 * - Status Effects: Temporary buffs/debuffs
 */

// Type imports - only import what we actually use
import { PlayerState } from '../types/gameStates/GameStateTypes';

// Action types - import from the correct location
import { PLAYER_ACTIONS } from '../types/actions/playerActionTypes';

// Import the modularized player reducer and its sub-reducers
import { 
  playerReducer as modularPlayerReducer,
  coreReducer,
  attributesReducer,
  statsReducer,
  skillsReducer,
  traitsReducer,
  statusReducer
} from './player';

/**
 * Type definition for player actions
 * All player-related actions must follow this structure
 */
export interface PlayerAction {
  type: string;
  payload: any;
}

/**
 * Type guard to check if an action is of a specific type
 * Used by sub-reducers to ensure type safety in action handling
 * 
 * @example
 * if (isActionOfType(action, PLAYER_ACTIONS.UPDATE_ATTRIBUTE)) {
 *   // TypeScript now knows that action.payload has the UpdateAttributePayload shape
 * }
 */
export function isActionOfType<T extends string>(
  action: PlayerAction, 
  type: T
): action is PlayerAction & { type: T } {
  return action.type === type;
}

// Re-export the modularized player reducer as the main player reducer
export const playerReducer = modularPlayerReducer;

// Export sub-reducers for direct access when needed
export {
  coreReducer,
  attributesReducer,
  statsReducer,
  skillsReducer,
  traitsReducer,
  statusReducer
};

// Export default for backward compatibility
export default playerReducer;
