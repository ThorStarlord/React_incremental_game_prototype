import { PlayerState, PlayerStats, EquipmentState } from '../../../context/types/gameStates/GameStateTypes';

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
  
  // Calculate derived stats from player attributes
  const derivedStats: Partial<PlayerStats> = {
    maxHealth: HEALTH.BASE + (player.attributes.vitality * HEALTH.VITALITY_MULTIPLIER),
    healthRegen: HEALTH_REGEN.BASE + (player.attributes.vitality * HEALTH_REGEN.VITALITY_MULTIPLIER),
    maxMana: MANA.BASE + (player.attributes.intelligence * MANA.INTELLIGENCE_MULTIPLIER),
    manaRegen: MANA_REGEN.BASE + (player.attributes.intelligence * MANA_REGEN.INTELLIGENCE_MULTIPLIER),
    physicalDamage: PHYSICAL_DAMAGE.BASE + (player.attributes.strength * PHYSICAL_DAMAGE.STRENGTH_MULTIPLIER),
    magicalDamage: MAGICAL_DAMAGE.BASE + (player.attributes.intelligence * MAGICAL_DAMAGE.INTELLIGENCE_MULTIPLIER),
    critChance: CRIT_CHANCE.BASE + (player.attributes.luck * CRIT_CHANCE.LUCK_MULTIPLIER),
    critMultiplier: CRIT_MULTIPLIER.BASE + (player.attributes.luck * CRIT_MULTIPLIER.LUCK_MULTIPLIER),
  };
  
  return {
    ...player.stats,
    ...derivedStats
  };
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
    critMultiplier: 0
  };
  
  // Iterate through each equipment slot
  Object.values(equipment).forEach(item => {
    if (item && item.stats) {
      // Add each stat bonus from the item
      Object.entries(item.stats).forEach(([key, value]) => {
        // Use type guard for better type safety
        if (key in bonuses && typeof value === 'number') {
          const statKey = key as keyof PlayerStats;
          bonuses[statKey] = (bonuses[statKey] as number) + value;
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
