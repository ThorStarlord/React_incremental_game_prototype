/**
 * @file NPCSlice.ts
 * @description Redux Toolkit slice for managing NPC state with comprehensive relationship,
 * dialogue, trading, and quest systems
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
  DEFAULT_NPC_STATE
} from './NPCTypes';

// Async thunks
export const initializeNPCsThunk = createAsyncThunk<
  Record<string, NPC>,
  NPC[] | undefined,
  { state: RootState }
>(
  'npcs/initialize',
  async (providedNPCs, { rejectWithValue }) => {
    try {
      if (providedNPCs && Array.isArray(providedNPCs)) {
        // Convert array to record
        const npcsRecord: Record<string, NPC> = {};
        providedNPCs.forEach(npc => {
          npcsRecord[npc.id] = npc;
        });
        return npcsRecord;
      }

      // Load mock data if no NPCs provided
      const { getMockNPCs } = await import('../data/mockNPCData');
      const mockNPCs = getMockNPCs();
      const npcsRecord: Record<string, NPC> = {};
      mockNPCs.forEach(npc => {
        npcsRecord[npc.id] = npc;
      });
      return npcsRecord;
    } catch (error) {
      return rejectWithValue('Failed to initialize NPCs');
    }
  }
);

export const updateNPCRelationshipThunk = createAsyncThunk<
  InteractionResult,
  UpdateNPCRelationshipPayload,
  { state: RootState }
>(
  'npcs/updateRelationship',
  async ({ npcId, change, reason = 'Unknown' }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue('NPC not found');
      }

      const newValue = Math.max(-100, Math.min(100, npc.relationshipValue + change));
      const actualChange = newValue - npc.relationshipValue;

      return {
        success: true,
        relationshipChange: actualChange,
        rewards: actualChange > 0 ? ['Improved relationship'] : []
      };
    } catch (error) {
      return rejectWithValue('Failed to update relationship');
    }
  }
);

export const processNPCInteractionThunk = createAsyncThunk<
  InteractionResult,
  { npcId: string; interactionType: string; options?: Record<string, any> },
  { state: RootState }
>(
  'npcs/processInteraction',
  async ({ npcId, interactionType, options = {} }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc || !npc.isAvailable) {
        return rejectWithValue('NPC not available for interaction');
      }

      // Process different interaction types
      let result: InteractionResult = { success: true };
      
      switch (interactionType) {
        case 'dialogue':
          result.relationshipChange = Math.floor(Math.random() * 3) + 1;
          result.rewards = ['Had a pleasant conversation'];
          break;
        case 'trade':
          result.rewards = ['Completed trade'];
          break;
        case 'quest':
          result.rewards = ['Quest interaction'];
          break;
        default:
          result.rewards = ['General interaction'];
      }

      // Apply relationship change if any
      if (result.relationshipChange) {
        dispatch(updateNPCRelationshipThunk({
          npcId,
          change: result.relationshipChange,
          reason: interactionType
        }));
      }

      return result;
    } catch (error) {
      return rejectWithValue('Failed to process interaction');
    }
  }
);

export const discoverNPCThunk = createAsyncThunk<
  string,
  DiscoverNPCPayload,
  { state: RootState }
>(
  'npcs/discover',
  async ({ npcId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue('NPC not found');
      }

      if (state.npcs.discoveredNPCs.includes(npcId)) {
        return rejectWithValue('NPC already discovered');
      }

      return npcId;
    } catch (error) {
      return rejectWithValue('Failed to discover NPC');
    }
  }
);

export const processDialogueChoiceThunk = createAsyncThunk<
  DialogueResult,
  ProcessDialoguePayload,
  { state: RootState }
>(
  'npcs/processDialogue',
  async ({ npcId, choiceId, playerText }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue('NPC not found');
      }

      // Mock dialogue processing
      const responses = [
        "That's an interesting perspective.",
        "I appreciate you sharing that with me.",
        "Tell me more about that.",
        "I see your point of view."
      ];

      const npcResponse = responses[Math.floor(Math.random() * responses.length)];
      const relationshipChange = Math.floor(Math.random() * 3);

      return {
        success: true,
        npcResponse,
        relationshipChange,
        rewards: relationshipChange > 0 ? ['Positive conversation'] : []
      };
    } catch (error) {
      return rejectWithValue('Failed to process dialogue');
    }
  }
);

// Create the slice
const npcSlice = createSlice({
  name: 'npcs',
  initialState: DEFAULT_NPC_STATE,
  reducers: {
    updateNpcRelationship: (state, action: PayloadAction<UpdateNPCRelationshipPayload>) => {
      const { npcId, change, reason = 'Manual update' } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc) {
        const oldValue = npc.relationshipValue;
        const newValue = Math.max(-100, Math.min(100, oldValue + change));
        npc.relationshipValue = newValue;
        npc.lastInteraction = Date.now();

        // Record the change
        state.relationshipChanges.push({
          id: `${npcId}-${Date.now()}`,
          npcId,
          oldValue,
          newValue,
          reason,
          timestamp: Date.now()
        });
      }
    },

    setNpcStatus: (state, action: PayloadAction<{ npcId: string; status: string }>) => {
      const { npcId, status } = action.payload;
      const npc = state.npcs[npcId];
      if (npc) {
        npc.status = status as any;
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
      playerText: string;
      npcResponse: string;
      relationshipChange?: number;
    }>) => {
      const { npcId, playerText, npcResponse, relationshipChange } = action.payload;
      state.dialogueHistory.push({
        id: `${npcId}-${Date.now()}`,
        npcId,
        playerText,
        npcResponse,
        timestamp: Date.now(),
        relationshipChange
      });
    },

    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // Initialize NPCs
      .addCase(initializeNPCsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeNPCsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.npcs = action.payload;
      })
      .addCase(initializeNPCsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update relationship
      .addCase(updateNPCRelationshipThunk.fulfilled, (state, action) => {
        // Handled by the manual reducer above
      })

      // Discover NPC
      .addCase(discoverNPCThunk.fulfilled, (state, action) => {
        const npcId = action.payload;
        if (!state.discoveredNPCs.includes(npcId)) {
          state.discoveredNPCs.push(npcId);
        }
      })

      // Process dialogue
      .addCase(processDialogueChoiceThunk.fulfilled, (state, action) => {
        const result = action.payload;
        const { npcId } = action.meta.arg;
        
        if (result.relationshipChange) {
          const npc = state.npcs[npcId];
          if (npc) {
            npc.relationshipValue = Math.max(-100, Math.min(100, 
              npc.relationshipValue + result.relationshipChange
            ));
            npc.lastInteraction = Date.now();
          }
        }
      });
  }
});

export const {
  updateNpcRelationship,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError
} = npcSlice.actions;

export default npcSlice.reducer;
