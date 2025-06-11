/**
 * Trait Selectors Module
 * 
 * This module contains memoized selectors for the Traits feature.
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { Trait, TraitPreset } from './TraitsTypes';

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
export const selectPlayerPermanentTraits = (state: RootState) => state.player.permanentTraits;

export const selectPlayerMaxTraitSlots = (state: RootState) => state.player.maxTraitSlots;

// Add selectors that reference PlayerSlice directly to avoid circular dependencies
export const selectPlayerEquippedTraitIdsFromPlayer = (state: RootState) => 
  state.player.permanentTraits; // Use permanent traits as equipped for now

export const selectPlayerPermanentTraitIdsFromPlayer = (state: RootState) => 
  state.player.permanentTraits;

export const selectEquippedTraits = createSelector(
  [selectTraits, selectPlayerPermanentTraits],
  (traits, permanentTraitIds) => {
    return permanentTraitIds
      .map((traitId: string) => traits[traitId])
      .filter((trait: Trait | undefined) => trait !== undefined) as Trait[];
  }
);

export const selectAvailableTraits = createSelector(
  [selectTraits, selectAcquiredTraits, selectPlayerPermanentTraitIdsFromPlayer],
  (traits, acquiredTraitIds, permanentTraitIds) => {
    // Return traits that are acquired but not permanent
    return acquiredTraitIds
      .filter((traitId: string) => !permanentTraitIds.includes(traitId))
      .map((traitId: string) => traits[traitId])
      .filter((trait: Trait | undefined) => trait !== undefined) as Trait[];
  }
);

// Derived selectors using createSelector
export const selectEquippedTraitObjects = createSelector(
  [selectTraits, selectPlayerPermanentTraits],
  (traits, permanentTraitIds) => {
    return permanentTraitIds
      .map((id: string) => traits[id])
      .filter(Boolean) as Trait[];
  }
);

export const selectPermanentTraitObjects = createSelector(
  [selectTraits, selectPlayerPermanentTraits],
  (traits, permanentTraitIds) => {
    return permanentTraitIds
      .map((id: string) => traits[id])
      .filter(Boolean) as Trait[];
  }
);

export const selectAvailableTraitObjects = createSelector(
  [selectTraits, selectAcquiredTraits, selectPlayerPermanentTraits],
  (traits, acquiredTraitIds, permanentTraitIds) => {
    return acquiredTraitIds
      .filter((id: string) => !permanentTraitIds.includes(id))
      .map((id: string) => traits[id])
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
  [selectPlayerMaxTraitSlots, selectPlayerPermanentTraits], 
  (maxSlots, permanentTraits): number => {
    // Return available slots based on max slots minus permanent traits
    return Math.max(0, maxSlots - permanentTraits.length);
  }
);

/**
 * Selects Trait objects that the player truly possesses (permanent traits).
 */
export const selectPlayerTrulyPossessedTraitObjects = createSelector(
  [selectTraits, selectPlayerPermanentTraitIdsFromPlayer],
  (allTraits, permanentIds): Trait[] => {
    return permanentIds
      .map((id: string) => allTraits[id])
      .filter(Boolean) as Trait[];
  }
);

/**
 * Enhanced trait management selectors
 */
export const selectManageableTraits = createSelector(
  [selectAcquiredTraits, selectTraits, selectPlayerPermanentTraitIdsFromPlayer],
  (acquiredIds, allTraits, permanentIds) => {
    return acquiredIds.map((id: string) => ({
      ...allTraits[id],
      isPermanent: permanentIds.includes(id),
      isManageable: !permanentIds.includes(id) // Can be made permanent
    })).filter((trait: any) => trait.id); // Filter out any undefined traits
  }
);

export const selectTraitStatistics = createSelector(
  [selectAcquiredTraits, selectPlayerPermanentTraitIdsFromPlayer],
  (acquiredIds, permanentIds) => ({
    total: acquiredIds.length,
    permanent: permanentIds.length,
    available: acquiredIds.length - permanentIds.length,
    temporary: 0 // No temporary equipped traits in current system
  })
);

/**
 * Selects trait preset by ID
 */
export const selectTraitPresetById = createSelector(
  [selectTraitPresets, (_, presetId: string) => presetId],
  (presets, presetId) => presets.find((preset: TraitPreset) => preset.id === presetId)
);
