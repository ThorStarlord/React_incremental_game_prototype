import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { MetaState } from './MetaTypes';

/**
 * Selects the timestamp of the last successful save operation.
 * @param state - The root state of the application.
 * @returns The timestamp (number) or null if never saved.
 */
export const selectLastSavedTimestamp = (state: RootState): number | null =>
  state.meta.lastSavedTimestamp;

/**
 * Selects the current game version string.
 * @param state - The root state of the application.
 * @returns The game version string.
 */
export const selectGameVersion = (state: RootState): string =>
  state.meta.gameVersion;

/**
 * Selects the timestamp when the current game session started.
 * @param state - The root state of the application.
 * @returns The session start timestamp (number).
 */
export const selectSessionStartTime = (state: RootState): number =>
  state.meta.sessionStartTime;

export const selectMetaState = (state: RootState): MetaState => state.meta;

export const selectMeta = selectMetaState;

// Updated selectors to match actual MetaState interface
export const selectCurrentSaveId = createSelector(
  [selectMetaState],
  (meta) => meta.currentSaveId
);

export const selectLastSaved = createSelector(
  [selectMetaState],
  (meta) => meta.lastSavedTimestamp
);

export const selectAutoSaveEnabled = createSelector(
  [selectMetaState],
  (meta) => meta.autoSaveEnabled
);

export const selectSaveInProgress = createSelector(
  [selectMetaState],
  (meta) => meta.saveInProgress
);

export const selectLoadInProgress = createSelector(
  [selectMetaState],
  (meta) => meta.loadInProgress
);

export const selectMetaError = createSelector(
  [selectMetaState],
  (meta) => meta.error
);

// Note: The following selectors have been removed as they reference properties
// that don't exist in the current MetaState interface:
// - selectSaveSlots (meta.saveSlots doesn't exist)
// - selectCurrentSaveSlot (meta.currentSaveSlot doesn't exist) 
// - selectLastLoaded (meta.lastLoaded doesn't exist)
// - selectAvailableSaveSlots (depends on non-existent saveSlots)
// - selectEmptySaveSlots (depends on non-existent saveSlots)
// - selectSaveSlotById (depends on non-existent saveSlots)

// If save slot functionality is needed, it should use the save utilities
// from src/shared/utils/saveUtils.ts instead of Meta state
