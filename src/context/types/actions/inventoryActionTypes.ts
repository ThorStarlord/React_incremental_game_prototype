/**
 * Inventory-related action type definitions
 * 
 * This module defines the types and interfaces for inventory actions
 * in the game.
 * 
 * @module inventoryActionTypes
 */

/**
 * Inventory action type constants
 */
export const INVENTORY_ACTIONS = {
  ADD_ITEM: 'inventory/addItem' as const,
  REMOVE_ITEM: 'inventory/removeItem' as const,
  USE_ITEM: 'inventory/useItem' as const,
  SORT_INVENTORY: 'inventory/sortInventory' as const,
  EXAMINE_ITEM: 'inventory/examineItem' as const,
  UPDATE_ITEM: 'inventory/updateItem' as const,
  MOVE_ITEM: 'inventory/moveItem' as const,
  STACK_ITEMS: 'inventory/stackItems' as const,
  SPLIT_STACK: 'inventory/splitStack' as const
};

// Create a union type of all inventory action types
export type InventoryActionType = typeof INVENTORY_ACTIONS[keyof typeof INVENTORY_ACTIONS];

/**
 * Base inventory action interface
 */
export interface InventoryAction {
  type: InventoryActionType;
  payload?: any;
}

/**
 * Add item payload
 */
export interface AddItemPayload {
  itemId: string;
  quantity?: number;
  source?: string;
}

/**
 * Remove item payload
 */
export interface RemoveItemPayload {
  itemId: string;
  quantity?: number;
}

/**
 * Use item payload
 */
export interface UseItemPayload {
  itemId: string;
  targetId?: string;
}

/**
 * Sort inventory payload
 */
export interface SortInventoryPayload {
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

/**
 * Examine item payload
 */
export interface ExamineItemPayload {
  itemId: string;
}
