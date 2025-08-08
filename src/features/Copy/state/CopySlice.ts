/**
 * @file CopySlice.ts
 * @description Redux slice for managing the state of player-created Copies.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CopiesState, Copy } from './CopyTypes';
import { COPY_SYSTEM } from '../../../constants/gameConstants';
import { clamp } from '../utils/copyUtils';

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
      const existing = state.copies[copyId];
      if (existing) {
        Object.assign(existing, updates);
        // Clamp maturity & loyalty if provided
        if (updates.maturity !== undefined) {
          existing.maturity = clamp(updates.maturity, COPY_SYSTEM.MATURITY_MIN, COPY_SYSTEM.MATURITY_MAX);
        }
        if (updates.loyalty !== undefined) {
          existing.loyalty = clamp(updates.loyalty, COPY_SYSTEM.LOYALTY_MIN, COPY_SYSTEM.LOYALTY_MAX);
        }
      }
    },

    // Batch update multiple copies at once for performance (used in growth/decay loops)
    updateMultipleCopies: (state, action: PayloadAction<Array<{ copyId: string; updates: Partial<Copy> }>>) => {
      for (const { copyId, updates } of action.payload) {
        const existing = state.copies[copyId];
        if (!existing) continue;
        Object.assign(existing, updates);
        if (updates.maturity !== undefined) {
          existing.maturity = clamp(existing.maturity, COPY_SYSTEM.MATURITY_MIN, COPY_SYSTEM.MATURITY_MAX);
        }
        if (updates.loyalty !== undefined) {
          existing.loyalty = clamp(existing.loyalty, COPY_SYSTEM.LOYALTY_MIN, COPY_SYSTEM.LOYALTY_MAX);
        }
      }
    },

    // Promote a copy to accelerated growth type
    promoteCopyToAccelerated: (state, action: PayloadAction<{ copyId: string }>) => {
      const existing = state.copies[action.payload.copyId];
      if (existing) {
        existing.growthType = 'accelerated';
      }
    },

    // Assign or clear a task
    setCopyTask: (state, action: PayloadAction<{ copyId: string; task: string | null }>) => {
      const existing = state.copies[action.payload.copyId];
      if (existing) {
        if (action.payload.task) {
          existing.currentTask = action.payload.task;
        } else {
          delete existing.currentTask;
        }
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
  updateMultipleCopies,
  promoteCopyToAccelerated,
  setCopyTask,
    setCopiesLoading,
    setCopiesError
} = copiesSlice.actions;

export default copiesSlice.reducer;