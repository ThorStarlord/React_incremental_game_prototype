/**
 * Type definitions for game meta information
 */

/**
 * Semantic versioning structure
 */
export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  label?: string;
}

/**
 * Save history entry
 */
export interface SaveHistoryEntry {
  timestamp: string;
  version: string;
  notes?: string;
}

/**
 * Play session entry
 */
export interface PlaySession {
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
}

/**
 * Game update entry
 */
export interface GameUpdate {
  version: string;
  releaseDate: string;
  notes: string;
}

/**
 * Debug information structure
 */
export interface DebugInfo {
  isDevMode: boolean;
  debugLevel: 'none' | 'low' | 'medium' | 'high';
  lastError?: string;
  errorCount: number;
  performanceMetrics: PerformanceMetrics;
  lastApiCall?: string;
}

/**
 * Performance metrics structure
 */
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
}

/**
 * Migration record structure
 */
export interface MigrationRecord {
  fromVersion: string;
  toVersion: string;
  timestamp: string;
  changes: string[];
}

/**
 * Feature flags for enabling/disabling game features
 */
export interface FeatureFlags {
  debugMode: boolean;
  experimentalFeatures: boolean;
  betaContent: boolean;
  developerTools: boolean;
}

/**
 * Meta state structure
 */
export interface MetaState {
  version: string;
  versionDetails: SemanticVersion;
  lastSaved: string;
  playingSince: string;
  saveHistory: SaveHistoryEntry[];
  playSessions: PlaySession[];
  updates: GameUpdate[];
  featureFlags: FeatureFlags;
  debug: DebugInfo;
  migrationHistory: MigrationRecord[];
}

/**
 * Game lifecycle events
 */
export enum GameLifecycleEvent {
  GAME_START = 'GAME_START',
  GAME_PAUSE = 'GAME_PAUSE',
  GAME_RESUME = 'GAME_RESUME',
  GAME_END = 'GAME_END',
  SAVE_GAME = 'SAVE_GAME',
  LOAD_GAME = 'LOAD_GAME',
  NEW_VERSION = 'NEW_VERSION',
  DATA_MIGRATION = 'DATA_MIGRATION'
}

/**
 * Game lifecycle event payload
 */
export interface GameLifecycleEventPayload {
  type: GameLifecycleEvent;
  timestamp: string; // ISO date string
  data?: any;
}
