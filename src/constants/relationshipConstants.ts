/**
 * Relationship Constants
 * 
 * Defines constants related to NPC relationships and reputations
 */

// Reputation levels and thresholds
export enum ReputationLevel {
  Hated = 'hated',
  Hostile = 'hostile',
  Unfriendly = 'unfriendly',
  Neutral = 'neutral',
  Friendly = 'friendly',
  Honored = 'honored',
  Revered = 'revered',
  Exalted = 'exalted'
}

export interface ReputationRange {
  min: number;
  max: number;
  name: ReputationLevel;
  description: string;
}

export const REPUTATION_RANGES: Record<ReputationLevel, ReputationRange> = {
  [ReputationLevel.Hated]: {
    min: -100,
    max: -75,
    name: ReputationLevel.Hated,
    description: "They despise your very existence and will attack on sight."
  },
  [ReputationLevel.Hostile]: {
    min: -74,
    max: -50,
    name: ReputationLevel.Hostile,
    description: "They see you as an enemy and are likely to attack."
  },
  [ReputationLevel.Unfriendly]: {
    min: -49,
    max: -25,
    name: ReputationLevel.Unfriendly,
    description: "They dislike you and may refuse to interact."
  },
  [ReputationLevel.Neutral]: {
    min: -24,
    max: 24,
    name: ReputationLevel.Neutral,
    description: "They have no strong feelings toward you."
  },
  [ReputationLevel.Friendly]: {
    min: 25,
    max: 49,
    name: ReputationLevel.Friendly,
    description: "They are well-disposed toward you and offer basic services."
  },
  [ReputationLevel.Honored]: {
    min: 50,
    max: 74,
    name: ReputationLevel.Honored,
    description: "They hold you in high esteem and offer special services."
  },
  [ReputationLevel.Revered]: {
    min: 75,
    max: 99,
    name: ReputationLevel.Revered,
    description: "They deeply respect you and provide significant benefits."
  },
  [ReputationLevel.Exalted]: {
    min: 100,
    max: Infinity,
    name: ReputationLevel.Exalted,
    description: "You are a legend among them and receive their greatest rewards."
  }
};

// Standard reputation changes
export const REPUTATION_CHANGES = {
  SMALL_FAVOR: 3,
  MEDIUM_FAVOR: 5,
  LARGE_FAVOR: 10,
  QUEST_COMPLETION: 15,
  CRITICAL_QUEST: 25,
  SMALL_OFFENSE: -3,
  MEDIUM_OFFENSE: -8,
  LARGE_OFFENSE: -15,
  THEFT: -20,
  COMBAT: -30,
  MURDER: -50
};

// Relationship bonus thresholds
export interface RelationshipBonus {
  tradingDiscount?: number;
  itemQuality?: number;
  uniqueDialogue?: boolean;
  uniqueQuests?: boolean;
  specialItems?: boolean;
  locationAccess?: boolean;
  skillTraining?: boolean;
  reputationVouching?: number; // Reputation boost with allied factions
}

export const RELATIONSHIP_BONUSES: Record<ReputationLevel, RelationshipBonus> = {
  [ReputationLevel.Hated]: {
    tradingDiscount: -0.5, // 50% markup
    reputationVouching: -5 // Damages reputation with allies
  },
  [ReputationLevel.Hostile]: {
    tradingDiscount: -0.25 // 25% markup
  },
  [ReputationLevel.Unfriendly]: {
    tradingDiscount: -0.1 // 10% markup
  },
  [ReputationLevel.Neutral]: {
    // No bonuses or penalties
  },
  [ReputationLevel.Friendly]: {
    tradingDiscount: 0.05, // 5% discount
    uniqueDialogue: true,
    reputationVouching: 1
  },
  [ReputationLevel.Honored]: {
    tradingDiscount: 0.1, // 10% discount
    itemQuality: 1,
    uniqueDialogue: true,
    uniqueQuests: true,
    reputationVouching: 2
  },
  [ReputationLevel.Revered]: {
    tradingDiscount: 0.15, // 15% discount
    itemQuality: 2,
    uniqueDialogue: true,
    uniqueQuests: true,
    specialItems: true,
    locationAccess: true,
    reputationVouching: 3
  },
  [ReputationLevel.Exalted]: {
    tradingDiscount: 0.25, // 25% discount
    itemQuality: 3,
    uniqueDialogue: true,
    uniqueQuests: true,
    specialItems: true,
    locationAccess: true,
    skillTraining: true,
    reputationVouching: 5
  }
};

// Faction relationship modifiers
export interface FactionModifier {
  name: string;
  allies: string[];
  rivals: string[];
  spilloverRate: number; // How much reputation with this faction affects related factions
}

export const FACTION_MODIFIERS: Record<string, FactionModifier> = {
  villagers: {
    name: "Villagers' Union",
    allies: ['merchants'],
    rivals: ['bandits'],
    spilloverRate: 0.2
  },
  merchants: {
    name: "Merchant Guild",
    allies: ['villagers', 'warriors'],
    rivals: ['bandits'],
    spilloverRate: 0.25
  },
  mages: {
    name: "Arcane Society",
    allies: ['elementals'],
    rivals: ['warriors'],
    spilloverRate: 0.3
  },
  warriors: {
    name: "Warrior Brotherhood",
    allies: ['merchants'],
    rivals: ['mages', 'bandits'],
    spilloverRate: 0.2
  },
  bandits: {
    name: "Shadow Syndicate",
    allies: [],
    rivals: ['villagers', 'merchants', 'warriors'],
    spilloverRate: 0.15
  }
};

/**
 * Calculate reputation level from a numeric value
 */
export function getReputationLevelFromValue(value: number): ReputationLevel {
  for (const [level, range] of Object.entries(REPUTATION_RANGES)) {
    if (value >= range.min && value <= range.max) {
      return level as ReputationLevel;
    }
  }
  return ReputationLevel.Neutral; // Default fallback
}

/**
 * Calculate faction relationship spillover
 */
export function calculateSpillover(
  factionId: string, 
  reputationChange: number
): Record<string, number> {
  const spillover: Record<string, number> = {};
  const faction = FACTION_MODIFIERS[factionId];
  
  if (!faction) return spillover;
  
  // Reputation spills over to allies positively
  faction.allies.forEach(allyId => {
    const allyFaction = FACTION_MODIFIERS[allyId];
    if (allyFaction) {
      spillover[allyId] = Math.round(reputationChange * faction.spilloverRate);
    }
  });
  
  // Reputation spills over to rivals negatively
  faction.rivals.forEach(rivalId => {
    const rivalFaction = FACTION_MODIFIERS[rivalId];
    if (rivalFaction) {
      spillover[rivalId] = Math.round(reputationChange * -faction.spilloverRate);
    }
  });
  
  return spillover;
}
