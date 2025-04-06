/**
 * Redux Thunks for NPCs-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addNotification } from '../../Notifications/state/NotificationsSlice';
import {
  PurchaseItemPayload,
  SellItemPayload,
  CompleteQuestPayload,
  UpdateRelationshipPayload,
  UpdateFactionReputationPayload,
  PurchaseResponse,
  SellResponse,
  QuestCompletionResponse,
  StartDialoguePayload
} from './NPCsTypes';
import { startDialogue } from './NPCsSlice';

/**
 * Purchase an item from an NPC
 */
export const purchaseItem = createAsyncThunk<
  PurchaseResponse,
  PurchaseItemPayload,
  { state: RootState }
>(
  'npcs/purchaseItem',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { npcId, itemIndex, quantity = 1 } = payload;
    const state = getState();
    const npc = state.npcs.npcs[npcId];
    
    if (!npc) {
      return rejectWithValue({ error: 'NPC not found' });
    }
    
    const item = npc.shop?.inventory[itemIndex];
    
    if (!item) {
      return rejectWithValue({ error: 'Item not found' });
    }
    
    if (!npc.shop?.isOpen) {
      dispatch(startDialogue({ 
        npcId, 
        dialogueType: 'shopClosed' 
      }));
      return rejectWithValue({ error: 'Shop is closed' });
    }
    
    if (item.quantity < quantity) {
      dispatch(startDialogue({ 
        npcId, 
        dialogueType: 'outOfStock' 
      }));
      return rejectWithValue({ error: 'Not enough stock' });
    }
    
    const totalCost = item.price * quantity;
    
    if (state.player.gold < totalCost) {
      dispatch(startDialogue({ 
        npcId, 
        dialogueType: 'lowGold' 
      }));
      return rejectWithValue({ error: 'Not enough gold' });
    }
    
    // Deduct gold
    dispatch({
      type: 'player/removeGold',
      payload: totalCost
    });
    
    // Add item to inventory
    dispatch({
      type: 'inventory/addItem',
      payload: {
        itemId: item.itemId,
        quantity
      }
    });
    
    // Show notification
    dispatch(addNotification(
      `Purchased ${quantity}x ${item.itemId} for ${totalCost} gold`,
      'success',
      {
        duration: 3000,
        category: 'purchase'
      }
    ));
    
    return {
      success: true,
      item: {
        id: item.itemId,
        name: item.itemId, // We'd usually fetch the real name from an items DB
        quantity
      },
      cost: totalCost
    };
  }
);

/**
 * Sell an item to an NPC
 */
export const sellItem = createAsyncThunk<
  SellResponse,
  SellItemPayload,
  { state: RootState }
>(
  'npcs/sellItem',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { npcId, itemId, quantity } = payload;
    const state = getState();
    const npc = state.npcs.npcs[npcId];
    
    if (!npc) {
      return rejectWithValue({ error: 'NPC not found' });
    }
    
    if (!npc.shop?.isOpen) {
      dispatch(startDialogue({ 
        npcId, 
        dialogueType: 'shopClosed' 
      }));
      return rejectWithValue({ error: 'Shop is closed' });
    }
    
    // Check if player has the item in their inventory
    const itemInInventory = state.inventory.items.find(item => item.id === itemId);
    
    if (!itemInInventory) {
      return rejectWithValue({ error: 'Item not found in inventory' });
    }
    
    if (itemInInventory.quantity < quantity) {
      return rejectWithValue({ error: 'Not enough items to sell' });
    }
    
    // Calculate sell price
    const basePrice = itemInInventory.value || 0;
    const buyRate = npc.shop.buyRate || 0.5; // Default 50% of value
    const totalValue = Math.floor(basePrice * buyRate * quantity);
    
    // Remove item from inventory
    dispatch({
      type: 'inventory/removeItem',
      payload: {
        itemId,
        quantity
      }
    });
    
    // Add gold to player
    dispatch({
      type: 'player/addGold',
      payload: totalValue
    });
    
    // Show notification
    dispatch(addNotification(
      `Sold ${quantity}x ${itemInInventory.name} for ${totalValue} gold`,
      'success',
      {
        duration: 3000,
        category: 'sale'
      }
    ));
    
    return {
      success: true,
      goldReceived: totalValue
    };
  }
);

/**
 * Complete a quest with an NPC
 */
export const completeQuest = createAsyncThunk<
  QuestCompletionResponse,
  CompleteQuestPayload,
  { state: RootState }
