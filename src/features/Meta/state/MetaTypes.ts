/**
 * Type definitions for the Meta slice, containing game metadata.
 */

export interface MetaState {
  /** Timestamp of the last successful save operation, or null if never saved. */
  lastSavedTimestamp: number | null;
  /** Current version of the game application. */
  gameVersion: string;
  /** Timestamp when the current game session started. */
  sessionStartTime: number;
  // Add other relevant metadata fields as needed
  // e.g., currentSaveId?: string;
  // e.g., isNewGame?: boolean;
}
