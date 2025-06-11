import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { selectPlayer } from '../../Player/state/PlayerSelectors';
import { selectEquippedTraitObjects } from '../../Traits/state/TraitsSelectors';

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

/**
 * Select comprehensive essence statistics for display
 */
export const selectEssenceStatistics = createSelector(
  [selectEssenceState, selectPlayer, selectEquippedTraitObjects],
  (essence, player, equippedTraits) => {
    // Calculate trait slot information
    const maxTraitSlots = player.maxTraitSlots || 6;
    const usedTraitSlots = equippedTraits.length;
    const unlockedSlots = Math.min(maxTraitSlots, player.resonanceLevel + 2); // Base 2 + resonance level
    const playerResonanceLevel = player.resonanceLevel || 0;

    return {
      currentEssence: essence.currentEssence,
      totalCollected: essence.totalCollected,
      generationRate: essence.generationRate,
      perClickValue: essence.perClickValue,
      traitSlotsUsed: usedTraitSlots,
      traitSlotsMax: maxTraitSlots,
      traitSlotsUnlocked: unlockedSlots,
      resonanceLevel: playerResonanceLevel,
      nextResonanceCost: calculateNextResonanceCost(playerResonanceLevel),
      permanentTraitCount: player.permanentTraits?.length || 0,
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
  [selectEssenceState, selectPlayer],
  (essence, player) => {
    const currentLevel = player.resonanceLevel || 0;
    const currentEssence = essence.currentEssence;
    const nextLevelCost = calculateNextResonanceCost(currentLevel);
    
    // Calculate progress to next level (0-100%)
    const progress = nextLevelCost > 0 ? Math.min((currentEssence / nextLevelCost) * 100, 100) : 100;
    
    // Check if player has enough essence for next level
    const canLevelUp = currentEssence >= nextLevelCost;

    // Find the next trait slot that would unlock with resonance level increase
    let nextSlotToUnlock: {
      id: string;
      slotIndex: number;
      traitId: string | null;
      isLocked: boolean;
      unlockRequirement: string;
    } | undefined;
    const maxTraitSlots = player.maxTraitSlots || 6;
    const currentUnlockedSlots = Math.min(maxTraitSlots, currentLevel + 2);
    
    // If there are more slots available to unlock
    if (currentUnlockedSlots < maxTraitSlots) {
      // The next slot would unlock at the next resonance level
      const nextLevelSlotsUnlocked = Math.min(maxTraitSlots, (currentLevel + 1) + 2);
      if (nextLevelSlotsUnlocked > currentUnlockedSlots) {
        // Create a virtual TraitSlot representation for the next slot
        nextSlotToUnlock = {
          id: `slot_${currentUnlockedSlots}`,
          slotIndex: currentUnlockedSlots,
          traitId: null,
          isLocked: true,
          unlockRequirement: `resonanceLevel_${currentLevel + 1}`
        };
      }
    }

    return {
      currentLevel,
      nextLevelCost,
      progress,
      canLevelUp,
      nextSlotToUnlock,
      maxLevel: 50, // Configurable maximum resonance level
      isMaxLevel: currentLevel >= 50,
    };
  }
);

/**
 * Calculate the essence cost for the next resonance level
 * @param currentLevel The player's current resonance level
 * @returns The essence cost for the next level, or 0 if already at max level
 */
function calculateNextResonanceCost(currentLevel: number): number {
  const baseCost = 1000;
  const costMultiplier = 1.5;
  const maxLevel = 50;

  if (currentLevel >= maxLevel) return 0;

  // Exponential growth formula: baseCost * (costMultiplier ^ currentLevel)
  return Math.floor(baseCost * Math.pow(costMultiplier, currentLevel));
}
