/**
 * @file CopySelectors.ts
 * @description Selectors for the Copies feature slice.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { CopiesState } from './CopyTypes';

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
