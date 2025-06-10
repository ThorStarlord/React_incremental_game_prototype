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
export const traitsSlice = createSlice({
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
    /**
     * Save a trait preset configuration
     */
    saveTraitPreset: (state, action: PayloadAction<TraitPreset>) => {
      const preset = action.payload;
      const existingIndex = state.presets.findIndex(p => p.id === preset.id);
      
      if (existingIndex >= 0) {
        state.presets[existingIndex] = preset;
      } else {
        state.presets.push(preset);
      }
    },

    /**
     * Load a trait preset configuration
     * Note: This action only manages the preset data. 
     * The actual trait equipping is handled by PlayerSlice actions.
     */
    loadTraitPreset: (state, action: PayloadAction<string>) => {
      const presetId = action.payload;
      const preset = state.presets.find(p => p.id === presetId);
      
      if (preset) {
        // Mark preset as recently used (for future sorting/UI features)
        preset.lastUsed = Date.now();
      }
    },

    /**
     * Delete a trait preset
     */
    deleteTraitPreset: (state, action: PayloadAction<string>) => {
      const presetId = action.payload;
      state.presets = state.presets.filter(preset => preset.id !== presetId);
    },

    /**
     * Clear all equipped traits
     * Note: This is a convenience action that will be handled by PlayerSlice
     */
    clearAllEquippedTraits: (state) => {
      // This reducer doesn't actually modify state - it's handled by PlayerSlice
      // But we keep it here for action consistency
    },

    /**
     * Reset trait management state
     */
    resetTraitManagement: (state) => {
      state.presets = [];
    },
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
        // Access the correct property from the returned payload
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
  clearAllEquippedTraits,
  resetTraitManagement,
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
