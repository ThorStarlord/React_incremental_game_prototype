/**
 * Redux Thunks for Essence-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  gainEssence, 
  spendEssence, 
  updateGenerationRate,
  updateResonanceLevel
} from './EssenceSlice';
import { RootState } from '../../../app/store';
import { EssenceState } from './EssenceTypes';
// FIXED: Import the correct action that exists in PlayerSlice
import { addPermanentTrait, setResonanceLevel } from '../../Player/state/PlayerSlice';
import { selectPlayer } from '../../Player/state/PlayerSelectors';

/**
 * Initialize the essence system with default values
 */
export const initializeEssenceSystemThunk = createAsyncThunk<void, void, { state: RootState }>(
  'essence/initializeSystem',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const essenceState = state.essence;
    
    // Set initial generation rate if not already set
    if (essenceState.generationRate === 0) {
      dispatch(updateGenerationRate(1)); // Base rate of 1 essence per second
    }
    
    // Process initial resonance level
    await dispatch(processResonanceLevelThunk());
  }
);

/**
 * Generate essence manually (for testing/clicking)
 */
export const generateEssenceManuallyThunk = createAsyncThunk<void, void, { state: RootState }>(
  'essence/generateManually',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const essenceState = state.essence;
    
    // Use gainEssence which automatically updates lastGenerationTime
    dispatch(gainEssence({ amount: essenceState.perClickValue }));
  }
);

/**
 * Update generation rate based on NPC connections
 */
export const updateGenerationRateThunk = createAsyncThunk<void, number, { state: RootState }>(
  'essence/updateGenerationRate',
  async (newRate, { dispatch }) => {
    dispatch(updateGenerationRate(newRate));
  }
);

/**
 * Acquire trait with essence cost (Resonance mechanic)
 */
export const acquireTraitWithEssenceThunk = createAsyncThunk<
  { traitId: string; essenceSpent: number },
  { traitId: string; essenceCost: number },
  { state: RootState }
>(
  'essence/acquireTraitWithEssence',
  async ({ traitId, essenceCost }, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const currentEssence = state.essence.currentEssence;
    
    // Check if player has enough essence
    if (currentEssence < essenceCost) {
      return rejectWithValue(`Insufficient essence. Required: ${essenceCost}, Available: ${currentEssence}`);
    }
    
    // Spend the essence
    dispatch(spendEssence({ amount: essenceCost }));
    
    // FIXED: Use the correct payload type - PlayerSlice expects just the traitId string
    dispatch(addPermanentTrait(traitId));
    
    return {
      traitId,
      essenceSpent: essenceCost
    };
  }
);

/**
 * Process Resonance Level updates based on total Essence collected
 */
export const processResonanceLevelThunk = createAsyncThunk<
  { newLevel: number; previousLevel: number; levelUp: boolean } | null,
  void,
  { state: RootState }
>(
  'essence/processResonanceLevel',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const essenceState = state.essence;
    const playerState = selectPlayer(state);
    
    // Calculate new resonance level based on total essence collected
    const newCalculatedResonanceLevel = Math.floor(essenceState.totalCollected / 100);
    
    // Check if resonance level should increase
    if (newCalculatedResonanceLevel > essenceState.currentResonanceLevel) {
      const previousLevel = essenceState.currentResonanceLevel;
      
      // Update essence resonance level
      dispatch(updateResonanceLevel(newCalculatedResonanceLevel));
      
      // FIXED: Use the correct action with the calculated value
      dispatch(setResonanceLevel(newCalculatedResonanceLevel));

      return {
        newLevel: newCalculatedResonanceLevel,
        previousLevel,
        levelUp: true
      };
    }
    
    return null;
  }
);

/**
 * Manually increase resonance level (for testing/admin purposes)
 */
export const increaseResonanceLevelThunk = createAsyncThunk<void, void, { state: RootState }>(
  'essence/increaseResonanceLevel',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const currentResonanceLevel = state.essence.currentResonanceLevel;
    
    // Update essence resonance level
    dispatch(updateResonanceLevel(currentResonanceLevel + 1));
    
    // FIXED: Use the correct action with the incremented value
    dispatch(setResonanceLevel(currentResonanceLevel + 1));
  }
);

/**
 * Process passive essence generation based on connections
 */
export const processPassiveGenerationThunk = createAsyncThunk<void, void, { state: RootState }>(
  'essence/processPassiveGeneration',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const essenceState = state.essence;
    const currentTime = Date.now();
    
    if (essenceState.isGenerating && essenceState.generationRate > 0) {
      const timeDelta = (currentTime - essenceState.lastGenerationTime) / 1000; // Convert to seconds
      const generatedAmount = Math.floor(essenceState.generationRate * timeDelta);
      
      if (generatedAmount > 0) {
        // gainEssence automatically updates lastGenerationTime
        dispatch(gainEssence({ amount: generatedAmount }));
      }
    }
  }
);