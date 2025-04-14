/**
 * Trait Selectors Module
 * 
 * This module contains memoized selectors for the Traits feature.
 */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
// Import Trait type from TraitsTypes
import { Trait } from './TraitsTypes'; 
// Import UITrait and convertToUITrait from traitUIUtils
import { UITrait, convertToUITrait } from '../utils/traitUIUtils';
// Import the correct memoized selector for equipped IDs from the slice
import { selectEquippedTraitIds as selectEquippedTraitIdsFromSlice } from './TraitsSlice';

// Basic selectors (re-exports from TraitsSlice for consistency)
export const selectTraits = (state: RootState) => state.traits.traits;
// Use the correct selector from the slice:
export const selectEquippedTraitIds = selectEquippedTraitIdsFromSlice;
export const selectPermanentTraits = (state: RootState) => state.traits.permanentTraits;
export const selectAcquiredTraits = (state: RootState) => state.traits.acquiredTraits;
export const selectTraitSlots = (state: RootState) => state.traits.slots;
export const selectTraitLoading = (state: RootState) => state.traits.loading;
export const selectTraitError = (state: RootState) => state.traits.error;
export const selectDiscoveredTraits = (state: RootState) => state.traits.discoveredTraits;
export const selectTraitPresets = (state: RootState) => state.traits.presets;

/**
 * Selects a single trait object by its ID.
 */
export const selectTraitById = createSelector(
  [selectTraits, (_, traitId: string) => traitId],
  (traits, traitId): Trait | undefined => traits[traitId]
);

/**
 * Selects trait objects that are currently equipped
 */
export const selectEquippedTraitObjects = createSelector(
  [selectTraits, selectEquippedTraitIds], // Uses the correct selectEquippedTraitIds now
  (traits, equippedIds): Trait[] => {
    return equippedIds
      .map(id => traits[id])
      .filter(Boolean); // Filter out undefined values
  }
);

/**
 * Selects trait objects that are permanently acquired
 */
export const selectPermanentTraitObjects = createSelector(
  [selectTraits, selectPermanentTraits],
  (traits, permanentIds): Trait[] => {
    return permanentIds
      .map(id => traits[id])
      .filter(Boolean); // Filter out undefined values
  }
);

/**
 * Selects trait objects that are available but not equipped
 */
export const selectAvailableTraitObjects = createSelector(
  [selectTraits, selectAcquiredTraits, selectEquippedTraitIds, selectPermanentTraits], // Uses the correct selectEquippedTraitIds now
  (traits, acquiredIds, equippedIds, permanentIds): Trait[] => {
    // Get trait IDs that are acquired but not equipped or permanent
    const availableIds = acquiredIds.filter(
      id => !equippedIds.includes(id) && !permanentIds.includes(id)
    );
    
    return availableIds
      .map(id => traits[id])
      .filter(Boolean); // Filter out undefined values
  }
);

/**
 * Selects all equipped traits converted to UITrait format
 */
export const selectEquippedUITraits = createSelector(
  [selectEquippedTraitObjects],
  (equippedTraits): UITrait[] => {
    return equippedTraits.map(convertToUITrait);
  }
);

/**
 * Selects all permanent traits converted to UITrait format
 */
export const selectPermanentUITraits = createSelector(
  [selectPermanentTraitObjects],
  (permanentTraits): UITrait[] => {
    return permanentTraits.map(convertToUITrait);
  }
);

/**
 * Selects all available traits converted to UITrait format
 */
export const selectAvailableUITraits = createSelector(
  [selectAvailableTraitObjects],
  (availableTraits): UITrait[] => {
    return availableTraits.map(convertToUITrait);
  }
);

/**
 * Selects all acquired traits (equipped + available + permanent) as Trait objects
 */
export const selectAcquiredTraitObjects = createSelector(
  [selectEquippedTraitObjects, selectAvailableTraitObjects, selectPermanentTraitObjects],
  (equipped, available, permanent): Trait[] => {
    return [...equipped, ...available, ...permanent];
  }
);

/**
 * Selects all discovered trait objects
 */
export const selectDiscoveredTraitObjects = createSelector(
  [selectTraits, selectDiscoveredTraits],
  (traits, discoveredIds): Trait[] => {
    return discoveredIds
      .map(id => traits[id])
      .filter(Boolean); // Filter out undefined values
  }
);

/**
 * Selects available trait objects for equip
 * (Traits that are acquired but not equipped and not permanent)
 */
export const selectAvailableTraitObjectsForEquip = createSelector(
  [selectAvailableTraitObjects], // Depends on the selector that already filters permanent traits
  (availableTraits): Trait[] => {
    // No need for further filtering here, as selectAvailableTraitObjects already excludes permanent traits.
    return availableTraits; 
  }
);

/**
 * Selects the count of available trait slots
 */
export const selectAvailableTraitSlotCount = createSelector(
  [selectTraitSlots],
  (slots): number => {
    return slots.filter(slot => slot.isUnlocked && !slot.traitId).length;
  }
);
