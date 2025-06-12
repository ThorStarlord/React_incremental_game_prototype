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
import {
  initializeNPCsThunk,
  updateNPCRelationshipThunk,
  processNPCInteractionThunk,
  discoverNPCThunk,
  shareTraitWithNPCThunk
} from './NPCThunks';

// Define RejectedAction type for the matcher
interface RejectedAction extends AnyAction {
  payload?: any;
  error: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

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


// Create the slice
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
      const { npcId, change, reason = 'Manual update' } = action.payload;
      const npc = state.npcs[npcId];

      if (npc) {
        const oldValue = npc.relationshipValue;
        const newValue = Math.max(-100, Math.min(100, oldValue + change));
        npc.relationshipValue = newValue;
        npc.lastInteraction = Date.now();

        if (npc.sharedTraitSlots) {
          npc.sharedTraitSlots.forEach(slot => {
            if (!slot.isUnlocked && slot.unlockRequirement !== undefined && newValue >= slot.unlockRequirement) {
              slot.isUnlocked = true;
              console.log(`NPC ${npcId} unlocked trait slot ${slot.index} at relationship ${newValue}`);
            }
          });
        }

        state.relationshipHistory.push({
          id: `${npcId}-${Date.now()}`,
          npcId,
          timestamp: Date.now(),
          oldValue,
          newValue,
          reason
        });
      }
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
    startInteraction: (state, action: PayloadAction<{ npcId: string; type: any; context?: any }>) => {
      const { npcId, type, context } = action.payload;
      state.currentInteraction = {
        npcId,
        type,
        startTime: Date.now(),
        context
      };
    },
    endInteraction: (state) => {
      state.currentInteraction = null;
    },
    addDialogueEntry: (state, action: PayloadAction<{
      npcId: string;
      speaker: 'player' | 'npc' | 'system';
      playerText: string;
      npcResponse: string;
      affinityDelta?: number;
    }>) => {
      const { npcId, speaker, playerText, npcResponse, affinityDelta } = action.payload;
      // FIXED: Added the 'speaker' property to the entry object to match the DialogueEntry interface.
      const entry: DialogueEntry = {
        id: `${npcId}-${Date.now()}`,
        npcId,
        speaker,
        timestamp: Date.now(),
        playerText,
        npcResponse,
        relationshipChange: affinityDelta
      };
      state.dialogueHistory.push(entry);
    },
    clearError: (state) => {
      state.error = null;
    },
    updateNpcConnectionDepth: (state, action: PayloadAction<{ npcId: string; change: number }>) => {
      const { npcId, change } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.connectionDepth = Math.max(0, npc.connectionDepth + change);
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
        console.log(`DEBUG: All shared trait slots unlocked for NPC ${npcId}`);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeNPCsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeNPCsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.npcs = action.payload;
        Object.values(state.npcs).forEach(npc => {
          if (npc.isDiscovered && !state.discoveredNPCs.includes(npc.id)) {
            state.discoveredNPCs.push(npc.id);
          }
          if (npc.sharedTraitSlots) {
            npc.sharedTraitSlots.forEach(slot => {
              if (!slot.isUnlocked && slot.unlockRequirement !== undefined && npc.relationshipValue >= slot.unlockRequirement) {
                slot.isUnlocked = true;
              }
            });
          }
        });
      })
      .addCase(initializeNPCsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? (action.error?.message || 'Failed to initialize NPCs');
      })
      .addCase(updateNPCRelationshipThunk.fulfilled, (state, action) => {
        const { npcId, change, reason } = action.payload;
        const npc = state.npcs[npcId];
        if (npc) {
          const oldValue = npc.relationshipValue;
          const newValue = Math.max(-100, Math.min(100, oldValue + change));
          npc.relationshipValue = newValue;
          npc.lastInteraction = Date.now();

          if (npc.sharedTraitSlots) {
            npc.sharedTraitSlots.forEach(slot => {
              if (!slot.isUnlocked && slot.unlockRequirement !== undefined && newValue >= slot.unlockRequirement) {
                slot.isUnlocked = true;
              }
            });
          }

          state.relationshipHistory.push({
            id: `${npcId}-${Date.now()}`,
            npcId,
            timestamp: Date.now(),
            oldValue,
            newValue,
            reason: reason || 'Relationship update'
          });
        }
      })
      .addCase(discoverNPCThunk.fulfilled, (state, action) => {
        const npcId = action.payload;
        if (!state.discoveredNPCs.includes(npcId)) {
          state.discoveredNPCs.push(npcId);
          const npc = state.npcs[npcId];
          if (npc) {
            npc.isDiscovered = true;
          }
        }
      })
      .addCase(shareTraitWithNPCThunk.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to share trait with NPC';
      });
  },
});

export const {
  setLoading,
  setError,
  setNPCs,
  updateNpcRelationship,
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
export { npcSlice };
export default npcSlice.reducer;