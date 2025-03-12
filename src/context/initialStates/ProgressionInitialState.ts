/**
 * Initial state configuration for game progression
 */

import { ProgressionState } from '../types/GameStateTypes';

/**
 * Initial game locations available to new players
 */
export const INITIAL_LOCATIONS = [
  'village',      // Starting village
  'forest_edge'   // First exploration area
];

/**
 * Initial features unlocked for new players
 */
export const INITIAL_FEATURES = [
  'inventory',    // Basic inventory management
  'combat',       // Basic combat system
  'questing'      // Basic quest system
];

/**
 * Initial state for game progression
 */
const progressionInitialState: ProgressionState = {
  currentLocation: 'village',
  unlockedLocations: INITIAL_LOCATIONS,
  completedQuests: [],
  activeQuests: [],
  achievements: [],
  unlockedFeatures: INITIAL_FEATURES
};

export default progressionInitialState;
