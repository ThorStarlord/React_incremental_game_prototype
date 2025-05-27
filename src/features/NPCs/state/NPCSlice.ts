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
  DialogueEntry,
  RelationshipChangeEntry,
  NPCStatus,
  InteractionType
} from './NPCTypes';
import { DEFAULT_NPC_STATE } from './NPCTypes';

// Async thunks
const initializeNPCsThunk = createAsyncThunk<
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

      // Load mock data from existing mock data file
      const mockNPCModule = await import('../data/mockNPCData');
      // Use the correct export name 'mockNPCs' from mockNPCData.ts
      const mockData = mockNPCModule.mockNPCs;
      
      if (!mockData) {
        throw new Error('Mock NPC data not found');
      }
      
      // mockNPCs is exported as Record<string, NPC>, so we can use it directly
      return mockData;
    } catch (error) {
      return rejectWithValue('Failed to initialize NPCs');
    }
  }
);

const updateNPCRelationshipThunk = createAsyncThunk<
  { npcId: string; relationshipChange: number; newValue: number },
  UpdateNPCRelationshipPayload,
  { state: RootState }
>(
  'npcs/updateRelationship',
  async ({ npcId, change, reason = 'Unknown' }, { getState, rejectWithValue }) => {
    const state = getState();
    const npc = state.npcs.npcs[npcId];
    
    if (!npc) {
      return rejectWithValue(`NPC with id ${npcId} not found`);
    }

    const newValue = Math.max(0, Math.min(100, npc.relationshipValue + change));
    
    return {
      npcId,
      relationshipChange: change,
      newValue
    };
  }
);

const processNPCInteractionThunk = createAsyncThunk<
  InteractionResult,
  { npcId: string; interactionType: InteractionType; options?: Record<string, any> },
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
      let result: InteractionResult = { 
        success: true,
        message: 'Interaction completed successfully'
      };
      
      switch (interactionType) {
        case 'dialogue':
          result.relationshipChange = Math.floor(Math.random() * 3) + 1;
          result.message = 'Had a pleasant conversation';
          result.rewards = ['Improved understanding'];
          break;
        case 'trade':
          result.message = 'Completed trade transaction';
          result.rewards = ['Traded goods'];
          break;
        case 'quest':
          result.message = 'Quest interaction completed';
          result.rewards = ['Quest progress'];
          break;
        case 'trait_sharing':
          result.message = 'Shared knowledge and experiences';
          result.relationshipChange = 2;
          result.rewards = ['Deepened bond'];
          break;
        default:
          result.message = 'General interaction completed';
          result.rewards = ['Social connection'];
      }

      // Apply relationship change if any
      if (result.relationshipChange) {
        await dispatch(updateNPCRelationshipThunk({
          npcId,
          change: result.relationshipChange,
          reason: `${interactionType} interaction`
        }));
      }

      return result;
    } catch (error) {
      return rejectWithValue('Failed to process interaction');
    }
  }
);

const discoverNPCThunk = createAsyncThunk<
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

const processDialogueChoiceThunk = createAsyncThunk<
  DialogueResult,
  ProcessDialoguePayload,
  { state: RootState }
