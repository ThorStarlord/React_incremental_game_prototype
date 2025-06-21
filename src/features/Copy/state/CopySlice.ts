/**
 * @file CopySlice.ts
 * @description Redux slice for managing the state of player-created Copies.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CopiesState, Copy } from './CopyTypes';

const initialState: CopiesState = {
  copies: {},
  isLoading: false,
  error: null,
};

const copiesSlice = createSlice({
  name: 'copies',
  initialState,
  reducers: {
    // Action to add a new copy to the state
    addCopy: (state, action: PayloadAction<Copy>) => {
      const newCopy = action.payload;
      state.copies[newCopy.id] = newCopy;
    },
    
    // Action to remove a copy
    removeCopy: (state, action: PayloadAction<{ copyId: string }>) => {
      delete state.copies[action.payload.copyId];
    },
    
    // Action to update a copy's properties
    updateCopy: (state, action: PayloadAction<{ copyId: string; updates: Partial<Copy> }>) => {
      const { copyId, updates } = action.payload;
      if (state.copies[copyId]) {
        Object.assign(state.copies[copyId], updates);
      }
    },
    
    setCopiesLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
    },
    
    setCopiesError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
    }
  },
});

export const { 
    addCopy, 
    removeCopy, 
    updateCopy,
    setCopiesLoading,
    setCopiesError
} = copiesSlice.actions;

export default copiesSlice.reducer;