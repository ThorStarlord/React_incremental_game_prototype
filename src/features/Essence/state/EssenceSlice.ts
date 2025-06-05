import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EssenceState, EssenceTransactionPayload, EssenceConnection } from './EssenceTypes';
import { 
  saveEssenceThunk, 
  loadEssenceThunk, 
  manualGenerateEssenceThunk, // Renamed import
  passiveGenerateEssenceThunk // Added import
} from './EssenceThunks';

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
  npcConnections: {}, // Initialize as an empty object
  currentResonanceLevel: 0,
  maxResonanceLevel: 3, // Example: Corresponds to 3 thresholds
  resonanceThresholds: [100, 500, 2000], // Example: Essence needed for levels 1, 2, 3
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
     * Update properties of an existing EssenceConnection
     */
    updateEssenceConnection: (state, action: PayloadAction<{ npcId: string; updates: Partial<EssenceConnection> }>) => {
      const { npcId, updates } = action.payload;
      if (state.npcConnections[npcId]) {
        state.npcConnections[npcId] = {
          ...state.npcConnections[npcId],
          ...updates,
        };
      }
    },
    /**
     * Updates the player's current resonance level.
     */
    updateResonanceLevel: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload <= state.maxResonanceLevel) {
        state.currentResonanceLevel = action.payload;
      }
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
      
      // Manual Generate essence thunk
      .addCase(manualGenerateEssenceThunk.fulfilled, (state, action: PayloadAction<number>) => {
        // Essence gain is now handled by gainEssence action dispatched in the thunk.
        // This reducer can be used for other side effects related to manual generation completion if needed.
        // For example, logging or specific UI updates not covered by gainEssence.
        // state.lastGenerationTime = Date.now(); // gainEssence handles this
      })
      // Passive Generate essence thunk
      .addCase(passiveGenerateEssenceThunk.fulfilled, (state, action: PayloadAction<number>) => {
        // Essence gain is now handled by gainEssence action dispatched in the thunk.
        // This reducer can be used for other side effects related to passive generation completion.
        // const amount = action.payload;
        // if (amount > 0) { 
        //   state.lastGenerationTime = Date.now(); // gainEssence handles this
        // }
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
  updateEssenceConnection,
  updateResonanceLevel, // Export the new action
} = essenceSlice.actions;

export const selectEssence = (state: { essence: EssenceState }) => state.essence;

export default essenceSlice.reducer;
