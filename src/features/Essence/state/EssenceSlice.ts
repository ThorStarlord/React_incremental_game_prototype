import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EssenceState, EssenceTransactionPayload } from './EssenceTypes';

/**
 * Initial state for the Essence system
 */
const initialState: EssenceState = {
  currentEssence: 0,
  totalCollected: 0,
  generationRate: 0.1, // 0.1 essence per second
  perClickValue: 1,
  lastGenerationTime: Date.now(),
  isGenerating: false,
  loading: false,
  error: null,
  currentResonanceLevel: 0,
};

/**
 * Essence Redux slice managing core metaphysical resource system
 */
const essenceSlice = createSlice({
  name: 'essence',
  initialState,
  reducers: {
    /**
     * Add essence to current amount and total collected
     */
    gainEssence: (state, action: PayloadAction<EssenceTransactionPayload>) => {
      const { amount } = action.payload;
      state.currentEssence += amount;
      state.totalCollected += amount;
      state.lastGenerationTime = Date.now();
    },

    /**
     * Spend essence if sufficient amount available
     */
    spendEssence: (state, action: PayloadAction<EssenceTransactionPayload>) => {
      const { amount } = action.payload;
      if (state.currentEssence >= amount) {
        state.currentEssence -= amount;
      }
    },

    /**
     * Update generation rate based on connections
     */
    updateGenerationRate: (state, action: PayloadAction<number>) => {
      state.generationRate = Math.max(0, action.payload);
    },

    /**
     * Update per-click generation value
     */
    updatePerClickValue: (state, action: PayloadAction<number>) => {
      state.perClickValue = Math.max(1, action.payload);
    },

    /**
     * Toggle passive generation state
     */
    toggleGeneration: (state) => {
      state.isGenerating = !state.isGenerating;
      state.lastGenerationTime = Date.now();
    },

    /**
     * Reset all essence data to initial state
     */
    resetEssence: (state) => {
      Object.assign(state, initialState);
    },

    /**
     * Clear any error states
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Update the player's resonance level.
     */
    updateResonanceLevel: (state, action: PayloadAction<number>) => {
      state.currentResonanceLevel = action.payload;
    },
  },
});

export const {
  gainEssence,
  spendEssence,
  updateGenerationRate,
  updatePerClickValue,
  toggleGeneration,
  resetEssence,
  clearError,
  updateResonanceLevel,
} = essenceSlice.actions;

// FIXED: The redundant selector that was here has been removed.

export default essenceSlice.reducer;