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

// Basic selectors (re-exports from TraitsSlice for consistency)
export const selectTraits = (state: RootState) => state.traits.traits; // Ensure this points to state.traits.traits
export const selectEquippedTraitIds = (state: RootState) => state.traits.equippedTraits;
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
  [selectTraits, (_, traitId: string) => traitId], // selectTraits now correctly points to the traits object
  (traits, traitId): Trait | undefined => traits[traitId]
);

/**
 * Selects trait objects that are currently equipped
 */
export const selectEquippedTraitObjects = createSelector(
  [selectTraits, selectEquippedTraitIds], // Uses the correct selectTraits
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
  [selectTraits, selectPermanentTraits], // Uses the correct selectTraits
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
  [selectTraits, selectAcquiredTraits, selectEquippedTraitIds, selectPermanentTraits], // Uses the correct selectTraits
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
  [selectTraits, selectDiscoveredTraits], // Uses the correct selectTraits
  (traits, discoveredIds): Trait[] => {
    return discoveredIds
      .map(id => traits[id])
      .filter(Boolean); // Filter out undefined values
  }
);
