/**
 * Enemy Adapter Module
 * 
 * Provides utility functions to adapt core enemy data models (from enemyTypes.ts)
 * into combat-ready enemy instances with combat-specific properties.
 * This adapter decouples the data representation from combat mechanics.
 */

import { EnemyBase, LootDrop } from '../../../context/types/combat';
import { COMBAT_CONSTANTS } from '../data/enemyData';
import { DamageType } from '../../../context/types/combat/basic';

// Map of enemy traits to resistances
const TRAIT_RESISTANCE_MAP: Record<string, Partial<Record<DamageType, number>>> = {
  'fireResistant': { [DamageType.Fire]: 0.5 },
  'freezeResistant': { [DamageType.Ice]: 0.5 },
  'poisonResistant': { [DamageType.Poison]: 0.5 },
  'armored': { [DamageType.Physical]: 0.3 },
  'magical': { [DamageType.Magical]: 0.2 },
};

/**
 * Adapts a base enemy model to a combat-ready enemy with combat-specific properties
 * 
 * @param baseEnemy The core enemy data to adapt
 * @param difficultyMultiplier Optional difficulty scaling factor
 * @returns A combat-ready enemy with necessary combat properties
 */
export function adaptToCombatEnemy(
  baseEnemy: any,
  difficultyMultiplier: number = 1.0
): any {
  // Calculate combat stats based on base values
  const combatHealth = Math.ceil(baseEnemy.maxHealth * difficultyMultiplier);
  const combatAttack = Math.ceil(baseEnemy.attack * difficultyMultiplier);
  const combatDefense = Math.ceil(baseEnemy.defense * difficultyMultiplier);
  
  // Generate combat-specific properties
  const speed = generateSpeed();
  
  // Create base combat enemy with all required properties
  return {
    // Core properties from the base enemy
    id: baseEnemy.id,
    name: baseEnemy.name,
    level: baseEnemy.level || 1,
    maxHealth: combatHealth,
    currentHealth: combatHealth,
    attack: combatAttack,
    defense: combatDefense,
    type: 'enemy',
    
    // Required properties for Combat component
    enemyType: baseEnemy.enemyType || 'generic',
    experience: baseEnemy.experience || 0,
    gold: baseEnemy.gold || 0,
    
    // Required base properties
    baseHealth: baseEnemy.baseHealth || combatHealth,
    baseAttack: baseEnemy.baseAttack || combatAttack,
    baseDefense: baseEnemy.baseDefense || combatDefense,
    
    // Combat-specific properties
    speed,
    critChance: 0.05, // Base 5% critical chance
    dodgeChance: 0.05, // Base 5% dodge chance
    resistances: {},
    statusEffects: [],
    skills: [],
    
    // Other required properties
    lootTable: baseEnemy.lootTable || [],
    abilities: baseEnemy.abilities || [],
    immunities: baseEnemy.immunities || [],
    weaknesses: baseEnemy.weaknesses || [],
    
    // Optional image properties
    imageUrl: baseEnemy.imageUrl,
  };
}

/**
 * Generates a random speed value for an enemy within the defined range
 */
function generateSpeed(): number {
  return Math.floor(
    COMBAT_CONSTANTS.MIN_ENEMY_SPEED + 
    Math.random() * (COMBAT_CONSTANTS.MAX_ENEMY_SPEED - COMBAT_CONSTANTS.MIN_ENEMY_SPEED)
  );
}

/**
 * Creates a resistance record based on enemy traits
 */
function createResistancesFromTraits(traits: string[]): Record<string, number> {
  const resistances: Record<string, number> = {};
  
  traits.forEach(trait => {
    if (TRAIT_RESISTANCE_MAP[trait]) {
      Object.entries(TRAIT_RESISTANCE_MAP[trait]).forEach(([damageType, value]) => {
        resistances[damageType] = Math.max(
          resistances[damageType] || 0,
          value
        );
      });
    }
  });
  
  return resistances;
}

/**
 * Adapts a loot table based on difficulty
 */
function adaptLootTable(lootTable: LootDrop[], difficultyMultiplier: number): LootDrop[] {
  // Clone the loot table to avoid modifying the original
  return lootTable.map(loot => ({
    ...loot,
    // Adjust drop chances or quantities based on difficulty
    dropChance: Math.min(1.0, loot.dropChance * difficultyMultiplier),
    quantity: Math.ceil(loot.quantity * (difficultyMultiplier > 1.5 ? 1.2 : 1.0))
  }));
}

/**
 * Transforms trait info into potential loot drops
 */
function createTraitDrops(traits: string[]): LootDrop[] {
  return traits.map(trait => ({
    id: `${trait}-essence`,
    name: `${trait.charAt(0).toUpperCase() + trait.slice(1)} Essence`,
    quantity: 1,
    dropChance: 0.3
  }));
}

/**
 * Converts any combat enemy back to its base form for storage
 * (removes runtime properties, keeps only persistent data)
 * 
 * @param combatEnemy The combat enemy instance to convert
 * @returns A base enemy data object suitable for storage
 */
export function adaptToBaseEnemy(combatEnemy: any): EnemyBase {
  // Extract only the essential properties that should be stored
  return {
    id: combatEnemy.id,
    name: combatEnemy.name,
    level: combatEnemy.level,
    maxHealth: combatEnemy.maxHealth,
    currentHealth: combatEnemy.currentHealth,
    attack: combatEnemy.attack,
    defense: combatEnemy.defense,
    imageUrl: combatEnemy.imageUrl,
    baseHealth: combatEnemy.baseHealth || combatEnemy.maxHealth,
    baseAttack: combatEnemy.baseAttack || combatEnemy.attack,
    baseDefense: combatEnemy.baseDefense || combatEnemy.defense,
    category: combatEnemy.category,
    enemyType: combatEnemy.enemyType
  };
}

/**
 * Creates a reward-ready enemy from a base enemy by adding reward properties
 * 
 * @param baseEnemy The core enemy data
 * @param gold Gold reward
 * @param essence Essence reward
 * @param lootTable Optional loot table
 * @returns A RewardableEnemy ready for combat
 */
export function createRewardableEnemy(
  baseEnemy: EnemyBase,
  gold: number = 5,
  essence: number = 1,
  lootTable: LootDrop[] = []
): RewardableEnemy {
  return {
    ...baseEnemy,
    // Remove experience-based calculations 
    experience: 0, // Set to zero as we're removing experience but need to satisfy the interface
    gold,
    essence,
    lootTable
  };
}
