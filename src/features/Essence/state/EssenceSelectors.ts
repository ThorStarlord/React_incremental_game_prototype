import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { EssenceState, EssenceStatistics } from './EssenceTypes'; // Added EssenceState
// Player selectors will be needed to check trait slots
import { selectTraitSlots, selectMaxTraitSlots, selectPlayerResonanceLevel } from '../../Player/state/PlayerSelectors';
import { TraitSlot } from '../../Traits/state/TraitsTypes'; // For TraitSlot type

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
  (essence): EssenceStatistics => {
    const activeNpcConnections = Object.values(essence.npcConnections).filter(
      connection => connection.connectionDepth > 0
    ).length;

    return {
      currentAmount: essence.currentEssence,
      totalCollected: essence.totalCollected,
      generationRate: essence.generationRate,
      perClickValue: essence.perClickValue,
      activeConnections: activeNpcConnections,
    };
  }
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
 * Selector to calculate the player's current Resonance Level and progress towards unlocking the next trait slot.
 */
export const selectResonanceLevelProgress = createSelector(
  [selectEssenceState, selectTraitSlots, selectMaxTraitSlots, selectPlayerResonanceLevel],
  (essenceState: EssenceState, playerTraitSlots: TraitSlot[], playerMaxTraitSlots: number, playerResonanceLevel: number) => {
    const { totalCollected, currentResonanceLevel, resonanceThresholds, maxResonanceLevel } = essenceState;

    // Find the next trait slot that is locked and unlocks via resonance level
    let nextSlotToUnlock: TraitSlot | undefined;
    for (const slot of playerTraitSlots) {
      if (!slot.isUnlocked && slot.unlockRequirements?.type === 'resonanceLevel') {
        if (!nextSlotToUnlock || (slot.unlockRequirements.value as number) < (nextSlotToUnlock.unlockRequirements!.value as number)) {
          nextSlotToUnlock = slot;
        }
      }
    }
    
    const currentUnlockedSlots = playerTraitSlots.filter(slot => slot.isUnlocked).length;
    const allSlotsUnlockedByResonance = !nextSlotToUnlock || currentUnlockedSlots >= playerMaxTraitSlots;

    if (allSlotsUnlockedByResonance || currentResonanceLevel >= maxResonanceLevel) {
      return {
        currentResonanceLevel: currentResonanceLevel,
        nextResonanceLevelForSlotUnlock: currentResonanceLevel, // Or maxResonanceLevel
        essenceForNextSlotUnlock: totalCollected, // No more needed or already at max
        progressPercentage: 100,
        essenceNeededForNextSlotUnlock: 0,
        allSlotsUnlocked: true,
      };
    }

    const targetResonanceLevelForNextSlot = nextSlotToUnlock!.unlockRequirements!.value as number;
    const essenceForNextSlotUnlock = resonanceThresholds[targetResonanceLevelForNextSlot - 1] || Infinity;
    
    const essenceForCurrentLevel = currentResonanceLevel > 0 ? resonanceThresholds[currentResonanceLevel - 1] : 0;
    
    const essenceEarnedInCurrentSpan = totalCollected - essenceForCurrentLevel;
    const essenceSpanToNextSlotUnlock = essenceForNextSlotUnlock - essenceForCurrentLevel;
    
    let progressPercentage = 0;
    if (essenceSpanToNextSlotUnlock > 0) {
      progressPercentage = (essenceEarnedInCurrentSpan / essenceSpanToNextSlotUnlock) * 100;
    } else if (totalCollected >= essenceForNextSlotUnlock) {
      progressPercentage = 100;
    }

    return {
      currentResonanceLevel: currentResonanceLevel, // This is the actual current RL
      nextResonanceLevelForSlotUnlock: targetResonanceLevelForNextSlot,
      essenceForNextSlotUnlock: essenceForNextSlotUnlock,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      essenceNeededForNextSlotUnlock: Math.max(0, essenceForNextSlotUnlock - totalCollected),
      allSlotsUnlocked: false,
    };
  }
);
