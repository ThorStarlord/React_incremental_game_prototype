import { MINION_ACTION_TYPES } from '../actions/minionsActions';

/**
 * Interface for minion state
 */
interface Minion {
  id: string;
  name: string;
  level: number;
  experience: number;
  assigned: string | null;
  status: string;
  stats: {
    strength: number;
    speed: number;
    efficiency: number;
    [key: string]: number;
  };
  [key: string]: any;
}

/**
 * Interface for minion action types
 */
interface MinionAction {
  type: string;
  payload: any;
}

/**
 * Initial state - empty array of minions
 */
const initialState: Minion[] = [];

/**
 * Helper functions
 */
const updateMinionById = (minions: Minion[], id: string, updates: Partial<Minion>): Minion[] => 
  minions.map(minion => minion.id === id ? { ...minion, ...updates } : minion);

/**
 * Minions Reducer - Manages minion collection and attributes
 */
const minionsReducer = (
  state: Minion[] = initialState,
  action: MinionAction
): Minion[] => {
  switch (action.type) {
    case MINION_ACTION_TYPES.HIRE_MINION: {
      // Create a new minion with default values and payload data
      const newMinion: Minion = {
        ...action.payload,
        id: `minion_${Date.now()}`,
        level: 1,
        experience: 0,
        assigned: null,
        status: 'idle'
      };
      return [...state, newMinion];
    }
    
    case MINION_ACTION_TYPES.DISMISS_MINION: 
      return state.filter(minion => minion.id !== action.payload.minionId);
    
    case MINION_ACTION_TYPES.UPGRADE_MINION: {
      const { minionId, upgrades } = action.payload;
      return updateMinionById(state, minionId, { 
        stats: {
          ...(state.find(m => m.id === minionId)?.stats || {}),
          ...upgrades
        } 
      });
    }
    
    case MINION_ACTION_TYPES.ASSIGN_MINION: {
      const { minionId, taskId } = action.payload;
      return updateMinionById(state, minionId, { 
        assigned: taskId, 
        status: 'working' 
      });
    }
    
    case MINION_ACTION_TYPES.UNASSIGN_MINION: {
      const { minionId } = action.payload;
      return updateMinionById(state, minionId, { 
        assigned: null, 
        status: 'idle' 
      });
    }
    
    case MINION_ACTION_TYPES.LEVEL_UP_MINION: {
      const { minionId } = action.payload;
      const minion = state.find(m => m.id === minionId);
      
      if (!minion) return state;
      
      return updateMinionById(state, minionId, {
        level: minion.level + 1,
        experience: 0,
        stats: {
          ...minion.stats,
          strength: minion.stats.strength + 1,
          speed: minion.stats.speed + 0.5,
          efficiency: minion.stats.efficiency + 0.5
        }
      });
    }
    
    case MINION_ACTION_TYPES.SET_MINIONS:
      return [...action.payload];
    
    case MINION_ACTION_TYPES.UPDATE_MINION_STATUS: {
      const { minionId, status } = action.payload;
      return updateMinionById(state, minionId, status);
    }
    
    case MINION_ACTION_TYPES.GAIN_MINION_EXPERIENCE: {
      const { minionId, amount } = action.payload;
      const minion = state.find(m => m.id === minionId);
      
      if (!minion) return state;
      
      // Calculate if leveling up
      const newExperience = minion.experience + amount;
      const experienceNeeded = Math.pow(minion.level, 1.5) * 100;
      
      if (newExperience >= experienceNeeded) {
        // Level up automatically
        return minionsReducer(
          updateMinionById(state, minionId, { experience: newExperience }),
          { type: MINION_ACTION_TYPES.LEVEL_UP_MINION, payload: { minionId } }
        );
      }
      
      return updateMinionById(state, minionId, { experience: newExperience });
    }
    
    default:
      return state;
  }
};

export default minionsReducer;
