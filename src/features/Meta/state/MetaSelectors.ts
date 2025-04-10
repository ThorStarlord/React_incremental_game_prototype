import { RootState } from '../../../app/store';

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

// Add other selectors for meta state as needed, for example:
// export const selectCurrentSaveId = (state: RootState) => state.meta.currentSaveId;
// export const selectIsNewGame = (state: RootState) => state.meta.isNewGame;
