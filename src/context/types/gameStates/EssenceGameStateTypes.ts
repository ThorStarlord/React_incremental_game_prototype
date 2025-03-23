/**
 * @file EssenceGameStateTypes.ts
 * @description Type definitions specifically related to the Essence system.
 * 
 * This file contains all the interfaces and types that define the essence system,
 * including generators, upgrades, and mechanics. These types are used across
 * the essence-related features of the game.
 */

/**
 * Interface for a generator in the essence system
 */
export interface EssenceGenerator {
  level: number;
  baseCost: number;
  costMultiplier: number;
  baseProduction: number;
  owned: number;
  unlocked: boolean;
  name: string;
  description: string;
}

/**
 * Interface for an upgrade in the essence system
 */
export interface EssenceUpgrade {
  level: number;
  baseCost: number;
  costMultiplier: number;
  effect: number;
  maxLevel: number;
  unlocked: boolean;
  name: string;
  description: string;
}

/**
 * Interface for the essence system mechanics
 */
export interface EssenceMechanics {
  autoCollectUnlocked: boolean;
  resonanceUnlocked: boolean;
}

/**
 * Interface for the complete essence state
 */
export interface EssenceState {
  amount: number;
  totalCollected: number;
  perSecond: number;
  perClick: number;
  multiplier: number;
  unlocked: boolean;
  generators: {
    basic: EssenceGenerator;
    advanced: EssenceGenerator;
    [key: string]: EssenceGenerator;
  };
  upgrades: {
    clickPower: EssenceUpgrade;
    autoGeneration: EssenceUpgrade;
    [key: string]: EssenceUpgrade;
  };
  mechanics: EssenceMechanics;
}

/**
 * Payload type for essence-related actions
 */
export interface EssencePayload {
  amount: number;
  source?: string;
  reason?: string;
}

/**
 * Interface for upgrade purchase results
 */
export interface UpgradePurchaseResult {
  success: boolean;
  message?: string;
  newLevel?: number;
  cost?: number;
  essenceRemaining?: number;
}

/**
 * Container for essence state within game state
 */
export interface EssenceStateContainer {
  essence: EssenceState;
}
