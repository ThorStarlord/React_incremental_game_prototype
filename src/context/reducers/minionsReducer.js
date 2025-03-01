/**
 * @fileoverview Reducer for managing minions state in the incremental RPG.
 */

import { MINION_ACTION_TYPES } from '../actions/minionsActions';

/**
 * Initial state for minions
 * @type {Array<Object>}
 */
const initialState = [];

/**
 * Reducer for minion-related actions
 * @param {Array<Object>} state - The current minions state
 * @param {Object} action - The action to process
 * @returns {Array<Object>} The new minions state
 */
const minionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case MINION_ACTION_TYPES.HIRE_MINION: {
      const newMinion = {
        ...action.payload,
        id: `minion_${Date.now()}`,
        level: 1,
        experience: 0,
        assigned: null,
        status: 'idle'
      };
      return [...state, newMinion];
    }
    
    case MINION_ACTION_TYPES.DISMISS_MINION: {
      return state.filter(minion => minion.id !== action.payload.minionId);
    }
    
    case MINION_ACTION_TYPES.UPGRADE_MINION: {
      const { minionId, upgrades } = action.payload;
      return state.map(minion => {
        if (minion.id === minionId) {
          return {
            ...minion,
            stats: {
              ...minion.stats,
              ...upgrades
            }
          };
        }
        return minion;
      });
    }
    
    case MINION_ACTION_TYPES.ASSIGN_MINION: {
      const { minionId, taskId } = action.payload;
      return state.map(minion => {
        if (minion.id === minionId) {
          return {
            ...minion,
            assigned: taskId,
            status: 'working'
          };
        }
        return minion;
      });
    }
    
    case MINION_ACTION_TYPES.UNASSIGN_MINION: {
      const { minionId } = action.payload;
      return state.map(minion => {
        if (minion.id === minionId) {
          return {
            ...minion,
            assigned: null,
            status: 'idle'
          };
        }
        return minion;
      });
    }
    
    case MINION_ACTION_TYPES.LEVEL_UP_MINION: {
      const { minionId } = action.payload;
      return state.map(minion => {
        if (minion.id === minionId) {
          return {
            ...minion,
            level: minion.level + 1,
            experience: 0,
            stats: {
              ...minion.stats,
              strength: minion.stats.strength + 1,
              speed: minion.stats.speed + 0.5,
              efficiency: minion.stats.efficiency + 0.5
            }
          };
        }
        return minion;
      });
    }
    
    case MINION_ACTION_TYPES.SET_MINIONS: {
      return [...action.payload];
    }
    
    case MINION_ACTION_TYPES.UPDATE_MINION_STATUS: {
      const { minionId, status } = action.payload;
      return state.map(minion => {
        if (minion.id === minionId) {
          return {
            ...minion,
            ...status
          };
        }
        return minion;
      });
    }
    
    default:
      return state;
  }
};

export default minionsReducer;
