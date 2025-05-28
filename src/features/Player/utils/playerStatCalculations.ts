// Import types from the local PlayerTypes file
import { PlayerState, PlayerStats } from '../state/PlayerTypes';

/**
 * Constants for player stat calculations
 */
export const PLAYER_STAT_FACTORS = {
  HEALTH: {
    BASE: 100,
    CONSTITUTION_MULTIPLIER: 5
  },
  HEALTH_REGEN: {
    BASE: 1.0,
    CONSTITUTION_MULTIPLIER: 0.1
  },
  MANA: {
    BASE: 50,
    INTELLIGENCE_MULTIPLIER: 3
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

  // Access attribute values directly (they are numbers, not objects with .value property)
  const constitutionValue = player.attributes.constitution;
  const intelligenceValue = player.attributes.intelligence;
  const strengthValue = player.attributes.strength;
  const dexterityValue = player.attributes.dexterity;
  const wisdomValue = player.attributes.wisdom;

  // Calculate attribute bonuses (D&D style: (attribute - 10) / 2)
  const strengthBonus = Math.floor((strengthValue - 10) / 2);
  const dexterityBonus = Math.floor((dexterityValue - 10) / 2);
  const intelligenceBonus = Math.floor((intelligenceValue - 10) / 2);
  const constitutionBonus = Math.floor((constitutionValue - 10) / 2);
  const wisdomBonus = Math.floor((wisdomValue - 10) / 2);

  // Calculate derived stats from player attributes
  const derivedStats = {
    maxHealth: Math.max(1, HEALTH.BASE + (constitutionBonus * HEALTH.CONSTITUTION_MULTIPLIER)),
    healthRegen: Math.max(0, HEALTH_REGEN.BASE + (constitutionBonus * HEALTH_REGEN.CONSTITUTION_MULTIPLIER)),
    maxMana: Math.max(0, MANA.BASE + (intelligenceBonus * MANA.INTELLIGENCE_MULTIPLIER)),
    manaRegen: Math.max(0, MANA_REGEN.BASE + (wisdomBonus * MANA_REGEN.WISDOM_MULTIPLIER)),
    attack: Math.max(0, player.stats.attack + strengthBonus),
    defense: Math.max(0, player.stats.defense + constitutionBonus),
    speed: Math.max(0, player.stats.speed + dexterityBonus),
    criticalChance: Math.max(0, Math.min(1, CRITICAL_CHANCE.BASE + (dexterityBonus * CRITICAL_CHANCE.DEXTERITY_MULTIPLIER))),
    criticalDamage: Math.max(1, CRITICAL_DAMAGE.BASE + (strengthBonus * CRITICAL_DAMAGE.STRENGTH_MULTIPLIER)),
  };

  // Return updated stats with proper PlayerStats interface properties
  const updatedStats: PlayerStats = {
    ...player.stats,
    maxHealth: derivedStats.maxHealth,
    healthRegen: derivedStats.healthRegen,
    maxMana: derivedStats.maxMana,
    manaRegen: derivedStats.manaRegen,
    attack: derivedStats.attack,
    defense: derivedStats.defense,
    speed: derivedStats.speed,
    criticalChance: derivedStats.criticalChance,
    criticalDamage: derivedStats.criticalDamage,
    health: Math.min(player.stats.health, derivedStats.maxHealth),
    mana: Math.min(player.stats.mana, derivedStats.maxMana),
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
  // Initialize stat modifiers
  let statusModifiers = {
    health: 0,
    mana: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    healthRegen: 0,
    manaRegen: 0,
    criticalChance: 0,
    criticalDamage: 0
  };

  // Apply status effect modifiers
  player.statusEffects.forEach(effect => {
    if (effect.effects) {
      Object.entries(effect.effects).forEach(([stat, value]) => {
        if (stat in statusModifiers) {
          statusModifiers[stat as keyof typeof statusModifiers] += value as number;
        }
      });
    }
  });

  // Apply modifiers to final stats
  const finalStats: PlayerStats = {
    ...baseStats,
    health: Math.max(0, Math.min(baseStats.maxHealth, baseStats.health + statusModifiers.health)),
    mana: Math.max(0, Math.min(baseStats.maxMana, baseStats.mana + statusModifiers.mana)),
    attack: Math.max(0, baseStats.attack + statusModifiers.attack),
    defense: Math.max(0, baseStats.defense + statusModifiers.defense),
    speed: Math.max(0, baseStats.speed + statusModifiers.speed),
    healthRegen: Math.max(0, baseStats.healthRegen + statusModifiers.healthRegen),
    manaRegen: Math.max(0, baseStats.manaRegen + statusModifiers.manaRegen),
    criticalChance: Math.max(0, Math.min(1, baseStats.criticalChance + statusModifiers.criticalChance)),
    criticalDamage: Math.max(1, baseStats.criticalDamage + statusModifiers.criticalDamage),
  };

  return finalStats;
};

/**
 * Calculate complete player stats with all modifiers
 * @param {PlayerState} player - Current player state
 * @returns {PlayerStats} Final calculated player stats
 */
export const calculateCompletePlayerStats = (player: PlayerState): PlayerStats => {
  // First calculate base stats from attributes
  const baseStats = recalculatePlayerStats(player);
  
  // Then apply status effect modifiers
  const finalStats = applyStatusEffectModifiers(baseStats, player);
  
  return finalStats;
};
