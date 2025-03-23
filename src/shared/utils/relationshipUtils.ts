import { RELATIONSHIP_TIERS } from '../../config/relationshipConstants';

/**
 * Interface for relationship tier
 */
interface RelationshipTier {
  name: string;
  min: number;    // Changed from threshold to min
  max: number;    // Added max property
  color: string;
  benefits?: string[];
  [key: string]: any; // Additional tier properties
}

/**
 * Interface for next tier information
 */
interface NextTierInfo {
  nextTier: RelationshipTier | null;
  pointsNeeded: number;
}

/**
 * Returns the relationship tier object based on relationship value
 * @param {number} value - The relationship value (-100 to 100)
 * @returns {RelationshipTier} The relationship tier object
 */
export const getRelationshipTier = (value: number = 0): RelationshipTier => {
  // Default to lowest relationship tier if no value provided
  if (value === null || value === undefined) {
    return RELATIONSHIP_TIERS.HOSTILE;
  }
  
  // Find the tier that the relationship value falls within
  return Object.values(RELATIONSHIP_TIERS)
    .find((tier: any) => value >= tier.min && value <= tier.max) || RELATIONSHIP_TIERS.HOSTILE;
};

/**
 * Checks if a relationship meets a required threshold
 * @param {number} currentValue - The current relationship value
 * @param {number} requiredValue - The threshold value needed
 * @returns {boolean} Whether the current value meets or exceeds the required value
 */
export const meetsRelationshipRequirement = (currentValue: number = 0, requiredValue: number = 0): boolean => {
  return currentValue >= requiredValue;
};

/**
 * Returns the points needed to reach the next tier
 * @param {number} value - The current relationship value
 * @returns {NextTierInfo} Object with nextTier and pointsNeeded
 */
export const getPointsToNextTier = (value: number = 0): NextTierInfo => {
  const currentTier = getRelationshipTier(value);
  
  // Get all tiers sorted by min threshold
  const sortedTiers = Object.values(RELATIONSHIP_TIERS)
    .sort((a: any, b: any) => a.min - b.min);
  
  const currentIndex = sortedTiers.findIndex((tier: any) => tier.name === currentTier.name);
  const nextTier = currentIndex < sortedTiers.length - 1 ? sortedTiers[currentIndex + 1] : null;
  
  if (!nextTier) {
    return { nextTier: null, pointsNeeded: 0 };
  }
  
  const pointsNeeded = nextTier.min - value;
  return { nextTier, pointsNeeded };
};

/**
 * Convert hex color to RGB format
 * @param {string} hex - Hex color code
 * @returns {string} RGB color values as string
 */
export const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};

/**
 * Calculate the progress percentage to the next relationship tier
 * @param {number} relationship - Current relationship value
 * @param {RelationshipTier} currentTier - Current relationship tier
 * @param {RelationshipTier | null} nextTier - Next relationship tier
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgressToNextTier = (
  relationship: number, 
  currentTier: RelationshipTier, 
  nextTier: RelationshipTier | null
): number => {
  if (!nextTier) return 100; // Max progress if no next tier
  return ((relationship - currentTier.min) / (nextTier.min - currentTier.min)) * 100;
};

/**
 * Get the color associated with a relationship value
 * @param {number} relationshipValue - The relationship value
 * @returns {string} Color code for the relationship tier
 */
export const getRelationshipColor = (relationshipValue: number): string => {
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
export const getAvailableInteractions = (relationshipValue: number = 0): string[] => {
  // Dialogue is always available regardless of relationship
  const available: string[] = ['dialogue'];
  
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
