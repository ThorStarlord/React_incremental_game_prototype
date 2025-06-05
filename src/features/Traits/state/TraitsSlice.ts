import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import {
  Trait,
  TraitPreset,
  TraitsState
} from './TraitsTypes';
// Import the thunks
import { fetchTraitsThunk, acquireTraitWithEssenceThunk } from './TraitThunks';

// Initial state
const initialState: TraitsState = {
  traits: {}, 
  acquiredTraits: [],
  // permanentTraits: [], // Removed: Player's permanent traits are managed in PlayerSlice
  presets: [],
  discoveredTraits: [],
  loading: false,
  error: null
};

// Create the traits slice
const traitsSlice = createSlice({
  name: 'traits',
  initialState,
  reducers: {
    setTraits: (state, action: PayloadAction<Record<string, Trait>>) => {
      state.traits = action.payload; 
    },
    discoverTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
    },
    acquireTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
      if (!state.acquiredTraits.includes(traitId)) {
        state.acquiredTraits.push(traitId);
      }
    },
    // makePermanent reducer removed as it's deprecated
    // makePermanent: (state, action: PayloadAction<string>) => {
    //   const traitId = action.payload;
    //   if (!state.acquiredTraits.includes(traitId)) {
    //     return;
    //   }
    //   if (!state.permanentTraits.includes(traitId)) { // This referred to TraitsSlice.permanentTraits
    //     state.permanentTraits.push(traitId);
    //   }
    // },
    saveTraitPreset: (state, action: PayloadAction<{ name: string, description?: string }>) => {
      const { name, description } = action.payload;
      const preset: TraitPreset = {
        id: `preset-${Date.now()}`,
        name,
        description: description || '',
        traits: state.acquiredTraits, 
        created: Date.now()
      };
      state.presets.push(preset);
    },
    loadTraitPreset: (state, action: PayloadAction<string>) => {
      const presetId = action.payload;
      const preset = state.presets.find(p => p.id === presetId);
      if (!preset) {
        return;
      }
      preset.traits.forEach((traitId) => {
        if (!state.acquiredTraits.includes(traitId)) {
          state.acquiredTraits.push(traitId);
        }
      });
    },
    deleteTraitPreset: (state, action: PayloadAction<string>) => {
      const presetId = action.payload;
      state.presets = state.presets.filter(p => p.id !== presetId);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addTraitDefinition: (state, action: PayloadAction<Trait>) => {
      state.traits[action.payload.id] = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTraitsThunk.pending, (state) => {
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchTraitsThunk.fulfilled, (state, action: PayloadAction<Record<string, Trait>>) => {
        state.loading = false;
        state.traits = action.payload; 
        state.discoveredTraits = Object.keys(action.payload);
        state.error = null;
      })
      .addCase(fetchTraitsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to fetch traits';
      })
      .addCase(acquireTraitWithEssenceThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(acquireTraitWithEssenceThunk.fulfilled, (state, action) => {
        console.log(`Trait Resonated (TraitsSlice handling): ${action.payload.message}`);
      })
      .addCase(acquireTraitWithEssenceThunk.rejected, (state, action) => {
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : action.error.message || 'Failed to resonate trait';
        console.error('Failed to resonate trait (TraitsSlice handling):', state.error);
      });
  }
});

export const {
  setTraits,
  discoverTrait,
  acquireTrait,
  // makePermanent, // Removed
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset,
  setLoading,
  setError,
  addTraitDefinition
} = traitsSlice.actions;

// Selectors
export const selectTraits = (state: RootState) => state.traits.traits;
export const selectAcquiredTraits = (state: RootState) => state.traits.acquiredTraits;
// export const selectPermanentTraits = (state: RootState) => state.traits.permanentTraits; // Removed: Use PlayerSelectors.selectPermanentTraits for player's permanent traits
export const selectTraitPresets = (state: RootState) => state.traits.presets;
export const selectTraitLoading = (state: RootState) => state.traits.loading;
export const selectTraitError = (state: RootState) => state.traits.error;
export const selectDiscoveredTraits = (state: RootState) => state.traits.discoveredTraits;

export const selectTraitsByIds = (state: RootState, traitIds: string[]) => {
  return traitIds.map(id => state.traits.traits[id]).filter(Boolean);
};

export default traitsSlice.reducer;
