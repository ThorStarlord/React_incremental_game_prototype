/**
 * @file npcSlice.ts
 * @description Custom slice for managing NPC state in the game
 */

import npcsInitialState, { NPCState, NPC } from '../../context/initialStates/NPCsInitialState';
import { createSlice, Action } from '../../context/utils/reducerUtils';

// Types for action payloads
interface DialogueParams { npcId: string; dialogueType?: string; }
interface NpcIdParam { npcId: string; }
interface QuestParams { npcId: string; questId: string; }
interface PurchaseParams { npcId: string; itemIndex: number; quantity?: number; }
interface ReputationParams { faction: string; amount: number; }
interface RelationshipParams { npcId: string; amount: number; }
interface LocationParams { npcId: string; location: string; }
interface RestockParams { 
  npcId: string; 
  items: Array<{ itemId: string; quantity: number; price: number }>; 
}

// Action type for typechecking
interface PayloadAction<T> {
  payload: T;
}

// Thunk action types
interface ThunkApi {
  dispatch: (action: any) => void;
  getState: () => RootState;
}

// Root state type for thunks
interface RootState {
  npcs: NPCState;
  player: { gold: number; [key: string]: any };
  quests: { activeQuests: Array<{ id: string; isComplete: boolean; rewards: any }>; [key: string]: any };
  [key: string]: any;
}

/**
 * Function to create async thunk equivalent without Redux Toolkit
 */
function createAsyncThunk<Result, Arg>(
  typePrefix: string,
  payloadCreator: (arg: Arg, api: ThunkApi) => Promise<Result>
) {
  // Return a function that accepts the argument and returns a thunk
  return function(arg: Arg) {
    return async function thunk(dispatch: any, getState: () => RootState) {
      try {
        // Start action
        dispatch({ type: `${typePrefix}/pending` });
        
        // Execute payload creator
        const result = await payloadCreator(arg, { dispatch, getState });
        
        // Success action
        dispatch({ 
          type: `${typePrefix}/fulfilled`, 
          payload: result 
        });
        
        return result;
      } catch (error) {
        // Error action
        dispatch({ 
          type: `${typePrefix}/rejected`, 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        throw error;
      }
    };
  };
}

/**
 * Thunk for purchasing items from an NPC
 */
export const purchaseItemThunk = createAsyncThunk<
  { success: boolean },
  PurchaseParams
>(
  'npcs/purchaseItem',
  async (params: PurchaseParams, { dispatch, getState }) => {
    const { npcId, itemIndex, quantity } = params;
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
  QuestParams
>(
  'npcs/submitQuest',
  async (params: QuestParams, { dispatch, getState }) => {
    const { npcId, questId } = params;
    const { quests } = getState();
    const quest = quests.activeQuests.find((q: { id: string }) => q.id === questId);
    
    if (!quest || !quest.isComplete) 
      throw new Error(quest ? 'Quest not complete' : 'Quest not found');
    
    dispatch(completeQuest({ npcId, questId }));
    return { success: true, rewards: {} };
  }
);

// Creating a type-safe slice without Redux toolkit
const slice = createSlice({
  name: 'npcs',
  InitialState: npcsInitialState,
  reducers: {
    // Dialog interactions
    startDialogue: (state: NPCState, action: Action) => {
      if (!action.payload) return state;
      const { npcId, dialogueType = 'greeting' } = action.payload as DialogueParams;
      
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
      
      return state;
    },
    
    endDialogue: (state: NPCState) => {
      state.playerInteractions.activeDialogue = null;
      return state;
    },
    
    // NPC availability
    unlockNpc: (state: NPCState, action: Action) => {
      if (!action.payload) return state;
      const { npcId } = action.payload as NpcIdParam;
      
      if (state.npcs[npcId] && !state.npcs[npcId].unlocked) {
        state.npcs[npcId].unlocked = true;
        
        if (!state.playerInteractions.discoveredNpcs.includes(npcId)) {
          state.playerInteractions.discoveredNpcs.push(npcId);
        }
      }
      
      return state;
    },
    
    // Trading
    purchaseItem: (state: NPCState, action: Action) => {
      if (!action.payload) return state;
      const { npcId, itemIndex, quantity = 1 } = action.payload as PurchaseParams;
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
      
      return state;
    },
    
    sellItem: (state: NPCState, action: Action) => {
      if (!action.payload) return state;
      const npc = state.npcs[(action.payload as NpcIdParam).npcId];
      
      if (npc?.shop?.isOpen) {
        state.playerInteractions.activeDialogue = {
          npcId: action.payload.npcId,
          dialogue: npc.dialogues.successfulSale,
          dialogueType: 'successfulSale'
        };
      }
      
      return state;
    },
    
    // Quests
    completeQuest: (state: NPCState, action: Action) => {
      if (!action.payload) return state;
      const { npcId, questId } = action.payload as QuestParams;
      const npc = state.npcs[npcId];
      
      if (npc?.quests) {
        const questIndex = npc.quests.findIndex((q: { questId: string }) => q.questId === questId);
        
        if (questIndex >= 0) {
          npc.quests[questIndex].completed = true;
          
          // Update dialogue
          state.playerInteractions.activeDialogue = {
            npcId,
            dialogue: npc.dialogues.questComplete,
            dialogueType: 'questComplete'
          };
          
          // Unlock follow-up quests
          npc.quests.forEach((q: { questId: string; available: boolean }) => {
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
      
      return state;
    },
    
    // ...existing code for other reducers...
  }
});

// Export actions
export const {
  startDialogue,
  endDialogue,
  unlockNpc,
  purchaseItem,
  sellItem,
  completeQuest
} = slice.actions;

// Export basic selectors
export const selectAllNpcs = (state: { npcs: NPCState }) => state.npcs.npcs;
export const selectNpcById = (state: { npcs: NPCState }, npcId: string) => state.npcs.npcs[npcId];
export const selectActiveDialogue = (state: { npcs: NPCState }) => state.npcs.playerInteractions.activeDialogue;
export const selectFactionReputation = (state: { npcs: NPCState }, factionId: string) => 
  state.npcs.globalState.reputationsByFaction[factionId];

export default slice.reducer;
