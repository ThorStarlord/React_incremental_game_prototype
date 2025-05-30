import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import {
  Trait,
  TraitPreset,
  TraitsState
} from './TraitsTypes';
// Import the thunks
import { makeTraitPermanentThunk, fetchTraitsThunk } from './TraitThunks';

// Initial state - ensure traits starts empty
const initialState: TraitsState = {
  traits: {}, // Start with an empty traits object
  acquiredTraits: [],
  permanentTraits: [],
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
    // Set all traits when loading game data
    setTraits: (state, action: PayloadAction<Record<string, Trait>>) => {
      state.traits = action.payload; // Use state.traits
    },
    
    // Track when a trait is discovered
    discoverTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
    },
    
    // Add a trait to player's acquired traits
    acquireTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      
      // Add to discovered and acquired traits if not already there
      if (!state.discoveredTraits.includes(traitId)) {
        state.discoveredTraits.push(traitId);
      }
      
      if (!state.acquiredTraits.includes(traitId)) {
        state.acquiredTraits.push(traitId);
      }
    },
    
    // Make a trait permanent (always active)
    makePermanent: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      
      // Ensure trait is acquired
      if (!state.acquiredTraits.includes(traitId)) {
        return;
      }
      
      // Add to permanent traits if not already there
      if (!state.permanentTraits.includes(traitId)) {
        state.permanentTraits.push(traitId);
      }
    },
    
    // Save a trait preset
    saveTraitPreset: (state, action: PayloadAction<{ name: string, description?: string }>) => {
      const { name, description } = action.payload;
      
      // Create a new preset
      const preset: TraitPreset = {
        id: `preset-${Date.now()}`,
        name,
        description: description || '',
        // Traits in presets will now refer to acquired traits, not equipped slots
        traits: state.acquiredTraits, // Or a filtered list if only equipped traits should be saved
        created: Date.now()
      };
      
      state.presets.push(preset);
    },
    
    // Load a trait preset
    loadTraitPreset: (state, action: PayloadAction<string>) => {
      const presetId = action.payload;
      const preset = state.presets.find(p => p.id === presetId);
      
      if (!preset) {
        return;
      }
      
      // This reducer will no longer directly equip to slots.
      // A thunk would be needed to coordinate with PlayerSlice to equip traits.
      // For now, just ensure traits are acquired if not already.
      preset.traits.forEach((traitId) => {
        if (!state.acquiredTraits.includes(traitId)) {
          state.acquiredTraits.push(traitId);
        }
      });
    },
    
    // Delete a trait preset
    deleteTraitPreset: (state, action: PayloadAction<string>) => {
      const presetId = action.payload;
      state.presets = state.presets.filter(p => p.id !== presetId);
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Add a new trait definition
    addTraitDefinition: (state, action: PayloadAction<Trait>) => {
      state.traits[action.payload.id] = action.payload;
    }
  },
  // Add extraReducers to handle async thunk lifecycle actions
  extraReducers: (builder) => {
    builder
      // Handle fetchTraitsThunk lifecycle
      .addCase(fetchTraitsThunk.pending, (state) => {
        state.loading = true; // Use boolean for loading state
        state.error = null; // Clear previous errors on new request
      })
      .addCase(fetchTraitsThunk.fulfilled, (state, action: PayloadAction<Record<string, Trait>>) => {
        state.loading = false;
        state.traits = action.payload; // Store the fetched traits
        state.discoveredTraits = Object.keys(action.payload);
        state.error = null;
      })
      .addCase(fetchTraitsThunk.rejected, (state, action) => {
        state.loading = false;
        // Store error message, preferring payload if available
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to fetch traits';
      })
      // Handle makeTraitPermanentThunk lifecycle
      .addCase(makeTraitPermanentThunk.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear errors specific to this operation
      })
      .addCase(makeTraitPermanentThunk.fulfilled, (state, action) => {
        state.loading = false;
        // The core state change (adding to permanentTraits) is handled
        // by the synchronous `makePermanent` reducer dispatched *within* the thunk.
        // Log success or handle UI feedback if needed.
        console.log(action.payload.message); // Example logging
      })
      .addCase(makeTraitPermanentThunk.rejected, (state, action) => {
        state.loading = false;
        // Handle failure state, ensuring payload is treated as string or fallback
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : action.error.message || 'Failed to make trait permanent';
        console.error('Failed to make trait permanent:', state.error);
      });
  }
});

// Export actions
export const {
  setTraits,
  discoverTrait,
  acquireTrait,
  makePermanent,
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
export const selectPermanentTraits = (state: RootState) => state.traits.permanentTraits;
export const selectTraitPresets = (state: RootState) => state.traits.presets;
export const selectTraitLoading = (state: RootState) => state.traits.loading;
export const selectTraitError = (state: RootState) => state.traits.error;
export const selectDiscoveredTraits = (state: RootState) => state.traits.discoveredTraits; // Ensure this selector is exported

// Helper selector to get details for an array of trait IDs
export const selectTraitsByIds = (state: RootState, traitIds: string[]) => {
  return traitIds.map(id => state.traits.traits[id]).filter(Boolean);
};

// Export reducer
export default traitsSlice.reducer;
