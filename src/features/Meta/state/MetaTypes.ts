/**
 * Type definitions for the Meta slice, containing game metadata.
 */

export interface MetaState {
  /** Timestamp of the last successful save operation, or null if never saved. */
  lastSavedTimestamp: number | null;
  /** Timestamp of the last successful load operation, or null if never loaded. */
  lastLoadedTimestamp: number | null;
  /** ID of the currently loaded save, or null for new games. */
  currentSaveId: string | null;
  /** Whether the current game state was imported from an external source. */
  isImported: boolean;
  /** Current version of the game application. */
  gameVersion: string;
  /** Timestamp when the current game session started. */
  sessionStartTime: number;
}
