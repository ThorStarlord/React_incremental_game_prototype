/**
 * Type definitions for the Meta system
 */

export interface MetaState {
  lastSavedTimestamp: number | null;
  // FIXED: Added missing properties to the interface
  lastLoadedTimestamp: number | null;
  isImported: boolean;
  isInProximityToNPC: boolean;
  // ---
  gameVersion: string;
  sessionStartTime: number;
  currentSaveId: string | null;
  autoSaveEnabled: boolean;
  saveInProgress: boolean;
  loadInProgress: boolean;
  error: string | null;
  hasSeenIntro: boolean;
  /**
   * True once New Game or Load has established a playable session. A fresh
   * page (including a mid-game reload) starts false, so the game routes return
   * to the main menu instead of exposing the uninitialized startup world, and
   * autosave never persists that world.
   */
  sessionActive: boolean;
}
