/**
 * Type definitions for inventory and item-related game state
 */

// Import the original InventoryItem for compatibility
import { InventoryItem as PlayerInventoryItem } from './PlayerGameStateTypes';
import { Materials } from './ResourceGameStateTypes';

// Re-export for backward compatibility
export type InventoryItem = PlayerInventoryItem;

/**
 * Effect that can be applied by consumables or equipment
 */
export interface ItemEffect {
  health?: number;
  mana?: number;
  strength?: number;
  intelligence?: number;
  dexterity?: number;
  vitality?: number;
  luck?: number;
  [key: string]: number | undefined; // Allow for additional effects
}

/**
 * Item statistics for weapons and armor
 */
export interface ItemStats {
  physicalDamage?: number;
  magicalDamage?: number;
  armor?: number;
  healthBonus?: number;
  manaBonus?: number;
  [key: string]: number | undefined; // Allow for additional stats
}

/**
 * Game item structure
 */
export interface GameItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'quest' | 'accessory';
  effect?: ItemEffect;
  stats?: ItemStats;
  quantity: number;
  value: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description?: string;
}

/**
 * Player inventory
 */
export interface InventoryState {
  capacity: number;
  items: GameItem[];
}

/**
 * Equipment slots for the player
 */
export interface EquipmentState {
  weapon: GameItem | null;
  offhand: GameItem | null;
  head: GameItem | null;
  body: GameItem | null;
  hands: GameItem | null;
  legs: GameItem | null;
  feet: GameItem | null;
  accessory1: GameItem | null;
  accessory2: GameItem | null;
  [key: string]: GameItem | null; // Allow for additional equipment slots
}
