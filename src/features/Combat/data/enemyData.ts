/**
 * Enemy data configuration for the combat system
 * 
 * This file contains all the base enemy templates organized by area.
 * Each enemy has baseline stats that get scaled based on player level
 * and area difficulty.
 */

import { EnemyBase, LootDrop } from '../../../context/types/combat/index';

/**
 * Type for enemy templates
 */
export interface EnemyTemplate {
  id: string;
  name: string;
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
  baseExperience: number;
  baseGold: number;
}

/**
 * Type for area-organized enemies
 */
export type AreaEnemies = Record<string, EnemyTemplate[]>;

/**
 * Common loot items that can drop from any enemy
 */
export const COMMON_LOOT: LootDrop[] = [
  { id: 'herb', name: 'Healing Herb', dropChance: 0.5, quantity: 1 },
  { id: 'cloth', name: 'Cloth Scrap', dropChance: 0.7, quantity: 1 }
];

/**
 * Enemy-specific loot tables
 */
export const SPECIFIC_LOOT: Record<string, LootDrop[]> = {
  goblin: [
    { id: 'dagger', name: 'Rusty Dagger', dropChance: 0.1, quantity: 1 }
  ],
  wolf: [
    { id: 'pelt', name: 'Wolf Pelt', dropChance: 0.4, quantity: 1 }
  ],
  bandit: [
    { id: 'lockpick', name: 'Lockpick', dropChance: 0.3, quantity: 1 }
  ],
  bat: [
    { id: 'wing', name: 'Bat Wing', dropChance: 0.4, quantity: 1 }
  ],
  slime: [
    { id: 'goo', name: 'Slime Goo', dropChance: 0.6, quantity: 2 }
  ],
  troll: [
    { id: 'hide', name: 'Troll Hide', dropChance: 0.3, quantity: 1 },
    { id: 'tooth', name: 'Troll Tooth', dropChance: 0.2, quantity: 1 }
  ],
  skeleton: [
    { id: 'bone', name: 'Bone Fragment', dropChance: 0.5, quantity: 2 }
  ],
  zombie: [
    { id: 'rottenFlesh', name: 'Rotten Flesh', dropChance: 0.7, quantity: 1 }
  ],
  necromancer: [
    { id: 'spellbook', name: 'Torn Spellbook', dropChance: 0.2, quantity: 1 },
    { id: 'darkEssence', name: 'Dark Essence', dropChance: 0.15, quantity: 1 }
  ]
};

/**
 * Enemy templates organized by area
 */
const AREA_ENEMIES: AreaEnemies = {
  forest: [
    { id: 'goblin', name: 'Goblin', baseHealth: 35, baseAttack: 4, baseDefense: 2, baseExperience: 8, baseGold: 5 },
    { id: 'wolf', name: 'Wolf', baseHealth: 30, baseAttack: 5, baseDefense: 1, baseExperience: 7, baseGold: 3 },
    { id: 'bandit', name: 'Bandit', baseHealth: 40, baseAttack: 4, baseDefense: 3, baseExperience: 10, baseGold: 8 }
  ],
  cave: [
    { id: 'bat', name: 'Giant Bat', baseHealth: 25, baseAttack: 3, baseDefense: 1, baseExperience: 5, baseGold: 2 },
    { id: 'slime', name: 'Cave Slime', baseHealth: 45, baseAttack: 2, baseDefense: 4, baseExperience: 8, baseGold: 4 },
    { id: 'troll', name: 'Cave Troll', baseHealth: 60, baseAttack: 7, baseDefense: 5, baseExperience: 15, baseGold: 12 }
  ],
  dungeon: [
    { id: 'skeleton', name: 'Skeleton', baseHealth: 40, baseAttack: 5, baseDefense: 2, baseExperience: 9, baseGold: 6 },
    { id: 'zombie', name: 'Zombie', baseHealth: 50, baseAttack: 4, baseDefense: 3, baseExperience: 11, baseGold: 7 },
    { id: 'necromancer', name: 'Necromancer', baseHealth: 35, baseAttack: 8, baseDefense: 1, baseExperience: 14, baseGold: 15 }
  ]
};

/**
 * Combat difficulty multipliers
 */
export const DIFFICULTY_MULTIPLIERS = {
  easy: 0.8,
  normal: 1.0,
  hard: 1.2,
  expert: 1.5
};

/**
 * Combat system constants
 */
export const COMBAT_CONSTANTS = {
  BASE_RETREAT_CHANCE: 0.6,
  RANDOM_ENCOUNTER_COUNT: 1,
  MIN_NORMAL_ENCOUNTERS: 1,
  MAX_ADDITIONAL_ENCOUNTERS: 2,
  XP_SCALING_FACTOR: 0.2,
  MIN_ENEMY_SPEED: 5,
  MAX_ENEMY_SPEED: 10,
  RESULT_DISPLAY_DELAY: 1000
};

export default AREA_ENEMIES;