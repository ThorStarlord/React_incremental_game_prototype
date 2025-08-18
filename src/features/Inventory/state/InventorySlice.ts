import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryState } from './InventoryTypes';

const initialState: InventoryState = {
  items: {},
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      state.items[itemId] = (state.items[itemId] || 0) + quantity;
    },
    removeItem: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      if (state.items[itemId]) {
        state.items[itemId] -= quantity;
        if (state.items[itemId] <= 0) {
        if (quantity >= state.items[itemId]) {
          delete state.items[itemId];
        } else {
          state.items[itemId] -= quantity;
        }
      }
    },
  },
});

export const { addItem, removeItem } = inventorySlice.actions;
export const inventoryReducer = inventorySlice.reducer;
