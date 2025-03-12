/**
 * Initial state configuration for game meta information
 */

import { MetaState, SemanticVersion, SaveHistoryEntry, PlaySession, GameUpdate, DebugInfo } from '../types/MetaGameStateTypes';

/**
 * Current game version
 */
export const CURRENT_VERSION: SemanticVersion = {
  major: 1,
  minor: 0,
  patch: 0,
  label: 'alpha'
};

/**
 * Initial state for game meta information
 */
const metaInitialState: MetaState = {
  version: `${CURRENT_VERSION.major}.${CURRENT_VERSION.minor}.${CURRENT_VERSION.patch}${CURRENT_VERSION.label ? `-${CURRENT_VERSION.label}` : ''}`,
  versionDetails: CURRENT_VERSION,
  lastSaved: '', // Changed from null to empty string to avoid null reference errors
  playingSince: '', // Changed from null to empty string to avoid null reference errors
  saveHistory: [] as SaveHistoryEntry[], // Specify type for better documentation
  playSessions: [] as PlaySession[], // Specify type for better documentation
  updates: [] as GameUpdate[], // Specify type for better documentation
  featureFlags: {
    debugMode: false,
    experimentalFeatures: false,
    betaContent: false,
    developerTools: false
  },
  debug: {
    isDevMode: false,
    debugLevel: 'none',
  } as DebugInfo,
  migrationHistory: [] // Specify type if needed
};

export default metaInitialState;
