import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { EssenceStatistics } from './EssenceTypes';

/**
 * Essence Selectors
 *
 * Memoized selectors for efficient Essence state access and derived data calculations.
 * Uses createSelector for performance optimization.
 */

// Base selector
export const selectEssenceState = (state: RootState) => state.essence;

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

// Derived selectors
export const selectEssenceStatistics = createSelector(
  [selectEssenceState],
  (essence): EssenceStatistics => ({
    currentAmount: essence.currentEssence,
    totalCollected: essence.totalCollected,
    generationRate: essence.generationRate,
    perClickValue: essence.perClickValue,
    activeConnections: 0, // TODO: Calculate from NPC connections
  })
);

export const selectCanAfford = createSelector(
  [selectCurrentEssence],
  (currentEssence) => (cost: number) => currentEssence >= cost
);

export const selectGenerationPerHour = createSelector(
  [selectGenerationRate],
  (rate) => rate * 3600 // Convert per-second to per-hour
);

export const selectLastGenerationTime = createSelector(
  [selectEssenceState],
  (essence) => essence.lastGenerationTime
);

// Complex derived selector for essence gain since last check
export const selectPendingEssenceGain = createSelector(
  [selectGenerationRate, selectLastGenerationTime, selectIsGenerating],
  (rate, lastTime, isGenerating) => {
    if (!isGenerating) return 0;
    const timeDiff = (Date.now() - lastTime) / 1000; // seconds
    return Math.floor(rate * timeDiff);
  }
);

// Formatted display selectors
export const selectFormattedCurrentEssence = createSelector(
  [selectCurrentEssence],
  (amount) => new Intl.NumberFormat().format(Math.floor(amount))
);

export const selectFormattedTotalCollected = createSelector(
  [selectTotalCollected],
  (amount) => new Intl.NumberFormat().format(Math.floor(amount))
);

export const selectFormattedGenerationRate = createSelector(
  [selectGenerationRate],
  (rate) => rate.toFixed(1)
);
