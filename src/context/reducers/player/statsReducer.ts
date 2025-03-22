import { PlayerState, PlayerStats } from '../../types/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { isActionOfType } from '../playerReducer';

/**
 * Stats reducer - manages player stats independent of attributes
 * 
 * Responsible for:
 * - Direct stat updates (not derived from attributes)
 * - Managing specific stat values
 */
export const statsReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.UPDATE_STAT:
      // Type guard for UPDATE_STAT action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_STAT)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('stat' in action.payload) || !('value' in action.payload)) {
        return state;
      }
      
      const stat = action.payload.stat;
      const value = action.payload.value;
      
      return {
        ...state,
        stats: {
          ...state.stats,
          [stat]: value
        }
      };

    case PLAYER_ACTIONS.UPDATE_STATS:
      // First check if action is of the correct type
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_STATS)) {
        return state;
      }
      
      if (!action.payload || typeof action.payload !== 'object') {
        return state;
      }
      
      // Create a properly typed copy of stats with only valid numeric values
      const updatedStats: PlayerStats = {
        ...state.stats
      };
      
      // Only add valid numeric properties to ensure type safety
      Object.entries(action.payload).forEach(([key, value]) => {
        if (typeof value === 'number') {
          updatedStats[key] = value;
        }
      });
      
      return {
        ...state,
        stats: updatedStats
      };

    default:
      return state;
  }
};
