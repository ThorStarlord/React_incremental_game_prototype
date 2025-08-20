/**
 * @file NPCSlice.ts
 * @description Redux Toolkit slice for managing NPC state with comprehensive relationship,
 * dialogue, trading, and quest systems
 */

import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type {
  NPCState,
  NPC,
  DialogueEntry,
  NPCStatus,
  RelationshipChangeEntry,
  NPCInteraction
} from './NPCTypes';
// Import the thunk to handle its lifecycle actions
import { initializeNPCsThunk } from './NPCThunks';

const initialState: NPCState = {
  npcs: {},
  discoveredNPCs: [],
  currentInteraction: null,
  dialogueHistory: [],
  relationshipHistory: [],
  loading: false,
  error: null,
  selectedNPCId: null,
};

const npcSlice = createSlice({
  name: 'npcs',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setNPCs: (state, action: PayloadAction<Record<string, NPC>>) => {
      state.npcs = action.payload;
      state.discoveredNPCs = Object.values(action.payload)
        .filter(npc => npc.isDiscovered)
        .map(npc => npc.id);
      state.loading = false;
      state.error = null;
    },
    updateNpcAffinity: (state, action: PayloadAction<{ npcId: string; change: number; reason?: string }>) => {
      const { npcId, change } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.affinity = Math.max(-100, Math.min(100, npc.affinity + change));
        // Auto-unlock shared trait slots based on affinity thresholds
        if (npc.sharedTraitSlots && npc.sharedTraitSlots.length > 0) {
          npc.sharedTraitSlots.forEach(slot => {
            if (!slot.isUnlocked && typeof slot.unlockRequirement === 'number') {
              if (npc.affinity >= slot.unlockRequirement) {
                slot.isUnlocked = true;
              }
            }
          });
        }
      }
    },
    setAffinity: (state, action: PayloadAction<{ npcId: string; value: number }>) => {
        const { npcId, value } = action.payload;
        const npc = state.npcs[npcId];
        if (npc) {
            npc.affinity = Math.max(0, Math.min(100, value));
            // Auto-unlock shared trait slots based on affinity thresholds
            if (npc.sharedTraitSlots && npc.sharedTraitSlots.length > 0) {
              npc.sharedTraitSlots.forEach(slot => {
                if (!slot.isUnlocked && typeof slot.unlockRequirement === 'number') {
                  if (npc.affinity >= slot.unlockRequirement) {
                    slot.isUnlocked = true;
                  }
                }
              });
            }
        }
    },
    increaseConnectionDepth: (state, action: PayloadAction<{ npcId: string; amount: number }>) => {
        const { npcId, amount } = action.payload;
        const npc = state.npcs[npcId];
        if (npc) {
            npc.connectionDepth = (npc.connectionDepth || 0) + amount;
        }
    },
    addRelationshipChangeEntry: (state, action: PayloadAction<RelationshipChangeEntry>) => {
        state.relationshipHistory.push(action.payload);
    },
    setNpcStatus: (state, action: PayloadAction<{ npcId: string; status: NPCStatus }>) => {
      const { npcId, status } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.status = status;
      }
    },
    setNpcAvailability: (state, action: PayloadAction<{ npcId: string; isAvailable: boolean }>) => {
      const { npcId, isAvailable } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.isAvailable = isAvailable;
      }
    },
    startInteraction: (state, action: PayloadAction<NPCInteraction>) => {
      state.currentInteraction = action.payload;
    },
    endInteraction: (state) => {
      state.currentInteraction = null;
    },
    addDialogueEntry: (state, action: PayloadAction<DialogueEntry>) => {
      state.dialogueHistory.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    updateNpcConnectionDepth: (state, action: PayloadAction<{ npcId: string; newDepth: number }>) => {
      const npc = state.npcs[action.payload.npcId];
      if (npc) {
        npc.connectionDepth = action.payload.newDepth;
      }
    },
    setSelectedNPCId: (state, action: PayloadAction<string | null>) => {
      state.selectedNPCId = action.payload;
    },
    debugUnlockAllSharedSlots: (state, action: PayloadAction<string>) => {
      const npc = state.npcs[action.payload];
      if (npc && npc.sharedTraitSlots) {
        npc.sharedTraitSlots.forEach(slot => {
          slot.isUnlocked = true;
        });
      }
    },
    addAvailableQuestToNPC: (state, action: PayloadAction<{ npcId: string; questId: string }>) => {
      const { npcId, questId } = action.payload;
      const npc = state.npcs[npcId];
      if (npc && !npc.availableQuests.includes(questId)) {
        npc.availableQuests.push(questId);
      }
    },
    updateNpcLocation: (state, action: PayloadAction<{ npcId: string; location: string }>) => {
      const { npcId, location } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.location = location;
      }
    },
    /**
     * Assign or clear a shared trait in a specific NPC slot.
     * - Prevents duplicates across slots by clearing any existing slot with the same traitId first.
     * - No-op if the slot is locked or doesn't exist.
     */
    setNPCSharedTraitInSlot: (
      state,
      action: PayloadAction<{ npcId: string; slotIndex: number; traitId: string | null }>
    ) => {
      const { npcId, slotIndex, traitId } = action.payload;
      const npc = state.npcs[npcId];
      if (!npc || !npc.sharedTraitSlots || slotIndex < 0 || slotIndex >= npc.sharedTraitSlots.length) {
        return;
      }
      const slot = npc.sharedTraitSlots[slotIndex];
      if (!slot.isUnlocked) {
        return;
      }
      // If assigning a trait, ensure it's not duplicated in another slot
      if (traitId) {
        const existingIndex = npc.sharedTraitSlots.findIndex(s => s.traitId === traitId);
        if (existingIndex !== -1 && existingIndex !== slotIndex) {
          npc.sharedTraitSlots[existingIndex].traitId = null;
        }
        slot.traitId = traitId;
      } else {
        // Clearing the slot
        slot.traitId = null;
      }
    },
  },
  extraReducers: (builder) => {
    // RESTORED: This block handles the async lifecycle of initializeNPCsThunk.
    builder
      .addCase(initializeNPCsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeNPCsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.npcs = action.payload;
        // Also populate the discovered list for developer convenience
        state.discoveredNPCs = Object.keys(action.payload);
      })
      .addCase(initializeNPCsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to initialize NPCs';
      });
  },
});

export const {
  setLoading,
  setError,
  setNPCs,
  updateNpcAffinity,
  setAffinity,
  increaseConnectionDepth,
  addRelationshipChangeEntry,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError,
  updateNpcConnectionDepth,
  debugUnlockAllSharedSlots,
  setSelectedNPCId,
  addAvailableQuestToNPC,
  updateNpcLocation,
  setNPCSharedTraitInSlot,
} = npcSlice.actions;

export const npcActions = npcSlice.actions;
export default npcSlice.reducer;