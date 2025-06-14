/**
 * Trait Selectors Module (Corrected - No Player Dependencies)
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { TraitsState, Trait, TraitPreset } from './TraitsTypes';

// Base selectors
export const selectTraitsState = (state: RootState): TraitsState => state.traits;

export const selectTraits = createSelector(
  [selectTraitsState],
  (traitsState) => traitsState.traits
);

export const selectAllTraits = selectTraits; // Alias for consistency

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

export const selectDiscoveredTraitObjects = createSelector(
  [selectTraits, selectDiscoveredTraits],
  (allTraits, discoveredTraitIds) => {
    return discoveredTraitIds
      .map((traitId: string) => allTraits[traitId])
      .filter(Boolean) as Trait[];
  }
);

export const selectTraitPresetById = createSelector(
  [selectTraitPresets, (state: RootState, presetId: string) => presetId],
  (presets, presetId) => presets.find((preset: TraitPreset) => preset.id === presetId) || null
);