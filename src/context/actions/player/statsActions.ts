/**
 * Player Statistics Actions
 * ========================
 * 
 * Action creators for tracking and updating player statistics
 */

import { 
  PLAYER_ACTIONS, 
  PlayerAction,
  UpdateStatPayload,
  UpdateStatsPayload
} from '../../types/actions/playerActionTypes';
import { validatePositive, validateString } from './utils';

/**
 * Update total playtime for the player
 * 
 * @param seconds - Number of seconds to add
 * @returns UPDATE_TOTAL_PLAYTIME action
 */
export function updateTotalPlayTime(seconds: number): PlayerAction {
  validatePositive(seconds, 'Playtime seconds');
  
  return {
    type: PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME,
    payload: seconds
  };
}

/**
 * Update a single player stat
 * 
 * @param stat - Name of the stat to update
 * @param value - New value for the stat
 * @param min - Optional minimum value
 * @param max - Optional maximum value
 * @returns UPDATE_STAT action
 */
export function updateStat(
  stat: string, 
  value: number, 
  min?: number, 
  max?: number
): PlayerAction {
  validateString(stat, 'Stat name');
  
  return {
    type: PLAYER_ACTIONS.UPDATE_STAT,
    payload: {
      stat,
      value,
      min,
      max
    } as UpdateStatPayload
  };
}

/**
 * Update multiple stats at once
 * 
 * @param stats - Object containing stat names and values
 * @returns UPDATE_STATS action
 */
export function updateStats(stats: Record<string, number>): PlayerAction {
  return {
    type: PLAYER_ACTIONS.UPDATE_STATS,
    payload: stats as UpdateStatsPayload
  };
}
