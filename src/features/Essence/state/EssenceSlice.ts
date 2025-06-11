import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EssenceState, EssenceTransactionPayload, EssenceConnection } from './EssenceTypes';
import { 
  processEssenceGenerationThunk,
  updateEssenceGenerationRateThunk,
  spendEssenceThunk,
  acquireTraitWithEssenceThunk,
  processResonanceLevelThunk,
  initializeEssenceSystemThunk,
  manualEssenceGenerationThunk
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
      // Manual essence generation
      .addCase(manualEssenceGenerationThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(manualEssenceGenerationThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Handle successful manual generation
      })
      .addCase(manualEssenceGenerationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Manual generation failed';
      })
      
      // Passive essence generation
      .addCase(processEssenceGenerationThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(processEssenceGenerationThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Handle successful passive generation
      })
      .addCase(processEssenceGenerationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Passive generation failed';
      })
      
      // Initialize essence system
      .addCase(initializeEssenceSystemThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeEssenceSystemThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Handle successful initialization
      })
      .addCase(initializeEssenceSystemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Initialization failed';
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
