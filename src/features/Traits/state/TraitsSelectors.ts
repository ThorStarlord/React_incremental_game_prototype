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
// Import selectors from the slice file
import { 
  selectTraits as selectTraitsFromSlice,
  selectEquippedTraitIds as selectEquippedTraitIdsFromSlice,
  selectPermanentTraits as selectPermanentTraitsFromSlice,
  selectAcquiredTraits as selectAcquiredTraitsFromSlice,
  selectTraitSlots as selectTraitSlotsFromSlice,
  selectTraitLoading as selectTraitLoadingFromSlice, // Import loading selector
  selectTraitError as selectTraitErrorFromSlice,     // Import error selector
  selectDiscoveredTraits as selectDiscoveredTraitsFromSlice, // Import discovered selector
  selectTraitPresets as selectTraitPresetsFromSlice
} from './TraitsSlice';

// Basic selectors (re-exports from TraitsSlice for consistency)
export const selectTraits = selectTraitsFromSlice;
export const selectEquippedTraitIds = selectEquippedTraitIdsFromSlice;
export const selectPermanentTraits = selectPermanentTraitsFromSlice;
export const selectAcquiredTraits = selectAcquiredTraitsFromSlice;
export const selectTraitSlots = selectTraitSlotsFromSlice;
export const selectTraitLoading = selectTraitLoadingFromSlice; // Re-export loading selector
export const selectTraitError = selectTraitErrorFromSlice;     // Re-export error selector
export const selectDiscoveredTraits = selectDiscoveredTraitsFromSlice; // Re-export discovered selector
export const selectTraitPresets = selectTraitPresetsFromSlice;

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
      .map((id: string) => traits[id]) // Add string type annotation for id
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
