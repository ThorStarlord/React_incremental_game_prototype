/**
 * Trait Selectors Module
 * 
 * This module contains memoized selectors for the Traits feature.
 */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
// Import Trait type from TraitsTypes
import { Trait, TraitSlot } from './TraitsTypes'; // Import TraitSlot
// Import UITrait and convertToUITrait from traitUIUtils
import { UITrait, convertToUITrait } from '../utils/traitUIUtils';
// Import selectors from the slice file
import { 
  selectTraits as selectTraitsFromSlice,
  selectPermanentTraits as selectPermanentTraitsFromSlice,
  selectAcquiredTraits as selectAcquiredTraitsFromSlice,
  selectTraitLoading as selectTraitLoadingFromSlice, // Import loading selector
  selectTraitError as selectTraitErrorFromSlice,     // Import error selector
  selectDiscoveredTraits as selectDiscoveredTraitsFromSlice, // Import discovered selector
  selectTraitPresets as selectTraitPresetsFromSlice
} from './TraitsSlice';

// Import player selectors for equipped traits and slots
import { 
  selectEquippedTraitIds as selectPlayerEquippedTraitIds,
  selectTraitSlots as selectPlayerTraitSlots,
  selectMaxTraitSlots as selectPlayerMaxTraitSlots,
  selectPermanentTraits as selectPlayerSlicePermanentTraitIds // Import player's permanent trait IDs
} from '../../Player/state/PlayerSelectors';

// Basic selectors (re-exports from TraitsSlice for consistency)
export const selectTraits = selectTraitsFromSlice;
export const selectPermanentTraits = selectPermanentTraitsFromSlice;
export const selectAcquiredTraits = selectAcquiredTraitsFromSlice;
export const selectTraitLoading = selectTraitLoadingFromSlice; // Re-export loading selector
export const selectTraitError = selectTraitErrorFromSlice;     // Re-export error selector
export const selectDiscoveredTraits = selectDiscoveredTraitsFromSlice; // Re-export discovered selector
export const selectTraitPresets = selectTraitPresetsFromSlice;

// Re-export player selectors for convenience in Traits feature
export const selectEquippedTraitIds = selectPlayerEquippedTraitIds;
export const selectTraitSlots = selectPlayerTraitSlots;
export const selectMaxTraitSlots = selectPlayerMaxTraitSlots;


/**
 * Selects a single trait object by its ID.
 */
export const selectTraitById = createSelector(
  [selectTraits, (_, traitId: string) => traitId],
  (traits, traitId): Trait | undefined => traits[traitId]
);

/**
 * Selects trait objects that are currently equipped (from PlayerState)
 */
export const selectEquippedTraitObjects = createSelector(
  [selectTraits, selectEquippedTraitIds],
  (traits, equippedIds): Trait[] => {
    return equippedIds
      .map((id: string) => traits[id])
      .filter(Boolean) as Trait[];
  }
);

/**
 * Selects trait objects that are permanently acquired
 */
export const selectPermanentTraitObjects = createSelector(
  [selectTraits, selectPermanentTraits],
  (traits, permanentIds): Trait[] => {
    return permanentIds
      .map((id: string) => traits[id])
      .filter(Boolean) as Trait[];
  }
);

/**
 * Selects trait objects that are acquired but not equipped (by player) and not permanent
 */
export const selectAvailableTraitObjects = createSelector(
  [selectTraits, selectAcquiredTraits, selectEquippedTraitIds, selectPermanentTraits],
  (traits, acquiredIds, equippedIds, permanentIds): Trait[] => {
    // Get trait IDs that are acquired but not equipped or permanent
    const availableIds = acquiredIds.filter(
      (id: string) => !equippedIds.includes(id) && !permanentIds.includes(id)
    );
    
    return availableIds
      .map((id: string) => traits[id])
      .filter(Boolean) as Trait[];
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
      .map((id: string) => traits[id])
      .filter(Boolean) as Trait[];
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
 * Selects the count of available trait slots (from PlayerState)
 */
export const selectAvailableTraitSlotCount = createSelector(
  [selectTraitSlots],
  (slots): number => {
    return slots.filter((slot: TraitSlot) => slot.isUnlocked && !slot.traitId).length;
  }
);

/**
 * Selects Trait objects that the player truly possesses (equipped or permanent on the player character).
 * This is the definitive list for actions like sharing.
 */
export const selectPlayerTrulyPossessedTraitObjects = createSelector(
  [selectTraits, selectPlayerEquippedTraitIds, selectPlayerSlicePermanentTraitIds],
  (allTraits, equippedIds, playerPermanentIds): Trait[] => {
    const possessedIds = Array.from(new Set([...equippedIds, ...playerPermanentIds]));
    return possessedIds
      .map(id => allTraits[id])
      .filter(Boolean) as Trait[];
  }
);

// Additional convenience selectors for Player UI integration
export const selectTraitsState = (state: RootState) => state.traits;
export const selectAllTraits = (state: RootState) => state.traits.traits;
