import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EssenceState } from './EssenceTypes';

/**
 * Initial state for the Essence system
 */
const initialState: EssenceState = {
  amount: 0,
  totalCollected: 0,
  generationRate: 0.1, // Per second
  perClick: 1,
  multiplier: 1.0,
  npcConnections: 0,
  lastUpdated: Date.now(),
};

/**
 * Essence slice managing the core metaphysical resource system
 */
const essenceSlice = createSlice({
  name: 'essence',
  initialState,
  reducers: {
    /**
     * Add essence to the current amount and total collected
     */
    gainEssence: (state, action: PayloadAction<number>) => {
      const amount = Math.max(0, action.payload);
      state.amount += amount;
      state.totalCollected += amount;
      state.lastUpdated = Date.now();
    },

    /**
     * Remove essence from the current amount
     */
    spendEssence: (state, action: PayloadAction<number>) => {
      const amount = Math.max(0, action.payload);
      state.amount = Math.max(0, state.amount - amount);
      state.lastUpdated = Date.now();
    },

    /**
     * Add manual essence (e.g., from clicking)
     */
    addManualEssence: (state) => {
      const amount = state.perClick * state.multiplier;
      state.amount += amount;
      state.totalCollected += amount;
      state.lastUpdated = Date.now();
    },

    /**
     * Set the passive generation rate
     */
    setGenerationRate: (state, action: PayloadAction<number>) => {
      state.generationRate = Math.max(0, action.payload);
    },

    /**
     * Set the per-click generation amount
     */
    setPerClick: (state, action: PayloadAction<number>) => {
      state.perClick = Math.max(0, action.payload);
    },

    /**
     * Set the global multiplier
     */
    setMultiplier: (state, action: PayloadAction<number>) => {
      state.multiplier = Math.max(0.1, action.payload);
    },

    /**
     * Add an NPC connection for generation
     */
    addNpcConnection: (state) => {
      state.npcConnections += 1;
      // Recalculate generation rate based on connections
      state.generationRate = state.npcConnections * 0.1;
    },

    /**
     * Remove an NPC connection
     */
    removeNpcConnection: (state) => {
      state.npcConnections = Math.max(0, state.npcConnections - 1);
      // Recalculate generation rate based on connections
      state.generationRate = state.npcConnections * 0.1;
    },

    /**
     * Update the last updated timestamp
     */
    updateLastUpdated: (state) => {
      state.lastUpdated = Date.now();
    },

    /**
     * Reset essence state to initial values
     */
    resetEssence: (state) => {
      Object.assign(state, initialState);
    },

    /**
     * Process passive generation based on time elapsed
     */
    processPassiveGeneration: (state, action: PayloadAction<number>) => {
      const deltaTime = action.payload; // Time in seconds
      if (state.generationRate > 0 && deltaTime > 0) {
        const generated = state.generationRate * deltaTime * state.multiplier;
        state.amount += generated;
        state.totalCollected += generated;
      }
      state.lastUpdated = Date.now();
    },

    /**
     * Update generation configuration
     */
    updateGenerationConfig: (state, action: PayloadAction<{
      generationRate?: number;
      multiplier?: number;
      npcConnections?: number;
    }>) => {
      const { generationRate, multiplier, npcConnections } = action.payload;
      
      if (generationRate !== undefined) {
        state.generationRate = Math.max(0, generationRate);
      }
      
      if (multiplier !== undefined) {
        state.multiplier = Math.max(0.1, multiplier);
      }
      
      if (npcConnections !== undefined) {
        state.npcConnections = Math.max(0, npcConnections);
        // Recalculate generation rate based on new connection count
        state.generationRate = state.npcConnections * 0.1;
      }
      
      state.lastUpdated = Date.now();
    },
  },
});

// Export actions
export const {
  gainEssence,
  spendEssence,
  addManualEssence,
  setGenerationRate,
  setPerClick,
  setMultiplier,
  addNpcConnection,
  removeNpcConnection,
  updateLastUpdated,
  resetEssence,
  processPassiveGeneration,
  updateGenerationConfig,
} = essenceSlice.actions;

// Export reducer
export default essenceSlice.reducer;

// Export the slice for potential additional usage
export { essenceSlice };
