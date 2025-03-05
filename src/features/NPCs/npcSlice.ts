/**
 * @file npcSlice.ts
 * @description Redux slice for managing NPC state in the game
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import npcsInitialState, { NPCState, NPC } from './npcsInitialState';

// Types for action payloads
type DialogueParams = { npcId: string; dialogueType?: string };
type NpcIdParam = { npcId: string };
type QuestParams = { npcId: string; questId: string };
type PurchaseParams = { npcId: string; itemIndex: number; quantity?: number };
type ReputationParams = { faction: string; amount: number };
type RelationshipParams = { npcId: string; amount: number };
type LocationParams = { npcId: string; location: string };
type RestockParams = { npcId: string; items: Array<{ itemId: string; quantity: number; price: number }> };

// Root state type for thunks
interface RootState {
  npcs: NPCState;
  player: { gold: number; [key: string]: any };
  quests: { activeQuests: Array<{ id: string; isComplete: boolean; rewards: any }>; [key: string]: any };
  [key: string]: any;
}

/**
 * Thunk for purchasing items from an NPC
 */
export const purchaseItemThunk = createAsyncThunk<
  { success: boolean },
  PurchaseParams,
  { state: RootState }
>(
  'npcs/purchaseItem',
  async ({ npcId, itemIndex, quantity }, { dispatch, getState }) => {
    const { npcs, player } = getState();
    const npc = npcs.npcs[npcId];
    const item = npc?.shop?.inventory[itemIndex];
    
    if (!item) throw new Error('Item not found');
    
    const totalCost = item.price * (quantity || 1);
    
    if (player.gold < totalCost) {
      dispatch(startDialogue({ npcId, dialogueType: 'lowGold' }));
      throw new Error('Insufficient funds');
    }
    
    dispatch(purchaseItem({ npcId, itemIndex, quantity }));
    return { success: true };
  }
);

/**
 * Thunk for submitting a completed quest
 */
export const submitQuestThunk = createAsyncThunk<
  { success: boolean; rewards: any },
  QuestParams,
  { state: RootState }
>(
  'npcs/submitQuest',
  async ({ npcId, questId }, { dispatch, getState }) => {
    const { quests } = getState();
    const quest = quests.activeQuests.find(q => q.id === questId);
    
    if (!quest || !quest.isComplete) 
      throw new Error(quest ? 'Quest not complete' : 'Quest not found');
    
    dispatch(completeQuest({ npcId, questId }));
    return { success: true, rewards: quest.rewards };
  }
);

