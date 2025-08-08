/**
 * @file CopySelectors.ts
 * @description Selectors for the Copies feature slice.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { CopiesState, Copy } from './CopyTypes';
import { COPY_SYSTEM } from '../../../constants/gameConstants';

const selectCopiesState = (state: RootState): CopiesState => state.copy;

export const selectAllCopies = createSelector(
  [selectCopiesState],
  (copiesState) => Object.values(copiesState.copies)
);

export const selectCopyById = createSelector(
  [
    selectCopiesState,
    (state: RootState, copyId: string) => copyId,
  ],
  (copiesState, copyId) => copiesState.copies[copyId] || null
);

export const selectCopiesLoading = createSelector(
    [selectCopiesState],
    (copiesState) => copiesState.isLoading
);

export const selectCopiesError = createSelector(
    [selectCopiesState],
    (copiesState) => copiesState.error
);

// --- Advanced / Derived Selectors ---

export const selectMatureCopies = createSelector(
  [selectAllCopies],
  (copies) => copies.filter(c => c.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD)
);

export const selectLoyalCopies = createSelector(
  [selectAllCopies],
  (copies) => copies.filter(c => c.loyalty > COPY_SYSTEM.LOYALTY_THRESHOLD)
);

export const selectQualifyingCopiesForEssence = createSelector(
  [selectAllCopies],
  (copies) => copies.filter(c => c.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD && c.loyalty > COPY_SYSTEM.LOYALTY_THRESHOLD)
);

export const selectQualifyingCopyCount = createSelector(
  [selectQualifyingCopiesForEssence],
  (copies) => copies.length
);

export const selectCopiesByNPC = createSelector(
  [selectAllCopies, (_: RootState, npcId: string) => npcId],
  (copies, npcId) => copies.filter(c => c.parentNPCId === npcId)
);

export const makeSelectLowLoyaltyCopies = (threshold: number = 30) => createSelector(
  [selectAllCopies],
/**
 * Selects copies with loyalty less than or equal to the given threshold.
 * @param state The root state.
 * @param threshold The loyalty threshold (defaults to LOW_LOYALTY_THRESHOLD_DEFAULT).
 */
export const selectLowLoyaltyCopies = createSelector(
  [selectAllCopies, (_: RootState, threshold: number = LOW_LOYALTY_THRESHOLD_DEFAULT) => threshold],
  (copies, threshold) => copies.filter(c => c.loyalty <= threshold)
);

export const selectCopyEssenceBonusTotal = createSelector(
  [selectQualifyingCopiesForEssence],
  (qualifying) => qualifying.length * COPY_SYSTEM.ESSENCE_GENERATION_BONUS
);

// For potential UI segmentation
export const selectCopySegments = createSelector(
  [selectAllCopies],
  (copies) => {
    const mature: Copy[] = [];
    const growing: Copy[] = [];
    const lowLoyalty: Copy[] = [];
    copies.forEach(c => {
      if (c.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD) mature.push(c); else growing.push(c);
      if (c.loyalty <= COPY_SYSTEM.LOYALTY_THRESHOLD) lowLoyalty.push(c);
    });
    return { mature, growing, lowLoyalty };
  }
);
