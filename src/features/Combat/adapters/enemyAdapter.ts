import { Enemy } from '../../../context/types/combat/actors';  // Import directly from actors
import { DamageType } from '../../../context/types/combat/basic';
import { Enemy as DungeonEnemy } from '../../../features/World/data/dungeonEnemies';

/**
 * Adapter function to convert dungeon enemies to combat system enemies
 * 
 * @param dungeonEnemy - The source dungeon enemy data
 * @returns - A fully typed combat system enemy
 */
export function adaptToCombatEnemy(dungeonEnemy: DungeonEnemy): Enemy {  // Return Enemy type
  return {
    id: dungeonEnemy.id,
    name: dungeonEnemy.name,
    type: 'enemy',
    enemyType: 'dungeon', // Default type
    currentHealth: dungeonEnemy.hp,
    maxHealth: dungeonEnemy.hp,
    attack: dungeonEnemy.attack,
    defense: dungeonEnemy.defense,
    speed: 3, // Default speed
    level: 1, // Default level
    experience: dungeonEnemy.essenceDrop * 2, // Convert essence to XP
    gold: dungeonEnemy.goldDrop,
    critChance: 0.05, // Default crit chance
    dodgeChance: 0.05, // Default dodge chance
    resistances: {} as Record<DamageType, number>, // Empty resistances
    immunities: [], // No immunities
    weaknesses: [], // No weaknesses
    baseHealth: dungeonEnemy.hp,
    baseAttack: dungeonEnemy.attack,
    baseDefense: dungeonEnemy.defense,
    skills: [], // No default skills
    statusEffects: [], // No status effects initially
    lootTable: [], // Empty loot table
    abilities: [], // No special abilities
    imageUrl: dungeonEnemy.portrait ? `assets/enemies/${dungeonEnemy.portrait}` : undefined,
    
    // Map traits to combat properties
    ...(dungeonEnemy.traits.length > 0 && {
      traits: dungeonEnemy.traits
    })
  };
}