>(
  'npcs/completeQuest',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { npcId, questId } = payload;
    const state = getState();
    const npc = state.npcs.npcs[npcId];
    
    if (!npc) {
      return rejectWithValue({ error: 'NPC not found' });
    }
    
    // Check if the NPC has this quest
    const quest = npc.quests?.find(q => q.questId === questId);
    
    if (!quest) {
      return rejectWithValue({ error: 'Quest not found' });
    }
    
    if (!quest.available) {
      return rejectWithValue({ error: 'Quest not available' });
    }
    
    if (quest.completed) {
      return rejectWithValue({ error: 'Quest already completed' });
    }
    
    // Check if the quest is actually complete in the quest system
    const playerQuest = state.quests.activeQuests.find(q => q.id === questId);
    
    if (!playerQuest || !playerQuest.isComplete) {
      return rejectWithValue({ error: 'Quest objectives not completed' });
    }
    
    // Process quest rewards
    const rewards = playerQuest.rewards || {};
    
    // Gold reward
    if (rewards.gold) {
      dispatch({
        type: 'player/addGold',
        payload: rewards.gold
      });
    }
    
    // XP reward
    if (rewards.experience) {
      dispatch({
        type: 'player/addExperience',
        payload: rewards.experience
      });
    }
    
    // Item rewards
    if (rewards.items) {
      rewards.items.forEach((item: any) => {
        dispatch({
          type: 'inventory/addItem',
          payload: {
            itemId: item.id,
            quantity: item.quantity || 1
          }
        });
      });
    }
    
    // Mark quest as completed in quest system
    dispatch({
      type: 'quests/completeQuest',
      payload: { questId }
    });
    
    // Show notification
    dispatch(addNotification(
      `Completed quest: ${quest.title}`,
      'success',
      {
        duration: 5000,
        category: 'quest'
      }
    ));
    
    return {
      success: true,
      rewards
    };
  }
);

/**
 * Update relationship with an NPC
 */
export const updateRelationship = createAsyncThunk<
  { npcId: string; newValue: number },
  UpdateRelationshipPayload,
  { state: RootState }
>(
  'npcs/updateRelationship',
  async (payload, { getState, dispatch }) => {
    const { npcId, amount, notifyPlayer = false, source = 'interaction' } = payload;
    const state = getState();
    const npc = state.npcs.npcs[npcId];
    
    if (!npc) {
      throw new Error(`NPC with ID ${npcId} not found`);
    }
    
    // Calculate new relationship value
    const currentValue = npc.relationship.value;
    const newValue = Math.min(100, Math.max(-100, currentValue + amount));
    
    // Show notification if requested
    if (notifyPlayer) {
      const message = amount > 0
        ? `Your relationship with ${npc.name} has improved (+${amount})`
        : `Your relationship with ${npc.name} has worsened (${amount})`;
      
      dispatch(addNotification(
        message,
        amount > 0 ? 'success' : 'warning',
        {
          duration: 5000,
          category: 'relationship'
        }
      ));
    }
    
    return { npcId, newValue };
  }
);

/**
 * Update reputation with a faction
 */
export const updateFactionReputation = createAsyncThunk<
  { faction: string; newValue: number },
  UpdateFactionReputationPayload,
  { state: RootState }
>(
  'npcs/updateFactionReputation',
  async (payload, { getState, dispatch }) => {
    const { faction, amount } = payload;
    const state = getState();
    
    // Calculate new faction reputation
    const currentValue = state.npcs.globalState.reputationsByFaction[faction] || 0;
    const newValue = Math.min(100, Math.max(-100, currentValue + amount));
    
    // Show notification
    const message = amount > 0
      ? `Your reputation with ${faction} has improved (+${amount})`
      : `Your reputation with ${faction} has decreased (${amount})`;
    
    dispatch(addNotification(
      message,
      amount > 0 ? 'success' : 'warning',
      {
        duration: 5000,
        category: 'faction'
      }
    ));
    
    return { faction, newValue };
  }
);

/**
 * Decay relationships over time
 */
export const decayRelationships = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'npcs/decayRelationships',
  async (_, { getState, dispatch }) => {
    const state = getState();
    
    // Skip decay if feature is disabled in settings
    if (state.settings?.gameplay?.relationshipDecayDisabled) {
      return;
    }
    
    // Decay all positive relationships above neutral
    Object.keys(state.npcs.npcs).forEach(npcId => {
      const npc = state.npcs.npcs[npcId];
      
      if (npc.relationship.value > 50) {
        dispatch(updateRelationship({
          npcId,
          amount: -1,
          notifyPlayer: false,
          source: 'decay'
        }));
      }
    });
  }
);

/**
 * Start a dialogue with NPC
 */
export const startDialogueWithNPC = createAsyncThunk<
  void,
  StartDialoguePayload,
  { state: RootState }
>(
  'npcs/startDialogueWithNPC',
  async (payload, { getState, dispatch }) => {
    const { npcId, dialogueType = 'greeting' } = payload;
    const state = getState();
    const npc = state.npcs.npcs[npcId];
    
    if (!npc) {
      throw new Error(`NPC with ID ${npcId} not found`);
    }
    
    // Check if this is the first time meeting this NPC
    const hasMetBefore = state.npcs.playerInteractions.discoveredNpcs.includes(npcId);
    
    if (!hasMetBefore) {
      // Mark NPC as discovered
      dispatch({
        type: 'npcs/discoverNpc',
        payload: { npcId }
      });
      
      // Show notification
      dispatch(addNotification(
        `You've met ${npc.name} for the first time!`,
        'info',
        {
          duration: 5000,
          category: 'discovery'
        }
      ));
      
      // Use first meeting dialogue if available
      if (npc.dialogue && npc.dialogue.firstMeeting) {
        dispatch(startDialogue({
          npcId,
          dialogueType: 'firstMeeting'
        }));
        return;
      }
    }
    
    // Use the requested dialogue type
    dispatch(startDialogue({
      npcId,
      dialogueType
    }));
  }
);
