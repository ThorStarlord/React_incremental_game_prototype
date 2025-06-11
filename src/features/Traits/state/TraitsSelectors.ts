/**
 * Trait Selectors Module
 * 
 * This module contains memoized selectors for the Traits feature.
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { TraitsState, Trait, TraitPreset } from './TraitsTypes';

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
export const selectTraitsState = (state: RootState): TraitsState => state.traits;

export const selectTraits = createSelector(
  [selectTraitsState],
  (traitsState) => traitsState.traits
);

// Alias for backward compatibility
export const selectAllTraits = selectTraits;

export const selectAcquiredTraits = createSelector(
  [selectTraitsState],
  (traitsState) => traitsState.acquiredTraits
);

export const selectDiscoveredTraits = createSelector(
  [selectTraitsState],
  (traitsState) => traitsState.discoveredTraits
);

export const selectTraitPresets = createSelector(
  [selectTraitsState],
  (traitsState) => traitsState.presets
);

export const selectTraitLoading = createSelector(
  [selectTraitsState],
  (traitsState) => traitsState.loading
);

export const selectTraitError = createSelector(
  [selectTraitsState],
  (traitsState) => traitsState.error
);

// Individual trait selectors
export const selectTraitById = createSelector(
  [selectTraits, (state: RootState, traitId: string) => traitId],
  (traits, traitId) => traits[traitId] || null
);

export const selectAcquiredTraitObjects = createSelector(
  [selectTraits, selectAcquiredTraits],
  (allTraits, acquiredTraitIds) => {
    return acquiredTraitIds
      .map(traitId => allTraits[traitId])
      .filter(Boolean);
  }
);

export const selectDiscoveredTraitObjects = createSelector(
  [selectTraits, selectDiscoveredTraits],
  (allTraits, discoveredTraitIds) => {
    return discoveredTraitIds
      .map(traitId => allTraits[traitId])
      .filter(Boolean);
  }
);

// Player trait integration selectors
export const selectPlayerTraitSlots = createSelector(
  [(state: RootState) => state.player.traitSlots],
  (traitSlots) => traitSlots
);

export const selectEquippedTraitObjects = createSelector(
  [selectTraits, selectPlayerTraitSlots],
  (allTraits, traitSlots) => {
    return traitSlots
      .filter(slot => slot.traitId !== null)
      .map(slot => ({
        ...allTraits[slot.traitId!],
        slotIndex: slot.slotIndex,
        id: slot.traitId!
      }))
      .filter(trait => trait.name); // Filter out undefined traits
  }
);

export const selectUnlockedSlotCount = createSelector(
  [selectPlayerTraitSlots],
  (traitSlots) => traitSlots.filter(slot => !slot.isLocked).length
);

export const selectAvailableTraitSlotCount = createSelector(
  [selectPlayerTraitSlots],
  (traitSlots) => traitSlots.filter(slot => !slot.isLocked && slot.traitId === null).length
);

export const selectUsedTraitSlotCount = createSelector(
  [selectPlayerTraitSlots],
  (traitSlots) => traitSlots.filter(slot => slot.traitId !== null).length
);

export const selectMaxTraitSlots = createSelector(
  [(state: RootState) => state.player.maxTraitSlots],
  (maxTraitSlots) => maxTraitSlots
);

// Preset selectors
export const selectPresetById = createSelector(
  [selectTraitPresets, (state: RootState, presetId: string) => presetId],
  (presets, presetId) => presets.find(preset => preset.id === presetId) || null
);

// Codex selectors for trait browsing
export const selectTraitsByCategory = createSelector(
  [selectTraits],
  (allTraits) => {
    const categories: Record<string, Trait[]> = {};
    Object.values(allTraits).forEach(trait => {
      if (!categories[trait.category]) {
        categories[trait.category] = [];
      }
      categories[trait.category].push(trait);
    });
    return categories;
  }
);

export const selectTraitsByRarity = createSelector(
  [selectTraits],
  (allTraits) => {
    const rarities: Record<string, Trait[]> = {};
    Object.values(allTraits).forEach(trait => {
      if (!rarities[trait.rarity]) {
        rarities[trait.rarity] = [];
      }
      rarities[trait.rarity].push(trait);
    });
    return rarities;
  }
);

// Trait validation selectors
export const selectCanEquipTrait = createSelector(
  [selectPlayerTraitSlots, selectAcquiredTraits, (state: RootState, traitId: string) => traitId],
  (traitSlots, acquiredTraits, traitId) => {
    // Check if trait is acquired
    if (!acquiredTraits.includes(traitId)) {
      return { canEquip: false, reason: 'Trait not acquired' };
    }
    
    // Check if trait is already equipped
    const isEquipped = traitSlots.some(slot => slot.traitId === traitId);
    if (isEquipped) {
      return { canEquip: false, reason: 'Trait already equipped' };
    }
    
    // Check for available slots
    const availableSlot = traitSlots.find(slot => !slot.isLocked && slot.traitId === null);
    if (!availableSlot) {
      return { canEquip: false, reason: 'No available trait slots' };
    }
    
    return { canEquip: true, slotIndex: availableSlot.slotIndex };
  }
);

// Statistics selectors
export const selectTraitStats = createSelector(
  [selectTraits, selectAcquiredTraits, selectDiscoveredTraits],
  (allTraits, acquiredTraits, discoveredTraits) => ({
    totalTraits: Object.keys(allTraits).length,
    acquiredCount: acquiredTraits.length,
    discoveredCount: discoveredTraits.length,
    undiscoveredCount: Object.keys(allTraits).length - discoveredTraits.length
  })
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
  [selectTraitPresets, (state: RootState, presetId: string) => presetId],
  (presets, presetId) => presets.find(preset => preset.id === presetId) || null
);
