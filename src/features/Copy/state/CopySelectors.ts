/**
 * @file CopySelectors.ts
 * @description Selectors for the Copies feature slice.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { CopiesState } from './CopyTypes';

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