>(
  'npcs/processDialogue',
  async ({ npcId, choiceId, playerText }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue('NPC not found');
      }

      // Mock dialogue processing based on relationship level
      const responses = [
        "That's an interesting perspective.",
        "I appreciate you sharing that with me.",
        "Tell me more about that.",
        "I see your point of view.",
        "Your words resonate with me.",
        "I'm beginning to understand you better."
      ];

      const npcResponse = responses[Math.floor(Math.random() * responses.length)];
      const relationshipChange = Math.floor(Math.random() * 3) + 1;

      // Add dialogue entry
      dispatch(addDialogueEntry({
        npcId,
        playerText,
        npcResponse,
        relationshipChange
      }));

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

const shareTraitWithNPCThunk = createAsyncThunk<
  InteractionResult,
  ShareTraitPayload,
  { state: RootState }
>(
  'npcs/shareTrait',
  async ({ npcId, traitId, slotIndex }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue('NPC not found');
      }

      // Check if NPC has relationship level for trait sharing (4+)
      if (npc.relationshipValue < 4) {
        return rejectWithValue('Insufficient relationship level for trait sharing');
      }

      return {
        success: true,
        message: `Successfully shared trait with ${npc.name}`,
        relationshipChange: 1,
        rewards: ['Trait sharing bond']
      };
    } catch (error) {
      return rejectWithValue('Failed to share trait');
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
      playerText: string;
      npcResponse: string;
      relationshipChange?: number;
    }>) => {
      const { npcId, playerText, npcResponse, relationshipChange } = action.payload;
      const entry: DialogueEntry = {
        id: `${npcId}-${Date.now()}`,
        npcId,
        timestamp: Date.now(),
        playerText,
        npcResponse,
        relationshipChange
      };
      state.dialogueHistory.push(entry);
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
        // Auto-discover available NPCs
        Object.values(action.payload).forEach(npc => {
          if (npc.isDiscovered && !state.discoveredNPCs.includes(npc.id)) {
            state.discoveredNPCs.push(npc.id);
          }
        });
      })
      .addCase(initializeNPCsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update relationship
      .addCase(updateNPCRelationshipThunk.fulfilled, (state, action) => {
        const { npcId, relationshipChange, newValue } = action.payload;
        const npc = state.npcs[npcId];
        if (npc) {
          const oldValue = npc.relationshipValue;
          npc.relationshipValue = newValue;
          npc.lastInteraction = Date.now();

          // Record the change
          state.relationshipChanges.push({
            id: `${npcId}-${Date.now()}`,
            npcId,
            timestamp: Date.now(),
            oldValue,
            newValue,
            reason: action.meta.arg.reason || 'Relationship update'
          });
        }
      })

      // Discover NPC
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

      // Process dialogue
      .addCase(processDialogueChoiceThunk.fulfilled, (state, action) => {
        const result = action.payload;
        const { npcId } = action.meta.arg;
        
        if (result.relationshipChange) {
          const npc = state.npcs[npcId];
          if (npc) {
            const oldValue = npc.relationshipValue;
            const newValue = Math.max(-100, Math.min(100, oldValue + result.relationshipChange));
            npc.relationshipValue = newValue;
            npc.lastInteraction = Date.now();

            // Record the relationship change
            state.relationshipChanges.push({
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

      // Share trait with NPC
      .addCase(shareTraitWithNPCThunk.fulfilled, (state, action) => {
        const result = action.payload;
        const { npcId } = action.meta.arg;
        
        if (result.relationshipChange) {
          const npc = state.npcs[npcId];
          if (npc) {
            const oldValue = npc.relationshipValue;
            const newValue = Math.max(-100, Math.min(100, oldValue + result.relationshipChange));
            npc.relationshipValue = newValue;
            npc.lastInteraction = Date.now();

            // Record the relationship change
            state.relationshipChanges.push({
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

      // Handle async thunk errors with proper typing
      .addMatcher(
        (action): action is ReturnType<typeof initializeNPCsThunk.rejected> |
                        ReturnType<typeof updateNPCRelationshipThunk.rejected> |
                        ReturnType<typeof processNPCInteractionThunk.rejected> |
                        ReturnType<typeof discoverNPCThunk.rejected> |
                        ReturnType<typeof processDialogueChoiceThunk.rejected> |
                        ReturnType<typeof shareTraitWithNPCThunk.rejected> => {
          return action.type.endsWith('/rejected');
        },
        (state, action) => {
          state.loading = false;
          if (action.payload && typeof action.payload === 'string') {
            state.error = action.payload;
          } else if (action.error?.message) {
            state.error = action.error.message;
          } else {
            state.error = 'An error occurred';
          }
        }
      );
  }
});

// Export actions
export const {
  updateNpcRelationship,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError
} = npcSlice.actions;

// Export thunks
export {
  initializeNPCsThunk,
  updateNPCRelationshipThunk,
  processNPCInteractionThunk,
  discoverNPCThunk,
  processDialogueChoiceThunk,
  shareTraitWithNPCThunk
};

// Export reducer as default
export default npcSlice.reducer;
