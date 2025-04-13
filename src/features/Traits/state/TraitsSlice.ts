import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import {
  Trait,
  TraitSlot,
  TraitPreset,
  TraitsState
} from './TraitsTypes';
// Import the thunks
import { makeTraitPermanentThunk, fetchTraitsThunk } from './TraitThunks';

// Initial trait slots
const initialSlots: TraitSlot[] = [
  { id: 'slot-1', index: 0, isUnlocked: true },
  { id: 'slot-2', index: 1, isUnlocked: true },
  { id: 'slot-3', index: 2, isUnlocked: false, unlockRequirements: { type: 'level', value: 5 } },
  { id: 'slot-4', index: 3, isUnlocked: false, unlockRequirements: { type: 'level', value: 10 } },
  { id: 'slot-5', index: 4, isUnlocked: false, unlockRequirements: { type: 'quest', value: 'master-of-traits' } },
];

// Initial state
const initialState: TraitsState = {
  traits: {}, // Use 'traits' as defined in TraitsState interface
  acquiredTraits: [],
  permanentTraits: [],
  slots: initialSlots,
  maxTraitSlots: 5,
  presets: [],
  discoveredTraits: [],
  equippedTraits: [],
  loading: false,
  error: null,
};

// Create the traits slice
const traitsSlice = createSlice({
  name: 'traits',
  initialState,
  reducers: {
    // Set all traits when loading game data
    setTraits: (state, action: PayloadAction<Record<string, Trait>>) => {
      state.traits = action.payload; // Store data in 'traits'
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
    
    // Equip a trait to a specific slot or the first available one
    equipTrait: (state, action: PayloadAction<{ traitId: string; slotIndex?: number }>) => {
      const { traitId, slotIndex } = action.payload;
      
      // Validate trait exists and is acquired
      if (!state.acquiredTraits.includes(traitId)) {
        console.warn(`Trait ${traitId} not acquired.`);
        return;
      }
      
      // Check if trait is already equipped in any slot
      if (state.slots.some(slot => slot.traitId === traitId)) {
        console.warn(`Trait ${traitId} is already equipped.`);
        return;
      }

      let targetSlot: TraitSlot | undefined;

      // Try equipping to a specific slot if index is provided
      if (typeof slotIndex === 'number' && slotIndex >= 0 && slotIndex < state.slots.length) {
        const specificSlot = state.slots[slotIndex];
        if (specificSlot.isUnlocked && !specificSlot.traitId) {
          targetSlot = specificSlot;
        } else {
          console.warn(`Slot index ${slotIndex} is not available or locked.`);
        }
      }

      // If no specific slot targeted or the specific slot was invalid, find the first available
      if (!targetSlot) {
        targetSlot = state.slots.find(
          slot => slot.isUnlocked && !slot.traitId
        );
      }
      
      if (!targetSlot) {
        console.warn(`No available trait slots to equip ${traitId}.`);
        return;
      }
      
      // Equip the trait
      targetSlot.traitId = traitId;
      // Update equippedTraits array for consistency
      state.equippedTraits = state.slots
        .filter(slot => slot.isUnlocked && slot.traitId)
        .map(slot => slot.traitId as string);
    },
    
    // Unequip a trait
    unequipTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      
      // Find and clear the slot with this trait
      const slot = state.slots.find(slot => slot.traitId === traitId);
      if (slot) {
        slot.traitId = null;
      }
      // Update equippedTraits array for consistency
      state.equippedTraits = state.slots
        .filter(slot => slot.isUnlocked && slot.traitId)
        .map(slot => slot.traitId as string);
    },
    
    // Make a trait permanent (always active)
    makePermanent: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      
      // Ensure trait is acquired
      if (!state.acquiredTraits.includes(traitId)) {
        console.warn(`Cannot make unacquired trait ${traitId} permanent.`);
        return;
      }
      
      // Add to permanent traits if not already there
      if (!state.permanentTraits.includes(traitId)) {
        state.permanentTraits.push(traitId);
      }
      
      // Remove from equipped traits to avoid duplicate effects
      const slot = state.slots.find(slot => slot.traitId === traitId);
      if (slot) {
        slot.traitId = null;
      }
      // Update equippedTraits array for consistency
      state.equippedTraits = state.slots
        .filter(slot => slot.isUnlocked && slot.traitId)
        .map(slot => slot.traitId as string);
    },
    
    // Unlock a trait slot
    unlockTraitSlot: (state, action: PayloadAction<number>) => {
      const slotIndex = action.payload;
      const slot = state.slots.find(s => s.index === slotIndex);
      
      if (slot && !slot.isUnlocked) {
        slot.isUnlocked = true;
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
        traits: state.slots
          .filter(slot => slot.traitId)
          .map(slot => slot.traitId as string),
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
      
      // Clear current equipped traits
      state.slots.forEach(slot => {
        slot.traitId = null;
      });
      
      // Equip each trait from the preset
      preset.traits.forEach((traitId, index) => {
        // Skip if index is out of bounds
        if (index >= state.slots.length) {
          return;
        }
        
        // Skip if slot is not unlocked
        if (!state.slots[index].isUnlocked) {
          return;
        }
        
        // Skip if trait is not acquired
        if (!state.acquiredTraits.includes(traitId)) {
          return;
        }
        
        // Equip the trait
        state.slots[index].traitId = traitId;
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
    }
  },
  // Add extra reducers for handling thunk lifecycle actions
  extraReducers: (builder) => {
    builder
      // Make Permanent Thunk
      .addCase(makeTraitPermanentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeTraitPermanentThunk.fulfilled, (state, action) => {
        state.loading = false;
        // The actual state changes (making permanent) are handled by the dispatched 'makePermanent' action within the thunk.
        // We might log success or update UI state here if needed.
        console.log(action.payload.message); // Example logging
      })
      .addCase(makeTraitPermanentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to make trait permanent';
      })
      // Fetch Traits Thunk
      .addCase(fetchTraitsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTraitsThunk.fulfilled, (state, action: PayloadAction<Record<string, Trait>>) => {
        state.loading = false;
        state.traits = action.payload; // Set the fetched traits in 'traits'
        state.error = null;
      })
      .addCase(fetchTraitsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch traits'; // Use rejectValue
      });
  }
});

// Export actions
export const {
  setTraits,
  discoverTrait,
  acquireTrait,
  equipTrait,
  unequipTrait,
  makePermanent,
  unlockTraitSlot,
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset,
  setLoading,
  setError
} = traitsSlice.actions;

// Selectors
export const selectTraits = (state: RootState) => state.traits.traits;
export const selectAcquiredTraits = (state: RootState) => state.traits.acquiredTraits;
export const selectPermanentTraits = (state: RootState) => state.traits.permanentTraits;
export const selectTraitSlots = (state: RootState) => state.traits.slots;
export const selectTraitPresets = (state: RootState) => state.traits.presets;
export const selectTraitLoading = (state: RootState) => state.traits.loading;
export const selectTraitError = (state: RootState) => state.traits.error;

// Helper selector to get details for an array of trait IDs
export const selectTraitsByIds = (state: RootState, traitIds: string[]) => {
  return traitIds.map(id => state.traits.traits[id]).filter(Boolean);
};

// Use the state array directly for equipped traits
export const selectEquippedTraitIds = (state: RootState) => state.traits.equippedTraits;

// Export reducer
export default traitsSlice.reducer;
