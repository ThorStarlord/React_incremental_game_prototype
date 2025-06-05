/**
 * Trait Selectors Module
 * 
 * This module contains memoized selectors for the Traits feature.
 */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { Trait, TraitSlot } from './TraitsTypes';
import { UITrait, convertToUITrait } from '../utils/traitUIUtils';
// Import selectors from the slice file
import { 
  selectTraits as selectTraitsFromSlice,
  selectAcquiredTraits as selectAcquiredTraitsFromSlice, // This returns string[] (IDs)
  selectTraitLoading as selectTraitLoadingFromSlice,
  selectTraitError as selectTraitErrorFromSlice,
  selectDiscoveredTraits as selectDiscoveredTraitsFromSlice,
  selectTraitPresets as selectTraitPresetsFromSlice
} from './TraitsSlice';

// Import player selectors
import { 
  selectEquippedTraitIds as selectPlayerEquippedTraitIds,
  selectTraitSlots as selectPlayerTraitSlots,
  selectMaxTraitSlots as selectPlayerMaxTraitSlots,
  selectPermanentTraits as selectPlayerSlicePermanentTraitIds 
} from '../../Player/state/PlayerSelectors';

// Basic selectors from TraitsSlice (re-exports for consistency)
export const selectTraits = selectTraitsFromSlice; // Record<string, Trait>
export const selectAcquiredTraits = selectAcquiredTraitsFromSlice; // string[] - IDs of traits in the general acquired pool
export const selectTraitLoading = selectTraitLoadingFromSlice;
export const selectTraitError = selectTraitErrorFromSlice;
export const selectDiscoveredTraits = selectDiscoveredTraitsFromSlice; // string[] - IDs of discovered traits
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
 * Selects trait objects that are currently equipped by the player.
 */
export const selectEquippedTraitObjects = createSelector(
  [selectTraits, selectPlayerEquippedTraitIds], 
  (traits, equippedIds): Trait[] => {
    return equippedIds
      .map((id: string) => traits[id])
      .filter(Boolean) as Trait[];
  }
);

/**
 * Selects trait objects that are permanently acquired by the player.
 */
export const selectPermanentTraitObjects = createSelector(
  [selectTraits, selectPlayerSlicePermanentTraitIds], 
  (traits, permanentIds): Trait[] => {
    return permanentIds
      .map((id: string) => traits[id])
      .filter(Boolean) as Trait[];
  }
);

/**
 * Selects trait objects from the general acquired pool (TraitsSlice.acquiredTraits).
 */
export const selectAcquiredTraitObjects = createSelector(
  [selectTraits, selectAcquiredTraits], // selectAcquiredTraits is string[] from TraitsSlice
  (allTraitsData, acquiredTraitIds): Trait[] => {
    return acquiredTraitIds
      .map(id => allTraitsData[id])
      .filter(Boolean) as Trait[];
  }
);

/**
 * Selects trait objects that are in the general acquired pool (TraitsSlice.acquiredTraits)
 * but are NOT currently equipped by the player AND NOT permanent for the player.
 */
export const selectAvailableTraitObjects = createSelector(
  [selectAcquiredTraitObjects, selectPlayerEquippedTraitIds, selectPlayerSlicePermanentTraitIds],
  (acquiredTraitObjectsList, equippedIds, playerPermanentIds): Trait[] => {
    return acquiredTraitObjectsList.filter(
      (trait: Trait) => !equippedIds.includes(trait.id) && !playerPermanentIds.includes(trait.id)
    );
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
 * Selects all player's permanent traits converted to UITrait format
 */
export const selectPermanentUITraits = createSelector(
  [selectPermanentTraitObjects], 
  (permanentTraits): UITrait[] => {
    return permanentTraits.map(convertToUITrait);
  }
);

/**
 * Selects all available (acquired but not equipped/permanent) traits converted to UITrait format
 */
export const selectAvailableUITraits = createSelector(
  [selectAvailableTraitObjects],
  (availableTraits): UITrait[] => {
    return availableTraits.map(convertToUITrait);
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
 * Selects available trait objects for the player to equip.
 */
export const selectAvailableTraitObjectsForEquip = createSelector(
  [selectAvailableTraitObjects], 
  (availableTraits): Trait[] => {
    return availableTraits; 
  }
);

/**
 * Selects the count of available player trait slots.
 */
export const selectAvailableTraitSlotCount = createSelector(
  [selectPlayerTraitSlots], 
  (slots): number => {
    return slots.filter((slot: TraitSlot) => slot.isUnlocked && !slot.traitId).length;
  }
);

/**
 * Selects Trait objects that the player truly possesses (equipped or permanent on the player character).
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

// Additional convenience selectors
export const selectTraitsState = (state: RootState) => state.traits;
export const selectAllTraits = (state: RootState) => state.traits.traits;
