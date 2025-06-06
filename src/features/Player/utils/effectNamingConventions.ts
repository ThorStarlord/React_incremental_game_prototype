/**
 * Effect Naming Conventions and Parsing
 * 
 * Establishes clear conventions for trait effect naming to avoid ambiguity
 * between direct modifiers, percentage bonuses, and multipliers.
 */

import { TRAIT_EFFECT_CONSTANTS } from '../../../constants/playerConstants';

export interface ParsedEffectName {
  baseStat: string;
  effectType: 'direct' | 'percentage' | 'multiplier' | 'special';
  isValid: boolean;
  description: string;
}

/**
 * Naming Convention Rules:
 * 
 * Direct Stat Modifiers:
 * - Use exact stat names: "attack", "maxHealth", "strength"
 * - Example: attack: 5 = +5 Attack
 * 
 * Percentage Bonuses:
 * - Use format: "{stat}PercentBonus"
 * - Example: attackPercentBonus: 0.1 = +10% Attack
 * 
 * Multipliers (compound/stacking):
 * - Use format: "{stat}Multiplier" or "{category}GainMultiplier"
 * - Example: essenceGainMultiplier: 0.5 = +50% Essence gain (multiplicative)
 * 
 * Special Effects:
 * - Use descriptive names not matching stat names
 * - Example: shopDiscount: 0.1 = 10% shop discount
 */

export const parseEffectName = (effectName: string): ParsedEffectName => {
  // Check for direct stat modifiers
  if (TRAIT_EFFECT_CONSTANTS.DIRECT_STATS.includes(effectName as any)) {
    return {
      baseStat: effectName,
      effectType: 'direct',
      isValid: true,
      description: `Direct ${effectName} modifier`
    };
  }

  // Check for percentage bonuses (specific pattern)
  if (effectName.endsWith('PercentBonus')) {
    const baseStat = effectName.replace('PercentBonus', '');
    return {
      baseStat,
      effectType: 'percentage',
      isValid: TRAIT_EFFECT_CONSTANTS.DIRECT_STATS.includes(baseStat as any),
      description: `Percentage bonus to ${baseStat}`
    };
  }

  // Check for multipliers
  const multiplierPatterns = ['Multiplier', 'GainMultiplier', 'XpMultiplier'];
  for (const pattern of multiplierPatterns) {
    if (effectName.includes(pattern)) {
      const baseStat = effectName.replace(pattern, '');
      return {
        baseStat,
        effectType: 'multiplier',
        isValid: true,
        description: `Multiplicative bonus to ${baseStat}`
      };
    }
  }

  // Special effects (everything else)
  return {
    baseStat: effectName,
    effectType: 'special',
    isValid: TRAIT_EFFECT_CONSTANTS.SPECIAL_EFFECTS.includes(effectName as any),
    description: `Special effect: ${effectName}`
  };
};

/**
 * Validates effect naming convention
 */
export const validateEffectName = (effectName: string): { isValid: boolean; suggestion?: string } => {
  const parsed = parseEffectName(effectName);
  
  if (parsed.isValid) {
    return { isValid: true };
  }

  // Suggest corrections for common mistakes
  if (parsed.effectType === 'percentage' && !parsed.isValid) {
    return {
      isValid: false,
      suggestion: `"${effectName}" should target a valid stat. Valid stats: ${TRAIT_EFFECT_CONSTANTS.DIRECT_STATS.join(', ')}`
    };
  }

  if (parsed.effectType === 'special' && !parsed.isValid) {
    return {
      isValid: false,
      suggestion: `"${effectName}" is not a recognized special effect. Consider adding it to SPECIAL_EFFECTS or check spelling.`
    };
  }

  return {
    isValid: false,
    suggestion: `"${effectName}" doesn't follow naming conventions. Use exact stat names, "{stat}PercentBonus", or "{category}Multiplier"`
  };
};

/**
 * Developer utility to generate effect name suggestions
 */
export const generateEffectNameSuggestions = (baseStat: string) => {
  return {
    direct: baseStat,
    percentage: `${baseStat}PercentBonus`,
    multiplier: `${baseStat}Multiplier`,
    gainMultiplier: `${baseStat}GainMultiplier`
  };
};