export const npcSlice = createSlice({
  name: 'npcs',
  initialState: npcsInitialState,
  reducers: {
    // Dialog interactions
    startDialogue: (state, action: PayloadAction<DialogueParams>) => {
      const { npcId, dialogueType = 'greeting' } = action.payload;
      
      if (state.npcs[npcId]) {
        state.playerInteractions.activeDialogue = {
          npcId,
          dialogue: state.npcs[npcId].dialogues[dialogueType] || state.npcs[npcId].dialogues.greeting,
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
      }
    },
    
    endDialogue: (state) => {
      state.playerInteractions.activeDialogue = null;
    },
    
    // NPC availability
    unlockNpc: (state, action: PayloadAction<NpcIdParam>) => {
      const { npcId } = action.payload;
      
      if (state.npcs[npcId] && !state.npcs[npcId].unlocked) {
        state.npcs[npcId].unlocked = true;
        
        if (!state.playerInteractions.discoveredNpcs.includes(npcId)) {
          state.playerInteractions.discoveredNpcs.push(npcId);
        }
      }
    },
    
    // Trading
    purchaseItem: (state, action: PayloadAction<PurchaseParams>) => {
      const { npcId, itemIndex, quantity = 1 } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc?.shop?.isOpen) {
        const item = npc.shop.inventory[itemIndex];
        if (item && item.quantity >= quantity) {
          npc.shop.inventory[itemIndex].quantity -= quantity;
          
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.successfulPurchase,
            dialogueType: 'successfulPurchase'
          };
        }
      }
    },
    
    sellItem: (state, action: PayloadAction<NpcIdParam>) => {
      const npc = state.npcs[action.payload.npcId];
      
      if (npc?.shop?.isOpen) {
        state.playerInteractions.activeDialogue = {
          npcId: action.payload.npcId,
          dialogue: npc.dialogues.successfulSale,
          dialogueType: 'successfulSale'
        };
      }
    },
    
    // Quests
    completeQuest: (state, action: PayloadAction<QuestParams>) => {
      const { npcId, questId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc?.quests) {
        const questIndex = npc.quests.findIndex(q => q.questId === questId);
        
        if (questIndex >= 0) {
          npc.quests[questIndex].completed = true;
          
          // Update dialogue
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.questComplete,
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
    },
    
    claimQuestReward: (state, action: PayloadAction<QuestParams>) => {
      const { npcId, questId } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc?.quests) {
        const questIndex = npc.quests.findIndex(q => q.questId === questId);
        
        if (questIndex >= 0 && npc.quests[questIndex].completed && !npc.quests[questIndex].rewarded) {
          npc.quests[questIndex].rewarded = true;
        }
      }
    },
    
    // Reputation and relationships
    updateReputation: (state, action: PayloadAction<ReputationParams>) => {
      const { faction, amount } = action.payload;
      
      if (state.globalState.reputationsByFaction[faction] !== undefined) {
        state.globalState.reputationsByFaction[faction] = Math.max(
          0,
          Math.min(100, state.globalState.reputationsByFaction[faction] + amount)
        );
      }
    },
    
    updateNpcRelationship: (state, action: PayloadAction<RelationshipParams>) => {
      const { npcId, amount } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc?.relationship) {
        // Update numeric value
        npc.relationship.value = Math.max(0, Math.min(100, npc.relationship.value + amount));
        
        // Update relationship level based on value
        if (npc.relationship.value >= 90) npc.relationship.level = 'allied';
        else if (npc.relationship.value >= 70) npc.relationship.level = 'trusted';
        else if (npc.relationship.value >= 50) npc.relationship.level = 'friendly';
        else if (npc.relationship.value >= 30) npc.relationship.level = 'neutral';
        else if (npc.relationship.value >= 10) npc.relationship.level = 'unfriendly';
        else npc.relationship.level = 'hostile';
      }
    },
    
    // Misc utility actions
    setDayNightCycle: (state, action: PayloadAction<'day' | 'night' | 'dawn' | 'dusk'>) => {
      state.globalState.dayNightCycle = action.payload;
    },
    
    restockNpcShop: (state, action: PayloadAction<RestockParams>) => {
      const { npcId, items } = action.payload;
      const npc = state.npcs[npcId];
      
      if (npc?.shop) {
        items.forEach(newItem => {
          const existingItemIndex = npc.shop.inventory.findIndex(i => i.itemId === newItem.itemId);
          
          if (existingItemIndex >= 0) {
            npc.shop.inventory[existingItemIndex].quantity += newItem.quantity;
          } else {
            npc.shop.inventory.push(newItem);
          }
        });
      }
    },
    
    setNpcLocation: (state, action: PayloadAction<LocationParams>) => {
      const { npcId, location } = action.payload;
      
      if (state.npcs[npcId]) {
        state.npcs[npcId].location = location;
      }
    }
  }
});

// Export actions
export const {
  startDialogue,
  endDialogue,
  unlockNpc,
  purchaseItem,
  sellItem,
  completeQuest,
  claimQuestReward,
  updateReputation,
  updateNpcRelationship,
  setDayNightCycle,
  restockNpcShop,
  setNpcLocation
} = npcSlice.actions;

// Export basic selectors
export const selectAllNpcs = (state: { npcs: NPCState }) => state.npcs.npcs;
export const selectNpcById = (state: { npcs: NPCState }, npcId: string) => state.npcs.npcs[npcId];
export const selectActiveDialogue = (state: { npcs: NPCState }) => state.npcs.playerInteractions.activeDialogue;
export const selectFactionReputation = (state: { npcs: NPCState }, factionId: string) => 
  state.npcs.globalState.reputationsByFaction[factionId];

export default npcSlice.reducer;
