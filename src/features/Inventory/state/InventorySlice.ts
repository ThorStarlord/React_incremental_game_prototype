/**
 * Redux slice for Inventory state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  InventoryState,
  Item,
  ItemCategory,
  EquipmentSlot,
  AddItemPayload,
  RemoveItemPayload,
  UpdateItemPayload,
  EquipItemPayload,
  UnequipItemPayload,
  MoveItemPayload,
  SetQuickSlotPayload,
  SortItemsPayload,
  FilterItemsPayload,
  SellItemPayload,
  BuyItemPayload,
  UseItemPayload,
  AddGoldPayload,
  RemoveGoldPayload
} from './InventoryTypes';
import { clamp, updateInventoryQuantity } from '../../../context/utils/reducerUtils';
import { 
  addItem, 
  removeItem, 
  equip, 
  unequip, 
  useItem,
  sellItem,
  buyItem
} from './InventoryThunks';

/**
 * Initial state for the inventory slice
 */
const initialState: InventoryState = {
  items: [],
  capacity: 20,
  gold: 0,
  equipment: {
    head: null,
    body: null,
    hands: null,
    legs: null,
    feet: null,
    weapon: null,
    offhand: null,
    accessory1: null,
    accessory2: null
  },
  quickSlots: [null, null, null, null],
  activeFilters: {},
  sorting: {
    field: 'name',
    direction: 'asc'
  },
  selectedItemId: null,
  isLoading: false,
  error: null
};

