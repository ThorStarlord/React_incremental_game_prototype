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

// FIXED: Import only the thunks that actually exist.
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

// FIXED: Defined initialState directly in the slice, removing the need for DEFAULT_NPC_STATE import.
// Added relationshipHistory to match the reducer logic.
const initialState: NPCState = {
  npcs: {},
  discoveredNPCs: [],
  currentInteraction: null,
  dialogueHistory: [],
  relationshipHistory: [], // FIXED: Added this missing property
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
    // FIXED: Using an inline type for the payload.
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

        // FIXED: Pushing to the now-existing relationshipHistory array.
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
    // FIXED: Using an inline type for the payload.
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
      playerText: string;
      npcResponse: string;
      affinityDelta?: number;
    }>) => {
      const { npcId, playerText, npcResponse, affinityDelta } = action.payload;
      // FIXED: The 'speaker' property does not exist on DialogueEntry type. Removed it.
      const entry: DialogueEntry = {
        id: `${npcId}-${Date.now()}`,
        npcId,
        timestamp: Date.now(),
        playerText,
        npcResponse,
        relationshipChange: affinityDelta // Mapped affinityDelta to relationshipChange
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
      // FIXED: Removed explicit payload type to let TS infer it from the thunk.
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
                console.log(`NPC ${npc.id} initially unlocked trait slot ${slot.index} at relationship ${npc.relationshipValue}`);
              }
            });
          }
        });
      })
      .addCase(initializeNPCsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? (action.error?.message || 'Failed to initialize NPCs');
      })

      // FIXED: Removed extraReducers for fetchNPCsThunk as it doesn't exist.
      // The logic is handled by initializeNPCsThunk now.

      .addCase(updateNPCRelationshipThunk.fulfilled, (state, action) => {
        // FIXED: The payload doesn't contain newValue, it contains the `change`. We must calculate the new value.
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
                console.log(`NPC ${npcId} unlocked trait slot ${slot.index} at relationship ${newValue} (via thunk)`);
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

      // FIXED: Removed extraReducer for non-existent `processDialogueChoiceThunk`.
      // This logic should be part of `processNPCInteractionThunk`.

      .addCase(shareTraitWithNPCThunk.fulfilled, (state, action) => {
        // FIXED: The payload from the thunk does not contain `success` or `relationshipChange`.
        // The primary state update (sharing the trait) should be done in a synchronous reducer.
        // This extraReducer is for handling side effects if the thunk were to return them.
        // For now, we can log the success. The actual trait sharing must be handled elsewhere.
        console.log('shareTraitWithNPCThunk fulfilled:', action.payload);
      })
      .addCase(shareTraitWithNPCThunk.rejected, (state, action) => {
        // FIXED: action.payload can be undefined.
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