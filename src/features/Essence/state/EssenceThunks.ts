/**
 * Redux Thunks for Essence-related async operations
 */
import { createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  gainEssence,
  spendEssence,
  updateGenerationRate,
  updateResonanceLevel,
} from './EssenceSlice';
import { EssenceState } from './EssenceTypes';
import { setResonanceLevel } from '../../Player/state/PlayerSlice';
import { selectPlayer } from '../../Player/state/PlayerSelectors';
import { calculateEssenceGenerationRate } from '../utils/essenceRate';

/**
 * Async thunk for processing essence generation over time
 */
export const processPassiveGenerationThunk: AsyncThunk<{ generated: number; newTotal: number; }, number, { state: RootState }> = createAsyncThunk(
  'essence/processGeneration',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const essenceState = state.essence;

    if (state.gameLoop.isRunning && !state.gameLoop.isPaused && essenceState.generationRate > 0) {
      const generatedAmount = (essenceState.generationRate * deltaTime) / 1000;
      dispatch(gainEssence({ amount: generatedAmount, source: 'passive_generation' }));

      return {
        generated: generatedAmount,
        newTotal: essenceState.currentEssence + generatedAmount
      };
    }

    return {
      generated: 0,
      newTotal: essenceState.currentEssence
    };
  }
);

/**
 * Update the passive Essence rate from explicit current sources.
 * The calculation is pure and shared with relationship orchestration so the
 * two feature modules do not import each other's thunks.
 */
export const updateEssenceGenerationRateThunk = createAsyncThunk(
  'essence/updateGenerationRate',
  async (_, { getState, dispatch }) => {
    const calculation = calculateEssenceGenerationRate(getState() as RootState);
    dispatch(updateGenerationRate(calculation.newRate));
    return calculation;
  }
);

/**
 * Async thunk for spending essence with validation
 */
export const spendEssenceThunk = createAsyncThunk(
  'essence/spendEssence',
  async (amount: number, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentEssence = state.essence.currentEssence;

    if (currentEssence < amount) {
      return rejectWithValue(`Insufficient essence. Required: ${amount}, Available: ${currentEssence}`);
    }

    dispatch(spendEssence({ amount }));

    return {
      spent: amount,
      remaining: currentEssence - amount
    };
  }
);

// NOTE: Resonance acquisition now lives under Traits/state/TraitThunks.ts to centralize validation and notifications.

/**
 * Async thunk for processing resonance level updates
 */
export const processResonanceLevelThunk: AsyncThunk<{ newLevel: number; previousLevel: number; levelUp: boolean; }, void, { state: RootState }> = createAsyncThunk(
  'essence/processResonanceLevel',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const essenceState = state.essence as EssenceState;
    
    const newCalculatedResonanceLevel = Math.floor(essenceState.totalCollected / 100);

    if (newCalculatedResonanceLevel > essenceState.currentResonanceLevel) {
      dispatch(updateResonanceLevel(newCalculatedResonanceLevel));
      dispatch(setResonanceLevel(newCalculatedResonanceLevel));

      return {
        newLevel: newCalculatedResonanceLevel,
        previousLevel: essenceState.currentResonanceLevel,
        levelUp: true
      };
    }

    return {
      newLevel: newCalculatedResonanceLevel,
      previousLevel: essenceState.currentResonanceLevel,
      levelUp: false
    };
  }
);

/**
 * SIMPLIFIED Async thunk for initializing essence system
 */
export const initializeEssenceSystemThunk = createAsyncThunk(
  'essence/initializeSystem',
  async (_, { dispatch }) => {
    console.log("Essence system initialized.");
    return {
      initialized: true,
      timestamp: Date.now()
    };
  }
);

/**
 * Async thunk for manual essence generation (testing/development)
 */
export const generateEssenceManuallyThunk = createAsyncThunk(
  'essence/manualGeneration',
  async (amount: number, { dispatch }) => {
    dispatch(gainEssence({ amount, source: 'manual_generation' }));

    return {
      generated: amount,
      timestamp: Date.now()
    };
  }
);

/**
 * Async thunk for increasing player resonance level with essence cost
 */
export const increaseResonanceLevelThunk = createAsyncThunk<
  void,
  { essenceCost: number },
  { state: RootState }
>(
  'essence/increaseResonanceLevel',
  async ({ essenceCost }, { getState, dispatch }) => {
    const state = getState();
    const currentEssence = state.essence.currentEssence;
    const player = selectPlayer(state);
    
    if (currentEssence < essenceCost) {
      throw new Error('Insufficient essence for resonance level increase');
    }

    const currentResonanceLevel = player.resonanceLevel || 0;
    if (currentResonanceLevel >= 50) {
      throw new Error('Maximum resonance level reached');
    }

    if (essenceCost > 0) {
      dispatch(spendEssence({
        amount: essenceCost,
        source: 'resonance_level_increase',
        description: `Increased resonance level to ${currentResonanceLevel + 1}`
      }));
    }
    
    dispatch(setResonanceLevel(currentResonanceLevel + 1));
  }
);