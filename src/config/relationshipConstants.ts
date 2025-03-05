/**
 * @file relationshipConstants.ts
 * @description Constants and helper functions for NPC relationships in the game
 */

/**
 * Defines tiers of relationship with NPCs, their numerical ranges,
 * display names, and associated colors for UI presentation
 */
export const RELATIONSHIP_TIERS = {
  HOSTILE: { min: -100, max: -75, name: 'Hostile', color: '#f44336' },
  UNFRIENDLY: { min: -74, max: -25, name: 'Unfriendly', color: '#ff9800' },
  NEUTRAL: { min: -24, max: 24, name: 'Neutral', color: '#9e9e9e' },
  FRIENDLY: { min: 25, max: 74, name: 'Friendly', color: '#2196f3' },
  TRUSTED: { min: 75, max: 100, name: 'Trusted', color: '#4caf50' },
};

/**
 * Get the relationship tier object based on a numerical relationship value
 * @param {number} value - The relationship value, typically between -100 and 100
 * @returns {Object} The relationship tier object with tier key, name, min, max, and color
 */
export const getRelationshipTier = (value: number) => {
  for (const [tier, range] of Object.entries(RELATIONSHIP_TIERS)) {
    if (value >= range.min && value <= range.max) {
      return { tier, ...range };
    }
  }
  // Default to neutral if somehow out of range
  return { tier: 'NEUTRAL', ...RELATIONSHIP_TIERS.NEUTRAL };
};

/**
 * Get a simplified relationship tier name based on a numerical value
 * @param {number} value - The relationship value, typically between -100 and 100
 * @returns {string} The human-readable name of the relationship tier
 */
export const getSimplifiedTier = (value: number): string => {
  return getRelationshipTier(value).name;
};

/**
 * Gets the appropriate color for rendering relationship UI elements
 * @param {number} value - The relationship value
 * @returns {string} CSS color value
 */
export const getRelationshipColor = (value: number): string => {
  return getRelationshipTier(value).color;
};

/**
 * Calculate what benefits should be unlocked at different relationship tiers
 * @param {string} tierName - The name of the relationship tier
 * @returns {string[]} Array of benefit descriptions
 */
export const getRelationshipBenefits = (tierName: string): string[] => {
  switch(tierName) {
    case 'Hostile':
      return ['No benefits', 'May attack on sight'];
    case 'Unfriendly':
      return ['Limited dialogue options', 'Higher prices at shops'];
    case 'Neutral':
      return ['Standard dialogue options', 'Normal trading prices'];
    case 'Friendly':
      return ['Extended dialogue options', 'Discounted prices', 'Basic quests available'];
    case 'Trusted':
      return ['All dialogue options', 'Best prices', 'Special quests available', 'May share secrets'];
    default:
      return ['Standard interactions'];
  }
};
