/**
 * Utilities for player experience and leveling calculations
 */

// Constants for experience calculations
export const XP_CALCULATION = {
  BASE_XP: 100,
  LEVEL_EXPONENT: 1.5
};

/**
 * Calculate experience required for a specific level
 * @param {number} level - The level to calculate for
 * @returns {number} Experience points required
 */
export const calculateExperienceForLevel = (level: number): number => {
  return Math.floor(XP_CALCULATION.BASE_XP * Math.pow(level, XP_CALCULATION.LEVEL_EXPONENT));
};

/**
 * Calculate level based on total experience
 * @param {number} totalExperience - The total experience points
 * @returns {number} The resulting level
 */
export const calculateLevelFromExperience = (totalExperience: number): number => {
  let level = 1;
  while (calculateExperienceForLevel(level + 1) <= totalExperience) {
    level++;
  }
  return level;
};

/**
 * Calculate experience progress to next level
 * @param {number} totalExperience - The total experience points
 * @param {number} currentLevel - The current level
 * @returns {object} Object containing progress data
 */
export const calculateExperienceProgress = (
  totalExperience: number,
  currentLevel: number
): { 
  currentXp: number;
  requiredXp: number;
  percentage: number;
} => {
  const currentLevelXp = calculateExperienceForLevel(currentLevel);
  const nextLevelXp = calculateExperienceForLevel(currentLevel + 1);
  const requiredXp = nextLevelXp - currentLevelXp;
  const currentXp = totalExperience - currentLevelXp;
  const percentage = Math.min(100, Math.floor((currentXp / requiredXp) * 100));
  
  return { currentXp, requiredXp, percentage };
};
