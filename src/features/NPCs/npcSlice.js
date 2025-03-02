/**
 * @file npcSlice.js
 * @description Redux slice for managing NPC state in the game
 * 
 * This file defines the Redux state management for all NPCs including:
 * - NPC unlocking and availability
 * - Dialogue interactions
 * - Shop transactions
 * - Quest tracking
 * - Training and skill acquisition
 * - Crafting and equipment upgrading
 * - Relationship management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import npcsInitialState from './npcsInitialState';

/**
 * @typedef {Object} NPC
 * @property {string} id - Unique identifier for the NPC
 * @property {string} name - Display name of the NPC
 * @property {boolean} unlocked - Whether this NPC is available for interaction
 * @property {Object} dialogues - Map of dialogue branches
 * @property {Object} relationship - NPC relationship data
 * @property {number} relationship.value - Numeric relationship value (0-100)
 * @property {string} relationship.level - Text descriptor (hostile, neutral, friendly, etc.)
 * @property {Array<Object>} quests - Available quests from this NPC
 * @property {Object} [shop] - Shop data if NPC is a merchant
 * @property {Object} [training] - Training data if NPC is a trainer
 * @property {Object} [crafting] - Crafting data if NPC is a craftsman
 * @property {string} faction - Faction this NPC belongs to
 * @property {string} location - Current location of this NPC
 * @property {Array<string>} availableTimeOfDay - When this NPC is available
 */

/**
 * Complex thunk for purchasing items that updates both NPC and player state
 */
export const purchaseItemThunk = createAsyncThunk(
  'npcs/purchaseItem',
  async ({ npcId, itemIndex, quantity }, { dispatch, getState }) => {
    const { npcs, player } = getState();
    const npc = npcs.npcs[npcId];
    const item = npc?.shop?.inventory[itemIndex];
    
    if (!item) throw new Error('Item not found');
    
    const totalCost = item.price * quantity;
    
    // Check if player has enough gold
    if (player.gold < totalCost) {
      // Trigger insufficient funds dialogue
      dispatch(startDialogue({
        npcId,
        dialogueType: 'insufficientFunds'
      }));
      throw new Error('Insufficient funds');
    }
    
    // Process the purchase
    dispatch(purchaseItem({ npcId, itemIndex, quantity }));
    
    // Would also dispatch player actions to update inventory and gold
    // dispatch(playerActions.addInventoryItem({ itemId: item.itemId, quantity }));
    // dispatch(playerActions.spendGold(totalCost));
    
    return { success: true };
  }
);

/**
 * Thunk for submitting a completed quest
 */
export const submitQuestThunk = createAsyncThunk(
  'npcs/submitQuest',
  async ({ npcId, questId }, { dispatch, getState }) => {
    const { npcs, player, quests } = getState();
    const quest = quests.activeQuests.find(q => q.id === questId);
    
    if (!quest) throw new Error('Quest not found');
    if (!quest.isComplete) throw new Error('Quest not complete');
    
    // Complete the quest and get rewards
    dispatch(completeQuest({ npcId, questId }));
    
    // Update player data would be in other slices
    // dispatch(playerActions.addExperience(quest.rewards.experience));
    
    return { success: true, rewards: quest.rewards };
  }
);

