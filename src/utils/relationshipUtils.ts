/**
 * @file relationshipUtils.ts
 * @description Utility functions for relationship calculations and display
 */

import { RelationshipTier, RelationshipTierInfo } from '../config/relationshipConstants';

/**
 * Calculate progress percentage to the next relationship tier
 * 
 * @param relationshipValue Current relationship value
 * @param currentTier Current relationship tier
 * @param nextTier Next relationship tier or null if at max
 * @returns Progress percentage (0-100)
 */
export const calculateProgressToNextTier = (
  relationshipValue: number, 
  currentTier: RelationshipTier | RelationshipTierInfo, 
  nextTier: RelationshipTier | RelationshipTierInfo | null | undefined
): number => {
  if (!nextTier) return 100; // Max progress if no next tier
  
  // Handle both RelationshipTier and RelationshipTierInfo
  const currentThreshold = 'threshold' in currentTier 
    ? currentTier.threshold 
    : 'min' in currentTier 
      ? currentTier.min 
      : 0;
  
  const nextThreshold = nextTier && 'threshold' in nextTier 
    ? nextTier.threshold 
    : nextTier && 'min' in nextTier 
      ? nextTier.min 
      : 100;
  
  const range = nextThreshold - currentThreshold;
  if (range <= 0) return 100; // Guard against invalid tier configurations
  
  const progress = ((relationshipValue - currentThreshold) / range) * 100;
  return Math.min(100, Math.max(0, progress)); // Ensure value is between 0-100
};

/**
 * Convert hex color to RGB format for CSS animations
 * 
 * @param hex Hex color code
 * @returns RGB color values as string
 */
export const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};
