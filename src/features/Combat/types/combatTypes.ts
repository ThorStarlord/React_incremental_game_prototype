/**
 * Type definitions for the combat system
 */

/**
 * Interface for Loot Item
 */
export interface LootItem {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Chance of the item dropping (0-1) */
  dropChance: number;
  /** Quantity of the item that drops */
  quantity: number;
  /** Additional item properties */
  [key: string]: any;
}

/**
 * Interface for Enemy Template
 */
export interface EnemyTemplate {
  /** Unique identifier for the enemy type */
  id: string;
  /** Display name of the enemy */
  name: string;
  /** Base health before scaling */
  baseHealth: number;
  /** Base attack before scaling */
  baseAttack: number;
  /** Base defense before scaling */
  baseDefense: number;
  /** Base experience reward before scaling */
  baseExperience: number;
  /** Base gold reward before scaling */
  baseGold: number;
}

/**
 * Interface for instantiated Enemy
 */
export interface Enemy {
  /** Unique identifier for the enemy type */
  id: string;
  /** Display name of the enemy */
  name: string;
  /** Enemy level */
  level: number;
  /** Current health points */
  currentHealth: number;
  /** Maximum health points */
  maxHealth: number;
  /** Attack power */
  attack: number;
  /** Defense power */
  defense: number;
  /** Initiative/speed (determines turn order) */
  speed: number;
  /** Experience reward when defeated */
  experience: number;
  /** Gold reward when defeated */
  gold: number;
  /** Path to enemy image */
  imageUrl?: string;
  /** Potential loot drops */
  loot: LootItem[];
  /** Additional enemy properties */
  [key: string]: any;
}

/**
 * Interface for combat rewards
 */
export interface Rewards {
  /** Experience points earned */
  experience: number;
  /** Gold earned */
  gold: number;
  /** Items earned */
  items: Array<{
    /** Item name */
    name: string;
    /** Item quantity */
    quantity: number;
    /** Additional item properties */
    [key: string]: any;
  }>;
}

/**
 * Interface for combat result
 */
export interface CombatResult {
  /** Whether the player was victorious */
  victory: boolean;
  /** Whether the player retreated */
  retreat?: boolean;
  /** Combat rewards (if victorious) */
  rewards?: Rewards;
}

/**
 * Interface for battle result
 */
export interface BattleResult {
  victory: boolean;
  rewards: any; // Required property
  enemyDefeated?: string;
  retreat?: boolean;
  experienceGained?: number;
  goldGained?: number;
  itemsFound?: any[];
}

/**
 * Interface for area enemies mapping
 */
export interface AreaEnemies {
  /** Map of area ID to array of enemy templates */
  [key: string]: EnemyTemplate[];
}
