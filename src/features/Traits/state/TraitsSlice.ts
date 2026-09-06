import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  Trait,
  TraitsState,
  DiscoverTraitPayload,
  SaveTraitPresetPayload,
  LoadTraitPresetPayload,
  DeleteTraitPresetPayload,
} from './TraitsTypes';

const initialState: TraitsState = {
  traits: {},
  presets: [],
  discoveredTraits: [],
  loading: false,
  error: null,
};

/**
 * Legacy/simple Traits remain initially known unless they explicitly opt into
 * authored discovery. This keeps the prototype backward-compatible while making
 * relationship-mediated discovery a real gameplay gate.
 */
export const getInitiallyDiscoveredTraitIds = (
  traits: Record<string, Trait>
): string[] => Object.values(traits)
  .filter(trait => (trait.discoveryMode ?? 'initial') === 'initial')
  .map(trait => trait.id);

const traitsSlice = createSlice({
  name: 'traits',
  initialState,
  reducers: {
    loadTraits: (state, action: PayloadAction<Record<string, Trait>>) => {
      const incoming = action.payload;
      const previouslyDiscovered = state.discoveredTraits.filter(id => Boolean(incoming[id]));
      const initiallyDiscovered = getInitiallyDiscoveredTraitIds(incoming);

      state.traits = incoming;
      state.loading = false;
      state.error = null;

      // Loading definitions is not the same thing as discovering every Trait.
      // Preserve discoveries already earned in this save, while adding only the
      // Traits whose definitions say they are initially player-known.
      state.discoveredTraits = Array.from(
        new Set([...initiallyDiscovered, ...previouslyDiscovered])
      );
    },

    discoverTrait: (state, action: PayloadAction<DiscoverTraitPayload>) => {
      const { traitId } = action.payload;
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
    },

    saveTraitPreset: (state, action: PayloadAction<SaveTraitPresetPayload>) => {
      const { preset } = action.payload;
      const existingIndex = state.presets.findIndex(p => p.id === preset.id);

      if (existingIndex >= 0) {
        state.presets[existingIndex] = preset;
      } else {
        state.presets = state.presets.filter(p => p.name !== preset.name);
        state.presets.push(preset);
      }
    },

    loadTraitPreset: (state, action: PayloadAction<LoadTraitPresetPayload>) => {
      // Logic is handled by thunks/components, this action is a hook for middleware if needed.
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
      state.discoveredTraits = getInitiallyDiscoveredTraitIds(traits);
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
