/**
 * @file CopySelectors.ts
 * @description Selectors for the Copies feature slice.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { CopiesState } from './CopyTypes';
import { COPY_SYSTEM } from '../../../constants/gameConstants';

/** Root selector for the Copy slice. */
const selectCopiesState = (state: RootState): CopiesState => state.copy;

/**
 * Select all Copy entities as an array (unordered).
 */
export const selectAllCopies = createSelector(
  [selectCopiesState],
  (copiesState) => Object.values(copiesState.copies)
);

/**
 * Select a Copy by ID or null if it doesn't exist.
 */
export const selectCopyById = createSelector(
  [
    selectCopiesState,
    (state: RootState, copyId: string) => copyId,
  ],
  (copiesState, copyId) => copiesState.copies[copyId] || null
);

/** Select loading flag for async Copy operations. */
export const selectCopiesLoading = createSelector(
    [selectCopiesState],
    (copiesState) => copiesState.isLoading
);

/** Select last error string for Copy operations (or null). */
export const selectCopiesError = createSelector(
    [selectCopiesState],
    (copiesState) => copiesState.error
);

/** Internal: all copies array (non-memoized helper). */
const _allCopies = (state: RootState) => Object.values(state.copy.copies);

/** Select number of copies that qualify for the essence bonus. */
export const selectQualifyingCopyCount = createSelector([_allCopies], (copies) =>
  copies.reduce((acc, c) => acc + (c.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD && c.loyalty > COPY_SYSTEM.LOYALTY_THRESHOLD ? 1 : 0), 0)
);

/** Segmented lists for UI tabs (mature, growing, low loyalty). */
export const selectCopySegments = createSelector([_allCopies], (copies) => {
  const mature: typeof copies = [];
  const growing: typeof copies = [];
  const lowLoyalty: typeof copies = [];
  for (const c of copies) {
    if (c.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD) mature.push(c); else growing.push(c);
    if (c.loyalty <= COPY_SYSTEM.LOYALTY_THRESHOLD) lowLoyalty.push(c);
  }
  return { mature, growing, lowLoyalty };
});
