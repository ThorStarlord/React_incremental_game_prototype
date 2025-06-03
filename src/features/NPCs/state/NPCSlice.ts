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
  UpdateNPCRelationshipPayload,
  DiscoverNPCPayload,
  StartInteractionPayload,
  ProcessDialoguePayload,
  ShareTraitPayload,
  InteractionResult,
  DialogueResult,
  DialogueEntry,
  NPCStatus,
  RelationshipChangeEntry
} from './NPCTypes';
import { DEFAULT_NPC_STATE } from './NPCTypes';

// Import all thunks from NPCThunks.ts
import { 
  initializeNPCsThunk, 
  updateNPCRelationshipThunk, 
  processNPCInteractionThunk, 
  discoverNPCThunk, 
  processDialogueChoiceThunk, 
  shareTraitWithNPCThunk,
  fetchNPCsThunk
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

// Create the slice
const npcSlice = createSlice({
  name: 'npcs',
  initialState: { 
    ...DEFAULT_NPC_STATE,
    relationshipHistory: [] as RelationshipChangeEntry[], 
  } as NPCState,
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
    updateNpcRelationship: (state, action: PayloadAction<UpdateNPCRelationshipPayload>) => {
      const { npcId, change, reason = 'Manual update' } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc) {
        const oldValue = npc.relationshipValue;
        const newValue = Math.max(-100, Math.min(100, oldValue + change));
        npc.relationshipValue = newValue;
        npc.lastInteraction = Date.now();

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
    startInteraction: (state, action: PayloadAction<StartInteractionPayload>) => {
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
      speaker: 'player' | 'npc' | 'system'; // Added speaker to payload
      playerText: string;
      npcResponse: string;
      affinityDelta?: number;
    }>) => {
      const { npcId, speaker, playerText, npcResponse, affinityDelta } = action.payload; // Destructure speaker
      const entry: DialogueEntry = {
        id: `${npcId}-${Date.now()}`,
        npcId,
        speaker, // Assign speaker
        timestamp: Date.now(),
        playerText,
        npcResponse,
        affinityDelta
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
    /**
     * Marks a dialogue topic as completed for a specific NPC.
     * Moves the dialogueId from availableDialogues to completedDialogues.
     * @param state - The current NPC state.
     * @param action - The action containing npcId and dialogueId.
     */
    completeDialogueTopic: (state, action: PayloadAction<{ npcId: string; dialogueId: string }>) => {
      const { npcId, dialogueId } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        // Remove from availableDialogues
        npc.availableDialogues = npc.availableDialogues.filter(id => id !== dialogueId);
        // Add to completedDialogues if not already there
        if (!npc.completedDialogues.includes(dialogueId)) {
          npc.completedDialogues.push(dialogueId);
        }
      }
    },
    selectNPC: (state, action: PayloadAction<string | null>) => {
      state.selectedNPCId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeNPCsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeNPCsThunk.fulfilled, (state, action: PayloadAction<Record<string, NPC>>) => {
        state.loading = false;
        state.npcs = action.payload;
        Object.values(action.payload).forEach(npc => {
          if (npc.isDiscovered && !state.discoveredNPCs.includes(npc.id)) {
            state.discoveredNPCs.push(npc.id);
          }
        });
      })
      .addCase(initializeNPCsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? (action.error?.message || 'Failed to initialize NPCs');
      })

      .addCase(fetchNPCsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNPCsThunk.fulfilled, (state, action: PayloadAction<Record<string, NPC>>) => {
        state.npcs = action.payload;
        state.discoveredNPCs = Object.values(action.payload)
          .filter(npc => npc.isDiscovered)
          .map(npc => npc.id);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchNPCsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? (action.error?.message || 'Failed to fetch NPCs');
      })
      
      .addCase(updateNPCRelationshipThunk.fulfilled, (state, action) => {
        const { npcId, newValue } = action.payload;
        const npc = state.npcs[npcId];
        if (npc) {
          const oldValue = npc.relationshipValue;
          npc.relationshipValue = newValue;
          npc.lastInteraction = Date.now();
          state.relationshipHistory.push({
            id: `${npcId}-${Date.now()}`,
            npcId,
            timestamp: Date.now(),
            oldValue,
            newValue,
            reason: action.meta.arg.reason || 'Relationship update'
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

      .addCase(processDialogueChoiceThunk.fulfilled, (state, action: PayloadAction<DialogueResult, string, { arg: ProcessDialoguePayload; requestId: string; requestStatus: "fulfilled"; }, never>) => {
        const result = action.payload;
        const { npcId } = action.meta.arg;
        if (result.affinityDelta) {
          const npc = state.npcs[npcId];
          if (npc) {
            const oldValue = npc.relationshipValue;
            const newValue = Math.max(-100, Math.min(100, oldValue + result.affinityDelta));
            npc.relationshipValue = newValue;
            npc.lastInteraction = Date.now();
            state.relationshipHistory.push({
              id: `${npcId}-${Date.now()}`,
              npcId,
              timestamp: Date.now(),
              oldValue,
              newValue,
              reason: 'Dialogue interaction'
            });
          }
        }
      })

      .addCase(shareTraitWithNPCThunk.fulfilled, (state, action: PayloadAction<InteractionResult, string, { arg: ShareTraitPayload; requestId: string; requestStatus: "fulfilled"; }, never>) => {
        const result = action.payload;
        const { npcId, traitId, slotIndex } = action.meta.arg; // Destructure traitId and slotIndex
        
        const npc = state.npcs[npcId];
        if (npc) {
          // Update relationship if affinityDelta is present
          if (result.affinityDelta) {
            const oldValue = npc.relationshipValue;
            const newValue = Math.max(-100, Math.min(100, oldValue + result.affinityDelta));
            npc.relationshipValue = newValue;
            npc.lastInteraction = Date.now();
            state.relationshipHistory.push({
              id: `${npcId}-${Date.now()}`,
              npcId,
              timestamp: Date.now(),
              oldValue,
              newValue,
              reason: 'Trait sharing interaction'
            });
          }

          // Ensure sharedTraitSlots array exists
          if (!npc.sharedTraitSlots) {
            npc.sharedTraitSlots = [];
          }

          // Find or create the slot
          let targetSlot = npc.sharedTraitSlots.find(slot => slot.index === slotIndex);

          if (traitId === '') { // Logic for unsharing (empty traitId)
            if (targetSlot) {
              targetSlot.traitId = null;
            }
          } else { // Logic for sharing
            if (targetSlot) {
              targetSlot.traitId = traitId;
            } else {
              // If slot doesn't exist, create a new one and push it
              // Assuming isUnlocked is true and unlockRequirement is undefined for newly created slots via sharing
              npc.sharedTraitSlots.push({
                id: `${npcId}-shared-slot-${slotIndex}`, // Generate a unique ID for the slot
                index: slotIndex,
                traitId: traitId,
                isUnlocked: true,
                unlockRequirement: undefined,
              });
            }
          }
        }
      })

      .addMatcher(
        (action): action is RejectedAction => action.type.endsWith('/rejected'),
        (state, action) => {
          // Only set the main 'loading' error for these specific thunks
          if (action.type.startsWith('npcs/initializeNPCs/rejected') || action.type.startsWith('npcs/fetchNPCs/rejected')) {
            state.loading = false;
            if (action.payload && typeof action.payload === 'string') {
              state.error = action.payload;
            } else if (action.error?.message) {
              state.error = action.error.message;
            } else {
              state.error = 'An unknown error occurred while loading NPCs.';
            }
          } else {
            // For other rejected thunks, ensure loading is false but don't set the main 'error'
            // These should be handled locally by the component that dispatched them or use a different error state.
            state.loading = false; 
            console.warn(`NPC Thunk Rejected: ${action.type}`, action.payload || action.error);
            // Optionally, you could set a different error field here if needed for specific UI feedback,
            // e.g., state.interactionError = (action.payload as string) || action.error?.message || 'Interaction failed';
          }
        }
      );
  }
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
  selectNPC // Keep selectNPC here for now, but also export actions object
} = npcSlice.actions;

export const npcActions = npcSlice.actions; // Export all actions as a single object

export { npcSlice }; // Export the slice object itself
export default npcSlice.reducer;
