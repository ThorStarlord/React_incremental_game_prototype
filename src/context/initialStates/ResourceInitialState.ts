/**
 * Initial state configuration for game resources and currencies
 */

import { ResourceState } from '../types/ResourceGameStateTypes';

/**
 * Starting material quantities for new players
 */
export const STARTING_MATERIALS = {
  wood: 10,      // Basic wood for crafting
  stone: 5,      // Some stone for basic crafting
  leather: 3,    // Small amount of leather for basic equipment
  metal: 0,      // No metal to start - must be gathered
  cloth: 5,      // Basic cloth for simple items
  herbs: 2       // Few herbs for initial potions
};

/**
 * Starting currency amounts for new players
 */
export const STARTING_GOLD = 50;
export const STARTING_GEMS = 0;

/**
 * Initial state for game resources
 */
const resourceInitialState: ResourceState = {
  gold: STARTING_GOLD,    // Starting gold currency
  gems: STARTING_GEMS,    // Premium currency, start with none
  materials: STARTING_MATERIALS
};

export default resourceInitialState;