export const npcSlice = createSlice({
  name: 'npcs',
  initialState: npcsInitialState,
  reducers: {
    /**
     * Start a dialogue interaction with an NPC
     */
    startDialogue: (state, action) => {
      const { npcId, dialogueType = 'greeting' } = action.payload;
      
      if (state.npcs[npcId]) {
        state.playerInteractions.activeDialogue = {
          npcId,
          dialogue: state.npcs[npcId].dialogues[dialogueType] || state.npcs[npcId].dialogues.greeting,
          dialogueType
        };
        state.playerInteractions.lastInteractedNpc = npcId;
        
        // Record interaction in history if it doesn't exist
        if (!state.playerInteractions.interactionHistory[npcId]) {
          state.playerInteractions.interactionHistory[npcId] = {
            firstInteraction: new Date().toISOString(),
            interactionCount: 0
          };
        }
        
        // Increment interaction count
        state.playerInteractions.interactionHistory[npcId].interactionCount += 1;
        state.playerInteractions.interactionHistory[npcId].lastInteraction = new Date().toISOString();
      }
    },
    
    /**
     * End the current dialogue interaction
     */
    endDialogue: (state) => {
      state.playerInteractions.activeDialogue = null;
    },
    
    /**
     * Unlock an NPC, making them available for interaction
     */
    unlockNpc: (state, action) => {
      const { npcId } = action.payload;
      
      if (state.npcs[npcId] && !state.npcs[npcId].unlocked) {
        state.npcs[npcId].unlocked = true;
        
        // Add to discovered NPCs if not already there
        if (!state.playerInteractions.discoveredNpcs.includes(npcId)) {
          state.playerInteractions.discoveredNpcs.push(npcId);
        }
      }
    },
    
    /**
     * Purchase an item from an NPC shop
     */
    purchaseItem: (state, action) => {
      const { npcId, itemIndex, quantity = 1 } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.shop && npc.shop.isOpen) {
        const item = npc.shop.inventory[itemIndex];
        if (item && item.quantity >= quantity) {
          // Reduce item quantity in merchant inventory
          npc.shop.inventory[itemIndex].quantity -= quantity;
          
          // Player gold and inventory would be updated in the player slice
          // This is handled separately via thunks
          
          // Update dialogue to purchase confirmation
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.successfulPurchase,
            dialogueType: 'successfulPurchase'
          };
        }
      }
    },
    
    /**
     * Sell an item to an NPC shop
     */
    sellItem: (state, action) => {
      const { npcId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.shop && npc.shop.isOpen) {
        // Player inventory and gold would be updated in player slice
        // This is handled separately via thunks
        
        // Update dialogue to sale confirmation
        state.playerInteractions.activeDialogue = {
          npcId,
          dialogue: npc.dialogues.successfulSale,
          dialogueType: 'successfulSale'
        };
      }
    },
    
    /**
     * Accept a quest from an NPC
     */
    acceptQuest: (state, action) => {
      const { npcId, questIndex } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.quests && npc.quests[questIndex]) {
        // Mark that the player has accepted this quest
        // Actual quest tracking would be in the quest slice
        state.playerInteractions.activeDialogue = {
          npcId,
          dialogue: npc.dialogues.questOffer,
          dialogueType: 'questOffer'
        };
      }
    },
    
    /**
     * Complete a quest with an NPC
     */
    completeQuest: (state, action) => {
      const { npcId, questId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.quests) {
        const questIndex = npc.quests.findIndex(q => q.questId === questId);
        
        if (questIndex >= 0) {
          // Mark quest as completed
          npc.quests[questIndex].completed = true;
          
          // Trigger completion dialogue
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.questComplete,
            dialogueType: 'questComplete'
          };
          
          // Unlock follow-up quests if they exist
          npc.quests.forEach(q => {
            // Simple example: if questId includes "part1", unlock quests with "part2"
            if (q.questId.includes('part2') && questId.includes('part1')) {
              q.available = true;
            }
          });
          
          // Improve relationship with NPC
          if (npc.relationship) {
            npc.relationship.value = Math.min(100, npc.relationship.value + 10);
            if (npc.relationship.value >= 75 && npc.relationship.level !== 'trusted') {
              npc.relationship.level = 'trusted';
            } else if (npc.relationship.value >= 50 && npc.relationship.level !== 'friendly') {
              npc.relationship.level = 'friendly';
            }
          }
        }
      }
    },
    
    /**
     * Mark a quest reward as claimed
     */
    claimQuestReward: (state, action) => {
      const { npcId, questId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.quests) {
        const questIndex = npc.quests.findIndex(q => q.questId === questId);
        
        if (questIndex >= 0 && npc.quests[questIndex].completed && !npc.quests[questIndex].rewarded) {
          npc.quests[questIndex].rewarded = true;
        }
      }
    },
    
    /**
     * Learn a skill from a trainer NPC
     */
    learnSkill: (state, action) => {
      const { npcId, skillId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.training) {
        const skillIndex = npc.training.availableSkills.findIndex(
          skill => skill.skillId === skillId
        );
        
        if (skillIndex >= 0 && npc.training.availableSkills[skillIndex].requirementsMet) {
          // Training successful dialogue
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.trainingSuccess,
            dialogueType: 'trainingSuccess'
          };
          
          // Skill learning would be handled in player skill slice
        } else {
          // Training failed dialogue
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.trainingFailed,
            dialogueType: 'trainingFailed'
          };
        }
      }
    },
    
    /**
     * Craft an item with the blacksmith
     */
    craftItem: (state, action) => {
      const { npcId, recipeId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.crafting) {
        const recipe = npc.crafting.recipes.find(r => r.recipeId === recipeId);
        
        if (recipe && recipe.unlocked) {
          // Crafting success dialogue
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.craftingSuccess,
            dialogueType: 'craftingSuccess'
          };
          
          // Actual inventory changes would be in player inventory slice
        } else {
          // Insufficient materials dialogue
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.insufficientMaterials,
            dialogueType: 'insufficientMaterials'
          };
        }
      }
    },
    
    /**
     * Change the global time of day, affecting NPC availability
     */
    setDayNightCycle: (state, action) => {
      state.globalState.dayNightCycle = action.payload;
    },
    
    /**
     * Update faction reputation
     */
    updateReputation: (state, action) => {
      const { faction, amount } = action.payload;
      
      if (state.globalState.reputationsByFaction[faction] !== undefined) {
        state.globalState.reputationsByFaction[faction] = Math.max(
          0,
          Math.min(100, state.globalState.reputationsByFaction[faction] + amount)
        );
      }
    },
    
    /**
     * Update relationship with specific NPC
     */
    updateNpcRelationship: (state, action) => {
      const { npcId, amount } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.relationship) {
        // Update numeric value
        npc.relationship.value = Math.max(0, Math.min(100, npc.relationship.value + amount));
        
        // Update relationship level based on value
        if (npc.relationship.value >= 90) {
          npc.relationship.level = 'allied';
        } else if (npc.relationship.value >= 70) {
          npc.relationship.level = 'trusted';
        } else if (npc.relationship.value >= 50) {
          npc.relationship.level = 'friendly';
        } else if (npc.relationship.value >= 30) {
          npc.relationship.level = 'neutral';
        } else if (npc.relationship.value >= 10) {
          npc.relationship.level = 'unfriendly';
        } else {
          npc.relationship.level = 'hostile';
        }
      }
    },
    
    /**
     * Add items to NPC shop inventory
     */
    restockNpcShop: (state, action) => {
      const { npcId, items } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.shop) {
        items.forEach(newItem => {
          const existingItemIndex = npc.shop.inventory.findIndex(
            item => item.itemId === newItem.itemId
          );
          
          if (existingItemIndex >= 0) {
            // Add to existing item quantity
            npc.shop.inventory[existingItemIndex].quantity += newItem.quantity;
          } else {
            // Add new item to inventory
            npc.shop.inventory.push(newItem);
          }
        });
      }
    },
    
    /**
     * Toggle the favorite status of an NPC for easy access
     */
    toggleFavoriteNpc: (state, action) => {
      const { npcId } = action.payload;
      
      if (!state.playerInteractions.favoriteNpcs.includes(npcId)) {
        state.playerInteractions.favoriteNpcs.push(npcId);
      } else {
        state.playerInteractions.favoriteNpcs = state.playerInteractions.favoriteNpcs
          .filter(id => id !== npcId);
      }
    },
    
    /**
     * Set NPC location when they move between areas
     */
    setNpcLocation: (state, action) => {
      const { npcId, location } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc) {
        npc.currentLocation = location;
      }
    },
    
    /**
     * Mark dialogue option as seen by the player
     */
    markDialogueAsSeen: (state, action) => {
      const { npcId, dialogueId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc && npc.dialogue && npc.dialogue[dialogueId]) {
        state.playerInteractions.seenDialogues[npcId] = 
          state.playerInteractions.seenDialogues[npcId] || [];
          
        if (!state.playerInteractions.seenDialogues[npcId].includes(dialogueId)) {
          state.playerInteractions.seenDialogues[npcId].push(dialogueId);
        }
      }
    },
    
    /**
     * Add a story flag related to an NPC interaction
     */
    addNpcStoryFlag: (state, action) => {
      const { flag, npcId } = action.payload;
      
      if (!state.globalState.storyFlags.includes(flag)) {
        state.globalState.storyFlags.push(flag);
      }
      
      // Add to NPC-specific flags if npcId is provided
      if (npcId) {
        state.playerInteractions.npcFlags[npcId] = 
          state.playerInteractions.npcFlags[npcId] || [];
          
        if (!state.playerInteractions.npcFlags[npcId].includes(flag)) {
          state.playerInteractions.npcFlags[npcId].push(flag);
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Handle async thunk actions if needed
    builder
      .addCase(purchaseItemThunk.fulfilled, (state, action) => {
        // Any additional state updates after successful purchase
      })
      .addCase(submitQuestThunk.fulfilled, (state, action) => {
        // Any additional state updates after successful quest submission
      });
  }
});

