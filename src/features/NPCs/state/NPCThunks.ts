import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, RelationshipChangeEntry, DialogueEntry, InteractionResult } from './NpcTypes';

/**
 * Initialize NPCs with mock or loaded data
 */
export const initializeNPCsThunk = createAsyncThunk<
  Record<string, NPC>,
  Record<string, NPC> | undefined,
  { state: RootState }
>(
  'npcs/initialize',
  async (npcData, { rejectWithValue }) => {
    try {
      // If no data provided, load mock data
      if (!npcData) {
        const { mockNPCData } = await import('../data/mockNPCData');
        return mockNPCData;
      }
      return npcData;
    } catch (error) {
      return rejectWithValue('Failed to initialize NPCs');
    }
  }
);

/**
 * Update NPC relationship and handle side effects
 */
export const updateNPCRelationshipThunk = createAsyncThunk<
  { npcId: string; relationshipChange: number; newValue: number },
  { npcId: string; relationshipChange: number; reason?: string },
  { state: RootState }
>(
  'npcs/updateRelationship',
  async ({ npcId, relationshipChange, reason }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue(`NPC with ID ${npcId} not found`);
      }

      const newValue = Math.max(0, Math.min(100, npc.relationshipValue + relationshipChange));
      
      return {
        npcId,
        relationshipChange,
        newValue
      };
    } catch (error) {
      return rejectWithValue('Failed to update NPC relationship');
    }
  }
);

/**
 * Process NPC interaction with complex relationship effects
 */
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
      
      if (!npc) {
        return rejectWithValue(`NPC with ID ${npcId} not found`);
      }

      // Process different interaction types
      let relationshipChange = 0;
      let essenceGained = 0;
      let unlockRewards: string[] = [];

      switch (interactionType) {
        case 'dialogue':
          relationshipChange = Math.random() * 2 + 1; // 1-3 points
          break;
        case 'gift':
          relationshipChange = options.giftValue ? options.giftValue * 0.1 : 5;
          break;
        case 'quest_completion':
          relationshipChange = 10;
          essenceGained = 50;
          break;
        case 'trade':
          relationshipChange = 1;
          break;
        default:
          relationshipChange = 1;
      }

      // Apply relationship change
      if (relationshipChange > 0) {
        await dispatch(updateNPCRelationshipThunk({
          npcId,
          relationshipChange,
          reason: interactionType
        }));
      }

      // Check for unlocks based on new relationship level
      const newRelationship = Math.min(100, npc.relationshipValue + relationshipChange);
      if (newRelationship >= 25 && npc.relationshipValue < 25) {
        unlockRewards.push('dialogue_tier_2');
      }
      if (newRelationship >= 50 && npc.relationshipValue < 50) {
        unlockRewards.push('trade_access', 'trait_sharing');
      }
      if (newRelationship >= 75 && npc.relationshipValue < 75) {
        unlockRewards.push('quest_access', 'advanced_dialogue');
      }

      return {
        success: true,
        relationshipChange,
        essenceGained,
        unlockRewards,
        message: `Successfully interacted with ${npc.name}`
      };
    } catch (error) {
      return rejectWithValue('Failed to process NPC interaction');
    }
  }
);

/**
 * Discover new NPC and add to discovered list
 */
export const discoverNPCThunk = createAsyncThunk<
  string,
  string,
  { state: RootState }
>(
  'npcs/discover',
  async (npcId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue(`NPC with ID ${npcId} not found`);
      }

      if (state.npcs.discoveredNPCs.includes(npcId)) {
        return rejectWithValue(`NPC ${npcId} is already discovered`);
      }

      return npcId;
    } catch (error) {
      return rejectWithValue('Failed to discover NPC');
    }
  }
);

/**
 * Start interaction session with NPC
 */
export const startNPCInteractionThunk = createAsyncThunk<
  { npcId: string; timestamp: number },
  string,
  { state: RootState }
>(
  'npcs/startInteraction',
  async (npcId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue(`NPC with ID ${npcId} not found`);
      }

      if (!npc.isAvailable) {
        return rejectWithValue(`NPC ${npc.name} is not available for interaction`);
      }

      return {
        npcId,
        timestamp: Date.now()
      };
    } catch (error) {
      return rejectWithValue('Failed to start NPC interaction');
    }
  }
);

/**
 * End current interaction session
 */
export const endNPCInteractionThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'npcs/endInteraction',
  async (_, { getState }) => {
    // Update last interaction timestamp for the current NPC
    const state = getState();
    if (state.npcs.currentInteraction) {
      // This would typically update the NPC's lastInteraction field
      // Implementation depends on specific requirements
    }
  }
);

/**
 * Process dialogue choice with NPC
 */
export const processDialogueChoiceThunk = createAsyncThunk<
  { responseText: string; relationshipChange: number },
  { npcId: string; choiceId: string },
  { state: RootState }
>(
  'npcs/processDialogueChoice',
  async ({ npcId, choiceId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue(`NPC with ID ${npcId} not found`);
      }

      // Mock dialogue processing - in real implementation this would
      // reference dialogue trees and choice consequences
      const responses = [
        "That's an interesting perspective.",
        "I appreciate your honesty.",
        "Thank you for sharing that with me.",
        "I understand how you feel."
      ];

      const responseText = responses[Math.floor(Math.random() * responses.length)];
      const relationshipChange = Math.random() * 3 + 1; // 1-4 points

      // Update relationship
      await dispatch(updateNPCRelationshipThunk({
        npcId,
        relationshipChange,
        reason: 'dialogue_choice'
      }));

      return {
        responseText,
        relationshipChange
      };
    } catch (error) {
      return rejectWithValue('Failed to process dialogue choice');
    }
  }
);

/**
 * Share trait with NPC
 */
export const shareTraitWithNPCThunk = createAsyncThunk<
  { success: boolean; message: string },
  { npcId: string; traitId: string; slotIndex: number },
  { state: RootState }
>(
  'npcs/shareTrait',
  async ({ npcId, traitId, slotIndex }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue(`NPC with ID ${npcId} not found`);
      }

      // Check if player has sufficient relationship level
      if (npc.relationshipValue < 50) {
        return rejectWithValue('Insufficient relationship level for trait sharing');
      }

      // Check if player has the trait
      const playerTraits = state.traits?.acquiredTraits || [];
      if (!playerTraits.includes(traitId)) {
        return rejectWithValue('Player does not have this trait');
      }

      return {
        success: true,
        message: `Successfully shared trait with ${npc.name}`
      };
    } catch (error) {
      return rejectWithValue('Failed to share trait with NPC');
    }
  }
);