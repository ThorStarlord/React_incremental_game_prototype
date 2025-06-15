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
    updateNpcRelationship: (state, action: PayloadAction<{ npcId: string; change: number; reason?: string }>) => {
      const { npcId, change } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.relationshipValue = Math.max(-100, Math.min(100, npc.relationshipValue + change));
      }
    },
    setRelationshipValue: (state, action: PayloadAction<{ npcId: string; value: number }>) => {
        const { npcId, value } = action.payload;
        const npc = state.npcs[npcId];
        if (npc) {
            npc.relationshipValue = Math.max(0, Math.min(100, value));
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
      const { npcId, newDepth } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.connectionDepth = Math.max(0, Math.min(10, newDepth));
      }
    },
    completeDialogueTopic: (state, action: PayloadAction<{ npcId: string; dialogueId: string }>) => {
      const { npcId, dialogueId } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.availableDialogues = npc.availableDialogues.filter(id => id !== dialogueId);
        if (!npc.completedDialogues.includes(dialogueId)) {
          npc.completedDialogues.push(dialogueId);
        }
      }
    },
    selectNPC: (state, action: PayloadAction<string | null>) => {
      state.selectedNPCId = action.payload;
    },
    debugUnlockAllSharedSlots: (state, action: PayloadAction<string>) => {
      const npcId = action.payload;
      const npc = state.npcs[npcId];
      if (npc && npc.sharedTraitSlots) {
        npc.sharedTraitSlots.forEach(slot => {
          slot.isUnlocked = true;
        });
      }
    }
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
  updateNpcRelationship,
  setRelationshipValue,
  increaseConnectionDepth,
  addRelationshipChangeEntry,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError,
  updateNpcConnectionDepth,
  completeDialogueTopic,
  selectNPC,
  debugUnlockAllSharedSlots
} = npcSlice.actions;

export const npcActions = npcSlice.actions;
export default npcSlice.reducer;