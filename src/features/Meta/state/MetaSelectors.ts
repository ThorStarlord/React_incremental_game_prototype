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

export const selectSaveSlots = createSelector(
  [selectMetaState],
  (meta) => meta.saveSlots
);

export const selectCurrentSaveSlot = createSelector(
  [selectMetaState],
  (meta) => meta.currentSaveSlot
);

export const selectLastSaved = createSelector(
  [selectMetaState],
  (meta) => meta.lastSaved
);

export const selectLastLoaded = createSelector(
  [selectMetaState],
  (meta) => meta.lastLoaded
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

export const selectAvailableSaveSlots = createSelector(
  [selectSaveSlots],
  (saveSlots) => Object.keys(saveSlots).filter(slot => saveSlots[slot] !== null)
);

export const selectEmptySaveSlots = createSelector(
  [selectSaveSlots],
  (saveSlots) => Object.keys(saveSlots).filter(slot => saveSlots[slot] === null)
);

export const selectSaveSlotById = createSelector(
  [selectSaveSlots, (state: RootState, slotId: string) => slotId],
  (saveSlots, slotId) => saveSlots[slotId] || null
);

// Add other selectors for meta state as needed, for example:
// export const selectCurrentSaveId = (state: RootState) => state.meta.currentSaveId;
// export const selectIsNewGame = (state: RootState) => state.meta.isNewGame;
