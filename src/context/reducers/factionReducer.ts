/**
 * Faction Reducer - Manages faction-related state in the game
 */

// Import types from the correct location and initial state
import factionsInitialState from '../initialStates/FactionInitialState';
import { 
  FactionSystem, 
  Faction, 
  FactionStanding,
  MembershipStatus,
  PlayerFactionStanding
} from '../types/gameStates/FactionGameStateTypes';

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
 * Gets faction standing name from reputation value
 */
export const getFactionStandingName = (reputation: number): FactionStanding => {
  if (reputation >= 7500) return FactionStanding.Exalted;
  if (reputation >= 5000) return FactionStanding.Revered;
  if (reputation >= 3000) return FactionStanding.Honored;
  if (reputation >= 1000) return FactionStanding.Friendly;
  if (reputation >= 0) return FactionStanding.Neutral;
  if (reputation >= -3000) return FactionStanding.Unfriendly;
  if (reputation >= -7500) return FactionStanding.Hostile;
  return FactionStanding.Hated;
};

/**
 * Faction reducer function
 */
const factionReducer = (state: FactionSystem = factionsInitialState, action: FactionAction): FactionSystem => {
  switch (action.type) {
    case CHANGE_REPUTATION: {
      const { factionId, amount, reason } = action.payload;
      
      // Find the faction standing record
      const factionStandingIndex = state.playerStandings.findIndex(
        standing => standing.factionId === factionId
      );
      
      if (factionStandingIndex === -1) {
        console.error(`Cannot change reputation: Faction "${factionId}" standing not found.`);
        return state;
      }
      
      const currentStanding = state.playerStandings[factionStandingIndex];
      const newReputation = currentStanding.reputation + amount;
      
      // Update the standing record
      const updatedStandings = [...state.playerStandings];
      updatedStandings[factionStandingIndex] = {
        ...currentStanding,
        reputation: newReputation,
        // Update the standing level if necessary
        standing: getFactionStandingName(newReputation),
        // Add to history
        history: [
          ...currentStanding.history,
          {
            date: new Date().toISOString(),
            amount,
            reason: reason || 'Unknown action'
          }
        ]
      };
      
      return {
        ...state,
        playerStandings: updatedStandings,
        // Add to discovered factions if not already there
        discoveredFactions: state.discoveredFactions.includes(factionId)
          ? state.discoveredFactions
          : [...state.discoveredFactions, factionId],
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
            hidden: false // Set hidden to false when unlocked
          }
        }
      };
    }

    case COMPLETE_FACTION_QUEST: {
      const { factionId, questId, reputationReward = 100 } = action.payload;
      
      if (!state.factions[factionId]) {
        console.error(`Cannot complete quest: Faction "${factionId}" does not exist.`);
        return state;
      }
      
      // Find the faction standing record
      const factionStandingIndex = state.playerStandings.findIndex(
        standing => standing.factionId === factionId
      );
      
      if (factionStandingIndex === -1) {
        console.error(`Cannot complete quest: No standing found for faction "${factionId}".`);
        return state;
      }
      
      const currentStanding = state.playerStandings[factionStandingIndex];
      
      // Verify quest validity - checking in available quests
      if (!currentStanding.availableQuests.includes(questId) || 
          currentStanding.completedQuests.includes(questId)) {
        console.error(`Quest "${questId}" is not available or already completed for faction "${factionId}".`);
        return state;
      }
      
      const newReputation = currentStanding.reputation + reputationReward;
      
      // Update the standing record
      const updatedStandings = [...state.playerStandings];
      updatedStandings[factionStandingIndex] = {
        ...currentStanding,
        reputation: newReputation,
        standing: getFactionStandingName(newReputation),
        completedQuests: [...currentStanding.completedQuests, questId],
        availableQuests: currentStanding.availableQuests.filter(id => id !== questId),
        history: [
          ...currentStanding.history,
          {
            date: new Date().toISOString(),
            amount: reputationReward,
            reason: `Completed quest: ${questId}`
          }
        ]
      };
      
      return {
        ...state,
        playerStandings: updatedStandings
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
      const { factionId, status } = action.payload;
      
      if (!state.factions[factionId]) {
        console.error(`Cannot set status: Faction "${factionId}" does not exist.`);
        return state;
      }
      
      // Find the faction standing index
      const factionStandingIndex = state.playerStandings.findIndex(
        standing => standing.factionId === factionId
      );
      
      if (factionStandingIndex === -1) {
        console.error(`Cannot set status: No standing found for faction "${factionId}".`);
        return state;
      }
      
      // Convert status string to FactionStanding enum
      const targetStanding = status as FactionStanding;
      if (!Object.values(FactionStanding).includes(targetStanding)) {
        console.error(`Invalid faction standing: "${status}"`);
        return state;
      }
      
      // Determine appropriate reputation value based on standing
      let targetReputation: number;
      switch (targetStanding) {
        case FactionStanding.Exalted:
          targetReputation = 7500;
          break;
        case FactionStanding.Revered:
          targetReputation = 5000;
          break;
        case FactionStanding.Honored:
          targetReputation = 3000;
          break;
        case FactionStanding.Friendly:
          targetReputation = 1000;
          break;
        case FactionStanding.Neutral:
          targetReputation = 0;
          break;
        case FactionStanding.Unfriendly:
          targetReputation = -1000;
          break;
        case FactionStanding.Hostile:
          targetReputation = -5000;
          break;
        case FactionStanding.Hated:
          targetReputation = -7500;
          break;
        default:
          targetReputation = 0;
      }
      
      // Update the standing
      const updatedStandings = [...state.playerStandings];
      updatedStandings[factionStandingIndex] = {
        ...updatedStandings[factionStandingIndex],
        standing: targetStanding,
        reputation: targetReputation
      };
      
      return {
        ...state,
        playerStandings: updatedStandings
      };
    }

    default:
      return state;
  }
};

export default factionReducer;
