/**
 * Redux selectors for Inventory state
 */
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { 
  InventoryState, 
  Item, 
  ItemCategory, 
  EquipmentSlot,
  ItemStats
} from './InventoryTypes';
import { sortItems } from '../utils/inventoryUtils';

// Basic selectors
export const selectInventoryState = (state: RootState) => state.inventory;
export const selectAllItems = (state: RootState) => state.inventory.items;
export const selectEquipment = (state: RootState) => state.inventory.equipment;
export const selectGold = (state: RootState) => state.inventory.gold;
export const selectCapacity = (state: RootState) => state.inventory.capacity;
export const selectQuickSlots = (state: RootState) => state.inventory.quickSlots;
export const selectSelectedItemId = (state: RootState) => state.inventory.selectedItemId;
export const selectActiveFilters = (state: RootState) => state.inventory.activeFilters;
export const selectSorting = (state: RootState) => state.inventory.sorting;
export const selectIsLoading = (state: RootState) => state.inventory.isLoading;
export const selectError = (state: RootState) => state.inventory.error;

// Derived selectors
export const selectItemCount = (state: RootState) => state.inventory.items.length;

export const selectInventoryUsage = createSelector(
  [selectItemCount, selectCapacity],
  (itemCount, capacity) => ({
    count: itemCount,
    capacity,
    percentage: (itemCount / capacity) * 100
  })
);

export const selectItemById = (itemId: string) => 
  createSelector(
    [selectAllItems],
    (items) => items.find(item => item.id === itemId) || null
  );

export const selectItemBySlot = (slot: EquipmentSlot) => 
  createSelector(
    [selectEquipment],
    (equipment) => equipment[slot]
  );

export const selectItemByQuickSlot = (slotIndex: number) => 
  createSelector(
    [selectQuickSlots],
    (quickSlots) => slotIndex >= 0 && slotIndex < quickSlots.length ? quickSlots[slotIndex] : null
  );

export const selectSelectedItem = createSelector(
  [selectAllItems, selectSelectedItemId],
  (items, selectedItemId) => items.find(item => item.id === selectedItemId) || null
);

// Filtered and sorted items
export const selectFilteredItems = createSelector(
  [selectAllItems, selectActiveFilters],
  (items, filters) => {
    let result = [...items];
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }
    
    // Apply level filter
    if (filters.minLevel !== undefined) {
      result = result.filter(item => !item.level || item.level >= filters.minLevel);
    }
    
    if (filters.maxLevel !== undefined) {
      result = result.filter(item => !item.level || item.level <= filters.maxLevel);
    }
    
    // Apply rarity filter
    if (filters.rarity && filters.rarity.length > 0) {
      result = result.filter(item => filters.rarity?.includes(item.rarity));
    }
    
    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(search) || 
        item.description.toLowerCase().includes(search)
      );
    }
    
    // Apply usable filter
    if (filters.usable !== undefined) {
      result = result.filter(item => item.usable === filters.usable);
    }
    
    // Apply equipped filter
    if (filters.equipped !== undefined) {
      // TO DO: Implement this once we track equipped items
    }
    
    return result;
  }
);

export const selectSortedAndFilteredItems = createSelector(
  [selectFilteredItems, selectSorting],
  (items, sorting) => {
    return sortItems(
      items as any[], 
      sorting.field, 
      sorting.direction === 'asc'
    ) as Item[];
  }
);

// Category-based selectors
export const selectItemsByCategory = (category: ItemCategory) => 
  createSelector(
    [selectAllItems],
    (items) => items.filter(item => item.category === category)
  );

export const selectWeapons = createSelector(
  [selectAllItems],
  (items) => items.filter(item => item.category === ItemCategory.Weapon)
);

export const selectArmor = createSelector(
  [selectAllItems],
  (items) => items.filter(item => item.category === ItemCategory.Armor)
);

export const selectConsumables = createSelector(
  [selectAllItems],
  (items) => items.filter(item => item.category === ItemCategory.Consumable)
);

export const selectMaterials = createSelector(
  [selectAllItems],
  (items) => items.filter(item => item.category === ItemCategory.Material)
);

export const selectQuestItems = createSelector(
  [selectAllItems],
  (items) => items.filter(item => item.category === ItemCategory.Quest)
);

// Equipment stats
export const selectTotalEquipmentStats = createSelector(
  [selectEquipment],
  (equipment) => {
    const totalStats: ItemStats = {};
    
    // Sum up all stats from equipped items
    Object.values(equipment).forEach(item => {
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          if (value !== undefined) {
            totalStats[stat] = (totalStats[stat] || 0) + value;
          }
        });
      }
    });
    
    return totalStats;
  }
);

// Check if inventory has a specific item
export const selectHasItem = (itemId: string) => 
  createSelector(
    [selectAllItems],
    (items) => items.some(item => item.id === itemId)
  );

// Get the total quantity of a specific item
export const selectItemQuantity = (itemId: string) => 
  createSelector(
    [selectAllItems],
    (items) => {
      const item = items.find(i => i.id === itemId);
      return item ? item.quantity : 0;
    }
  );

// Get item value total
export const selectTotalItemValue = createSelector(
  [selectAllItems],
  (items) => items.reduce((total, item) => total + (item.value * item.quantity), 0)
);
