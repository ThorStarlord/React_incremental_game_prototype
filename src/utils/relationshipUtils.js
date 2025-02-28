import { RELATIONSHIP_TIERS } from '../config/gameConstants';

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