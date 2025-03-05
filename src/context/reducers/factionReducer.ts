/**
 * Faction Reducer - Manages faction-related state in the game
 */

// Define types
type FactionId = string;
type ReputationValue = number;

interface FactionState {
  discoveredFactions: FactionId[];
  reputations: Record<FactionId, ReputationValue>;
  factions: Record<FactionId, Faction>;
}

interface Faction {
  name: string;
  description: string;
  isUnlocked: boolean;
  rivals: FactionId[];
  allies: FactionId[];
  questsCompleted: string[];
  availableQuests: string[];
  tradeBonus: {
    type: string;
    multiplier: number;
  };
  locationAccess: string[];
}

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
 * Reputation thresholds and corresponding status
 */
export const REPUTATION_LEVELS = {
  HATED: { min: -100, max: -75, name: "Hated" },
  HOSTILE: { min: -74, max: -50, name: "Hostile" },
  UNFRIENDLY: { min: -49, max: -25, name: "Unfriendly" },
  NEUTRAL: { min: -24, max: 24, name: "Neutral" },
  FRIENDLY: { min: 25, max: 49, name: "Friendly" },
  HONORED: { min: 50, max: 74, name: "Honored" },
  REVERED: { min: 75, max: 99, name: "Revered" },
  EXALTED: { min: 100, max: Infinity, name: "Exalted" }
};

/**
 * Initial faction state
 */
const initialState: FactionState = {
  discoveredFactions: ['villagers'],
  reputations: {
    villagers: 10,
    merchants: 0,
    mages: 0,
    warriors: 0,
    bandits: -10,
    deepdwellers: 0,
    elementals: 0,
    ancients: 0
  },
  factions: {
    villagers: {
      name: "Villagers' Union",
      description: "The common folk who maintain the village and surrounding farmlands.",
      isUnlocked: true,
      rivals: ['bandits'],
      allies: ['merchants'],
      questsCompleted: [],
      availableQuests: ['village_supplies', 'repair_mill'],
      tradeBonus: { type: 'basicResources', multiplier: 1.0 },
      locationAccess: ['village']
    },
    merchants: {
      name: "Merchant Guild",
      description: "Traders and craftspeople who control most of the local economy.",
      isUnlocked: true,
      rivals: ['bandits'],
      allies: ['villagers', 'warriors'],
      questsCompleted: [],
      availableQuests: ['trade_route_safety', 'rare_materials'],
      tradeBonus: { type: 'coins', multiplier: 1.0 },
      locationAccess: ['market']
    },
    mages: {
      name: "Arcane Society",
      description: "Scholars and magic practitioners who study the mysteries of the world.",
      isUnlocked: false,
      rivals: ['warriors'],
      allies: ['elementals'],
      questsCompleted: [],
      availableQuests: ['ancient_texts', 'magical_anomaly'],
      tradeBonus: { type: 'magicItems', multiplier: 1.0 },
      locationAccess: ['tower']
    },
    warriors: {
      name: "Warrior Brotherhood",
      description: "Skilled fighters who protect the realm from various threats.",
      isUnlocked: false,
      rivals: ['mages', 'bandits'],
      allies: ['merchants'],
      questsCompleted: [],
      availableQuests: ['monster_hunt', 'combat_training'],
      tradeBonus: { type: 'weapons', multiplier: 1.0 },
      locationAccess: ['barracks']
    },
    bandits: {
      name: "Shadow Syndicate",
      description: "Organized criminals operating from the fringes of society.",
      isUnlocked: true,
      rivals: ['villagers', 'merchants', 'warriors'],
      allies: [],
      questsCompleted: [],
      availableQuests: ['heist_planning', 'rival_elimination'],
      tradeBonus: { type: 'blackMarket', multiplier: 1.0 },
      locationAccess: ['hideout']
    },
    deepdwellers: {
      name: "Deep Dwellers",
      description: "Mysterious beings that live in the depths of the mines.",
      isUnlocked: false,
      rivals: ['villagers'],
      allies: ['ancients'],
      questsCompleted: [],
      availableQuests: ['crystal_gathering', 'underground_mapping'],
      tradeBonus: { type: 'minerals', multiplier: 1.0 },
      locationAccess: ['deepMines']
    },
    elementals: {
      name: "Elemental Conclave",
      description: "Spirits of nature with power over the elements.",
      isUnlocked: false,
      rivals: [],
      allies: ['mages', 'ancients'],
      questsCompleted: [],
      availableQuests: ['balance_restoration', 'elemental_pact'],
      tradeBonus: { type: 'elementalEssence', multiplier: 1.0 },
      locationAccess: ['elementalSanctum']
    },
    ancients: {
      name: "The Ancients",
      description: "Remnants of a civilization that once ruled these lands.",
      isUnlocked: false,
      rivals: [],
      allies: ['elementals', 'deepdwellers'],
      questsCompleted: [],
      availableQuests: ['artifact_recovery', 'forgotten_knowledge'],
      tradeBonus: { type: 'artifacts', multiplier: 1.0 },
      locationAccess: ['ruins']
    }
  }
};

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
const factionReducer = (state: FactionState = initialState, action: FactionAction): FactionState => {
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
