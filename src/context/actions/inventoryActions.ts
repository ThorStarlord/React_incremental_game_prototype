/**
 * Inventory-related action types
 */

export const INVENTORY_ACTIONS = {
  ADD_ITEM: 'inventory/addItem' as const,
  REMOVE_ITEM: 'inventory/removeItem' as const,
  USE_ITEM: 'inventory/useItem' as const,
  SORT_INVENTORY: 'inventory/sortInventory' as const,
  EXAMINE_ITEM: 'inventory/examineItem' as const
};
