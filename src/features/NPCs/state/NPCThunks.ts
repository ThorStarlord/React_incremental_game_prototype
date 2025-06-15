/**
 * Async thunk operations for the NPCs system
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, InteractionResult, RelationshipChangeEntry } from './NPCTypes';
// Corrected: Import from the Essence feature's public API (barrel file)
import { updateEssenceGenerationRateThunk } from '../../Essence';
// Corrected: Import reducer actions from the local slice file
import { setRelationshipValue, increaseConnectionDepth, addRelationshipChangeEntry, updateNpcConnectionDepth } from './NPCSlice';

/**
 * Thunk for initializing NPCs by fetching data from the JSON file.
 */
export const initializeNPCsThunk = createAsyncThunk<
  Record<string, NPC>,
  void,
  { rejectValue: string }
>(
  'npcs/initialize',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('/data/npcs.json');
      if (!response.ok) {
        throw new Error('Failed to fetch NPC data');
      }
      const data: Record<string, NPC> = await response.json();
      
      dispatch(updateEssenceGenerationRateThunk());
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for discovering an NPC
 */
export const discoverNPCThunk = createAsyncThunk(
  'npcs/discoverNPC',
  async (npcId: string) => {
    return npcId;
  }
);

/**
 * REWRITTEN THUNK: Handles relationship updates with "level up" logic for connection depth.
 */
export const updateNPCRelationshipThunk = createAsyncThunk(
  'npcs/updateRelationship',
  async (payload: { npcId: string; change: number; reason: string }, { dispatch, getState }) => {
    const { npcId, change, reason } = payload;
    const state = getState() as RootState;
    const npc = state.npcs.npcs[npcId];

    if (!npc) {
        console.error(`NPC not found for relationship update: ${npcId}`);
        return;
    }

    const oldValue = npc.relationshipValue;
    let newValue = oldValue + change;
    let connectionDepthIncrease = 0;

    if (newValue >= 100) {
        connectionDepthIncrease = Math.floor(newValue / 100);
        newValue = newValue % 100;

        dispatch(increaseConnectionDepth({ npcId, amount: connectionDepthIncrease }));
    }
    
    dispatch(setRelationshipValue({ npcId, value: newValue }));

    const logEntry: RelationshipChangeEntry = {
        id: `${npcId}-${Date.now()}`,
        npcId,
        timestamp: Date.now(),
        oldValue,
        newValue,
        reason: connectionDepthIncrease > 0 
            ? `${reason} & Connection Level Up! (+${connectionDepthIncrease})` 
            : reason,
    };
    dispatch(addRelationshipChangeEntry(logEntry));
    
    await dispatch(updateEssenceGenerationRateThunk());
    
    return { ...payload, connectionDepthIncrease };
  }
);

/**
 * Thunk for updating an NPC's connection depth directly (for debug).
 */
export const updateNPCConnectionDepthThunk = createAsyncThunk(
  'npcs/updateConnectionDepth',
  async (payload: { npcId: string; newDepth: number }, { dispatch }) => {
    dispatch(updateNpcConnectionDepth(payload));
    await dispatch(updateEssenceGenerationRateThunk());
    return payload;
  }
);

/**
 * Placeholder thunk for processing NPC interaction
 */
export const processNPCInteractionThunk = createAsyncThunk<
  InteractionResult,
  { npcId: string; interactionType: string; context?: any }
>(
  'npcs/processInteraction',
  async (payload) => {
    return {
      success: true,
      message: `Interaction '${payload.interactionType}' with ${payload.npcId} processed.`,
    };
  }
);

/**
 * Placeholder thunk for sharing trait with NPC
 */
export const shareTraitWithNPCThunk = createAsyncThunk(
  'npcs/shareTrait',
  async (payload: { npcId: string; traitId: string; slotIndex: number }) => {
    return payload;
  }
);