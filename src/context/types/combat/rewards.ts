/**
 * Combat rewards and loot
 */

import { GameItem } from '../gameStates/InventoryGameStateTypes';

/**
 * Item that can be dropped by enemies
 */
export interface LootItem {
  id: string;
  name: string;
  quantity: number;
  dropChance: number; // 0-1 probability
  minQuantity?: number;
  maxQuantity?: number;
  requiredLevel?: number;
}

/**
 * Rewards given after combat
 */
export interface CombatRewards {
  experience: number;
  gold: number;
  items: GameItem[];
  bonusLoot?: GameItem[]; // Added missing property
}
