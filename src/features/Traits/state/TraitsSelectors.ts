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

/**
 * Selector: Resonance ETAs
 * Computes estimated time (seconds) until the player can afford resonance for discovered, non-permanent traits.
 * Requires: essence slice with currentEssence & generationRate, player slice with permanentTraits, trait essenceCost.
 * Returns sorted array by ETA ascending. If generationRate is 0, ETA defaults to Infinity for unaffordable traits.
 */
export const selectResonanceETAs = createSelector(
  [
    (state: RootState) => state.essence.currentEssence,
    (state: RootState) => state.essence.generationRate,
    selectDiscoveredTraits,
    selectTraits,
    (state: RootState) => state.player.permanentTraits
  ],
  (currentEssence, generationRate, discoveredTraitIds, allTraits, permanentTraits) => {
    const results: { traitId: string; traitName: string; cost: number; etaSeconds: number }[] = [];
    for (const id of discoveredTraitIds) {
      if (permanentTraits.includes(id)) continue; // skip already permanent
      const trait = allTraits[id];
      if (!trait) continue;
      const cost = trait.essenceCost ?? 0;
      if (cost <= 0) continue;
      const remaining = Math.max(0, cost - currentEssence);
      const etaSeconds = remaining === 0 ? 0 : (generationRate > 0 ? remaining / generationRate : Number.POSITIVE_INFINITY);
      results.push({ traitId: id, traitName: trait.name || id, cost, etaSeconds });
    }
    return results.sort((a, b) => a.etaSeconds - b.etaSeconds);
  }
);