import type { PlayerState, PlayerStats } from '../state/PlayerTypes';
import type { RootState } from '../../../app/store';

/**
 * Calculate derived player statistics from current player state
 * @param playerState - Current player state from Redux
 * @returns Computed player statistics object
 */
export const getPlayerStats = (playerState: PlayerState): PlayerStats => {
  const { attributes, statusEffects, stats: baseStats } = playerState;
  
  // Calculate attribute-based bonuses
  const strengthBonus = Math.floor((attributes.strength - 10) / 2);
  const dexterityBonus = Math.floor((attributes.dexterity - 10) / 2);
  const intelligenceBonus = Math.floor((attributes.intelligence - 10) / 2);
  const constitutionBonus = Math.floor((attributes.constitution - 10) / 2);
  const wisdomBonus = Math.floor((attributes.wisdom - 10) / 2);
  const charismaBonus = Math.floor((attributes.charisma - 10) / 2);
  
  // Calculate derived stats from attributes
  const maxHealth = baseStats.maxHealth + (constitutionBonus * 5);
  const maxMana = baseStats.maxMana + (intelligenceBonus * 3);
  const attack = baseStats.attack + strengthBonus;
  const defense = baseStats.defense + constitutionBonus;
  const speed = baseStats.speed + dexterityBonus;
  const healthRegen = baseStats.healthRegen + (constitutionBonus * 0.1);
  const manaRegen = baseStats.manaRegen + (wisdomBonus * 0.15);
  const criticalChance = Math.min(0.5, baseStats.criticalChance + (dexterityBonus * 0.01));
  const criticalDamage = baseStats.criticalDamage + (strengthBonus * 0.05);
  
  // Apply status effect modifiers
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
  
  statusEffects.forEach(effect => {
    if (effect.effects) {
      Object.entries(effect.effects).forEach(([stat, value]) => {
        if (stat in statusModifiers) {
          statusModifiers[stat as keyof typeof statusModifiers] += value as number;
        }
      });
    }
  });
  
  return {
    health: Math.max(0, Math.min(maxHealth, baseStats.health + statusModifiers.health)),
    maxHealth: Math.max(1, maxHealth),
    mana: Math.max(0, Math.min(maxMana, baseStats.mana + statusModifiers.mana)),
    maxMana: Math.max(0, maxMana),
    attack: Math.max(0, attack + statusModifiers.attack),
    defense: Math.max(0, defense + statusModifiers.defense),
    speed: Math.max(0, speed + statusModifiers.speed),
    healthRegen: Math.max(0, healthRegen + statusModifiers.healthRegen),
    manaRegen: Math.max(0, manaRegen + statusModifiers.manaRegen),
    criticalChance: Math.max(0, Math.min(1, criticalChance + statusModifiers.criticalChance)),
    criticalDamage: Math.max(1, criticalDamage + statusModifiers.criticalDamage)
  };
};

/**
 * Get player stats from Redux state
 * @param state - Root Redux state
 * @returns Computed player statistics
 */
export const getPlayerStatsFromState = (state: RootState): PlayerStats => {
  return getPlayerStats(state.player);
};

/**
 * Calculate effective stats including equipment and trait bonuses
 * @param playerState - Current player state
 * @returns Final computed stats with all bonuses applied
 */
export const getEffectivePlayerStats = (playerState: PlayerState): PlayerStats => {
  const baseStats = getPlayerStats(playerState);
  
  // Apply equipment bonuses (when equipment system is implemented)
  let equipmentBonuses = {
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
  
  // Apply trait bonuses (from equipped and permanent traits)
  let traitBonuses = {
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
  
  // TODO: When trait system integration is complete, calculate trait bonuses here
  // playerState.equippedTraits.forEach(trait => { ... });
  // playerState.permanentTraits.forEach(trait => { ... });
  
  return {
    health: Math.max(0, baseStats.health + equipmentBonuses.health + traitBonuses.health),
    maxHealth: Math.max(1, baseStats.maxHealth + equipmentBonuses.maxHealth + traitBonuses.maxHealth),
    mana: Math.max(0, baseStats.mana + equipmentBonuses.mana + traitBonuses.mana),
    maxMana: Math.max(0, baseStats.maxMana + equipmentBonuses.maxMana + traitBonuses.maxMana),
    attack: Math.max(0, baseStats.attack + equipmentBonuses.attack + traitBonuses.attack),
    defense: Math.max(0, baseStats.defense + equipmentBonuses.defense + traitBonuses.defense),
    speed: Math.max(0, baseStats.speed + equipmentBonuses.speed + traitBonuses.speed),
    healthRegen: Math.max(0, baseStats.healthRegen + equipmentBonuses.healthRegen + traitBonuses.healthRegen),
    manaRegen: Math.max(0, baseStats.manaRegen + equipmentBonuses.manaRegen + traitBonuses.manaRegen),
    criticalChance: Math.max(0, Math.min(1, baseStats.criticalChance + equipmentBonuses.criticalChance + traitBonuses.criticalChance)),
    criticalDamage: Math.max(1, baseStats.criticalDamage + equipmentBonuses.criticalDamage + traitBonuses.criticalDamage)
  };
};

/**
 * Calculate health percentage for UI display
 * @param health - Current health value
 * @param maxHealth - Maximum health value
 * @returns Health percentage as decimal (0.0 to 1.0)
 */
export const getHealthPercentage = (health: number, maxHealth: number): number => {
  return maxHealth > 0 ? Math.max(0, Math.min(1, health / maxHealth)) : 0;
};

/**
 * Calculate mana percentage for UI display
 * @param mana - Current mana value
 * @param maxMana - Maximum mana value
 * @returns Mana percentage as decimal (0.0 to 1.0)
 */
export const getManaPercentage = (mana: number, maxMana: number): number => {
  return maxMana > 0 ? Math.max(0, Math.min(1, mana / maxMana)) : 0;
};

/**
 * Get health status for UI color coding
 * @param healthPercentage - Health as percentage (0.0 to 1.0)
 * @returns Status string for UI theming
 */
export const getHealthStatus = (healthPercentage: number): 'critical' | 'low' | 'moderate' | 'good' | 'full' => {
  if (healthPercentage <= 0.1) return 'critical';
  if (healthPercentage <= 0.25) return 'low';
  if (healthPercentage <= 0.5) return 'moderate';
  if (healthPercentage < 1.0) return 'good';
  return 'full';
};

/**
 * Get mana status for UI color coding
 * @param manaPercentage - Mana as percentage (0.0 to 1.0)
 * @returns Status string for UI theming
 */
export const getManaStatus = (manaPercentage: number): 'empty' | 'low' | 'moderate' | 'good' | 'full' => {
  if (manaPercentage <= 0.1) return 'empty';
  if (manaPercentage <= 0.25) return 'low';
  if (manaPercentage <= 0.5) return 'moderate';
  if (manaPercentage < 1.0) return 'good';
  return 'full';
};
