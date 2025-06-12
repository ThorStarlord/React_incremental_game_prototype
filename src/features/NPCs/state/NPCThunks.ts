/**
 * Async thunk operations for the NPCs system
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { NPC, InteractionResult } from './NPCTypes';

/**
 * Thunk for initializing NPCs by fetching data from the JSON file.
 * This replaces the old placeholder.
 */
export const initializeNPCsThunk = createAsyncThunk<
  Record<string, NPC>, // Return type on success
  void, // Argument type
  { rejectValue: string } // ThunkAPI config
>(
  'npcs/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/data/npcs.json');
      if (!response.ok) {
        throw new Error('Failed to fetch NPC data');
      }
      const data: Record<string, NPC> = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(message);
    }
  }
);

/**
 * Placeholder thunk for discovering an NPC
 */
export const discoverNPCThunk = createAsyncThunk(
  'npcs/discoverNPC',
  async (npcId: string) => {
    // In a real scenario, this might involve an API call or complex logic.
    return npcId;
  }
);

/**
 * Placeholder thunk for updating NPC relationship
 */
export const updateNPCRelationshipThunk = createAsyncThunk(
  'npcs/updateRelationship',
  async (payload: { npcId: string; change: number; reason: string }) => {
    // Placeholder: In a real app, this might involve server validation.
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
    // Placeholder logic
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
    // Placeholder logic
    return payload;
  }
);