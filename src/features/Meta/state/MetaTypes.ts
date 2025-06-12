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
}