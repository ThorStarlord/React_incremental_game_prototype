/**
 * Trait Selectors Module
 * 
 * This module contains memoized selectors for the Traits feature.
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { Trait, TraitSlot } from './TraitsTypes';

// Helper function for UI trait conversion
interface UITrait {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: string;
  isEquipped?: boolean;
  isPermanent?: boolean;
}

function convertToUITrait(trait: Trait): UITrait {
  return {
    id: trait.id,
    name: trait.name,
    description: trait.description,
    category: trait.category,
    rarity: trait.rarity,
  };
}

// Base selectors - these must be defined before any createSelector calls
export const selectTraitsState = (state: RootState) => state.traits;

export const selectTraits = (state: RootState) => state.traits.traits;

export const selectAcquiredTraits = (state: RootState) => state.traits.acquiredTraits;

export const selectDiscoveredTraits = (state: RootState) => state.traits.discoveredTraits;

export const selectTraitPresets = (state: RootState) => state.traits.presets;

export const selectTraitLoading = (state: RootState) => state.traits.loading;

export const selectTraitError = (state: RootState) => state.traits.error;

// Player-related selectors - import from Player feature to avoid circular dependency
export const selectPlayerTraitSlots = (state: RootState) => state.player.traitSlots;

export const selectPlayerPermanentTraits = (state: RootState) => state.player.permanentTraits;

// Add selectors that reference PlayerSlice directly to avoid circular dependencies
export const selectPlayerEquippedTraitIdsFromPlayer = (state: RootState) => 
  state.player.traitSlots
    .filter(slot => slot.traitId !== null)
    .map(slot => slot.traitId!);

export const selectPlayerPermanentTraitIdsFromPlayer = (state: RootState) => 
  state.player.permanentTraits;

// Derived selectors using createSelector
export const selectEquippedTraitObjects = createSelector(
  [selectTraits, selectPlayerTraitSlots],
  (traits, traitSlots) => {
    return traitSlots
      .filter(slot => slot.traitId !== null)
      .map(slot => traits[slot.traitId!])
      .filter(Boolean) as Trait[];
  }
);

export const selectPermanentTraitObjects = createSelector(
  [selectTraits, selectPlayerPermanentTraits],
  (traits, permanentTraitIds) => {
    return permanentTraitIds
      .map(id => traits[id])
      .filter(Boolean) as Trait[];
  }
);

export const selectAvailableTraitObjects = createSelector(
  [selectTraits, selectAcquiredTraits, selectPlayerPermanentTraits, selectPlayerTraitSlots],
  (traits, acquiredTraitIds, permanentTraitIds, traitSlots) => {
    const equippedTraitIds = traitSlots
      .filter(slot => slot.traitId !== null)
      .map(slot => slot.traitId!);
    
    return acquiredTraitIds
      .filter(id => !permanentTraitIds.includes(id) && !equippedTraitIds.includes(id))
      .map(id => traits[id])
      .filter(Boolean) as Trait[];
  }
);

/**
 * Selects a single trait object by its ID.
 */
export const selectTraitById = createSelector(
  [selectTraits, (_, traitId: string) => traitId],
  (traits, traitId): Trait | undefined => traits[traitId]
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
 * Selects all acquired trait objects
 */
export const selectAcquiredTraitObjects = createSelector(
  [selectTraits, selectAcquiredTraits], 
  (traits, acquiredIds): Trait[] => {
    return acquiredIds
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
  [selectTraits, selectPlayerEquippedTraitIdsFromPlayer, selectPlayerPermanentTraitIdsFromPlayer],
  (allTraits, equippedIds, playerPermanentIds): Trait[] => {
    const possessedIds = Array.from(new Set([...equippedIds, ...playerPermanentIds]));
    return possessedIds
      .map(id => allTraits[id])
      .filter(Boolean) as Trait[];
  }
);

/**
 * Enhanced trait management selectors
 */
export const selectManageableTraits = createSelector(
  [selectAcquiredTraits, selectTraits, selectPlayerEquippedTraitIdsFromPlayer, selectPlayerPermanentTraitIdsFromPlayer],
  (acquiredIds, allTraits, equippedIds, permanentIds) => {
    return acquiredIds.map(id => ({
      ...allTraits[id],
      isEquipped: equippedIds.includes(id),
      isPermanent: permanentIds.includes(id),
      isManageable: !permanentIds.includes(id) // Can be equipped/unequipped
    })).filter(trait => trait.id); // Filter out any undefined traits
  }
);

export const selectTraitStatistics = createSelector(
  [selectAcquiredTraits, selectPlayerEquippedTraitIdsFromPlayer, selectPlayerPermanentTraitIdsFromPlayer],
  (acquired, equipped, permanent) => ({
    total: acquired.length,
    equipped: equipped.length,
    permanent: permanent.length,
    available: acquired.length - permanent.length,
    temporary: equipped.filter(id => !permanent.includes(id)).length
  })
);

/**
 * Selects trait preset by ID
 */
export const selectTraitPresetById = createSelector(
  [selectTraitPresets, (_, presetId: string) => presetId],
  (presets, presetId) => presets.find(preset => preset.id === presetId)
);
