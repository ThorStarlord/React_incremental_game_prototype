import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EssenceState, EssenceTransactionPayload } from './EssenceTypes';
import { saveEssenceThunk, loadEssenceThunk, generateEssenceThunk } from './EssenceThunks';

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
  },
  extraReducers: (builder) => {
    builder
      // Save essence thunk
      .addCase(saveEssenceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEssenceThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveEssenceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save essence data';
      })
      
      // Load essence thunk
      .addCase(loadEssenceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadEssenceThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          Object.assign(state, action.payload);
        }
      })
      .addCase(loadEssenceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load essence data';
      })
      
      // Generate essence thunk
      .addCase(generateEssenceThunk.fulfilled, (state, action) => {
        const amount = action.payload;
        state.currentEssence += amount;
        state.totalCollected += amount;
        state.lastGenerationTime = Date.now();
      });
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
} = essenceSlice.actions;

export const selectEssence = (state: { essence: EssenceState }) => state.essence;

export default essenceSlice.reducer;
