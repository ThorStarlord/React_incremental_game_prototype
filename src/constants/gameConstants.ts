/**
 * Game Constants
 * 
 * Defines the fundamental constants and configurations for the incremental RPG
 */

// Timing constants
export const TIMING = {
  TICK_RATE: 100, // Base game tick interval in ms
  RESOURCE_TICK: 1000, // Resource generation interval in ms
  AUTOSAVE_INTERVAL: 60000, // Autosave interval in ms
  DEFAULT_ANIMATION_DURATION: 300, // Default animation duration in ms
  DAY_LENGTH: 24000 // Game day length in ms
};

// Experience & leveling
export interface LevelRequirements {
  xp: number; // XP needed for this level
  attributePoints: number; // Attribute points awarded
  skillPoints: number; // Skill points awarded
  traitSlots?: number; // Trait slots unlocked at this level
}

export const LEVEL_REQUIREMENTS: Record<number, LevelRequirements> = {
  1: { xp: 0, attributePoints: 0, skillPoints: 0, traitSlots: 1 },
  2: { xp: 100, attributePoints: 3, skillPoints: 1 },
  3: { xp: 200, attributePoints: 3, skillPoints: 1 },
  4: { xp: 300, attributePoints: 3, skillPoints: 1 },
  5: { xp: 500, attributePoints: 3, skillPoints: 2, traitSlots: 2 },
  6: { xp: 750, attributePoints: 3, skillPoints: 1 },
  7: { xp: 1000, attributePoints: 3, skillPoints: 1 },
  8: { xp: 1500, attributePoints: 3, skillPoints: 1 },
  9: { xp: 2000, attributePoints: 3, skillPoints: 1 },
  10: { xp: 2500, attributePoints: 5, skillPoints: 3, traitSlots: 3 }
};

// Calculate XP for levels beyond those defined explicitly
export const calculateExperienceForLevel = (level: number): number => {
  if (level <= 10) {
    return LEVEL_REQUIREMENTS[level]?.xp || 0;
  }
  return Math.floor(100 * Math.pow(level, 1.8));
};

// Game difficulty settings
export enum DifficultyLevel {
  Easy = 'easy',
  Normal = 'normal',
  Hard = 'hard',
  Expert = 'expert'
}

export const DIFFICULTY_MODIFIERS: Record<DifficultyLevel, Record<string, number>> = {
  [DifficultyLevel.Easy]: {
    playerDamage: 1.25,
    enemyDamage: 0.75,
    xpGain: 1.25,
    resourceGain: 1.5,
    enemyHealth: 0.8
  },
  [DifficultyLevel.Normal]: {
    playerDamage: 1.0,
    enemyDamage: 1.0,
    xpGain: 1.0,
    resourceGain: 1.0,
    enemyHealth: 1.0
  },
  [DifficultyLevel.Hard]: {
    playerDamage: 0.8,
    enemyDamage: 1.2,
    xpGain: 1.1,
    resourceGain: 0.9,
    enemyHealth: 1.25
  },
  [DifficultyLevel.Expert]: {
    playerDamage: 0.7,
    enemyDamage: 1.4,
    xpGain: 1.2,
    resourceGain: 0.8,
    enemyHealth: 1.5
  }
};

// Item rarity settings
export enum ItemRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
  Mythic = 'mythic'
}

export const RARITY_MODIFIERS: Record<ItemRarity, Record<string, number>> = {
  [ItemRarity.Common]: { 
    value: 1.0, 
    statBonus: 0, 
    dropChance: 0.6 
  },
  [ItemRarity.Uncommon]: { 
    value: 1.5, 
    statBonus: 1, 
    dropChance: 0.3 
  },
  [ItemRarity.Rare]: { 
    value: 2.5, 
    statBonus: 3, 
    dropChance: 0.08 
  },
  [ItemRarity.Epic]: { 
    value: 4.0, 
    statBonus: 5, 
    dropChance: 0.02 
  },
  [ItemRarity.Legendary]: { 
    value: 8.0, 
    statBonus: 8, 
    dropChance: 0.005 
  },
  [ItemRarity.Mythic]: { 
    value: 20.0, 
    statBonus: 12, 
    dropChance: 0.0001 
  }
};

// Combat constants
export const COMBAT = {
  BASE_PLAYER_DAMAGE: 5,
  BASE_ENEMY_DAMAGE: 3,
  CRITICAL_MULTIPLIER: 1.5,
  BASE_CRITICAL_CHANCE: 0.05, // 5% base chance
  MAX_COMBAT_TURNS: 50,
  FLEE_CHANCE_BASE: 0.3, // 30% base chance
  ENEMY_TARGETING_WEIGHTS: {
    lowestHealth: 2,
    highestDamage: 1.5,
    random: 1
  }
};

// Resource settings
export interface ResourceDefinition {
  name: string;
  baseValue: number;
  category: string;
  respawnTime: number; // in ms
  toolRequired?: string;
  minLevel?: number;
}

export const RESOURCES: Record<string, ResourceDefinition> = {
  wood: {
    name: "Wood",
    baseValue: 1,
    category: "basic",
    respawnTime: 120000 // 2 minutes
  },
  stone: {
    name: "Stone",
    baseValue: 1.5,
    category: "basic",
    respawnTime: 180000, // 3 minutes
    toolRequired: "pickaxe"
  },
  herbs: {
    name: "Herbs",
    baseValue: 2.5,
    category: "gathering",
    respawnTime: 240000 // 4 minutes
  },
  ore: {
    name: "Iron Ore",
    baseValue: 3,
    category: "mining",
    respawnTime: 300000, // 5 minutes
    toolRequired: "pickaxe",
    minLevel: 3
  }
};

// Time periods and seasons
export enum TimePeriod {
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
  Night = 'night'
}

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
  Winter = 'winter'
}

export const SEASONAL_EFFECTS: Record<Season, Record<string, number>> = {
  [Season.Spring]: {
    herbGrowthRate: 1.5,
    cropYield: 1.25,
    fishingSuccess: 1.2,
    weatherChangeChance: 0.15
  },
  [Season.Summer]: {
    woodHarvestRate: 1.3,
    miningSpeed: 0.9, // Slower due to heat
    combatStamina: 1.1,
    weatherChangeChance: 0.1
  },
  [Season.Autumn]: {
    forageYield: 1.4,
    huntingSuccess: 1.3,
    craftingQuality: 1.1,
    weatherChangeChance: 0.2
  },
  [Season.Winter]: {
    resourceRespawnRate: 0.7, // Slower resource respawn
    energyConsumption: 1.2, // Higher energy consumption
    combatDamage: 0.9, // Reduced combat effectiveness
    weatherChangeChance: 0.25
  }
};

// Trait system constants
export const TRAIT_PERMANENT_ESSENCE_COST = 150;

// Essence gained per second per NPC connection
export const NPC_ESSENCE_GAIN_PER_CONNECTION = 0.5;
