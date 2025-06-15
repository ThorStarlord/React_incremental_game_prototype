// Import types from the local PlayerTypes file
import { PlayerState, PlayerStats } from '../state/PlayerTypes';

/**
 * Constants for player stat calculations
 */
export const PLAYER_STAT_FACTORS = {
  HEALTH: {
    BASE: 100,
    CONSTITUTION_MULTIPLIER: 10 // A more significant value
  },
  HEALTH_REGEN: {
    BASE: 1.0,
    CONSTITUTION_MULTIPLIER: 0.1
  },
  MANA: {
    BASE: 50,
    INTELLIGENCE_MULTIPLIER: 5 // A more significant value
  },
  MANA_REGEN: {
    BASE: 0.5,
    WISDOM_MULTIPLIER: 0.15
  },
  ATTACK: {
    STRENGTH_MULTIPLIER: 1
  },
  DEFENSE: {
    CONSTITUTION_MULTIPLIER: 1
  },
  SPEED: {
    DEXTERITY_MULTIPLIER: 1
  },
  CRITICAL_CHANCE: {
    BASE: 0.05,
    DEXTERITY_MULTIPLIER: 0.01
  },
  CRITICAL_DAMAGE: {
    BASE: 1.5,
    STRENGTH_MULTIPLIER: 0.05
  }
};

/**
 * Helper function to recalculate derived stats based on attributes
 * @param {PlayerState} player - Current player state
 * @returns {PlayerStats} Updated player stats
 */
export const recalculatePlayerStats = (player: PlayerState): PlayerStats => {
  const { HEALTH, HEALTH_REGEN, MANA, MANA_REGEN, ATTACK, DEFENSE, SPEED, CRITICAL_CHANCE, CRITICAL_DAMAGE } = PLAYER_STAT_FACTORS;
  
  // FIXED: Access stats from the 'baseStats' nested object
  const base = player.baseStats;

  const constitutionValue = player.attributes.constitution;
  const intelligenceValue = player.attributes.intelligence;
  const strengthValue = player.attributes.strength;
  const dexterityValue = player.attributes.dexterity;
  const wisdomValue = player.attributes.wisdom;

  const strengthBonus = Math.floor((strengthValue - 10) / 2);
  const dexterityBonus = Math.floor((dexterityValue - 10) / 2);
  const intelligenceBonus = Math.floor((intelligenceValue - 10) / 2);
  const constitutionBonus = Math.floor((constitutionValue - 10) / 2);
  const wisdomBonus = Math.floor((wisdomValue - 10) / 2);

  // Calculate derived stats from attributes and base stats
  const derivedStats = {
    maxHealth: Math.max(1, base.maxHealth + (constitutionBonus * HEALTH.CONSTITUTION_MULTIPLIER)),
    healthRegen: Math.max(0, base.healthRegen + (constitutionBonus * HEALTH_REGEN.CONSTITUTION_MULTIPLIER)),
    maxMana: Math.max(0, base.maxMana + (intelligenceBonus * MANA.INTELLIGENCE_MULTIPLIER)),
    manaRegen: Math.max(0, base.manaRegen + (wisdomBonus * MANA_REGEN.WISDOM_MULTIPLIER)),
    attack: Math.max(0, base.attack + strengthBonus),
    defense: Math.max(0, base.defense + constitutionBonus),
    speed: Math.max(0, base.speed + dexterityBonus),
    criticalChance: Math.max(0, Math.min(1, base.criticalChance + (dexterityBonus * CRITICAL_CHANCE.DEXTERITY_MULTIPLIER))),
    criticalDamage: Math.max(1, base.criticalDamage + (strengthBonus * CRITICAL_DAMAGE.STRENGTH_MULTIPLIER)),
  };

  const updatedStats: PlayerStats = {
    // Current health and mana are preserved, but capped by new max values
    health: Math.min(player.stats.health, derivedStats.maxHealth),
    maxHealth: derivedStats.maxHealth,
    mana: Math.min(player.stats.mana, derivedStats.maxMana),
    maxMana: derivedStats.maxMana,
    attack: derivedStats.attack,
    defense: derivedStats.defense,
    speed: derivedStats.speed,
    healthRegen: derivedStats.healthRegen,
    manaRegen: derivedStats.manaRegen,
    criticalChance: derivedStats.criticalChance,
    criticalDamage: derivedStats.criticalDamage,
  };

  return updatedStats;
};

/**
 * Apply status effect modifiers to player stats
 * @param {PlayerStats} baseStats - Base calculated stats
 * @param {PlayerState} player - Current player state with status effects
 * @returns {PlayerStats} Final player stats with status effect bonuses
 */
export const applyStatusEffectModifiers = (baseStats: PlayerStats, player: PlayerState): PlayerStats => {
  const finalStats = { ...baseStats };

  player.statusEffects.forEach(effect => {
    if (effect.effects) {
      for (const [stat, value] of Object.entries(effect.effects)) {
        if (stat in finalStats && typeof value === 'number') {
            (finalStats as any)[stat] += value;
        }
      }
    }
  });

  return finalStats;
};

/**
 * Calculate complete player stats with all modifiers
 * @param {PlayerState} player - Current player state
 * @returns {PlayerStats} Final calculated player stats
 */
export const calculateCompletePlayerStats = (player: PlayerState): PlayerStats => {
  const statsFromAttributes = recalculatePlayerStats(player);
  const finalStats = applyStatusEffectModifiers(statsFromAttributes, player);
  
  return finalStats;
};