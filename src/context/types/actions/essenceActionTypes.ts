/**
 * Essence Action Types
 * ===================
 * 
 * This file defines actions related to the essence system, which is
 * the primary resource and progression mechanism in the game.
 * 
 * @module essenceActionTypes
 */

/**
 * Action types for essence operations
 */
export const ESSENCE_ACTIONS = {
  /**
   * Player gains essence from activities, enemies, or rewards
   */
  GAIN_ESSENCE: 'essence/gain',

  /**
   * Player spends essence on upgrades, abilities, or other purchases
   */
  SPEND_ESSENCE: 'essence/spend',

  /**
   * Player upgrades their essence collection rate
   */
  UPGRADE_ESSENCE_RATE: 'essence/upgradeRate'
};

/**
 * Essence action payload interface
 */
export interface EssencePayload {
  amount: number;
  source?: string;
  reason?: string;
  timestamp?: number;
}

/**
 * Essence action interface
 */
export interface EssenceAction {
  type: keyof typeof ESSENCE_ACTIONS;
  payload: EssencePayload;
}

/**
 * Essence action type union
 */
export type EssenceActionType = typeof ESSENCE_ACTIONS[keyof typeof ESSENCE_ACTIONS];
