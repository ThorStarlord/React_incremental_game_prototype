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
import { addPermanentTrait, setResonanceLevel } from '../../Player/state/PlayerSlice';
import { selectPlayer } from '../../Player/state/PlayerSelectors';
import { COPY_SYSTEM, ESSENCE_GENERATION } from '../../../constants/gameConstants';
import { NPC } from '../../NPCs/state/NPCTypes';
import { Trait } from '../../Traits/state/TraitsTypes';

/**
 * Async thunk for processing essence generation over time
 */
export const processPassiveGenerationThunk: AsyncThunk<{ generated: number; newTotal: number; }, number, { state: RootState }> = createAsyncThunk(
  'essence/processGeneration',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const essenceState = state.essence;

    // We check isRunning in the game loop hook, but it's safe to double-check here.
    // The key check is generationRate > 0.
    if (state.gameLoop.isRunning && !state.gameLoop.isPaused && essenceState.generationRate > 0) {
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
 * Async thunk for updating essence generation rate based on NPC connections and traits.
 */
export const updateEssenceGenerationRateThunk = createAsyncThunk(
  'essence/updateGenerationRate',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const npcs = state.npcs?.npcs || {};
    const player = state.player;
    const allTraits = state.traits.traits;

    // 1. Start with the base generation rate
    let totalRate = ESSENCE_GENERATION.BASE_RATE_PER_SECOND;

    // 2. Add bonus from mature, loyal Copies
    const copies = state.copy?.copies || {};
    // Each qualifying Copy gives a flat bonus (e.g., 0.2/sec)
    const { ESSENCE_GENERATION_BONUS } = COPY_SYSTEM;
    const qualifyingCopies = Object.values(copies).filter(
      (copy) => copy.maturity >= 100 && copy.loyalty > 50
    );
    totalRate += qualifyingCopies.length * ESSENCE_GENERATION_BONUS;
    
    // 2. Calculate total contribution from all NPC connections
    const npcContribution = Object.values(npcs).reduce((total, npc: NPC) => {
      // Ensure relationship contributes positively
      if (npc.connectionDepth > 0 && npc.affinity > 0) {
        const relationshipMultiplier = npc.affinity / 100.0; // Normalize to 0-1
        const connectionMultiplier = npc.connectionDepth / 10.0; // Normalize to 0-1, assuming max depth is 10
        
        const npcRate = connectionMultiplier * relationshipMultiplier * ESSENCE_GENERATION.NPC_CONTRIBUTION_MULTIPLIER;
        return total + npcRate;
      }
      return total;
    }, 0);

    totalRate += npcContribution;
    
    // 3. Calculate global multipliers from player traits
    let traitMultiplier = 1.0;
    const activeTraitIds = [...player.permanentTraits, ...player.traitSlots.map(s => s.traitId).filter(Boolean) as string[]];
    
    activeTraitIds.forEach(traitId => {
      const trait: Trait = allTraits[traitId];
      if (trait && trait.effects && typeof trait.effects === 'object' && !Array.isArray(trait.effects)) {
        if (trait.effects.essenceGenerationMultiplier) {
          // Multipliers are cumulative (e.g., 1.1 * 1.15)
          traitMultiplier *= trait.effects.essenceGenerationMultiplier;
        }
      }
    });

    // 4. Apply the total trait multiplier to the calculated rate
    totalRate *= traitMultiplier;

    // 5. Dispatch the update action
    dispatch(updateGenerationRate(totalRate));

    return {
      newRate: totalRate,
      connectionCount: Object.values(npcs).filter((npc: NPC) => npc.connectionDepth > 0).length
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
 * Async thunk for acquiring traits with essence cost (Resonance)
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

    dispatch(spendEssence({ amount: essenceCost }));
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
    // The actual update logic is now triggered by other events.
    // This thunk can be used for any one-time setup if needed in the future.
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

    dispatch(spendEssence({
      amount: essenceCost,
      source: 'resonance_level_increase',
      description: `Increased resonance level to ${currentResonanceLevel + 1}`
    }));
    
    dispatch(setResonanceLevel(currentResonanceLevel + 1));
  }
);