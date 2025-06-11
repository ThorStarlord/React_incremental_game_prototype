import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TraitsState, Trait, TraitPreset } from './TraitsTypes';

const initialState: TraitsState = {
  traits: {},
  acquiredTraits: [],
  discoveredTraits: [],
  presets: [],
  loading: false,
  error: null,
};

export const traitsSlice = createSlice({
  name: 'traits',
  initialState,
  reducers: {
    acquireTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      if (!state.acquiredTraits.includes(traitId)) {
        state.acquiredTraits.push(traitId);
      }
    },

    discoverTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
    },

    equipTrait: (state, action: PayloadAction<{ traitId: string; slotIndex: number }>) => {
      // This action is handled by PlayerSlice for trait slot management
      // No direct state changes needed here
    },

    unequipTrait: (state, action: PayloadAction<number>) => {
      // This action is handled by PlayerSlice for trait slot management
      // No direct state changes needed here
    },

    saveTraitPreset: (state, action: PayloadAction<TraitPreset>) => {
      const preset = action.payload;
      const existingIndex = state.presets.findIndex(p => p.id === preset.id);
      if (existingIndex >= 0) {
        state.presets[existingIndex] = preset;
      } else {
        state.presets.push(preset);
      }
    },

    loadTraitPreset: (state, action: PayloadAction<string>) => {
      // Preset loading logic is handled by PlayerSlice
      // This action triggers the loading process
    },

    deleteTraitPreset: (state, action: PayloadAction<string>) => {
      state.presets = state.presets.filter(preset => preset.id !== action.payload);
    },

    unlockTraitSlot: (state, action: PayloadAction<number>) => {
      // Trait slot unlocking is handled by PlayerSlice
      // No direct state changes needed here
    },

    clearError: (state) => {
      state.error = null;
    },

    // Set traits data (typically loaded from JSON)
    setTraits: (state, action: PayloadAction<Record<string, Trait>>) => {
      state.traits = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    // Remove references to non-existent thunks
    // Future thunk integrations can be added here when TraitsThunks.ts is created
  },
});

export const {
  acquireTrait,
  discoverTrait,
  equipTrait,
  unequipTrait,
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset,
  unlockTraitSlot,
  clearError,
  setTraits,
} = traitsSlice.actions;

export default traitsSlice.reducer;