// Export actions
export const {
  startDialogue,
  endDialogue,
  unlockNpc,
  purchaseItem,
  sellItem,
  acceptQuest,
  completeQuest,
  claimQuestReward,
  learnSkill,
  craftItem,
  setDayNightCycle,
  updateReputation,
  updateNpcRelationship,
  restockNpcShop,
  toggleFavoriteNpc,
  setNpcLocation,
  markDialogueAsSeen,
  addNpcStoryFlag
} = npcSlice.actions;

// Basic selectors
export const selectAllNpcs = (state) => state.npcs.npcs;
export const selectUnlockedNpcs = (state) => {
  const npcs = state.npcs.npcs;
  return Object.keys(npcs)
    .filter(npcId => npcs[npcId].unlocked)
    .reduce((acc, npcId) => {
      acc[npcId] = npcs[npcId];
      return acc;
    }, {});
};
export const selectNpcById = (state, npcId) => state.npcs.npcs[npcId];
export const selectActiveDialogue = (state) => state.npcs.playerInteractions.activeDialogue;
export const selectDiscoveredNpcs = (state) => state.npcs.playerInteractions.discoveredNpcs;
export const selectFactionReputation = (state, factionId) => 
  state.npcs.globalState.reputationsByFaction[factionId];

// Advanced selectors
/**
 * Select NPCs by location
 * @param {Object} state - Redux state
 * @param {string} location - Location identifier
 * @returns {Array<NPC>} NPCs at the specified location
 */
