import { RELATIONSHIP_TIERS } from '../constants/gameConstants';

/**
 * Returns the relationship tier object based on relationship value
 * @param {number} value - The relationship value (-100 to 100)
 * @returns {object} The relationship tier object
 */
export const getRelationshipTier = (value = 0) => {
  // Default to lowest relationship tier if no value provided
  if (value === null || value === undefined) {
    return RELATIONSHIP_TIERS.NEMESIS;
  }
  
  // Find the highest tier that the relationship value qualifies for
  return Object.values(RELATIONSHIP_TIERS)
    .sort((a, b) => b.threshold - a.threshold)
    .find(tier => value >= tier.threshold) || RELATIONSHIP_TIERS.NEMESIS;
};

/**
 * Checks if a relationship meets a required threshold
 * @param {number} currentValue - The current relationship value
 * @param {number} requiredValue - The threshold value needed
 * @returns {boolean} Whether the current value meets or exceeds the required value
 */
export const meetsRelationshipRequirement = (currentValue = 0, requiredValue = 0) => {
  return currentValue >= requiredValue;
};

/**
 * Returns the points needed to reach the next tier
 * @param {number} value - The current relationship value
 * @returns {object} Object with nextTier and pointsNeeded
 */
export const getPointsToNextTier = (value = 0) => {
  const currentTier = getRelationshipTier(value);
  
  // Get all tiers sorted by threshold
  const sortedTiers = Object.values(RELATIONSHIP_TIERS)
    .sort((a, b) => a.threshold - b.threshold);
  
  // Find the next tier
  const currentIndex = sortedTiers.findIndex(tier => tier.name === currentTier.name);
  const nextTier = currentIndex < sortedTiers.length - 1 ? sortedTiers[currentIndex + 1] : null;
  
  if (!nextTier) {
    return { nextTier: null, pointsNeeded: 0 };
  }
  
  const pointsNeeded = nextTier.threshold - value;
  return { nextTier, pointsNeeded };
};

export const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};

export const calculateProgressToNextTier = (relationship, currentTier, nextTier) => {
  if (!nextTier) return 100; // Max progress if no next tier
  return ((relationship - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100;
};

export const getRelationshipColor = (relationshipValue) => {
  const tier = getRelationshipTier(relationshipValue);
  return tier.color;
};

/**
 * Determines which interactions are available based on relationship level
 * Different features unlock as relationship with an NPC improves
 * 
 * @param {number} relationshipValue - The current relationship value (-100 to 100)
 * @returns {string[]} Array of available interaction types
 */
export const getAvailableInteractions = (relationshipValue = 0) => {
  // Dialogue is always available regardless of relationship
  const available = ['dialogue'];
  
  // Basic relationship interactions become available at -50 (Unfriendly)
  if (relationshipValue >= -50) {
    available.push('relationship');
  }
  
  // Trade becomes available at 0 (Neutral)
  if (relationshipValue >= 0) {
    available.push('trade');
  }
  
  // Quests become available at 25 (Friendly)
  if (relationshipValue >= 25) {
    available.push('quests');
  }
  
  return available;
};