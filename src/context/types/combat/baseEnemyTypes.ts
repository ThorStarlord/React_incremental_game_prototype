/**
 * Basic enemy type definitions used in the game
 * 
 * This file contains the fundamental Enemy interface used throughout the application.
 * It serves as a base representation that can be adapted for specific contexts
 * like combat, dungeons, or world encounters.
 */

/**
 * Interface for basic item drop
 */
export interface EnemyDrop {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Quantity that can drop */
  quantity: number;
  /** Chance of dropping (0-1) */
  dropChance?: number;
  /** Additional item properties */
  [key: string]: any;
}

/**
 * Interface for enemy ability
 */
export interface EnemyAbility {
  /** Unique identifier for the ability */
  id: string;
  /** Display name of the ability */
  name: string;
  /** Description of what the ability does */
  description?: string;
  /** Cooldown in turns before ability can be used again */
  cooldown?: number;
  /** Damage multiplier (1.0 = normal damage) */
  damageMultiplier?: number;
  /** Whether the ability targets multiple entities */
  isAoE?: boolean;
  /** Additional ability properties */
  [key: string]: any;
}

/**
 * Simple Enemy interface for basic enemy representation
 * 
 * This interface is used as a common denominator across different
 * parts of the game, and can be adapted to more specific contexts
 * using the adapter functions.
 */
export interface Enemy {
  /** Unique identifier for the enemy */
  id: string;
  
  /** Display name of the enemy */
  name: string;
  
  /** Enemy level, affects difficulty scaling */
  level?: number;
  
  /** Base health value */
  health: number;
  
  /** Maximum health value */
  maxHealth: number;
  
  /** Current health value (defaults to maxHealth if not specified) */
  currentHealth?: number;
  
  /** Enemy classification, affects rewards and difficulty */
  type?: 'normal' | 'elite' | 'boss';
  
  /** Category of enemy (e.g., "undead", "beast", "humanoid") */
  enemyType?: string;
  
  /** Descriptive text about the enemy */
  description?: string;
  
  /** Available loot that can drop from this enemy */
  lootTable?: EnemyDrop[];
  
  /** Special abilities this enemy can use */
  abilities?: EnemyAbility[];
  
  /** Additional stats as key-value pairs */
  stats?: Record<string, number>;
  
  /** Defense value, reduces damage taken */
  defense?: number;
  
  /** Attack value, increases damage dealt */
  attack?: number;
  
  /** Speed value, affects turn order */
  speed?: number;
  
  /** Attack rate, affects frequency of attacks */
  attackRate?: number;
  
  /** Chance to land critical hits (0-1) */
  criticalChance?: number;
  
  /** Damage multiplier for critical hits (default: 1.5) */
  criticalMultiplier?: number;
  
  /** Alternative property for critical hit damage multiplier (for compatibility) */
  criticalDamage?: number;
  
  /** Item drops when defeated (simplified from lootTable) */
  drops?: EnemyDrop[];
  
  /** Essence currency awarded when defeated */
  essenceValue?: number;
  
  /** Experience points awarded when defeated */
  experienceValue?: number;
  
  /** Gold currency awarded when defeated */
  goldValue?: number;
  
  /** Image file name for the enemy portrait */
  portrait?: string;
  
  /** URL to the enemy's image asset */
  imageUrl?: string;
  
  /** Resistances to specific damage types (0-1, where 1 is immunity) */
  resistances?: Record<string, number>;
  
  /** Additional enemy properties */
  [key: string]: any;
}

/**
 * Type alias for Simple Enemy to avoid naming conflicts
 */
export type SimpleEnemy = Enemy;

/**
 * Get a blank enemy template with default values
 * 
 * @returns A minimal valid enemy object
 */
export function createDefaultEnemy(): Enemy {
  return {
    id: 'default-enemy',
    name: 'Unknown Enemy',
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    type: 'normal',
    attack: 1,
    defense: 0,
    speed: 1,
    criticalChance: 0.05,
    criticalMultiplier: 1.5,
    criticalDamage: 1.5, // Added to match the interface
    essenceValue: 1,
    experienceValue: 5,
    goldValue: 2
  };
}