/**
 * Redux Thunks for Essence-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gainEssence } from './EssenceSlice';
import { RootState } from '../../../app/store';
import { EssenceState } from './EssenceTypes';

/**
 * Essence System Async Thunks
 * 
 * Handles complex async operations for the Essence system including
 * persistence, passive generation, and cross-system interactions.
 */

/**
 * Generate essence over time based on current generators and modifiers
 */
export const generateEssence = createAsyncThunk<number, void, { state: RootState }>(
  'essence/generate',
  async (_, { dispatch, getState }) => {
    const rate = getState().essence.generationRate ?? 0;
    const amount = Math.floor(rate);
    if (amount > 0) {
      dispatch(gainEssence(amount));
    }
    return amount;
  }
);

/**
 * Save essence data to localStorage
 */
export const saveEssenceThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('essence/saveEssence', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const essenceData = state.essence;
    localStorage.setItem('gameEssence', JSON.stringify(essenceData));
  } catch (error) {
    return rejectWithValue('Failed to save essence data');
  }
});

/**
 * Load essence data from localStorage
 */
export const loadEssenceThunk = createAsyncThunk<
  Partial<EssenceState> | null,
  void,
  { state: RootState }
>('essence/loadEssence', async (_, { rejectWithValue }) => {
  try {
    const stored = localStorage.getItem('gameEssence');
    if (stored) {
      const data = JSON.parse(stored);
      // Validate and sanitize loaded data
      return {
        ...data,
        lastGenerationTime: Date.now(), // Reset generation timer
        loading: false,
        error: null,
      };
    }
    return null;
  } catch (error) {
    return rejectWithValue('Failed to load essence data');
  }
});

/**
 * Manual essence generation (for testing/prototyping)
 */
export const generateEssenceThunk = createAsyncThunk<
  number,
  number | undefined,
  { state: RootState }
>('essence/generateEssence', async (amount, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const baseAmount = amount || state.essence.perClickValue;
    
    // Apply any modifiers or multipliers here
    const finalAmount = Math.max(0, baseAmount);
    
    return finalAmount;
  } catch (error) {
    return rejectWithValue('Failed to generate essence');
  }
});

/**
 * Process passive essence generation based on connections
 */
export const processPassiveGenerationThunk = createAsyncThunk<
  number,
  void,
  { state: RootState }
>('essence/processPassiveGeneration', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const essence = state.essence;
    
    if (!essence.isGenerating) return 0;
    
    const timeDiff = (Date.now() - essence.lastGenerationTime) / 1000;
    const generatedAmount = essence.generationRate * timeDiff;
    
    return Math.max(0, generatedAmount);
  } catch (error) {
    return rejectWithValue('Failed to process passive generation');
  }
});

/**
 * Update generation rate based on NPC connections
 */
export const updateGenerationFromConnectionsThunk = createAsyncThunk<
  number,
  void,
  { state: RootState }
>('essence/updateGenerationFromConnections', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    
    // TODO: Calculate generation rate from NPC connections
    // This will integrate with the NPC system when implemented
    let totalRate = 0.1; // Base rate
    
    // Example calculation (to be implemented):
    // const npcs = state.npcs?.npcs || {};
    // const relationships = state.npcs?.relationships || {};
    // 
    // totalRate = Object.keys(relationships).reduce((rate, npcId) => {
    //   const relationship = relationships[npcId];
    //   const connectionBonus = relationship.value * 0.01; // 1% per relationship point
    //   return rate + connectionBonus;
    // }, 0.1);
    
    return Math.max(0.1, totalRate);
  } catch (error) {
    return rejectWithValue('Failed to update generation rate');
  }
});
