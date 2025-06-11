/**
 * Redux Thunks for Essence-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  gainEssence, 
  spendEssence, 
  updateResonanceLevel,
  updateGenerationRate 
} from './EssenceSlice';
import { RootState } from '../../../app/store';
import { EssenceState } from './EssenceTypes';
import { addPermanentTrait, incrementResonanceLevel } from '../../Player/state/PlayerSlice';
import { selectPlayer } from '../../Player/state/PlayerSelectors';

/**
 * Async thunk for processing essence generation over time
 */
export const processEssenceGenerationThunk = createAsyncThunk(
  'essence/processGeneration',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const essenceState = state.essence;
    
    if (essenceState.isGenerating && essenceState.generationRate > 0) {
      const generatedAmount = (essenceState.generationRate * deltaTime) / 1000; // deltaTime in ms
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
 * Async thunk for updating essence generation rate based on NPC connections
 */
export const updateEssenceGenerationRateThunk = createAsyncThunk(
  'essence/updateGenerationRate',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const npcs = state.npcs?.npcs || {};
    
    // Calculate generation rate based on NPC connections
    let totalGenerationRate = 0;
    
    Object.values(npcs).forEach((npc: any) => {
      if (npc.connectionDepth > 0) {
        // Base rate calculation: connectionDepth * relationshipValue factor
        const npcRate = npc.connectionDepth * (npc.relationshipValue / 100) * 0.1;
        totalGenerationRate += npcRate;
      }
    });
    
    dispatch(updateGenerationRate(totalGenerationRate));
    
    return {
      newRate: totalGenerationRate,
      connectionCount: Object.values(npcs).filter((npc: any) => npc.connectionDepth > 0).length
    };
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

/**
 * Async thunk for acquiring traits with essence cost
 */
export const acquireTraitWithEssenceThunk = createAsyncThunk(
  'essence/acquireTraitWithEssence',
  async (
    { traitId, essenceCost }: { traitId: string; essenceCost: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const currentEssence = state.essence.currentEssence;
    
    if (currentEssence < essenceCost) {
      return rejectWithValue(`Insufficient essence. Required: ${essenceCost}, Available: ${currentEssence}`);
    }
    
    // Spend the essence
    dispatch(spendEssence({ amount: essenceCost }));
    
    // Add trait to player's permanent traits
    dispatch(addPermanentTrait(traitId));
    
    return {
      traitId,
      essenceSpent: essenceCost,
      remainingEssence: currentEssence - essenceCost
    };
  }
);

/**
 * Async thunk for processing resonance level updates
 */
export const processResonanceLevelThunk = createAsyncThunk(
  'essence/processResonanceLevel',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const essenceState = state.essence as EssenceState;
    const playerState = state.player;
    
    // Calculate resonance level based on total essence collected
    const newCalculatedResonanceLevel = Math.floor(essenceState.totalCollected / 100); // 1 level per 100 essence
    
    if (newCalculatedResonanceLevel > essenceState.currentResonanceLevel) {
      dispatch(updateResonanceLevel(newCalculatedResonanceLevel));
      dispatch(incrementResonanceLevel()); // Increment by 1 level
      
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
 * Async thunk for initializing essence system
 */
export const initializeEssenceSystemThunk = createAsyncThunk(
  'essence/initializeSystem',
  async (_, { dispatch }) => {
    // Initialize generation rate based on current connections
    await dispatch(updateEssenceGenerationRateThunk());
    
    // Process initial resonance level
    await dispatch(processResonanceLevelThunk());
    
    return {
      initialized: true,
      timestamp: Date.now()
    };
  }
);

/**
 * Async thunk for manual essence generation (testing/development)
 */
export const manualEssenceGenerationThunk = createAsyncThunk(
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
 * Alias for processEssenceGenerationThunk for backwards compatibility
 */
export const passiveGenerateEssenceThunk = processEssenceGenerationThunk;

/**
 * Alias for processResonanceLevelThunk for backwards compatibility
 */
export const checkAndProcessResonanceLevelUpThunk = processResonanceLevelThunk;

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
    
    // Validation
    if (currentEssence < essenceCost) {
      throw new Error('Insufficient essence for resonance level increase');
    }
    
    const currentResonanceLevel = player.resonanceLevel || 0;
    const maxTraitSlots = player.maxTraitSlots || 6;
    
    // Check if player has reached maximum resonance level
    if (currentResonanceLevel >= 50) { // Maximum resonance level
      throw new Error('Maximum resonance level reached');
    }
    
    // Spend essence with proper payload structure
    dispatch(spendEssence({
      amount: essenceCost,
      source: 'resonance_level_increase',
      description: `Increased resonance level to ${currentResonanceLevel + 1}`
    }));
    
    // Increase resonance level
    dispatch(incrementResonanceLevel());
    
    // Calculate new unlocked slots (base 2 + resonance level)
    const newResonanceLevel = currentResonanceLevel + 1;
    const newUnlockedSlots = Math.min(maxTraitSlots, newResonanceLevel + 2);
    
    console.log(`Resonance level increased to ${newResonanceLevel}. Unlocked slots: ${newUnlockedSlots}/${maxTraitSlots}`);
  }
);
