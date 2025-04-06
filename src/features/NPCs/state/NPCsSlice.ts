/**
 * Redux slice for NPCs state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  NPCsState,
  NPC,
  StartDialoguePayload,
  UnlockNpcPayload,
  PurchaseItemPayload,
  SellItemPayload,
  CompleteQuestPayload,
  UpdateRelationshipPayload,
  UpdateFactionReputationPayload,
  UpdateNpcLocationPayload,
  RestockNpcInventoryPayload,
  UpdateTimeOfDayPayload,
  DiscoverNpcPayload,
  ToggleFavoriteNpcPayload
} from './NPCsTypes';

import { 
  purchaseItem,
  sellItem,
  completeQuest,
  updateRelationship,
  updateFactionReputation 
} from './NPCsThunks';

/**
 * Initial state for NPCs
 */
const initialState: NPCsState = {
  npcs: {},
  globalState: {
    dayNightCycle: 'day',
    activeEvents: [],
    reputationsByFaction: {}
  },
  playerInteractions: {
    activeDialogue: null,
    lastInteractedNpc: null,
    interactionHistory: {},
    discoveredNpcs: []
  },
  isLoading: false,
  error: null,
  selectedNpcId: null
};

/**
 * NPCs slice with reducers
 */
const npcsSlice = createSlice({
  name: 'npcs',
  initialState,
  reducers: {
    /**
     * Select an NPC
     */
    selectNpc(state, action: PayloadAction<string | null>) {
      state.selectedNpcId = action.payload;
    },
    
    /**
     * Initialize the NPCs state
     */
    initializeNpcs(state, action: PayloadAction<Partial<NPCsState>>) {
      return {
        ...state,
        ...action.payload
      };
    },
    
    /**
     * Start dialogue with an NPC
     */
    startDialogue(state, action: PayloadAction<StartDialoguePayload>) {
      const { npcId, dialogueType = 'greeting' } = action.payload;
      
      if (state.npcs[npcId]) {
        state.playerInteractions.activeDialogue = {
          npcId,
          dialogue: state.npcs[npcId].dialogues[dialogueType] || 
                   state.npcs[npcId].dialogues.greeting,
          dialogueType
        };
        state.playerInteractions.lastInteractedNpc = npcId;
        
        // Record interaction history
        if (!state.playerInteractions.interactionHistory[npcId]) {
          state.playerInteractions.interactionHistory[npcId] = {
            firstInteraction: new Date().toISOString(),
            interactionCount: 0
          };
        }
        
        state.playerInteractions.interactionHistory[npcId].interactionCount += 1;
        state.playerInteractions.interactionHistory[npcId].lastInteraction = new Date().toISOString();
      } else {
        state.error = `NPC with ID ${npcId} not found`;
      }
    },
    
    /**
     * End dialogue with an NPC
     */
    endDialogue(state) {
      state.playerInteractions.activeDialogue = null;
    },
    
    /**
     * Unlock an NPC
     */
    unlockNpc(state, action: PayloadAction<UnlockNpcPayload>) {
      const { npcId } = action.payload;
      
      if (state.npcs[npcId] && !state.npcs[npcId].unlocked) {
        state.npcs[npcId].unlocked = true;
        
        if (!state.playerInteractions.discoveredNpcs.includes(npcId)) {
          state.playerInteractions.discoveredNpcs.push(npcId);
        }
      } else if (!state.npcs[npcId]) {
        state.error = `NPC with ID ${npcId} not found`;
      }
    },
    
    /**
     * Discover a new NPC
     */
    discoverNpc(state, action: PayloadAction<DiscoverNpcPayload>) {
      const { npcId } = action.payload;
      
      if (state.npcs[npcId] && !state.playerInteractions.discoveredNpcs.includes(npcId)) {
        state.playerInteractions.discoveredNpcs.push(npcId);
      } else if (!state.npcs[npcId]) {
        state.error = `NPC with ID ${npcId} not found`;
      }
    },
    
    /**
     * Toggle an NPC as favorite
     */
    toggleFavoriteNpc(state, action: PayloadAction<ToggleFavoriteNpcPayload>) {
      const { npcId } = action.payload;
      
      if (!state.playerInteractions.favoriteNpcs) {
        state.playerInteractions.favoriteNpcs = [];
      }
      
      const index = state.playerInteractions.favoriteNpcs.indexOf(npcId);
      
      if (index === -1) {
        state.playerInteractions.favoriteNpcs.push(npcId);
      } else {
        state.playerInteractions.favoriteNpcs.splice(index, 1);
      }
    },
    
    /**
     * Manually update NPC relationship
     */
    manuallyUpdateRelationship(state, action: PayloadAction<UpdateRelationshipPayload>) {
      const { npcId, amount } = action.payload;
      
      if (state.npcs[npcId]) {
        const currentValue = state.npcs[npcId].relationship.value;
        const newValue = Math.min(100, Math.max(-100, currentValue + amount));
        
        state.npcs[npcId].relationship.value = newValue;
        
        // Update relationship level based on value
        if (newValue >= 75) {
          state.npcs[npcId].relationship.level = 'trusted';
        } else if (newValue >= 50) {
          state.npcs[npcId].relationship.level = 'friendly';
        } else if (newValue >= 0) {
          state.npcs[npcId].relationship.level = 'neutral';
        } else if (newValue >= -50) {
          state.npcs[npcId].relationship.level = 'unfriendly';
        } else {
          state.npcs[npcId].relationship.level = 'hostile';
        }
      } else {
        state.error = `NPC with ID ${npcId} not found`;
      }
    },
    
    /**
     * Update NPC location
     */
    updateNpcLocation(state, action: PayloadAction<UpdateNpcLocationPayload>) {
      const { npcId, location } = action.payload;
      
      if (state.npcs[npcId]) {
        state.npcs[npcId].location = location;
      } else {
        state.error = `NPC with ID ${npcId} not found`;
      }
    },
    
    /**
     * Restock NPC inventory
     */
    restockNpcInventory(state, action: PayloadAction<RestockNpcInventoryPayload>) {
      const { npcId, items } = action.payload;
      
      if (state.npcs[npcId] && state.npcs[npcId].shop) {
        state.npcs[npcId].shop!.inventory = items.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price
        }));
      } else if (!state.npcs[npcId]) {
        state.error = `NPC with ID ${npcId} not found`;
      } else {
        state.error = `NPC ${npcId} does not have a shop`;
      }
    },
    
    /**
     * Update time of day
     */
    updateTimeOfDay(state, action: PayloadAction<UpdateTimeOfDayPayload>) {
      state.globalState.dayNightCycle = action.payload.timeOfDay;
    },
    
    /**
     * Update active events
     */
    updateActiveEvents(state, action: PayloadAction<string[]>) {
      state.globalState.activeEvents = action.payload;
    },
    
    /**
     * Clear error
     */
    clearError(state) {
      state.error = null;
    },
    
    /**
     * Reset NPCs state
     */
    resetNpcs() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // Handle purchaseItem thunk
    builder.addCase(purchaseItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(purchaseItem.fulfilled, (state, action) => {
      state.isLoading = false;
      
      if (action.payload.success) {
        const { npcId, itemIndex, quantity = 1 } = action.meta.arg;
        const npc = state.npcs[npcId];
        
        if (npc?.shop?.isOpen) {
          const item = npc.shop.inventory[itemIndex];
          if (item && item.quantity >= quantity) {
            // Reduce the item quantity in stock
            npc.shop.inventory[itemIndex].quantity -= quantity;
            
            // Update dialogue to successful purchase
            state.playerInteractions.activeDialogue = {
              npcId,
              dialogue: npc.dialogues.successfulPurchase || "Thank you for your purchase!",
              dialogueType: 'successfulPurchase'
            };
          }
        }
      }
    });
    builder.addCase(purchaseItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error purchasing item';
      
      // If there was a specific NPC ID in the error payload, use their lowGold dialogue
      if (action.meta.arg.npcId && state.npcs[action.meta.arg.npcId]) {
        const npc = state.npcs[action.meta.arg.npcId];
        
        state.playerInteractions.activeDialogue = {
          npcId: action.meta.arg.npcId,
          dialogue: npc.dialogues.lowGold || "You don't have enough gold for that.",
          dialogueType: 'lowGold'
        };
      }
    });
    
    // Handle sellItem thunk
    builder.addCase(sellItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sellItem.fulfilled, (state, action) => {
      state.isLoading = false;
      
      if (action.payload.success) {
        const { npcId } = action.meta.arg;
        const npc = state.npcs[npcId];
        
        if (npc?.shop?.isOpen) {
          // Update dialogue to successful sale
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.successfulSale || "Thank you for the business!",
            dialogueType: 'successfulSale'
          };
        }
      }
    });
    builder.addCase(sellItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error selling item';
    });
    
    // Handle completeQuest thunk
    builder.addCase(completeQuest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(completeQuest.fulfilled, (state, action) => {
      state.isLoading = false;
      
      if (action.payload.success) {
        const { npcId, questId } = action.meta.arg;
        const npc = state.npcs[npcId];
        
        if (npc?.quests) {
          const questIndex = npc.quests.findIndex(q => q.questId === questId);
          
          if (questIndex >= 0) {
            // Mark quest as completed
            npc.quests[questIndex].completed = true;
            npc.quests[questIndex].rewarded = true;
            
            // Update dialogue
            state.playerInteractions.activeDialogue = {
              npcId,
              dialogue: npc.dialogues.questComplete || "Thank you for completing this task!",
              dialogueType: 'questComplete'
            };
            
            // Unlock follow-up quests
            npc.quests.forEach(q => {
              if (q.questId.includes('part2') && questId.includes('part1')) {
                q.available = true;
              }
            });
            
            // Improve relationship
            if (npc.relationship) {
              npc.relationship.value = Math.min(100, npc.relationship.value + 10);
              
              if (npc.relationship.value >= 75) {
                npc.relationship.level = 'trusted';
              } else if (npc.relationship.value >= 50) {
                npc.relationship.level = 'friendly';
              }
            }
          }
        }
      }
    });
    builder.addCase(completeQuest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error completing quest';
    });
    
    // Handle updateRelationship thunk
    builder.addCase(updateRelationship.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateRelationship.fulfilled, (state, action) => {
      state.isLoading = false;
      
      const { npcId, amount } = action.meta.arg;
      
      if (state.npcs[npcId]) {
        const currentValue = state.npcs[npcId].relationship.value;
        const newValue = Math.min(100, Math.max(-100, currentValue + amount));
        
        state.npcs[npcId].relationship.value = newValue;
        
        // Update relationship level based on value
        if (newValue >= 75) {
          state.npcs[npcId].relationship.level = 'trusted';
        } else if (newValue >= 50) {
          state.npcs[npcId].relationship.level = 'friendly';
        } else if (newValue >= 0) {
          state.npcs[npcId].relationship.level = 'neutral';
        } else if (newValue >= -50) {
          state.npcs[npcId].relationship.level = 'unfriendly';
        } else {
          state.npcs[npcId].relationship.level = 'hostile';
        }
      }
    });
    builder.addCase(updateRelationship.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error updating relationship';
    });
    
    // Handle updateFactionReputation thunk
    builder.addCase(updateFactionReputation.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateFactionReputation.fulfilled, (state, action) => {
      state.isLoading = false;
      
      const { faction, amount } = action.meta.arg;
      
      // Update faction reputation
      const currentValue = state.globalState.reputationsByFaction[faction] || 0;
      state.globalState.reputationsByFaction[faction] = Math.min(100, Math.max(-100, currentValue + amount));
      
      // Update relationships with NPCs from this faction
      Object.values(state.npcs).forEach(npc => {
        if (npc.faction === faction) {
          // Apply a portion of the faction reputation change to this NPC
          const relationshipChange = Math.round(amount * 0.5);
          npc.relationship.value = Math.min(100, Math.max(-100, npc.relationship.value + relationshipChange));
          
          // Update relationship level
          if (npc.relationship.value >= 75) {
            npc.relationship.level = 'trusted';
          } else if (npc.relationship.value >= 50) {
            npc.relationship.level = 'friendly';
          } else if (npc.relationship.value >= 0) {
            npc.relationship.level = 'neutral';
          } else if (npc.relationship.value >= -50) {
            npc.relationship.level = 'unfriendly';
          } else {
            npc.relationship.level = 'hostile';
          }
        }
      });
    });
    builder.addCase(updateFactionReputation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error updating faction reputation';
    });
  }
});

// Export actions
export const {
  selectNpc,
  initializeNpcs,
  startDialogue,
  endDialogue,
  unlockNpc,
  discoverNpc,
  toggleFavoriteNpc,
  manuallyUpdateRelationship,
  updateNpcLocation,
  restockNpcInventory,
  updateTimeOfDay,
  updateActiveEvents,
  clearError,
  resetNpcs
} = npcsSlice.actions;

// Export reducer
export default npcsSlice.reducer;
