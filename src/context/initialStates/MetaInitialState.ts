/**
 * Initial state configuration for game meta information
 */

import { MetaState, SemanticVersion } from '../types/MetaGameStateTypes';

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
  version: CURRENT_VERSION,
  lastSaved: null,
  playingSince: null,
  saveHistory: [],
  playSessions: [],
  updates: [],
  featureFlags: {
    debugMode: false,
    experimentalFeatures: false,
    betaContent: false,
    developerTools: false
  },
  debug: {
    lastError: null,
    errorCount: 0,
    performanceMetrics: {},
    lastApiCall: null
  },
  migrationHistory: []
};

export default metaInitialState;
