/**
 * Location Reducer
 * ===================
 * 
 * This reducer manages the state related to game locations in the incremental RPG.
 * It handles actions for moving between locations, discovering new areas,
 * and updating location properties.
 * 
 * @module locationReducer
 */

// Action Types
export const MOVE_TO_LOCATION = 'MOVE_TO_LOCATION';
export const DISCOVER_LOCATION = 'DISCOVER_LOCATION';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const LOCK_LOCATION = 'LOCK_LOCATION';
export const UNLOCK_LOCATION = 'UNLOCK_LOCATION';

/**
 * Initial state for the location reducer
 * Contains the current location, discovered locations, and details of all locations
 * @type {Object}
 */
const initialState = {
  currentLocation: 'village', // Default starting location
  discoveredLocations: ['village'], // Initially discovered locations
  locations: {
    village: {
      name: 'Village',
      description: 'A small peaceful village where your adventure begins.',
      isLocked: false,
      connectedLocations: ['forest', 'mines'],
      resources: {
        wood: 0.5, // Resource gathering multipliers
        stone: 0.2,
        food: 1.0
      },
      enemySpawnRate: 0.1
    },
    forest: {
      name: 'Forest',
      description: 'A dense forest filled with wildlife and resources.',
      isLocked: false,
      connectedLocations: ['village', 'mountain'],
      resources: {
        wood: 2.0,
        herbs: 1.0,
        food: 0.5
      },
      enemySpawnRate: 0.3
    },
    mines: {
      name: 'Mines',
      description: 'Dark mines with valuable minerals and dangers.',
      isLocked: false,
      connectedLocations: ['village', 'deepMines'],
      resources: {
        stone: 2.0,
        ore: 1.0,
        gems: 0.2
      },
      enemySpawnRate: 0.5
    },
    mountain: {
      name: 'Mountain',
      description: 'Treacherous mountain paths with rare resources.',
      isLocked: true,
      connectedLocations: ['forest', 'peak'],
      resources: {
        stone: 1.5,
        ore: 1.5,
        herbs: 0.3
      },
      enemySpawnRate: 0.7
    },
    deepMines: {
      name: 'Deep Mines',
      description: 'The dangerous depths of the mines with valuable treasures.',
      isLocked: true,
      connectedLocations: ['mines'],
      resources: {
        ore: 2.0,
        gems: 1.0,
        magicCrystals: 0.5
      },
      enemySpawnRate: 0.9
    }
  }
};

/**
 * Location reducer function
 * 
 * @param {Object} state - The current state of locations (defaults to initialState)
 * @param {Object} action - The action to be processed
 * @param {string} action.type - Type of the action
 * @param {*} action.payload - Data associated with the action
 * @returns {Object} - The new state after processing the action
 */
const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case MOVE_TO_LOCATION: {
      // Validate that we can move to the requested location
      if (!state.locations[action.payload]) {
        console.error(`Location "${action.payload}" does not exist.`);
        return state;
      }
      
      const currentLoc = state.locations[state.currentLocation];
      // Check if the new location is connected to the current one
      if (!currentLoc.connectedLocations.includes(action.payload)) {
        console.error(`Cannot move directly from ${currentLoc.name} to ${state.locations[action.payload].name}.`);
        return state;
      }
      
      // Check if the location is locked
      if (state.locations[action.payload].isLocked) {
        console.error(`Location "${state.locations[action.payload].name}" is locked.`);
        return state;
      }
      
      return {
        ...state,
        currentLocation: action.payload
      };
    }

    case DISCOVER_LOCATION: {
      // Check if location exists
      if (!state.locations[action.payload]) {
        console.error(`Location "${action.payload}" does not exist.`);
        return state;
      }
      
      // Check if already discovered
      if (state.discoveredLocations.includes(action.payload)) {
        return state;
      }
      
      return {
        ...state,
        discoveredLocations: [...state.discoveredLocations, action.payload]
      };
    }

    case UPDATE_LOCATION: {
      const { locationId, updates } = action.payload;
      
      // Validate location exists
      if (!state.locations[locationId]) {
        console.error(`Cannot update: Location "${locationId}" does not exist.`);
        return state;
      }
      
      return {
        ...state,
        locations: {
          ...state.locations,
          [locationId]: {
            ...state.locations[locationId],
            ...updates
          }
        }
      };
    }

    case LOCK_LOCATION: {
      // Validate location exists
      if (!state.locations[action.payload]) {
        console.error(`Cannot lock: Location "${action.payload}" does not exist.`);
        return state;
      }
      
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.payload]: {
            ...state.locations[action.payload],
            isLocked: true
          }
        }
      };
    }

    case UNLOCK_LOCATION: {
      // Validate location exists
      if (!state.locations[action.payload]) {
        console.error(`Cannot unlock: Location "${action.payload}" does not exist.`);
        return state;
      }
      
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.payload]: {
            ...state.locations[action.payload],
            isLocked: false
          }
        }
      };
    }

    default:
      return state;
  }
};

export default locationReducer;
