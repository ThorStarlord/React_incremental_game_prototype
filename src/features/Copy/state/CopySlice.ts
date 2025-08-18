/**
 * @file CopySlice.ts
 * @description Redux slice for managing the state of player-created Copies.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CopiesState, Copy, CopyTraitSlot, CopyRole, CopyTask } from './CopyTypes';
import { COPY_SYSTEM } from '../../../constants/gameConstants';
import { clamp } from '../utils/copyUtils';

/**
 * Unlock any eligible trait slots for a given metric update.
 */
const unlockEligibleTraitSlots = (
  slots: CopyTraitSlot[] | undefined,
  type: 'maturity' | 'loyalty',
  value: number
) => {
  if (!slots) return;
  for (const slot of slots) {
    if (!slot.isLocked || !slot.unlockRequirement) continue;
    const meets = slot.unlockRequirement.type === type && value >= slot.unlockRequirement.value;
    if (meets) slot.isLocked = false;
  }
};

const createInitialCopyTraitSlots = (): CopyTraitSlot[] => {
  const slots: CopyTraitSlot[] = [];
  for (let i = 0; i < COPY_SYSTEM.MAX_TRAIT_SLOTS; i++) {
    const unlock = COPY_SYSTEM.TRAIT_SLOT_UNLOCKS.find(u => u.slotIndex === i);
    slots.push({
      id: `copy_trait_slot_${i}`,
      slotIndex: i,
      traitId: null,
      isLocked: i >= COPY_SYSTEM.INITIAL_TRAIT_SLOTS,
      unlockRequirement: unlock ? { type: unlock.type, value: unlock.value } : undefined,
    });
  }
  return slots;
};

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
  traitSlots: createInitialCopyTraitSlots(),
      sharePreferences: {},
      role: 'none',
      activeTask: null,
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
  traitSlots: createInitialCopyTraitSlots(),
      sharePreferences: {},
      role: 'none',
      activeTask: null,
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
  if (!newCopy.traitSlots) newCopy.traitSlots = createInitialCopyTraitSlots();
      if (!newCopy.sharePreferences) newCopy.sharePreferences = {};
      if (newCopy.role === undefined) newCopy.role = 'none';
      if (newCopy.activeTask === undefined) newCopy.activeTask = null;
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

    /** Share a trait to a Copy's slot (assumes validation in thunk). */
    shareTraitToCopy: (state, action: PayloadAction<{ copyId: string; slotIndex: number; traitId: string }>) => {
      const { copyId, slotIndex, traitId } = action.payload;
      const copy = state.copies[copyId];
      if (!copy || !copy.traitSlots) return;
      const slot = copy.traitSlots[slotIndex];
      if (!slot || slot.isLocked) return;
      slot.traitId = traitId;
    },

    /** Remove a shared trait from a Copy slot. */
    unshareTraitFromCopy: (state, action: PayloadAction<{ copyId: string; slotIndex: number }>) => {
      const { copyId, slotIndex } = action.payload;
      const copy = state.copies[copyId];
      if (!copy || !copy.traitSlots) return;
      const slot = copy.traitSlots[slotIndex];
      if (!slot) return;
      slot.traitId = null;
    },

    /** Unlock any eligible trait slots based on maturity/loyalty. */
    unlockCopySlotsIfEligible: (state, action: PayloadAction<{ copyId: string }>) => {
      const { copyId } = action.payload;
      const copy = state.copies[copyId];
      if (!copy || !copy.traitSlots) return;
      for (const slot of copy.traitSlots) {
        if (!slot.isLocked || !slot.unlockRequirement) continue;
        const meets =
          (slot.unlockRequirement.type === 'maturity' && copy.maturity >= slot.unlockRequirement.value) ||
          (slot.unlockRequirement.type === 'loyalty' && copy.loyalty >= slot.unlockRequirement.value);
        if (meets) slot.isLocked = false;
      }
    },

    /**
     * Assign a role to a Copy (pure assignment, no side-effects here).
     */
    assignCopyRole: (state, action: PayloadAction<{ copyId: string; role: CopyRole }>) => {
      const { copyId, role } = action.payload;
      const copy = state.copies[copyId];
      if (copy) copy.role = role;
    },

    /** Set a user preference for sharing a given trait to this copy when available. */
    setCopySharePreference: (state, action: PayloadAction<{ copyId: string; traitId: string; enabled: boolean }>) => {
      const { copyId, traitId, enabled } = action.payload;
      const copy = state.copies[copyId];
      if (!copy) return;
      if (!copy.sharePreferences) copy.sharePreferences = {};
      copy.sharePreferences[traitId] = enabled;
    },

    /** Start a task on a copy, replacing any existing active task. */
    startCopyTask: (state, action: PayloadAction<{ copyId: string; task: CopyTask }>) => {
      const { copyId, task } = action.payload;
      const copy = state.copies[copyId];
      if (!copy) return;
      copy.activeTask = { ...task };
    },

    /** Progress an active task by deltaSeconds; complete if finished. */
    progressCopyTask: (state, action: PayloadAction<{ copyId: string; deltaSeconds: number }>) => {
      const { copyId, deltaSeconds } = action.payload;
      const copy = state.copies[copyId];
      const task = copy?.activeTask;
      if (!copy || !task || task.status !== 'running') return;
      task.progressSeconds = Math.min(task.durationSeconds, task.progressSeconds + deltaSeconds);
      if (task.progressSeconds >= task.durationSeconds) {
        task.status = 'completed';
      }
    },

    /** Clear the active task (e.g., after handling completion). */
    clearCopyActiveTask: (state, action: PayloadAction<{ copyId: string }>) => {
      const { copyId } = action.payload;
      const copy = state.copies[copyId];
      if (copy) copy.activeTask = null;
    },

    // Batch update multiple copies at once for performance (used in growth/decay loops)
    updateMultipleCopies: (state, action: PayloadAction<Array<{ copyId: string; updates: Partial<Copy> }>>) => {
      for (const { copyId, updates } of action.payload) {
        const existing = state.copies[copyId];
        if (!existing) continue;
        Object.assign(existing, updates);
        if (updates.maturity !== undefined) {
          existing.maturity = clamp(existing.maturity, COPY_SYSTEM.MATURITY_MIN, COPY_SYSTEM.MATURITY_MAX);
          // Check slot unlocks when maturity changes
          unlockEligibleTraitSlots(existing.traitSlots, 'maturity', existing.maturity);
        }
        if (updates.loyalty !== undefined) {
          existing.loyalty = clamp(updates.loyalty, COPY_SYSTEM.LOYALTY_MIN, COPY_SYSTEM.LOYALTY_MAX);
          // Check slot unlocks when loyalty changes
          unlockEligibleTraitSlots(existing.traitSlots, 'loyalty', existing.loyalty);
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
  },
    /** Ensure a Copy has initialized trait slots (migration safety for older saves). */
    ensureCopyTraitSlots: (state, action: PayloadAction<{ copyId: string }>) => {
      const { copyId } = action.payload;
      const copy = state.copies[copyId];
      if (copy && !copy.traitSlots) {
        copy.traitSlots = createInitialCopyTraitSlots();
      }
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
  setCopiesError,
  shareTraitToCopy,
  unshareTraitFromCopy,
  unlockCopySlotsIfEligible,
  ensureCopyTraitSlots,
    assignCopyRole,
    setCopySharePreference,
    startCopyTask,
    progressCopyTask,
    clearCopyActiveTask,
} = copiesSlice.actions;

export default copiesSlice.reducer;