/**
 * Type definitions for the Essence system
 */

/**
 * Essence generator types
 */
export enum GENERATOR_TYPES {
  BASIC = 'basic',
  ADVANCED = 'advanced',
  SUPERIOR = 'superior',
  MYTHICAL = 'mythical'
}

/**
 * Essence upgrade types
 */
export enum UPGRADE_TYPES {
  CLICK_POWER = 'clickPower',
  AUTO_GENERATION = 'autoGeneration',
  MULTIPLIER = 'multiplier',
  EFFICIENCY = 'efficiency'
}

/**
 * Interface for essence generators
 */
export interface EssenceGenerator {
  /** Current level of the generator */
  level: number;
  /** Base cost to purchase */
  baseCost: number;
  /** Cost multiplier per level */
  costMultiplier: number;
  /** Base production rate per second */
  baseProduction: number;
  /** Number owned */
  owned: number;
  /** Whether this generator is unlocked */
  unlocked: boolean;
  /** Display name */
  name: string;
  /** Description text */
  description: string;
}

/**
 * Interface for essence upgrades
 */
export interface EssenceUpgrade {
  /** Current level of the upgrade */
  level: number;
  /** Base cost to purchase */
  baseCost: number;
  /** Cost multiplier per level */
  costMultiplier: number;
  /** Effect magnitude per level */
  effect: number;
  /** Maximum level that can be purchased */
  maxLevel: number;
  /** Whether this upgrade is unlocked */
  unlocked: boolean;
  /** Display name */
  name: string;
  /** Description text */
  description: string;
}

/**
 * Essence system state interface
 */
export interface EssenceState {
  /** Current essence amount */
  amount: number;
  /** Total essence collected over all time */
  totalCollected: number;
  /** Passive generation rate per second */
  generationRate: number;
  /** Essence gained per manual click */
  perClick: number;
  /** Global multiplier for all essence gains */
  multiplier: number;
  /** Number of active NPC connections */
  npcConnections: number;
  /** Timestamp of last update */
  lastUpdated: number;
  /** Optional maximum essence capacity */
  maxAmount?: number;
}

/**
 * Payload for updating generation configuration
 */
export interface UpdateGenerationConfigPayload {
  generationRate?: number;
  multiplier?: number;
  npcConnections?: number;
}

/**
 * Essence generation source information
 */
export interface EssenceSource {
  id: string;
  name: string;
  type: 'npc' | 'manual' | 'passive' | 'quest' | 'other';
  rate: number;
  isActive: boolean;
}

/**
 * Essence transaction record
 */
export interface EssenceTransaction {
  id: string;
  timestamp: number;
  amount: number;
  type: 'gain' | 'spend';
  source: string;
  description?: string;
}
