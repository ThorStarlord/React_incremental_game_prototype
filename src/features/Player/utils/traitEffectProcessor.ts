import type { PlayerStats } from '../state/PlayerTypes';
import type { Trait, TraitEffectValues, TraitEffect } from '../../Traits/state/TraitsTypes';
import {
  STAT_LIMITS,
  clampStatValue,
  isDirectStatEffect,
  isMultiplierEffect,
  isPercentageEffect
} from '../../../constants/playerConstants';
import { parseEffectName, validateEffectName } from './effectNamingConventions';

/**
 * Enhanced trait effect processor with improved type safety and validation
 */

export interface ProcessedTraitEffects {
  statModifiers: Partial<PlayerStats>;
  specialEffects: Record<string, number>;
  multipliers: Record<string, number>;
  warnings?: string[]; // Track any issues during processing
}

/**
 * Processes all active traits and returns their combined effects with validation
 */
export const processTraitEffects = (
  activeTraits: Trait[],
  currentStats: PlayerStats
): ProcessedTraitEffects => {
  const result: ProcessedTraitEffects = {
    statModifiers: {},
    specialEffects: {},
    multipliers: {},
    warnings: []
  };

  activeTraits.forEach(trait => {
    if (!trait.effects) return;

    try {
      if (Array.isArray(trait.effects)) {
        // Handle TraitEffect[] format
        trait.effects.forEach(effect => {
          processTraitEffect(effect, result, currentStats, trait.id);
        });
      } else {
        // Handle TraitEffectValues format (Record<string, number>)
        Object.entries(trait.effects as TraitEffectValues).forEach(([effectName, value]) => {
          processTraitEffectValue(effectName, value, result, currentStats, trait.id);
        });
      }
    } catch (error) {
      result.warnings?.push(`Error processing trait ${trait.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return result;
};

/**
 * Processes a single TraitEffect with validation
 */
const processTraitEffect = (
  effect: TraitEffect,
  result: ProcessedTraitEffects,
  currentStats: PlayerStats,
  traitId: string
): void => {
  const { type, magnitude } = effect;
  const parsed = parseEffectName(type);

  if (!parsed.isValid) {
    const validation = validateEffectName(type);
    result.warnings?.push(`Invalid effect "${type}" in trait ${traitId}: ${validation.suggestion || 'Unknown naming issue'}`);
    return;
  }

  switch (parsed.effectType) {
    case 'direct':
      result.statModifiers[type as keyof PlayerStats] = 
        (result.statModifiers[type as keyof PlayerStats] as number || 0) + magnitude;
      break;
      
    case 'multiplier':
      const baseType = parsed.baseStat;
      result.multipliers[baseType] = (result.multipliers[baseType] || 1) + magnitude;
      break;
      
    case 'percentage':
      const percentBaseStat = parsed.baseStat;
      const currentValue = getCurrentStatValue(percentBaseStat, currentStats);
      const bonusAmount = currentValue * magnitude;
      
      if (isDirectStatEffect(percentBaseStat)) {
        result.statModifiers[percentBaseStat as keyof PlayerStats] = 
          (result.statModifiers[percentBaseStat as keyof PlayerStats] as number || 0) + bonusAmount;
      } else {
        result.specialEffects[type] = (result.specialEffects[type] || 0) + magnitude;
      }
      break;
      
    case 'special':
      result.specialEffects[type] = (result.specialEffects[type] || 0) + magnitude;
      break;
  }
};

/**
 * Processes a trait effect value with enhanced validation
 */
const processTraitEffectValue = (
  effectName: string,
  value: number,
  result: ProcessedTraitEffects,
  currentStats: PlayerStats,
  traitId: string
): void => {
  // Validate the effect name
  const validation = validateEffectName(effectName);
  if (!validation.isValid) {
    result.warnings?.push(`Invalid effect "${effectName}" in trait ${traitId}: ${validation.suggestion || 'Unknown naming issue'}`);
    return;
  }

  // Validate the value
  if (typeof value !== 'number' || !isFinite(value)) {
    result.warnings?.push(`Invalid value for effect "${effectName}" in trait ${traitId}: ${value}`);
    return;
  }

  const parsed = parseEffectName(effectName);

  switch (parsed.effectType) {
    case 'direct':
      result.statModifiers[effectName as keyof PlayerStats] = 
        (result.statModifiers[effectName as keyof PlayerStats] as number || 0) + value;
      break;
      
    case 'multiplier':
      const baseType = parsed.baseStat;
      result.multipliers[baseType] = (result.multipliers[baseType] || 1) + value;
      break;
      
    case 'percentage':
      const percentBaseStat = parsed.baseStat;
      const currentValue = getCurrentStatValue(percentBaseStat, currentStats);
      const bonusAmount = currentValue * value;
      
      if (isDirectStatEffect(percentBaseStat)) {
        result.statModifiers[percentBaseStat as keyof PlayerStats] = 
          (result.statModifiers[percentBaseStat as keyof PlayerStats] as number || 0) + bonusAmount;
      } else {
        result.specialEffects[effectName] = (result.specialEffects[effectName] || 0) + value;
      }
      break;
      
    case 'special':
      result.specialEffects[effectName] = (result.specialEffects[effectName] || 0) + value;
      break;
  }
};

/**
 * Gets the current value of a stat for percentage calculations with type safety
 */
const getCurrentStatValue = (statName: string, currentStats: PlayerStats): number => {
  const statKey = statName as keyof PlayerStats;
  const value = currentStats[statKey];
  
  if (typeof value === 'number') {
    return value;
  }
  
  // Return 0 for non-numeric stats or undefined stats
  return 0;
};

/**
 * Enhanced stat application with better error handling and clamping
 */
export const applyTraitEffectsToStats = (
  baseStats: PlayerStats,
  processedEffects: ProcessedTraitEffects
): PlayerStats => {
  const modifiedStats = { ...baseStats };

  // Apply direct stat modifiers with clamping
  Object.entries(processedEffects.statModifiers).forEach(([stat, modifier]) => {
    const statKey = stat as keyof PlayerStats;
    if (typeof modifiedStats[statKey] === 'number' && typeof modifier === 'number') {
      const currentValue = modifiedStats[statKey] as number;
      const newValue = currentValue + modifier;
      (modifiedStats[statKey] as number) = clampStatValue(stat, newValue);
    }
  });

  // Apply multipliers with clamping
  Object.entries(processedEffects.multipliers).forEach(([stat, multiplier]) => {
    const statKey = stat as keyof PlayerStats;
    if (typeof modifiedStats[statKey] === 'number') {
      const currentValue = modifiedStats[statKey] as number;
      const newValue = currentValue * multiplier;
      (modifiedStats[statKey] as number) = clampStatValue(stat, newValue);
    }
  });

  // Apply final cross-stat constraints
  modifiedStats.health = Math.max(
    STAT_LIMITS.MIN_HEALTH, 
    Math.min(modifiedStats.health, modifiedStats.maxHealth)
  );
  modifiedStats.mana = Math.max(
    STAT_LIMITS.MIN_MANA, 
    Math.min(modifiedStats.mana, modifiedStats.maxMana)
  );

  return modifiedStats;
};

/**
 * Helper function to check if traits have any effects
 */
export const hasTraitEffects = (trait: Trait): boolean => {
  if (!trait.effects) return false;
  
  if (Array.isArray(trait.effects)) {
    return trait.effects.length > 0;
  }
  
  return Object.keys(trait.effects).length > 0;
};

/**
 * Helper function to get all effect names from a trait
 */
export const getTraitEffectNames = (trait: Trait): string[] => {
  if (!trait.effects) return [];
  
  if (Array.isArray(trait.effects)) {
    return trait.effects.map(effect => effect.type);
  }
  
  return Object.keys(trait.effects);
};

/**
 * Validation utility for trait data
 */
export const validateTraitEffects = (trait: Trait): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!trait.effects) {
    return { isValid: true, errors: [] };
  }

  if (Array.isArray(trait.effects)) {
    trait.effects.forEach((effect, index) => {
      const validation = validateEffectName(effect.type);
      if (!validation.isValid) {
        errors.push(`Effect ${index}: ${validation.suggestion || 'Invalid effect name'}`);
      }
      
      if (typeof effect.magnitude !== 'number' || !isFinite(effect.magnitude)) {
        errors.push(`Effect ${index}: Invalid magnitude value`);
      }
    });
  } else {
    Object.entries(trait.effects).forEach(([effectName, value]) => {
      const validation = validateEffectName(effectName);
      if (!validation.isValid) {
        errors.push(`${effectName}: ${validation.suggestion || 'Invalid effect name'}`);
      }
      
      if (typeof value !== 'number' || !isFinite(value)) {
        errors.push(`${effectName}: Invalid value`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
