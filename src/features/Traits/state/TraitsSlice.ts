import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  TraitsState, 
  AcquireTraitPayload, 
  DiscoverTraitPayload,
  SaveTraitPresetPayload,
  LoadTraitPresetPayload,
  DeleteTraitPresetPayload 
} from './TraitsTypes';

// The initial state should be clean.
const initialState: TraitsState = {
  traits: {},
  acquiredTraits: [],
  presets: [],
  discoveredTraits: [],
  loading: false,
  error: null,
};

const traitsSlice = createSlice({
  name: 'traits',
  initialState,
  reducers: {
    // Load trait definitions
    loadTraits: (state, action: PayloadAction<Record<string, any>>) => {
      state.traits = action.payload;
      state.loading = false;
      state.error = null;
      
      // --- TEMPORARY DEVELOPER SHORTCUT ---
      // When traits are loaded, we will temporarily treat all of them
      // as "acquired" and "discovered" so the UI can be tested.
      const allTraitIds = Object.keys(action.payload);
      state.acquiredTraits = allTraitIds;
      state.discoveredTraits = allTraitIds;
      // TODO: Remove this logic once the "learn" and "discover" mechanics
      // are fully implemented and triggered by user actions.
      // --- END OF TEMPORARY FIX ---
    },

    // Discover a trait
    discoverTrait: (state, action: PayloadAction<DiscoverTraitPayload>) => {
      const { traitId } = action.payload;
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
    },

    // Acquire a trait (add to general acquired pool)
    acquireTrait: (state, action:PayloadAction<AcquireTraitPayload>) => {
      const { traitId } = action.payload;
      if (!state.acquiredTraits.includes(traitId)) {
        state.acquiredTraits.push(traitId);
      }
      // Also mark as discovered if not already
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
    },

    // Save trait preset
    saveTraitPreset: (state, action: PayloadAction<SaveTraitPresetPayload>) => {
      const { preset } = action.payload;
      const existingIndex = state.presets.findIndex(p => p.id === preset.id);
      
      if (existingIndex >= 0) {
        state.presets[existingIndex] = preset;
      } else {
        state.presets.push(preset);
      }
    },

    // Load trait preset
    loadTraitPreset: (state, action: PayloadAction<LoadTraitPresetPayload>) => {
      // This action might trigger other effects in thunks or sagas
      // The actual loading logic would be handled by the calling component
    },

    // Delete trait preset
    deleteTraitPreset: (state, action: PayloadAction<DeleteTraitPresetPayload>) => {
      const { presetId } = action.payload;
      state.presets = state.presets.filter(preset => preset.id !== presetId);
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Reset state
    resetTraitsState: (state) => {
      const traits = state.traits; // Keep the definitions
      Object.assign(state, initialState);
      state.traits = traits;
      
      // Re-apply the temporary fix after reset if needed for dev
      const allTraitIds = Object.keys(traits);
      state.acquiredTraits = allTraitIds;
      state.discoveredTraits = allTraitIds;
    },
  },
});

export const {
  loadTraits,
  discoverTrait,
  acquireTrait,
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset,
  setLoading,
  setError,
  resetTraitsState,
} = traitsSlice.actions;

export default traitsSlice.reducer;