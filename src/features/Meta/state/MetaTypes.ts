/**
 * Type definitions for the Meta system
 */

/**
 * Core Meta state interface
 */
export interface MetaState {
  /** Timestamp of the last successful save operation, or null if never saved. */
  lastSavedTimestamp: number | null;
  /** Current version of the game application. */
  gameVersion: string;
  /** Timestamp when the current game session started. */
  sessionStartTime: number;
  /** ID of the currently loaded save, or null for new games. */
  currentSaveId: string | null;
  /** Whether automatic saving is enabled. */
  autoSaveEnabled: boolean;
  /** Indicates if a save operation is currently in progress. */
  saveInProgress: boolean;
  /** Indicates if a load operation is currently in progress. */
  loadInProgress: boolean;
  /** Error message, if any error has occurred. */
  error: string | null;
}