export const selectNpcsByLocation = (state, location) => {
  const npcs = state.npcs.npcs;
  return Object.values(npcs).filter(
    npc => npc.unlocked && npc.currentLocation === location
  );
};

/**
 * Select NPCs by faction
 * @param {Object} state - Redux state
 * @param {string} faction - Faction identifier
 * @returns {Array<NPC>} NPCs belonging to the specified faction
 */
export const selectNpcsByFaction = (state, faction) => {
  const npcs = state.npcs.npcs;
  return Object.values(npcs).filter(
    npc => npc.unlocked && npc.faction === faction
  );
};

/**
 * Select NPCs that have available quests
 * @param {Object} state - Redux state
 * @returns {Array<NPC>} NPCs with available quests
 */
export const selectNpcsWithAvailableQuests = (state) => {
  const npcs = state.npcs.npcs;
  return Object.values(npcs).filter(npc => 
    npc.unlocked && 
    npc.quests && 
    npc.quests.some(quest => quest.available && !quest.completed)
  );
};

/**
 * Select NPCs that are available at the current time of day
 * @param {Object} state - Redux state
 * @returns {Array<NPC>} NPCs available at current time
 */
export const selectAvailableNpcsAtCurrentTime = (state) => {
  const { dayNightCycle } = state.npcs.globalState;
  const npcs = state.npcs.npcs;
  
  return Object.values(npcs).filter(npc => 
    npc.unlocked && 
    (!npc.availableTimeOfDay || npc.availableTimeOfDay.includes(dayNightCycle))
  );
};

/**
 * Select NPCs that the player has marked as favorites
 * @param {Object} state - Redux state
 * @returns {Array<NPC>} Favorite NPCs
 */
export const selectFavoriteNpcs = (state) => {
  const favoriteIds = state.npcs.playerInteractions.favoriteNpcs;
  const npcs = state.npcs.npcs;
  
  return favoriteIds
    .filter(id => npcs[id] && npcs[id].unlocked)
    .map(id => npcs[id]);
};

/**
 * Check if player has a story flag set with an NPC
 */
export const selectHasNpcStoryFlag = (state, npcId, flag) => {
  const flags = state.npcs.playerInteractions.npcFlags[npcId] || [];
  return flags.includes(flag);
};

export default npcSlice.reducer;
