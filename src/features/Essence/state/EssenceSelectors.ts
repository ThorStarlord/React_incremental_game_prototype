import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { EssenceStatistics } from './EssenceTypes';
import { RESONANCE_LEVEL_THRESHOLDS, ResonanceLevelThreshold } from '../../../constants/gameConstants'; // Import thresholds

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

/**
 * Selector to calculate the player's current Resonance Level and progress towards the next.
 */
export const selectResonanceLevelProgress = createSelector(
  [selectTotalCollected],
  (totalEssenceEarned) => {
    let currentResonanceLevel = 1;
    let nextResonanceLevelThreshold: ResonanceLevelThreshold | undefined;
    let nextResonanceLevel = 1;

    const sortedLevels = Object.keys(RESONANCE_LEVEL_THRESHOLDS)
      .map(Number)
      .sort((a, b) => a - b);

    for (const level of sortedLevels) {
      if (totalEssenceEarned >= RESONANCE_LEVEL_THRESHOLDS[level].essenceRequired) {
        currentResonanceLevel = level;
      } else {
        nextResonanceLevel = level;
        nextResonanceLevelThreshold = RESONANCE_LEVEL_THRESHOLDS[level];
        break;
      }
    }

    // If we've reached or surpassed the highest defined resonance level
    if (!nextResonanceLevelThreshold && sortedLevels.length > 0) {
      const highestLevel = sortedLevels[sortedLevels.length - 1];
      if (totalEssenceEarned >= RESONANCE_LEVEL_THRESHOLDS[highestLevel].essenceRequired) {
        currentResonanceLevel = highestLevel;
        nextResonanceLevel = highestLevel; // No further levels to unlock
      }
    }

    let progressPercentage = 0;
    let essenceNeeded = 0;
    let currentEssenceForLevel = 0;
    let nextEssenceForLevel = 0;

    if (nextResonanceLevelThreshold) {
      const prevLevelEssence = RESONANCE_LEVEL_THRESHOLDS[currentResonanceLevel]?.essenceRequired || 0;
      currentEssenceForLevel = totalEssenceEarned - prevLevelEssence;
      nextEssenceForLevel = nextResonanceLevelThreshold.essenceRequired - prevLevelEssence;
      
      if (nextEssenceForLevel > 0) {
        progressPercentage = (currentEssenceForLevel / nextEssenceForLevel) * 100;
      } else {
        progressPercentage = 100; // Should not happen if thresholds are well-defined
      }
      essenceNeeded = nextResonanceLevelThreshold.essenceRequired - totalEssenceEarned;
    } else {
      progressPercentage = 100; // Max level reached
    }

    return {
      currentResonanceLevel,
      nextResonanceLevel,
      nextResonanceLevelThreshold,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      essenceNeeded,
      isMaxResonanceLevel: !nextResonanceLevelThreshold,
    };
  }
);
