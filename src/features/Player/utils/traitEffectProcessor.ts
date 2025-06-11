import type { Trait, TraitEffect, TraitEffectValues } from '../../Traits/state/TraitsTypes';
import type { PlayerStats } from '../state/PlayerTypes';

/**
 * Processes trait effects and applies them to player stats
 * @param traits Array of traits to process
 * @param baseStats Base player stats before trait modifications
 * @returns Modified stats with trait effects applied
 */
export function processTraitEffects(traits: Trait[], baseStats: PlayerStats): PlayerStats {
  let modifiedStats = { ...baseStats };

  traits.forEach(trait => {
    if (!trait.effects) return;

    // Handle different effect formats
    if (Array.isArray(trait.effects)) {
      // TraitEffect[] format
      trait.effects.forEach((effect: TraitEffect) => {
        modifiedStats = applyEffect(modifiedStats, effect.type, effect.magnitude);
      });
    } else {
      // TraitEffectValues format (object with effect names as keys)
      Object.entries(trait.effects as TraitEffectValues).forEach(([effectType, magnitude]) => {
        modifiedStats = applyEffect(modifiedStats, effectType, magnitude);
      });
    }
  });

  return modifiedStats;
}

/**
 * Applies a single effect to player stats
 * @param stats Current player stats
 * @param effectType Type of effect to apply
 * @param magnitude Effect magnitude
 * @returns Updated stats with effect applied
 */
function applyEffect(stats: PlayerStats, effectType: string, magnitude: number): PlayerStats {
  const updatedStats = { ...stats };

  switch (effectType.toLowerCase()) {
    case 'health':
    case 'max_health':
    case 'maxhealth':
      updatedStats.maxHealth += magnitude;
      break;
    
    case 'mana':
    case 'max_mana':
    case 'maxmana':
      updatedStats.maxMana += magnitude;
      break;
    
    case 'attack':
    case 'damage':
      updatedStats.attack += magnitude;
      break;
    
    case 'defense':
    case 'armor':
      updatedStats.defense += magnitude;
      break;
    
    case 'speed':
    case 'agility':
      updatedStats.speed += magnitude;
      break;
    
    case 'health_regen':
    case 'healthregen':
    case 'health_regeneration':
      updatedStats.healthRegen += magnitude;
      break;
    
    case 'mana_regen':
    case 'manaregen':
    case 'mana_regeneration':
      updatedStats.manaRegen += magnitude;
      break;
    
    case 'critical_chance':
    case 'criticalchance':
    case 'crit_chance':
      updatedStats.criticalChance += magnitude;
      break;
    
    case 'critical_damage':
    case 'criticaldamage':
    case 'crit_damage':
      updatedStats.criticalDamage += magnitude;
      break;
    
    default:
      console.warn(`Unknown trait effect type: ${effectType}`);
      break;
  }

  return updatedStats;
}

/**
 * Calculates total trait bonuses for display purposes
 * @param traits Array of traits to analyze
 * @returns Object containing total bonuses by stat type
 */
export function calculateTraitBonuses(traits: Trait[]): Partial<PlayerStats> {
  const bonuses: Partial<PlayerStats> = {};
  const emptyStats: PlayerStats = {
    health: 0,
    maxHealth: 0,
    mana: 0,
    maxMana: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    healthRegen: 0,
    manaRegen: 0,
    criticalChance: 0,
    criticalDamage: 0
  };

  const modifiedStats = processTraitEffects(traits, emptyStats);
  
  // Return only non-zero bonuses
  Object.entries(modifiedStats).forEach(([key, value]) => {
    if (value !== 0) {
      (bonuses as any)[key] = value;
    }
  });

  return bonuses;
}

/**
 * Validates trait effects for consistency and correctness
 * @param trait Trait to validate
 * @returns Array of validation warnings
 */
export function validateTraitEffects(trait: Trait): string[] {
  const warnings: string[] = [];

  if (!trait.effects) {
    warnings.push(`Trait ${trait.name} has no effects defined`);
    return warnings;
  }

  if (Array.isArray(trait.effects)) {
    trait.effects.forEach((effect, index) => {
      if (!effect.type) {
        warnings.push(`Effect ${index} in trait ${trait.name} missing type`);
      }
      if (typeof effect.magnitude !== 'number') {
        warnings.push(`Effect ${index} in trait ${trait.name} has invalid magnitude`);
      }
    });
  } else {
    Object.entries(trait.effects).forEach(([effectType, magnitude]) => {
      if (typeof magnitude !== 'number') {
        warnings.push(`Effect ${effectType} in trait ${trait.name} has invalid magnitude`);
      }
    });
  }

  return warnings;
}
