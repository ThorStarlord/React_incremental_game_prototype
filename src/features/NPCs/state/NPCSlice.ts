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
              reason: 'Trait sharing interaction'
            });
          }
        }
      })

      .addMatcher(
        (action): action is RejectedAction => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          if (action.payload && typeof action.payload === 'string') {
            state.error = action.payload;
          } else if (action.error?.message) {
            state.error = action.error.message;
          } else {
            state.error = 'An unknown error occurred in an NPC thunk';
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
  updateNpcConnectionDepth
} = npcSlice.actions;

export default npcSlice.reducer;
