// Import types from the local PlayerTypes file
import { PlayerState, PlayerStats, EquipmentState, EquipmentItem } from '../state/PlayerTypes';

/**
 * Constants for player stat calculations
 */
export const PLAYER_STAT_FACTORS = {
  HEALTH: {
    BASE: 100,
    VITALITY_MULTIPLIER: 10
  },
  HEALTH_REGEN: {
    BASE: 0.5,
    VITALITY_MULTIPLIER: 0.1
  },
  MANA: {
    BASE: 50,
    INTELLIGENCE_MULTIPLIER: 10
  },
  MANA_REGEN: {
    BASE: 0.5,
    INTELLIGENCE_MULTIPLIER: 0.1
  },
  PHYSICAL_DAMAGE: {
    BASE: 5,
    STRENGTH_MULTIPLIER: 0.5
  },
  MAGICAL_DAMAGE: {
    BASE: 2,
    INTELLIGENCE_MULTIPLIER: 0.5
  },
  CRIT_CHANCE: {
    BASE: 5,
    LUCK_MULTIPLIER: 0.5
  },
  CRIT_MULTIPLIER: {
    BASE: 1.5,
    LUCK_MULTIPLIER: 0.05
  }
};

/**
 * Helper function to recalculate derived stats based on attributes
 * @param {PlayerState} player - Current player state
 * @returns {PlayerStats} Updated player stats
 */
export const recalculatePlayerStats = (player: PlayerState): PlayerStats => {
  const { HEALTH, HEALTH_REGEN, MANA, MANA_REGEN, PHYSICAL_DAMAGE, MAGICAL_DAMAGE, CRIT_CHANCE, CRIT_MULTIPLIER } = PLAYER_STAT_FACTORS;

  // Access the .value property of each attribute, provide default 0 if attribute is missing
  const vitalityValue = player.attributes.vitality?.value ?? 0;
  const intelligenceValue = player.attributes.intelligence?.value ?? 0;
  const strengthValue = player.attributes.strength?.value ?? 0;
  const luckValue = player.attributes.luck?.value ?? 0;

  // Calculate derived stats from player attributes' values
  const derivedStats = {
    maxHealth: HEALTH.BASE + (vitalityValue * HEALTH.VITALITY_MULTIPLIER),
    healthRegen: HEALTH_REGEN.BASE + (vitalityValue * HEALTH_REGEN.VITALITY_MULTIPLIER),
    maxMana: MANA.BASE + (intelligenceValue * MANA.INTELLIGENCE_MULTIPLIER),
    manaRegen: MANA_REGEN.BASE + (intelligenceValue * MANA_REGEN.INTELLIGENCE_MULTIPLIER),
    critChance: CRIT_CHANCE.BASE + (luckValue * CRIT_CHANCE.LUCK_MULTIPLIER),
    critDamage: CRIT_MULTIPLIER.BASE + (luckValue * CRIT_MULTIPLIER.LUCK_MULTIPLIER),
  };

  // Merge base stats with newly calculated derived stats
  const updatedStats: PlayerStats = {
    ...player.stats,
    maxHealth: derivedStats.maxHealth,
    healthRegen: derivedStats.healthRegen,
    maxMana: derivedStats.maxMana,
    manaRegen: derivedStats.manaRegen,
    critChance: derivedStats.critChance,
    critDamage: derivedStats.critDamage,
    health: Math.min(player.stats.health, derivedStats.maxHealth),
    mana: Math.min(player.stats.mana, derivedStats.maxMana),
    attack: player.stats.attack,
    speed: player.stats.speed,
    defense: player.stats.defense,
  };

  return updatedStats;
};

/**
 * Calculate equipment bonuses for player stats
 * @param {EquipmentState} equipment - Currently equipped items
 * @returns {Partial<PlayerStats>} Stat bonuses from equipment
 */
export const calculateEquipmentBonuses = (equipment: EquipmentState): Partial<PlayerStats> => {
  // Initialize empty stat bonuses
  const bonuses: Partial<PlayerStats> = {
    maxHealth: 0,
    healthRegen: 0,
    maxMana: 0,
    manaRegen: 0,
    physicalDamage: 0,
    magicalDamage: 0,
    critChance: 0,
    critMultiplier: 0,
    attack: 0,
    speed: 0,
    defense: 0,
    critDamage: 0,
  };

  // Iterate through each equipment slot
  Object.values(equipment).forEach((item: EquipmentItem | null | undefined) => {
    // Check if item exists and has stats
    if (item && item.stats) {
      // Add each stat bonus from the item
      Object.entries(item.stats).forEach(([key, value]) => {
        if (key in bonuses && typeof value === 'number') {
          const statKey = key as keyof PlayerStats;
          if (typeof bonuses[statKey] === 'number') {
            (bonuses[statKey] as number) += value;
          }
        }
      });
    }
  });

  return bonuses;
};

/**
 * Apply all bonuses to player stats
 * @param {PlayerState} player - Current player state
 * @param {EquipmentState} equipment - Currently equipped items 
 * @returns {PlayerStats} Final player stats with all bonuses
 */
export const calculateFinalPlayerStats = (player: PlayerState, equipment: EquipmentState): PlayerStats => {
  // First calculate base stats from attributes
  const baseStats = recalculatePlayerStats(player);
  
  // Then calculate equipment bonuses
  const equipmentBonuses = calculateEquipmentBonuses(equipment);
  
  // Combine the stats
  const finalStats: PlayerStats = { ...baseStats };
  
  // Apply equipment bonuses
  Object.entries(equipmentBonuses).forEach(([key, value]) => {
    const statKey = key as keyof PlayerStats;
    if (typeof finalStats[statKey] === 'number' && typeof value === 'number') {
      (finalStats[statKey] as number) += value;
    }
  });
  
  return finalStats;
};
