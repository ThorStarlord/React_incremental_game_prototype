/**
 * Type definitions for game metadata
 */

/**
 * Semantic version structure
 */
export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  label?: string; // e.g., 'alpha', 'beta', 'rc'
}

/**
 * Save state entry structure
 */
export interface SaveHistoryEntry {
  timestamp: string; // ISO date string
  version: string;
  description?: string;
  saveId: string;
  autoSave: boolean;
}

/**
 * Play session metadata
 */
export interface PlaySession {
  startTime: string; // ISO date string
  endTime?: string; // ISO date string
  duration?: number; // in seconds
  gameVersion: string;
  achievements?: string[]; // IDs of achievements unlocked in this session
  levelsGained?: number;
}

/**
 * Game update information
 */
export interface GameUpdate {
  version: string;
  releaseDate: string; // ISO date string
  notes: string;
  viewed: boolean;
}

/**
 * Feature flags for toggling experimental features
 */
export interface FeatureFlags {
  [featureName: string]: boolean;
}

/**
 * Debug information
 */
export interface DebugInfo {
  isDevMode: boolean;
  debugLevel: 'none' | 'error' | 'warn' | 'info' | 'verbose';
  lastError?: {
    message: string;
    stack?: string;
    timestamp: string; // ISO date string
  };
}

/**
 * Migration history for save data
 */
export interface MigrationHistory {
  lastMigration?: string; // ISO date string
  migratedFrom: string; // Previous version
  migratedTo: string; // Current version
  appliedMigrations: string[]; // IDs of applied migrations
}

/**
 * Meta information about the game state
 */
export interface MetaState {
  // Basic metadata (for backward compatibility)
  version: string;
  lastSaved: string | null; // ISO date string or null
  playingSince: string | null; // ISO date string or null
  
  // Extended metadata
  versionDetails?: SemanticVersion;
  saveHistory?: SaveHistoryEntry[];
  playSessions?: PlaySession[];
  currentSessionStart?: string; // ISO date string
  buildId?: string;
  platform?: 'web' | 'desktop' | 'mobile' | 'steam' | 'epic';
  pendingUpdates?: GameUpdate[];
  featureFlags?: FeatureFlags;
  debug?: DebugInfo;
  migrationHistory?: MigrationHistory;
  instanceId?: string; // Unique identifier for this game instance
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
