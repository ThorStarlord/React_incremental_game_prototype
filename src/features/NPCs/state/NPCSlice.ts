/**
 * @file NPCSlice.ts
 * @description Redux Toolkit slice for managing NPC state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { 
  NPCState, 
  NPC,
  UpdateRelationshipPayload,
  StartDialoguePayload,
  CompleteDialoguePayload,
  DiscoverNPCPayload,
  TradeWithNPCPayload,
  ShareTraitPayload,
  NPCRelationshipChange
} from './NPCTypes';

// Initial state
const initialState: NPCState = {
  npcs: {},
  discoveredNPCs: [],
  currentInteraction: null,
  dialogueHistory: {},
  relationshipChanges: [],
  loading: false,
  error: null,
};

// Async thunks
export const initializeNPCsThunk = createAsyncThunk(
  'npcs/initialize',
  async (npcData: Record<string, NPC>) => {
    // Initialize NPCs from game data
    return npcData;
  }
);

export const saveNPCStateThunk = createAsyncThunk(
  'npcs/saveState',
  async (_, { getState }) => {
    const state = getState() as { npcs: NPCState };
    // Save NPC state to localStorage or external storage
    const npcState = state.npcs;
    localStorage.setItem('gameData_npcs', JSON.stringify(npcState));
    return npcState;
  }
);

export const loadNPCStateThunk = createAsyncThunk(
  'npcs/loadState',
  async () => {
    const savedState = localStorage.getItem('gameData_npcs');
    if (savedState) {
      return JSON.parse(savedState) as NPCState;
    }
    return null;
  }
);

// Main slice
export const npcSlice = createSlice({
  name: 'npcs',
  initialState,
  reducers: {
    // NPC Discovery
    discoverNPC: (state, action: PayloadAction<DiscoverNPCPayload>) => {
      const { npcId, location } = action.payload;
      
      if (!state.discoveredNPCs.includes(npcId)) {
        state.discoveredNPCs.push(npcId);
      }
      
      if (state.npcs[npcId]) {
        state.npcs[npcId].isDiscovered = true;
        state.npcs[npcId].location = location;
      }
    },

    // Relationship Management
    updateRelationship: (state, action: PayloadAction<UpdateRelationshipPayload>) => {
      const { npcId, change, reason } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc) {
        const oldValue = npc.relationshipValue;
        const newValue = Math.max(0, Math.min(100, oldValue + change));
        
        npc.relationshipValue = newValue;
        
        // Track relationship change
        const relationshipChange: NPCRelationshipChange = {
          npcId,
          oldValue,
          newValue,
          reason,
          timestamp: new Date(),
        };
        
        state.relationshipChanges.push(relationshipChange);
        
        // Update connection depth based on relationship value
        if (newValue >= 90) npc.connectionDepth = 5; // Beloved
        else if (newValue >= 75) npc.connectionDepth = 4; // Trusted
        else if (newValue >= 50) npc.connectionDepth = 3; // Ally
        else if (newValue >= 25) npc.connectionDepth = 2; // Friend
        else if (newValue >= 10) npc.connectionDepth = 1; // Acquaintance
        else npc.connectionDepth = 0; // Neutral/Suspicious
      }
    },

    // Dialogue System
    startDialogue: (state, action: PayloadAction<StartDialoguePayload>) => {
      const { npcId, dialogueId } = action.payload;
      
      state.currentInteraction = {
        npcId,
        type: 'dialogue',
        timestamp: new Date(),
        data: { dialogueId, currentNodeId: dialogueId },
      };
    },

    completeDialogue: (state, action: PayloadAction<CompleteDialoguePayload>) => {
      const { npcId, dialogueId, effects } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc) {
        // Mark dialogue as completed
        if (!npc.completedDialogues.includes(dialogueId)) {
          npc.completedDialogues.push(dialogueId);
        }
        
        // Add to dialogue history
        if (!state.dialogueHistory[npcId]) {
          state.dialogueHistory[npcId] = [];
        }
        if (!state.dialogueHistory[npcId].includes(dialogueId)) {
          state.dialogueHistory[npcId].push(dialogueId);
        }
        
        // Apply effects if any
        if (effects) {
          effects.forEach(effect => {
            if (effect.type === 'relationship') {
              const change = typeof effect.value === 'number' ? effect.value : 0;
              npc.relationshipValue = Math.max(0, Math.min(100, npc.relationshipValue + change));
            }
          });
        }
        
        // Update last interaction
        npc.lastInteraction = new Date();
      }
      
      // Clear current interaction
      state.currentInteraction = null;
    },

    // Trait Sharing
    shareTraitWithNPC: (state, action: PayloadAction<ShareTraitPayload>) => {
      const { npcId, traitId, slotIndex } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && slotIndex < npc.sharedTraitSlots) {
        // Implementation depends on how shared traits are stored
        // This is a placeholder for the trait sharing mechanism
        npc.traits[traitId] = {
          id: traitId,
          name: `Shared: ${traitId}`,
          relationshipRequirement: 0,
          essenceCost: 0,
        };
      }
    },

    // Trading
    tradeWithNPC: (state, action: PayloadAction<TradeWithNPCPayload>) => {
      const { npcId, items } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.inventory) {
        // Update NPC inventory based on trade
        items.forEach(tradeItem => {
          const inventoryItem = npc.inventory!.items.find(item => item.id === tradeItem.itemId);
          if (inventoryItem) {
            inventoryItem.quantity = Math.max(0, inventoryItem.quantity - tradeItem.quantity);
          }
        });
        
        // Small relationship boost from trading
        npc.relationshipValue = Math.min(100, npc.relationshipValue + 1);
        npc.lastInteraction = new Date();
      }
    },

    // Quest Management
    startQuest: (state, action: PayloadAction<{ npcId: string; questId: string }>) => {
      const { npcId, questId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.availableQuests.includes(questId)) {
        // Remove from available and add to in-progress (handled by quest system)
        npc.availableQuests = npc.availableQuests.filter(id => id !== questId);
      }
    },

    completeQuest: (state, action: PayloadAction<{ npcId: string; questId: string }>) => {
      const { npcId, questId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc) {
        if (!npc.completedQuests.includes(questId)) {
          npc.completedQuests.push(questId);
        }
        
        // Relationship boost for completing quests
        npc.relationshipValue = Math.min(100, npc.relationshipValue + 5);
        npc.lastInteraction = new Date();
      }
    },

    // Utility actions
    setNPCAvailability: (state, action: PayloadAction<{ npcId: string; isAvailable: boolean }>) => {
      const { npcId, isAvailable } = action.payload;
      if (state.npcs[npcId]) {
        state.npcs[npcId].isAvailable = isAvailable;
      }
    },

    clearCurrentInteraction: (state) => {
      state.currentInteraction = null;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Initialize NPCs
    builder
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
        state.error = action.error.message || 'Failed to initialize NPCs';
      });

    // Save state
    builder
      .addCase(saveNPCStateThunk.fulfilled, (state) => {
        // Successfully saved
      })
      .addCase(saveNPCStateThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to save NPC state';
      });

    // Load state
    builder
      .addCase(loadNPCStateThunk.fulfilled, (state, action) => {
        if (action.payload) {
          return { ...state, ...action.payload };
        }
      })
      .addCase(loadNPCStateThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load NPC state';
      });
  },
});

// Export actions
export const npcActions = npcSlice.actions;

// Export reducer
export default npcSlice.reducer;
