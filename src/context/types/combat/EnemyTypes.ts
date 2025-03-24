/**
 * Unified Enemy Type System
 * 
 * This file provides core data models for enemies in the game.
 * It focuses on static/persistent properties of enemies rather than
 * runtime combat state which belongs in actors.ts.
 */

// Basic shared types
export type EnemyCategory = 'normal' | 'elite' | 'boss';
export type ActorType = 'player' | 'enemy' | 'npc';

/**
 * Item/loot drop interface (unified from various sources)
 */
export interface LootDrop {
  /** Unique identifier for the item */
  id: string;
  
  /** Display name of the item */
  name: string;
  
  /** Quantity that can drop */
  quantity: number;
  
  /** Chance of dropping (0-1) */
  dropChance: number;
  
  /** Item quality level */
  quality?: string;
  
  /** Item type/category */
  type?: string;
  
  /** Base gold value of item */
  value?: number;
}

/**
 * Ability interface (unified from various sources)
 */
export interface Ability {
  /** Unique identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description of what the ability does */
  description: string;
  
  /** Cooldown in turns before ability can be used again */
  cooldown: number;
  
  /** Whether the ability targets multiple entities */
  isAoE?: boolean;
  
  /** Mana cost to use the ability */
  manaCost?: number;
  
  /** Ability power level */
  level?: number;
  
  /** Effect produced by the ability */
  effect?: any;
}

/**
 * Core enemy interface - the base for all enemy types
 * Contains only essential properties common to all enemies
 */
export interface EnemyBase {
  /** Unique identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Enemy level */
  level: number;
  
  /** Maximum health points */
  maxHealth: number;
  
  /** Current health points */
  currentHealth: number;
  
  /** Base attack power */
  attack: number;
  
  /** Base defense value */
  defense: number;
  
  /** Enemy category (normal, elite, boss) */
  category?: EnemyCategory;
  
  /** Enemy type/species (goblin, skeleton, etc.) */
  enemyType?: string;
  
  /** URL to enemy image */
  imageUrl?: string;
  
  /** Base health for scaling calculations */
  baseHealth: number;
  
  /** Base attack for scaling calculations */
  baseAttack: number;
  
  /** Base defense for scaling calculations */
  baseDefense: number;
}

/**
 * Extended enemy interface with reward-related properties
 */
export interface RewardableEnemy extends EnemyBase {
  /** Experience points awarded when defeated */
  experience: number;
  
  /** Gold awarded when defeated */
  gold: number;
  
  /** Essence awarded when defeated */
  essence: number;
  
  /** Items that can drop from this enemy */
  lootTable: LootDrop[];
}

/**
 * Dungeon-specific enemy interface
 */
export interface DungeonEnemy extends RewardableEnemy {
  /** Enemy traits/tags that define special characteristics */
  traits: string[];
  
  /** Image name for portrait (without extension) */
  portrait?: string;
}

/**
 * Create a default enemy with minimum required properties
 */
export function createDefaultEnemy(): EnemyBase {
  return {
    id: 'default-enemy',
    name: 'Unknown Enemy',
    level: 1,
    maxHealth: 10,
    currentHealth: 10,
    attack: 1,
    defense: 0,
    baseHealth: 10,
    baseAttack: 1,
    baseDefense: 0
  };
}

/**
 * NOTE: Combat-specific enemy properties are now defined in actors.ts.
 * The Enemy interface there should extend both BaseEnemy and CombatActor:
 * 
 * export interface Enemy extends RewardableEnemy, CombatActor {
 *   // Combat-specific properties only
 * }
 */
