import type { Trait } from '../../Traits/state/TraitsTypes';
import type { PlayerStats } from '../state/PlayerTypes';

/**
 * Processes an array of active traits and applies their effects to a set of base stats.
 * @param activeTraits - An array of full Trait objects that are currently active.
 * @param baseStats - The player's stats before any trait modifications.
 * @returns A new PlayerStats object with all modifications applied.
 */
export function processTraitEffects(activeTraits: Trait[], baseStats: PlayerStats): PlayerStats {
  const finalStats: PlayerStats = { ...baseStats };
  const percentBonuses: { [key: string]: number } = {};
  const multipliers: { [key: string]: number } = {};

  // First, aggregate all flat bonuses, percentage bonuses, and multipliers
  activeTraits.forEach(trait => {
    if (!trait.effects || typeof trait.effects !== 'object' || Array.isArray(trait.effects)) {
      return;
    }

    for (const [effectName, value] of Object.entries(trait.effects)) {
      if (typeof value !== 'number') continue;

      if (effectName.endsWith('PercentBonus')) {
        const statName = effectName.replace('PercentBonus', '');
        percentBonuses[statName] = (percentBonuses[statName] || 0) + value;
      } else if (effectName.endsWith('Multiplier')) {
        const statName = effectName.replace('Multiplier', '');
        multipliers[statName] = (multipliers[statName] || 1) * value;
      } else {
        // Assume it's a flat bonus
        if (effectName in finalStats) {
          (finalStats as any)[effectName] += value;
        }
      }
    }
  });

  // Apply percentage bonuses to the (now modified) flat stats
  for (const [statName, percentValue] of Object.entries(percentBonuses)) {
    if (statName in finalStats) {
      const baseValue = (finalStats as any)[statName];
      (finalStats as any)[statName] = baseValue * (1 + percentValue);
    }
  }

  // Apply multipliers last
  for (const [statName, multiplierValue] of Object.entries(multipliers)) {
     if (statName in finalStats) {
      (finalStats as any)[statName] *= multiplierValue;
    }
  }

  return finalStats;
}