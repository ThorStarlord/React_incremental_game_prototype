import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  TraitsState, 
  DiscoverTraitPayload,
  SaveTraitPresetPayload,
  LoadTraitPresetPayload,
  DeleteTraitPresetPayload 
} from './TraitsTypes';

const initialState: TraitsState = {
  traits: {},
  presets: [],
  discoveredTraits: [],
  loading: false,
  error: null,
};

const traitsSlice = createSlice({
  name: 'traits',
  initialState,
  reducers: {
    loadTraits: (state, action: PayloadAction<Record<string, any>>) => {
      state.traits = action.payload;
      state.loading = false;
      state.error = null;
      
      if (state.discoveredTraits.length === 0) {
        state.discoveredTraits = Object.keys(action.payload);
      }
    },

    discoverTrait: (state, action: PayloadAction<DiscoverTraitPayload>) => {
      const { traitId } = action.payload;
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
    },

    saveTraitPreset: (state, action: PayloadAction<SaveTraitPresetPayload>) => {
      const { preset } = action.payload; // Correctly destructure the preset object
      const existingIndex = state.presets.findIndex(p => p.id === preset.id);
      
      if (existingIndex >= 0) {
        state.presets[existingIndex] = preset;
      } else {
        // Also check for name collision to prevent duplicates
        state.presets = state.presets.filter(p => p.name !== preset.name);
        state.presets.push(preset);
      }
    },

    loadTraitPreset: (state, action: PayloadAction<LoadTraitPresetPayload>) => {
      // Logic is handled by thunks/components, this action is a hook for middleware if needed
    },

    deleteTraitPreset: (state, action: PayloadAction<DeleteTraitPresetPayload>) => {
      const { presetId } = action.payload;
      state.presets = state.presets.filter(preset => preset.id !== presetId);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    resetTraitsState: (state) => {
      const traits = state.traits;
      Object.assign(state, initialState);
      state.traits = traits;
      
      if (Object.keys(traits).length > 0) {
        state.discoveredTraits = Object.keys(traits);
      }
    },
  },
});

export const {
  loadTraits,
  discoverTrait,
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset,
  setLoading,
  setError,
  resetTraitsState,
} = traitsSlice.actions;

export default traitsSlice.reducer;