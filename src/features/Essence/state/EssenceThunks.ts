/**
 * Redux Thunks for Essence-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gainEssence, updateResonanceLevel as updateEssenceResonanceLevel } from './EssenceSlice'; // Renamed import
import { RootState } from '../../../app/store';
import { EssenceState } from './EssenceTypes';
import { unlockTraitSlot, setResonanceLevel as updatePlayerResonanceLevel } from '../../Player/state/PlayerSlice'; // Fixed import name
import { selectTraitSlots, selectMaxTraitSlots, selectPlayerResonanceLevel } from '../../Player/state/PlayerSelectors';

/**
 * Essence System Async Thunks
 * 
 * Handles complex async operations for the Essence system including
 * persistence, passive generation, and cross-system interactions.
 */

/**
 * Generate essence over time based on current generators and modifiers (Passive Generation)
 */
export const passiveGenerateEssenceThunk = createAsyncThunk<number, void, { state: RootState }>(
  'essence/passiveGenerate', // Changed name for clarity
  async (_, { dispatch, getState }) => {
    const essenceState = getState().essence;
    if (!essenceState.isGenerating) return 0;

    const timeDiff = (Date.now() - essenceState.lastGenerationTime) / 1000; // Time diff in seconds
    const amount = Math.floor(essenceState.generationRate * timeDiff);

    if (amount > 0) {
      dispatch(gainEssence({ amount, description: 'Passive generation' }));
      dispatch(checkAndProcessResonanceLevelUpThunk());
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
 * Manual essence generation (e.g., from clicking a button)
 */
export const manualGenerateEssenceThunk = createAsyncThunk<
  number, // Amount generated
  number | undefined, // Optional amount to generate, otherwise uses perClickValue
  { state: RootState }
>('essence/manualGenerate', async (amount, { getState, dispatch, rejectWithValue }) => { // Renamed for clarity
  try {
    const state = getState().essence;
    const baseAmount = amount || state.perClickValue;
    const finalAmount = Math.max(0, baseAmount);
    
    if (finalAmount > 0) {
      dispatch(gainEssence({ amount: finalAmount, description: 'Manual generation' }));
      dispatch(checkAndProcessResonanceLevelUpThunk());
    }
    return finalAmount;
  } catch (error) {
    return rejectWithValue('Failed to generate essence manually');
  }
});

// Removed redundant processPassiveGenerationThunk, passiveGenerateEssenceThunk covers it.

/**
 * Checks for resonance level up and dispatches actions to update levels and unlock trait slots.
 * This thunk should be dispatched after any action that increases totalCollected essence.
 */
export const checkAndProcessResonanceLevelUpThunk = createAsyncThunk<
  void, // Returns nothing
  void, // Takes no arguments
  { state: RootState }
>(
  'essence/checkResonanceLevelUp',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const essenceState = state.essence;
    const playerState = state.player;

    let newCalculatedResonanceLevel = 0;
    for (let i = 0; i < essenceState.resonanceThresholds.length; i++) {
      if (essenceState.totalCollected >= essenceState.resonanceThresholds[i]) {
        newCalculatedResonanceLevel = i + 1;
      } else {
        break; 
      }
    }
    newCalculatedResonanceLevel = Math.min(newCalculatedResonanceLevel, essenceState.maxResonanceLevel);

    if (newCalculatedResonanceLevel > essenceState.currentResonanceLevel) {
      dispatch(updateEssenceResonanceLevel(newCalculatedResonanceLevel));
      dispatch(updatePlayerResonanceLevel(newCalculatedResonanceLevel)); // Keep PlayerSlice in sync

      // Check for trait slot unlocks
      const currentUnlockedSlots = playerState.traitSlots.filter(slot => slot.isUnlocked).length;
      
      playerState.traitSlots.forEach(slot => {
        if (
          !slot.isUnlocked &&
          slot.unlockRequirements?.type === 'resonanceLevel' &&
          newCalculatedResonanceLevel >= (slot.unlockRequirements.value as number) && // Assuming value is number for resonanceLevel type
          currentUnlockedSlots < playerState.maxTraitSlots // Ensure we don't exceed max slots (though individual slot logic should handle this)
        ) {
          dispatch(unlockTraitSlot(slot.index));
        }
      });
    }
  }
);

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
