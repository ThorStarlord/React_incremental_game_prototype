/**
 * Combat Types Module
 * 
 * Define shared types used across combat features
 */

import { SimpleLogEntry } from './logging';
import { CombatRewards } from '../gameStates/BattleGameStateTypes';

/**
 * Result of a combat encounter
 */
export interface CombatResult {
  victory: boolean;
  message?: string;
  rewards?: Rewards;
  retreat?: boolean;
}

/**
 * Battle result with extra information
 */
export interface BattleResult {
  victory: boolean;
  rewards: Partial<CombatRewards>;
  retreat: boolean;
}

/**
 * Rewards from combat
 */
export interface Rewards {
  experience: number;
  gold: number;
  items: RewardItem[];
}

/**
 * Item received as a reward
 * Includes required properties for compatibility with LootItem
 */
export interface RewardItem {
  id: string;
  name: string;
  quantity: number;
  rarity?: string;  // Make optional but add it for compatibility
  type?: string;    // Make optional but add it for compatibility
  [key: string]: any;
}
