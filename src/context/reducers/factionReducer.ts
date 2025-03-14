/**
 * Faction Reducer - Manages faction-related state in the game
 */

// Import types and initial state from the new file
import InitialState, {
  FactionState,
  FactionId,
  ReputationValue,
  Faction,
  REPUTATION_LEVELS
} from '../initialStates/factionInitialState';

interface FactionAction {
  type: string;
  payload: any;
}

// Action Types
export const CHANGE_REPUTATION = 'CHANGE_REPUTATION';
export const UNLOCK_FACTION = 'UNLOCK_FACTION';
export const SET_FACTION_STATUS = 'SET_FACTION_STATUS';
export const COMPLETE_FACTION_QUEST = 'COMPLETE_FACTION_QUEST';
export const UPDATE_FACTION = 'UPDATE_FACTION';

/**
 * Gets reputation level name from reputation value
 */
export const getReputationLevel = (reputation: ReputationValue): string => {
  for (const [level, range] of Object.entries(REPUTATION_LEVELS)) {
    if (reputation >= range.min && reputation <= range.max) {
      return range.name;
    }
  }
  return "Unknown";
};

/**
 * Faction reducer function
 */
const factionReducer = (state: FactionState = InitialState, action: FactionAction): FactionState => {
  switch (action.type) {
    case CHANGE_REPUTATION: {
      const { faction, amount } = action.payload;
      
      if (!state.factions[faction]) {
        console.error(`Cannot change reputation: Faction "${faction}" does not exist.`);
        return state;
      }
      
      // Clamp reputation between -100 and 100
      const newReputation = Math.max(-100, Math.min(100, (state.reputations[faction] || 0) + amount));
      
      return {
        ...state,
        discoveredFactions: state.discoveredFactions.includes(faction) 
          ? state.discoveredFactions 
          : [...state.discoveredFactions, faction],
        reputations: {
          ...state.reputations,
          [faction]: newReputation
        }
      };
    }

    case UNLOCK_FACTION: {
      const factionId = action.payload;
      
      if (!state.factions[factionId]) {
        console.error(`Cannot unlock: Faction "${factionId}" does not exist.`);
        return state;
      }
      
      return {
        ...state,
        discoveredFactions: state.discoveredFactions.includes(factionId)
          ? state.discoveredFactions
          : [...state.discoveredFactions, factionId],
        factions: {
          ...state.factions,
          [factionId]: {
            ...state.factions[factionId],
            isUnlocked: true
          }
        }
      };
    }

    case COMPLETE_FACTION_QUEST: {
      const { faction, questId, reputationReward = 5 } = action.payload;
      
      if (!state.factions[faction]) {
        console.error(`Cannot complete quest: Faction "${faction}" does not exist.`);
        return state;
      }
      
      // Verify quest validity
      if (!state.factions[faction].availableQuests.includes(questId) || 
          state.factions[faction].questsCompleted.includes(questId)) {
        console.error(`Quest "${questId}" is not available or already completed for faction "${faction}".`);
        return state;
      }
      
      return {
        ...state,
        reputations: {
          ...state.reputations,
          [faction]: Math.min(100, (state.reputations[faction] || 0) + reputationReward)
        },
        factions: {
          ...state.factions,
          [faction]: {
            ...state.factions[faction],
            availableQuests: state.factions[faction].availableQuests.filter(id => id !== questId),
            questsCompleted: [...state.factions[faction].questsCompleted, questId]
          }
        }
      };
    }

    case UPDATE_FACTION: {
      const { factionId, updates } = action.payload;
      
      if (!state.factions[factionId]) {
        console.error(`Cannot update: Faction "${factionId}" does not exist.`);
        return state;
      }
      
      return {
        ...state,
        factions: {
          ...state.factions,
          [factionId]: {
            ...state.factions[factionId],
            ...updates
          }
        }
      };
    }

    case SET_FACTION_STATUS: {
      const { faction, status } = action.payload;
      
      if (!state.factions[faction]) {
        console.error(`Cannot set status: Faction "${faction}" does not exist.`);
        return state;
      }
      
      // Find matching reputation level
      let targetReputation: number | null = null;
      
      for (const [level, range] of Object.entries(REPUTATION_LEVELS)) {
        if (range.name.toLowerCase() === status.toLowerCase()) {
          // Set to middle of the range
          targetReputation = Math.floor((range.min + range.max) / 2);
          break;
        }
      }
      
      if (targetReputation === null) {
        console.error(`Invalid reputation status: "${status}"`);
        return state;
      }
      
      return {
        ...state,
        reputations: {
          ...state.reputations,
          [faction]: targetReputation
        }
      };
    }

    default:
      return state;
  }
};

export default factionReducer;
