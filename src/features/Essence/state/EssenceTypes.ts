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
 * Interface for essence generation source
 */
export interface EssenceSource {
  /** Source identifier */
  id: string;
  /** Display name */
  name: string;
  /** Amount generated per cycle */
  amount: number;
  /** Whether this source is active */
  active: boolean;
  /** Multiplier applied to this source */
  multiplier?: number;
}

/**
 * Interface for essence generation notification
 */
export interface EssenceNotification {
  /** Unique notification ID */
  id: string;
  /** Message text */
  message: string;
  /** Essence amount */
  amount: number;
  /** Source of the essence */
  source?: string;
  /** Timestamp when generated */
  timestamp: number;
}

/**
 * Interface for essence mechanics
 */
export interface EssenceMechanics {
  /** Whether auto-collection is unlocked */
  autoCollectUnlocked: boolean;
  /** Whether resonance feature is unlocked */
  resonanceUnlocked: boolean;
}

/**
 * Interface for the essence state
 */
export interface EssenceState {
  /** Current essence amount */
  amount: number;
  /** Total essence collected lifetime */
  totalCollected: number;
  /** Essence generated per second */
  perSecond: number;
  /** Essence generated per click */
  perClick: number;
  /** Global multiplier for all essence generation */
  multiplier: number;
  /** Whether essence is unlocked */
  unlocked: boolean;
  /** Essence generators */
  generators: {
    [key: string]: EssenceGenerator;
  };
  /** Essence upgrades */
  upgrades: {
    [key: string]: EssenceUpgrade;
  };
  /** Feature flags and mechanics */
  mechanics: EssenceMechanics;
  /** Active essence generation sources */
  sources?: EssenceSource[];
  /** Recent essence notifications */
  notifications?: EssenceNotification[];
  /** Max essence that can be stored */
  maxAmount?: number;
  /** Resonance level (if unlocked) */
  resonanceLevel?: number;
  /** Rate at which essence decays (if applicable) */
  decayRate?: number;
  /** Timestamp of last update */
  lastUpdated?: number;
  /** Rate at which essence is generated per interval */
  generationRate?: number;
  /** Number of established NPC connections influencing essence gain */
  npcConnections: number;
}

/**
 * Interface for essence gain payload
 */
export interface GainEssencePayload {
  /** Amount of essence to gain */
  amount: number;
  /** Source of the essence gain */
  source?: string;
}

/**
 * Interface for essence spend payload
 */
export interface SpendEssencePayload {
  /** Amount of essence to spend */
  amount: number;
  /** What the essence was spent on (optional) */
  reason?: string; // Add the optional reason property
  /** What the essence was spent on */
  purpose?: string;
}

/**
 * Interface for generator purchase payload
 */
export interface PurchaseGeneratorPayload {
  /** Type of generator to purchase */
  generatorType: string;
  /** Quantity to purchase */
  quantity?: number;
}

/**
 * Interface for upgrade purchase payload
 */
export interface PurchaseUpgradePayload {
  /** Type of upgrade to purchase */
  upgradeType: string;
  /** Number of levels to purchase */
  levels?: number;
}
