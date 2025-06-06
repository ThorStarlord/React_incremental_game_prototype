import { Trait, TraitEffect, TraitEffectValues } from '../../Traits/state/TraitsTypes';
import { PlayerStats } from '../state/PlayerTypes';

/**
 * Defines the aggregated effects from traits.
 * - statModifiers: Direct additions/subtractions to base stats.
 * - multipliers: Percentage-based multipliers for stats.
 * - specialEffects: Flags or values for unique, non-stat-modifying effects.
 */
export interface ProcessedTraitEffects {
  statModifiers: Partial<PlayerStats>;
  multipliers: {
    [key: string]: number; // e.g., 'essenceGainMultiplier', 'skillXpMultiplier'
  };
  specialEffects: {
    [key: string]: any; // e.g., 'passiveRelationshipGrowth': 1
  };
  warnings?: string[]; // To log any issues during processing
}

/**
 * Aggregates effects from a list of active traits.
 * @param activeTraits An array of Trait objects that are currently active (equipped or permanent).
 * @param baseStats The player's current base stats (after attributes, before traits/status effects). Used for validation/context.
 * @returns An object containing aggregated stat modifiers, multipliers, and special effects.
 */
export const processTraitEffects = (
  activeTraits: Trait[],
  baseStats: Partial<PlayerStats> // Can be used for validation or dynamic effects
): ProcessedTraitEffects => {
  const aggregatedEffects: ProcessedTraitEffects = {
    statModifiers: {},
    multipliers: {},
    specialEffects: {},
    warnings: []
  };

  activeTraits.forEach(trait => {
    if (!trait.effects) return;

    if (Array.isArray(trait.effects)) {
      // Handle array of TraitEffect objects
      trait.effects.forEach(effect => {
        if (effect.type in baseStats) {
          // Direct stat modifier
          aggregatedEffects.statModifiers[effect.type as keyof PlayerStats] = 
            (aggregatedEffects.statModifiers[effect.type as keyof PlayerStats] || 0) + effect.magnitude;
        } else if (effect.type.endsWith('Multiplier')) {
          // Multiplier effect
          aggregatedEffects.multipliers[effect.type] = 
            (aggregatedEffects.multipliers[effect.type] || 1) * (1 + effect.magnitude); // Assuming magnitude is a percentage (0.15 for 15%)
        } else {
          // Special effect
          aggregatedEffects.specialEffects[effect.type] = effect.magnitude; // Or more complex handling
        }
      });
    } else {
      // Handle TraitEffectValues object
      Object.entries(trait.effects).forEach(([effectName, value]) => {
        if (effectName in baseStats) {
          // Direct stat modifier
          aggregatedEffects.statModifiers[effectName as keyof PlayerStats] = 
            (aggregatedEffects.statModifiers[effectName as keyof PlayerStats] || 0) + (value as number);
        } else if (effectName.endsWith('Multiplier')) {
          // Multiplier effect
          aggregatedEffects.multipliers[effectName] = 
            (aggregatedEffects.multipliers[effectName] || 1) * (1 + (value as number));
        } else {
          // Special effect
          aggregatedEffects.specialEffects[effectName] = value;
        }
      });
    }
  });

  return aggregatedEffects;
};

/**
 * Applies processed trait effects to a set of player stats.
 * @param currentStats The player's current stats (e.g., after attributes, before status effects).
 * @param traitEffects The aggregated trait effects from processTraitEffects.
 * @returns A new PlayerStats object with trait effects applied.
 */
export const applyTraitEffectsToStats = (
  currentStats: PlayerStats,
  traitEffects: ProcessedTraitEffects
): PlayerStats => {
  const newStats = { ...currentStats };

  // Apply direct stat modifiers
  Object.entries(traitEffects.statModifiers).forEach(([stat, modifier]) => {
    if (typeof newStats[stat as keyof PlayerStats] === 'number' && typeof modifier === 'number') {
      (newStats[stat as keyof PlayerStats] as number) += modifier;
    }
  });

  // Apply multipliers
  Object.entries(traitEffects.multipliers).forEach(([multiplierName, multiplierValue]) => {
    // This part needs careful mapping from multiplierName to actual stat
    // For example, 'essenceGainMultiplier' doesn't directly affect PlayerStats.
    // This function should only apply to PlayerStats. Other multipliers might be handled elsewhere.
    // For now, let's assume multipliers here are for stats like attack, defense, etc.
    // If a multiplier is for a stat, apply it. Otherwise, it's a special effect.
    if (multiplierName.includes('attack')) { // Example: if 'attackMultiplier'
      newStats.attack *= multiplierValue;
    }
    // Add more specific multiplier handling as needed
  });

  return newStats;
};
