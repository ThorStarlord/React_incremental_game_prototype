import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { setNPCs, setLoading, setError, updateNpcConnectionDepth, addDialogueEntry, completeDialogueTopic } from './NPCSlice'; // Added completeDialogueTopic
import type { NPC, RelationshipChangeEntry, DialogueEntry, InteractionResult, DialogueResult, ProcessDialoguePayload } from './NPCTypes';
import { getRelationshipTier, RELATIONSHIP_THRESHOLDS } from './NPCTypes';
import { mockDialogues } from '../data/mockNPCData';

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
        const mockNPCModule = await import('../data/mockNPCData');
        // Use the correct export name 'mockNPCs' from mockNPCData.ts
        const mockData = mockNPCModule.mockNPCs;
        
        if (!mockData) {
          throw new Error('Mock NPC data not found');
        }
        
        return mockData;
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
  { npcId: string; interactionType: string; options?: Record<string, any> }, // Ensure InteractionType is imported or defined
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
      let connectionDepthChange = 0; // New: Track connection depth changes
      let essenceGained = 0;
      let unlockRewards: string[] = [];

      switch (interactionType) {
        case 'dialogue':
          relationshipChange = Math.random() * 2 + 1; // 1-3 points
          connectionDepthChange = Math.random() * 0.5 + 0.1; // Small connection depth gain
          break;
        case 'gift':
          relationshipChange = options.giftValue ? options.giftValue * 0.1 : 5;
          connectionDepthChange = options.giftValue ? options.giftValue * 0.05 : 0.5;
          break;
        case 'quest_completion':
          relationshipChange = 10;
          essenceGained = 50;
          connectionDepthChange = 1; // Significant connection depth gain
          break;
        case 'trade':
          relationshipChange = 1;
          connectionDepthChange = 0.1;
          break;
        case 'trait_sharing':
          relationshipChange = 2;
          connectionDepthChange = 0.8; // Good connection depth gain
          break;
        default:
          relationshipChange = 1;
          connectionDepthChange = 0.1;
      }

      // Apply relationship change
      if (relationshipChange > 0) {
        await dispatch(updateNPCRelationshipThunk({
          npcId,
          relationshipChange,
          reason: interactionType
        }));
      }

      // Apply connection depth change
      if (connectionDepthChange > 0) {
        dispatch(updateNpcConnectionDepth({
          npcId,
          change: connectionDepthChange
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
        affinityDelta: relationshipChange, // Renamed
        connectionDepthChange,
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
  DialogueResult,
  ProcessDialoguePayload, // Use ProcessDialoguePayload for args
  { state: RootState }
>(
  'npcs/processDialogueChoice',
  async ({ npcId, choiceId, playerText }, { getState, dispatch, rejectWithValue }) => { // Added playerText
    try {
      const state = getState();
      const npc = state.npcs.npcs[npcId];
      
      if (!npc) {
        return rejectWithValue(`NPC with ID ${npcId} not found`);
      }

      // Get dialogue data based on choiceId
      const dialogueData = mockDialogues[choiceId];
      if (!dialogueData) {
        return rejectWithValue(`Dialogue choice with ID ${choiceId} not found`);
      }

      // Determine NPC response based on relationship level
      const currentRelationshipTier = getRelationshipTier(npc.relationshipValue);
      let responseText = dialogueData.responses[currentRelationshipTier] || dialogueData.responses['NEUTRAL']; // Fallback to NEUTRAL

      // If the choiceId is 'generic_talk', use a generic response if no specific one is found
      if (choiceId === 'generic_talk') {
        const genericResponses = [
          "That's an interesting perspective.",
          "I appreciate your honesty.",
          "Thank you for sharing that with me.",
          "I understand how you feel."
        ];
        responseText = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }

      const relationshipChange = Math.random() * 3 + 1; // 1-4 points

      // Dispatch addDialogueEntry to log the player's message in the history
      dispatch(addDialogueEntry({
        npcId,
        speaker: 'player',
        playerText: playerText,
        npcResponse: '',
      }));

      // Update relationship
      await dispatch(updateNPCRelationshipThunk({
        npcId,
        relationshipChange,
        reason: 'dialogue_choice'
      }));

      // Dispatch addDialogueEntry to log the NPC's response in the history
      dispatch(addDialogueEntry({
        npcId,
        speaker: 'npc',
        playerText: playerText,
        npcResponse: responseText,
        affinityDelta: relationshipChange,
      }));

      // If it's a specific dialogue choice (not generic_talk), mark it as completed
      if (choiceId !== 'generic_talk') {
        dispatch(completeDialogueTopic({ npcId, dialogueId: choiceId }));
      }

      return {
        success: true,
        npcResponse: responseText,
        affinityDelta: relationshipChange,
        rewards: relationshipChange > 0 ? ['Positive conversation'] : []
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
  InteractionResult, // Changed return type
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

      // Check if player has sufficient relationship level (removed for testing)
      // if (npc.relationshipValue < 50) {
      //   return rejectWithValue('Insufficient relationship level for trait sharing');
      // }

      // Check if player has the trait
      // Assuming player traits are stored in player slice, adjust path if necessary
      const playerAcquiredTraits = state.player.permanentTraits.concat(state.player.traitSlots.filter(s => s.traitId).map(s => s.traitId as string));
      if (!playerAcquiredTraits.includes(traitId)) {
        return rejectWithValue('Player does not have this trait');
      }

      return {
        success: true,
        message: `Successfully shared trait with ${npc.name}`,
        affinityDelta: 1, // Renamed from relationshipChange
        rewards: ['Trait sharing bond']
      };
    } catch (error) {
      return rejectWithValue('Failed to share trait with NPC');
    }
  }
);

/**
 * Fetch NPCs from the data file
 */
export const fetchNPCsThunk = createAsyncThunk<
  Record<string, NPC>, // Return type of the payload creator
  void, // First argument to the payload creator (no argument)
  { state: RootState; rejectValue: string } // ThunkAPI config
>(
  'npcs/fetchNPCs',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch('/data/npcs.json'); // Path relative to public folder
      if (!response.ok) {
        throw new Error(`Failed to fetch NPCs: ${response.statusText}`);
      }
      const data: Record<string, NPC> = await response.json();
      dispatch(setNPCs(data)); // Dispatch setNPCs from NPCSlice
      dispatch(setLoading(false));
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch NPCs';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);
