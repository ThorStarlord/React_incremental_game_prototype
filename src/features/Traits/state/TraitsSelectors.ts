import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { Trait, TraitSlot } from './TraitsTypes';
import { UITrait, convertToUITrait } from '../../../shared/utils/traitUtils';

/**
 * Basic selectors
 */
export const selectTraits = (state: RootState) => state.traits.traits;
export const selectAcquiredTraits = (state: RootState) => state.traits.acquiredTraits;
export const selectPermanentTraits = (state: RootState) => state.traits.permanentTraits;
export const selectTraitSlots = (state: RootState) => state.traits.slots;
export const selectTraitPresets = (state: RootState) => state.traits.presets;
export const selectTraitLoading = (state: RootState) => state.traits.loading;
export const selectTraitError = (state: RootState) => state.traits.error;
export const selectDiscoveredTraits = (state: RootState) => state.traits.discoveredTraits;
export const selectMaxTraitSlots = (state: RootState) => state.traits.maxTraitSlots;

/**
 * Memoized selectors
 */

/**
 * Selects full trait objects for all acquired traits
 */
export const selectAcquiredTraitObjects = createSelector(
  [selectTraits, selectAcquiredTraits],
  (traits, acquiredIds) => {
    return acquiredIds
      .map(id => traits[id])
      .filter(Boolean);
  }
);

/**
 * Selects full trait objects for permanent traits
 */
export const selectPermanentTraitObjects = createSelector(
  [selectTraits, selectPermanentTraits],
  (traits, permanentIds) => {
    return permanentIds
      .map(id => traits[id])
      .filter(Boolean);
  }
);

/**
 * Selects IDs of traits currently equipped in trait slots
 */
export const selectEquippedTraitIds = createSelector(
  [selectTraitSlots],
  (slots) => slots
    .filter(slot => slot.isUnlocked && slot.traitId)
    .map(slot => slot.traitId as string)
);

/**
 * Selects full trait objects for equipped traits
 */
export const selectEquippedTraitObjects = createSelector(
  [selectTraits, selectEquippedTraitIds],
  (traits, equippedIds) => {
    return equippedIds
      .map(id => traits[id])
      .filter(Boolean);
  }
);

/**
 * Selects UI-ready trait objects for equipped traits
 */
export const selectEquippedUITraits = createSelector(
  [selectEquippedTraitObjects],
  (traitObjects) => {
    return traitObjects.map(trait => convertToUITrait(trait));
  }
);

/**
 * Selects UI-ready trait objects for acquired but not equipped traits
 */
export const selectAvailableUITraits = createSelector(
  [selectTraits, selectAcquiredTraits, selectEquippedTraitIds, selectPermanentTraits],
  (traits, acquiredIds, equippedIds, permanentIds) => {
    const availableIds = acquiredIds.filter(
      id => !equippedIds.includes(id) && !permanentIds.includes(id)
    );
    
    return availableIds
      .map(id => traits[id])
      .filter(Boolean)
      .map(trait => convertToUITrait(trait));
  }
);

/**
 * Selects the number of unlocked trait slots
 */
export const selectUnlockedTraitSlotCount = createSelector(
  [selectTraitSlots],
  (slots) => slots.filter(slot => slot.isUnlocked).length
);

/**
 * Selects the number of available (empty and unlocked) trait slots
 */
export const selectAvailableTraitSlotCount = createSelector(
  [selectTraitSlots],
  (slots) => slots.filter(slot => slot.isUnlocked && !slot.traitId).length
);

/**
 * Selects the next trait slot that can be unlocked
 */
export const selectNextLockedTraitSlot = createSelector(
  [selectTraitSlots],
  (slots) => {
    const lockedSlots = slots.filter(slot => !slot.isUnlocked);
    return lockedSlots.length > 0 ? lockedSlots[0] : null;
  }
);

/**
 * Select combined stat bonuses from all equipped and permanent traits
 */
export const selectTraitStatBonuses = createSelector(
  [selectEquippedTraitObjects, selectPermanentTraitObjects],
  (equippedTraits, permanentTraits) => {
    const allTraits = [...equippedTraits, ...permanentTraits];
    const statBonuses: Record<string, number> = {};
    
    allTraits.forEach(trait => {
      if (!trait.effects) return;
      
      // Handle effects as array
      if (Array.isArray(trait.effects)) {
        trait.effects.forEach(effect => {
          if ('type' in effect && 'magnitude' in effect) {
            const statName = effect.type;
            statBonuses[statName] = (statBonuses[statName] || 0) + effect.magnitude;
          }
        });
      } 
      // Handle effects as object
      else if (typeof trait.effects === 'object') {
        Object.entries(trait.effects).forEach(([key, value]) => {
          if (typeof value === 'number') {
            statBonuses[key] = (statBonuses[key] || 0) + value;
          }
        });
      }
    });
    
    return statBonuses;
  }
);

/**
 * Select trait objects by IDs with filtering for valid traits
 */
export const selectTraitsByIds = (state: RootState, traitIds: string[]) => {
  return traitIds
    .map(id => state.traits.traits[id])
    .filter(Boolean);
};

/**
 * Select a single trait by ID
 */
export const selectTraitById = (state: RootState, traitId: string) => {
  return state.traits.traits[traitId];
};
