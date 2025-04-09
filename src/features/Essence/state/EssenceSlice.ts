import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
// Import the shared EssenceState and payload types
import { EssenceState, GainEssencePayload, SpendEssencePayload } from './EssenceTypes';

// Define the initial state based on the imported EssenceState
const initialState: EssenceState = {
  amount: 0,
  totalCollected: 0, // Use totalCollected from EssenceTypes
  perSecond: 0,
  perClick: 1, // Default click value
  multiplier: 1,
  unlocked: true, // Assuming essence is unlocked initially
  generators: {},
  upgrades: {},
  mechanics: {
    autoCollectUnlocked: false,
    resonanceUnlocked: false,
  },
  sources: [],
  notifications: [],
  maxAmount: 1000, // Example max amount
  resonanceLevel: 0,
  decayRate: 0,
  lastUpdated: Date.now(),
  generationRate: 1, // Example initial generation rate
};

const essenceSlice = createSlice({
  name: 'essence',
  initialState,
  reducers: {
    // Use GainEssencePayload from EssenceTypes.ts
    gainEssence: (state, action: PayloadAction<GainEssencePayload>) => {
      const { amount, source = 'unknown' } = action.payload;

      if (amount <= 0) return;

      state.amount += amount;
      state.totalCollected += amount; // Use totalCollected
      state.lastUpdated = Date.now();
    },

    // Use SpendEssencePayload from EssenceTypes.ts
    spendEssence: (state, action: PayloadAction<SpendEssencePayload>) => {
      const { amount, purpose } = action.payload;

      if (amount <= 0) return;
      if (state.amount < amount) {
        console.error(`Not enough essence. Required: ${amount}, Available: ${state.amount}`);
        return;
      }

      state.amount -= amount;
      state.lastUpdated = Date.now();
    },

    // Keep setEssenceAmount if needed for loading state
    setEssenceAmount: (state, action: PayloadAction<number>) => {
      state.amount = Math.max(0, action.payload);
      state.lastUpdated = Date.now();
    },

    // Add a reducer to update generationRate if necessary
    setGenerationRate: (state, action: PayloadAction<number>) => {
      state.generationRate = Math.max(0, action.payload);
      state.lastUpdated = Date.now();
    },
  },
});

// Update exports to match the new reducer names if changed
export const { gainEssence, spendEssence, setEssenceAmount, setGenerationRate } = essenceSlice.actions;

// Selectors - Update to use the correct state structure from EssenceTypes.ts
export const selectEssenceAmount = (state: RootState) => state.essence.amount;
export const selectTotalCollected = (state: RootState) => state.essence.totalCollected; // Use totalCollected
export const selectEssenceMaxAmount = (state: RootState) => state.essence.maxAmount;
export const selectEssenceGenerationRate = (state: RootState) => state.essence.generationRate;

export default essenceSlice.reducer;
