import { PlayerState, PlayerAttributes, PlayerStats, StatusEffect } from '../types/GameStateTypes';
import { PlayerInitialState } from '../initialStates/PlayerInitialState';
import { createReducer } from '../utils/reducerUtils';
import { Skill } from '../types/combat/skills';
import { ACTION_TYPES, PLAYER_ACTIONS } from '../types/ActionTypes';

// Import the modularized player reducer
import { playerReducer as modularPlayerReducer } from './player';

// Type for player actions
export interface PlayerAction {
  type: string;
  payload: any;
}

/**
 * Type guard to check if an action is of a specific type
 */
export function isActionOfType<T extends string>(
  action: PlayerAction, 
  type: T
): action is PlayerAction & { type: T } {
  return action.type === type;
}

// Re-export the modularized player reducer as the main playerReducer
export const playerReducer = modularPlayerReducer;

// Export default for backward compatibility
export default playerReducer;
