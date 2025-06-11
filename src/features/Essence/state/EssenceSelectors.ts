import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { EssenceState } from './EssenceTypes';

/**
 * Essence Selectors
 *
 * Memoized selectors for efficient Essence state access and derived data calculations.
 * Uses createSelector for performance optimization.
 */

// Base selector
export const selectEssenceState = (state: RootState): EssenceState => state.essence;

export const selectEssence = selectEssenceState;

// Basic selectors
export const selectCurrentEssence = createSelector(
  [selectEssenceState],
  (essence) => essence.currentEssence
);

export const selectTotalCollected = createSelector(
  [selectEssenceState],
  (essence) => essence.totalCollected
);

export const selectGenerationRate = createSelector(
  [selectEssenceState],
  (essence) => essence.generationRate
);

export const selectPerClickValue = createSelector(
  [selectEssenceState],
  (essence) => essence.perClickValue
);

export const selectLastGenerationTime = createSelector(
  [selectEssenceState],
  (essence) => essence.lastGenerationTime
);

export const selectIsGenerating = createSelector(
  [selectEssenceState],
  (essence) => essence.isGenerating
);

export const selectEssenceLoading = createSelector(
  [selectEssenceState],
  (essence) => essence.loading
);

export const selectEssenceError = createSelector(
  [selectEssenceState],
  (essence) => essence.error
);

export const selectEssenceStats = createSelector(
  [selectCurrentEssence, selectTotalCollected, selectGenerationRate, selectPerClickValue],
  (currentEssence, totalCollected, generationRate, perClickValue) => ({
    currentEssence,
    totalCollected,
    generationRate,
    perClickValue,
    efficiency: totalCollected > 0 ? currentEssence / totalCollected : 0
  })
);

export const selectCanAfford = createSelector(
  [selectCurrentEssence],
  (currentEssence) => (cost: number) => currentEssence >= cost
);