/**
 * Inventory slice with reducers
 */
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    /**
     * Add item to inventory
     */
    addItemToInventory(state, action: PayloadAction<AddItemPayload>) {
      const { item, quantity = 1 } = action.payload;
      
      if (state.items.length >= state.capacity && !item.stackable) {
        state.error = 'Inventory is full';
        return;
      }
      
      const existingItemIndex = state.items.findIndex(i => i.id === item.id);
      
      // If item exists and is stackable, increment quantity
      if (existingItemIndex >= 0 && item.stackable) {
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Check if the stack can be increased
        if (existingItem.maxStack && newQuantity > existingItem.maxStack) {
          state.error = 'Cannot exceed maximum stack size';
          return;
        }
        
        state.items[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };
      } else {
        // Check if we have room for a new item
        if (state.items.length >= state.capacity) {
          state.error = 'Inventory is full';
          return;
        }
        
        // Add as new item
        state.items.push({
          ...item,
          quantity: quantity
        });
      }
      
      state.error = null;
    },
    
    /**
     * Remove item from inventory
     */
    removeItemFromInventory(state, action: PayloadAction<RemoveItemPayload>) {
      const { itemId, quantity = 1 } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        state.error = 'Item not found';
        return;
      }
      
      const item = state.items[itemIndex];
      
      // If quantity to remove is greater than or equal to current quantity, remove item
      if (quantity >= item.quantity) {
        state.items = state.items.filter((_, index) => index !== itemIndex);
      } else {
        // Otherwise reduce quantity
        state.items[itemIndex] = {
          ...item,
          quantity: item.quantity - quantity
        };
      }
      
      state.error = null;
    },
    
    /**
     * Update item in inventory
     */
    updateItem(state, action: PayloadAction<UpdateItemPayload>) {
      const { itemId, updates } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        state.error = 'Item not found';
        return;
      }
      
      state.items[itemIndex] = {
        ...state.items[itemIndex],
        ...updates
      };
      
      state.error = null;
    },
    
    /**
     * Select an item
     */
    selectItem(state, action: PayloadAction<string | null>) {
      state.selectedItemId = action.payload;
    },
    
    /**
     * Set equipment in slot
     */
    setEquipment(state, action: PayloadAction<{ slot: EquipmentSlot; item: Item | null }>) {
      const { slot, item } = action.payload;
      state.equipment[slot] = item;
    },
    
    /**
     * Set quick slot item
     */
    setQuickSlot(state, action: PayloadAction<SetQuickSlotPayload>) {
      const { itemId, slotIndex } = action.payload;
      
      // Validate slot index
      if (slotIndex < 0 || slotIndex >= state.quickSlots.length) {
        state.error = 'Invalid quick slot index';
        return;
      }
      
      // If null, clear the slot
      if (itemId === null) {
        state.quickSlots[slotIndex] = null;
        return;
      }
      
      // Find the item
      const item = state.items.find(i => i.id === itemId);
      if (!item) {
        state.error = 'Item not found';
        return;
      }
      
      state.quickSlots[slotIndex] = item;
      state.error = null;
    },
    
    /**
     * Sort inventory items
     */
    sortInventory(state, action: PayloadAction<SortItemsPayload>) {
      const { sortBy, direction } = action.payload;
      state.sorting = { field: sortBy, direction };
    },
    
    /**
     * Filter inventory items
     */
    filterInventory(state, action: PayloadAction<FilterItemsPayload>) {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload.filter
      };
    },
    
    /**
     * Reset inventory filters
     */
    resetFilters(state) {
      state.activeFilters = {};
    },
    
    /**
     * Add gold to inventory
     */
    addGold(state, action: PayloadAction<AddGoldPayload>) {
      state.gold += action.payload.amount;
    },
    
    /**
     * Remove gold from inventory
     */
    removeGold(state, action: PayloadAction<RemoveGoldPayload>) {
      const { amount } = action.payload;
      
      if (state.gold < amount) {
        state.error = 'Not enough gold';
        return;
      }
      
      state.gold -= amount;
      state.error = null;
    },
    
    /**
     * Clear error message
     */
    clearError(state) {
      state.error = null;
    },
    
    /**
     * Increase inventory capacity
     */
    increaseCapacity(state, action: PayloadAction<number>) {
      state.capacity += action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handle addItem thunk
    builder.addCase(addItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addItem.fulfilled, (state, action) => {
      state.isLoading = false;
      // Note: The actual adding of the item is handled in the fulfilled action
    });
    builder.addCase(addItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to add item';
    });
    
    // Handle removeItem thunk
    builder.addCase(removeItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeItem.fulfilled, (state) => {
      state.isLoading = false;
      // Note: The actual removal of the item is handled in the fulfilled action
    });
    builder.addCase(removeItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to remove item';
    });
    
    // Handle equip thunk
    builder.addCase(equip.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(equip.fulfilled, (state) => {
      state.isLoading = false;
      // Note: The actual equipping is handled in the fulfilled action
    });
    builder.addCase(equip.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to equip item';
    });
    
    // Handle unequip thunk
    builder.addCase(unequip.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(unequip.fulfilled, (state) => {
      state.isLoading = false;
      // Note: The actual unequipping is handled in the fulfilled action
    });
    builder.addCase(unequip.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to unequip item';
    });
    
    // Handle useItem thunk
    builder.addCase(useItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(useItem.fulfilled, (state) => {
      state.isLoading = false;
      // Note: The actual using of the item is handled in the fulfilled action
    });
    builder.addCase(useItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to use item';
    });
    
    // Handle sellItem thunk
    builder.addCase(sellItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sellItem.fulfilled, (state) => {
      state.isLoading = false;
      // Note: The actual selling of the item is handled in the fulfilled action
    });
    builder.addCase(sellItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to sell item';
    });
    
    // Handle buyItem thunk
    builder.addCase(buyItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(buyItem.fulfilled, (state) => {
      state.isLoading = false;
      // Note: The actual buying of the item is handled in the fulfilled action
    });
    builder.addCase(buyItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to buy item';
    });
  }
});

// Export actions
export const {
  addItemToInventory,
  removeItemFromInventory,
  updateItem,
  selectItem,
  setEquipment,
  setQuickSlot,
  sortInventory,
  filterInventory,
  resetFilters,
  addGold,
  removeGold,
  clearError,
  increaseCapacity
} = inventorySlice.actions;

// Export reducer
export default inventorySlice.reducer;
