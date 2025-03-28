/**
 * @file relationshipConstants.ts
 * @description Constants and helper functions for NPC relationships in the game
 */

/**
 * Interface for relationship tier information
 */
export interface RelationshipTier {
  name: string;
  color: string;
  min: number;     // Minimum value for this tier
  max: number;     // Maximum value for this tier
  threshold?: number; // For backward compatibility (min value)
  description?: string;
}

/**
 * Interface for relationship tier information with additional properties
 * needed for presentation and progression tracking
 */
export interface RelationshipTierInfo {
  /** Name of this relationship tier */
  name: string;
  /** Color for visually representing this tier */
  color: string;
  /** Threshold value to reach this tier */
  threshold: number;
  /** Benefits provided by this tier */
  benefits: string[];
  /** Information about the next tier, or null if at max */
  nextTier: RelationshipTierInfo | null;
  /** Points needed to reach the next tier */
  pointsNeeded?: number;
}

// Relationship tier definitions
export const RELATIONSHIP_TIERS = {
  BELOVED: { 
    name: 'Beloved', 
    color: '#9c27b0', 
    min: 90, 
    max: 100, 
    description: 'Complete trust and adoration',
    get threshold() { return this.min; } // Add threshold getter for backward compatibility
  },
  TRUSTED: { 
    name: 'Trusted', 
    color: '#3f51b5', 
    min: 75, 
    max: 89, 
    description: 'Deep trust and friendship',
    get threshold() { return this.min; }
  },
  ALLY: { 
    name: 'Ally', 
    color: '#2196f3', 
    min: 60, 
    max: 74, 
    description: 'Reliable partnership',
    get threshold() { return this.min; }
  },
  FRIEND: { 
    name: 'Friend', 
    color: '#4caf50', 
    min: 50, 
    max: 59, 
    description: 'Mutual goodwill',
    get threshold() { return this.min; }
  },
  ACQUAINTANCE: { 
    name: 'Acquaintance', 
    color: '#8bc34a', 
    min: 40, 
    max: 49, 
    description: 'Familiar but cautious',
    get threshold() { return this.min; }
  },
  NEUTRAL: { 
    name: 'Neutral', 
    color: '#9e9e9e', 
    min: 25, 
    max: 39, 
    description: 'Neither friend nor foe',
    get threshold() { return this.min; }
  },
  SUSPICIOUS: { 
    name: 'Suspicious', 
    color: '#ff9800', 
    min: 10, 
    max: 24, 
    description: 'Wary and doubtful',
    get threshold() { return this.min; }
  },
  UNFRIENDLY: { 
    name: 'Unfriendly', 
    color: '#ff5722', 
    min: 1, 
    max: 9, 
    description: 'Actively dislikes you',
    get threshold() { return this.min; }
  },
  HOSTILE: { 
    name: 'Hostile', 
    color: '#f44336', 
    min: -100, 
    max: 0, 
    description: 'Open hostility',
    get threshold() { return this.min; }
  }
};

/**
 * Get a simplified relationship tier name based on value
 * @param value Relationship value (-100 to 100)
 * @returns Simplified tier name
 */
export const getSimplifiedTier = (value: number): string => {
  if (value >= 75) return "ALLY";
  if (value >= 50) return "FRIEND";
  if (value >= 25) return "NEUTRAL";
  if (value >= 0) return "ACQUAINTANCE";
  return "ENEMY";
};

/**
 * Get the relationship tier object based on relationship value
 * @param value Relationship value (-100 to 100)
 * @returns The relationship tier object
 */
export const getRelationshipTier = (value: number): RelationshipTier => {
  // Find matching tier or default to HOSTILE
  return Object.values(RELATIONSHIP_TIERS)
    .find(tier => value >= tier.min && value <= tier.max) || RELATIONSHIP_TIERS.HOSTILE;
};

/**
 * Get relationship benefits for a specific tier
 * @param tierName The name of the relationship tier
 * @returns Array of benefit descriptions
 */
export const getRelationshipBenefits = (tierName: string): string[] => {
  const benefitsMap: Record<string, string[]> = {
    'Beloved': [
      'Can learn all traits',
      'Exclusive quests available',
      'Best prices at shops',
      'Occasional valuable gifts'
    ],
    'Trusted': [
      'Can learn rare traits',
      'Special quests available',
      'Significant shop discounts',
      'Occasional helpful gifts'
    ],
    'Ally': [
      'Can learn uncommon traits',
      'Additional quests available',
      'Shop discounts',
      'May share valuable information'
    ],
    'Friend': [
      'Can learn basic traits',
      'Quests available',
      'Small shop discounts',
      'Occasional tips and hints'
    ],
    'Acquaintance': [
      'Basic interactions',
      'Simple quests available',
      'No shop benefits',
      'Limited dialogue options'
    ],
    'Neutral': [
      'Basic interactions only',
      'No special benefits',
      'Standard shop prices',
      'Limited dialogue options'
    ],
    'Suspicious': [
      'Limited interactions',
      'No quests available',
      'Higher shop prices',
      'May refuse some services'
    ],
    'Unfriendly': [
      'Minimal interactions',
      'May refuse to trade',
      'Significantly higher prices',
      'May spread rumors about you'
    ],
    'Hostile': [
      'Will not interact willingly',
      'No services available',
      'May attack on sight in some areas',
      'Actively works against you'
    ]
  };
  
  return benefitsMap[tierName] || ['No special benefits'];
};

/**
 * Get relationship tier benefits and next tier information
 * @param relationshipValue Current relationship value (0-100)
 * @returns Object with tier data including benefits and next tier
 */
export const getTierBenefits = (relationshipValue: number): RelationshipTierInfo => {
  const tierData = getRelationshipTier(relationshipValue);
  
  // Base tier info
  const tierInfo: RelationshipTierInfo = {
    name: tierData.name,
    color: tierData.color,
    threshold: tierData.min || 0,
    benefits: getRelationshipBenefits(tierData.name),
    nextTier: null
  };
  
  // Find next tier
  const allTiers = Object.values(RELATIONSHIP_TIERS).sort((a, b) => a.min - b.min);
  const currentTierIndex = allTiers.findIndex(t => t.name === tierData.name);
  
  // If not at max tier, add next tier info
  if (currentTierIndex < allTiers.length - 1) {
    const nextTierData = allTiers[currentTierIndex + 1];
    tierInfo.nextTier = {
      name: nextTierData.name,
      color: nextTierData.color,
      threshold: nextTierData.min,
      benefits: getRelationshipBenefits(nextTierData.name),
      nextTier: null
    };
    
    // Calculate points needed to next tier
    tierInfo.pointsNeeded = nextTierData.min - relationshipValue;
  }
  
  return tierInfo;
};

/**
 * Check if a player can learn a trait from an NPC
 * @param npc The NPC with available traits
 * @param traitId ID of the trait to check
 * @param relationshipValue Current relationship value with the NPC
 * @param playerTraits Array of traits the player already has
 * @returns Whether the player can learn this trait
 */
export const canLearnTrait = (
  npc: any,
  traitId: string,
  relationshipValue: number,
  playerTraits: string[]
): boolean => {
  // Check if NPC has this trait to teach
  if (!npc?.traits || !npc.traits[traitId]) return false;
  
  // Check if player already has this trait
  if (playerTraits.includes(traitId)) return false;
  
  // Check relationship requirement
  const trait = npc.traits[traitId];
  return relationshipValue >= (trait.relationshipRequirement || 0);
};
