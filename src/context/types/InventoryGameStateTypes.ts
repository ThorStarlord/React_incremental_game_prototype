/**
 * Type definitions for inventory and item-related game state
 */

// Import item types from ItemGameStateTypes for use in this file
import { GameItem, ItemType, ItemRarity } from './ItemGameStateTypes';

// Re-export these for backward compatibility
// TODO: Remove these re-exports when possible and update imports in other files
export { GameItem, ItemEffect, ItemStats, ItemType, ItemRarity } from './ItemGameStateTypes';

/**
 * Equipment slot types for better type safety
 */
export type EquipmentSlot =
  | 'weapon'
  | 'offhand'
  | 'head'
  | 'body'
  | 'hands'
  | 'legs'
  | 'feet'
  | 'accessory1'
  | 'accessory2';

/**
 * Player inventory
 */
export interface InventoryState {
  /** Maximum number of unique items the inventory can hold */
  capacity: number;
  
  /** Collection of items currently in the player's inventory */
  items: GameItem[];
  
  /** Player's currency amount */
  gold: number;
  
  /** Optional maximum weight the player can carry */
  maxWeight?: number;
  
  /** Equipment currently worn by the player */
  equipment: EquipmentState;
  
  /** Quick access slots for frequently used items */
  quickSlots: (GameItem | null)[];
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
  
  // Allow for additional equipment slots
  [key: string]: GameItem | null;
}
