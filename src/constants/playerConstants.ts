/**
 * Player Constants
 * 
 * Centralized constants for player mechanics, formulas, and limits.
 * Following best practices from the coding guidelines.
 */

/**
 * Attribute modifier calculation
 */
export const calculateAttributeModifier = (attributeValue: number): number => {
  return Math.floor((attributeValue - 10) / 2);
};

/**
 * Attribute system constants
 */
export const ATTRIBUTE_CONSTANTS = {
  STARTING_ATTRIBUTE_VALUE: 10,
  MAX_ATTRIBUTE_VALUE: 100,
  ATTRIBUTE_POINTS_PER_LEVEL: 2,
} as const;

/**
 * Progression constants
 */
export const PROGRESSION_CONSTANTS = {
  BASE_XP_REQUIREMENT: 100,
  XP_SCALING_FACTOR: 1.5,
  MAX_LEVEL: 100,
} as const;

/**
 * Stat calculation formulas
 */
export const STAT_FORMULAS = {
  HEALTH_PER_CONSTITUTION: 5,
  MANA_PER_INTELLIGENCE: 3,
  HEALTH_REGEN_PER_CONSTITUTION: 0.1,
  MANA_REGEN_PER_WISDOM: 0.1,
  CRIT_CHANCE_PER_DEXTERITY: 0.01,
  CRIT_DAMAGE_PER_STRENGTH: 0.05,
} as const;

/**
 * Stat limits and constraints
 */
export const STAT_LIMITS = {
  MIN_HEALTH: 0,
  MIN_MANA: 0,
  MAX_HEALTH: 9999,
  MAX_MANA: 9999,
  MAX_ATTRIBUTE_VALUE: 100,
} as const;

/**
 * Player base stats defaults
 */
export const PLAYER_BASE_STATS = {
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  attack: 10,
  defense: 5,
  speed: 8,
  healthRegen: 1,
  manaRegen: 1,
  criticalChance: 0.05,
  criticalDamage: 1.5,
} satisfies Record<string, number>;

import { PlayerAttributes, PlayerStats } from '../features/Player/state/PlayerTypes';

export const INITIAL_ATTRIBUTES: PlayerAttributes = {
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  constitution: 10,
  wisdom: 10,
  charisma: 10,
};

export const BASE_STATS: PlayerStats = {
  health: 0, // Health will be derived from constitution primarily
  maxHealth: 100, // Base before constitution and other modifiers
  mana: 0, // Mana will be derived from intelligence primarily
  maxMana: 50,  // Base before intelligence and other modifiers
  attack: 5,
  defense: 5,
  speed: 10,
  healthRegen: 1, // Per second
  manaRegen: 0.5, // Per second
  criticalChance: 0.05, // 5%
  criticalDamage: 1.5, // +50% damage
};

export const MAX_TRAIT_SLOTS = 5;
export const INITIAL_TRAIT_SLOTS = 3;

// Attribute point cost or effect scaling can be defined here if needed
// Example: export const ATTRIBUTE_HEALTH_SCALE = 10; // 1 constitution = 10 maxHealth
