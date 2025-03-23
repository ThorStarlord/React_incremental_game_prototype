/**
 * Unified Enemy Type System
 * 
 * This file provides a cohesive type hierarchy for all enemy-related interfaces
 * in the game. It resolves redundancies and naming conflicts between different
 * parts of the codebase.
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
}

/**
 * Extended enemy interface with reward-related properties
 */
export interface RewardableEnemy extends EnemyBase {
  /** Experience points awarded when defeated */
  experienceValue: number;
  
  /** Gold awarded when defeated */
  goldValue: number;
  
  /** Essence awarded when defeated */
  essenceValue: number;
}

/**
 * Combat-ready enemy interface with combat-specific properties
 */
export interface CombatEnemy extends RewardableEnemy {
  /** Actor type, always 'enemy' for enemies */
  type: 'enemy';
  
  /** Speed stat for turn order calculation */
  speed: number;
  
  /** Chance to critically hit (0-1) */
  critChance: number;
  
  /** Critical hit damage multiplier */
  critMultiplier: number;
  
  /** Chance to dodge attacks (0-1) */
  dodgeChance: number;
  
  /** Items that can drop from this enemy */
  lootTable: LootDrop[];
  
  /** Special abilities this enemy can use */
  abilities: Ability[];
  
  /** URL to enemy image */
  imageUrl?: string;
  
  /** Active status effects */
  statusEffects: any[];
  
  /** Available skills */
  skills: any[];
  
  /** Damage type resistances */
  resistances: Record<string, number>;
  
  /** Damage types this enemy is immune to */
  immunities: string[];
  
  /** Damage types this enemy is weak against */
  weaknesses: string[];
  
  /** Base health for scaling calculations */
  baseHealth: number;
  
  /** Base attack for scaling calculations */
  baseAttack: number;
  
  /** Base defense for scaling calculations */
  baseDefense: number;
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
    defense: 0
  };
}
