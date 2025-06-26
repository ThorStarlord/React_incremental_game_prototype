/**
 * @file CopySlice.ts
 * @description Redux slice for managing the state of player-created Copies.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CopiesState, Copy } from './CopyTypes';

const initialState: CopiesState = {
  copies: {
    'copy-001': {
      id: 'copy-001',
      name: 'Echo-1',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
      parentNPCId: 'npc-001',
      growthType: 'normal',
      maturity: 75,
      loyalty: 85,
      stats: {
        health: 100, maxHealth: 100, mana: 50, maxMana: 50,
        attack: 15, defense: 12, speed: 10,
        healthRegen: 1, manaRegen: 2,
        criticalChance: 0.1, criticalDamage: 1.5,
      },
      inheritedTraits: ['trait-resilience', 'trait-cunning'],
      location: 'City Center',
    },
    'copy-002': {
      id: 'copy-002',
      name: 'Shade-2',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      parentNPCId: 'npc-003',
      growthType: 'accelerated',
      maturity: 95,
      loyalty: 60,
      stats: {
        health: 80, maxHealth: 80, mana: 70, maxMana: 70,
        attack: 20, defense: 8, speed: 15,
        healthRegen: 0.8, manaRegen: 2.5,
        criticalChance: 0.15, criticalDamage: 1.6,
      },
      inheritedTraits: ['trait-swiftness', 'trait-arcane-potency'],
      location: 'Library Archives',
      currentTask: 'Researching ancient texts',
    },
  },
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