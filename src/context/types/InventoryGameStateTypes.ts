/**
 * Type definitions for inventory and item-related game state
 */

// Import the original InventoryItem for compatibility
import { InventoryItem as PlayerInventoryItem } from './PlayerGameStateTypes';
import { GameItem, ItemEffect, ItemStats } from './ItemGameStateTypes';

// Re-export for backward compatibility
export type InventoryItem = PlayerInventoryItem;

/**
 * Player inventory
 */
export interface InventoryState {
  capacity: number;
  items: InventoryItem[]; // Standardize to use InventoryItem[]
}

/**
 * Equipment slots for the player
 */
export interface EquipmentState {
  weapon: InventoryItem | null;
  offhand: InventoryItem | null;
  head: InventoryItem | null;
  body: InventoryItem | null;
  hands: InventoryItem | null;
  legs: InventoryItem | null;
  feet: InventoryItem | null;
  accessory1: InventoryItem | null;
  accessory2: InventoryItem | null;
  [key: string]: InventoryItem | null; // Allow for additional equipment slots
}

export { GameItem, ItemEffect, ItemStats }; // Re-export these types
