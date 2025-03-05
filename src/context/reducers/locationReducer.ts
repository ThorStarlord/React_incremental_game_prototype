import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * Location state management
 */
interface LocationState {
  currentLocation: string;
  discoveredLocations: string[];
  locations: Record<string, Location>;
}

interface Location {
  id: string;
  name: string;
  description: string;
  type: string;
  connectedLocations: string[];
  isLocked: boolean;
  resourceNodes?: ResourceNode[];
  npcs?: string[];
  enemies?: string[];
  events?: Record<string, any>[];
  discoveredAt?: number;
  visits?: number;
  [key: string]: any;
}

interface ResourceNode {
  type: string;
  quantity: number;
  respawnTime: number;
  lastHarvested?: number;
}

/**
 * Action types
 */
export const MOVE_TO_LOCATION = 'MOVE_TO_LOCATION';
export const DISCOVER_LOCATION = 'DISCOVER_LOCATION';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const LOCK_LOCATION = 'LOCK_LOCATION';
export const UNLOCK_LOCATION = 'UNLOCK_LOCATION';

/**
 * Initial state
 */
const initialState: LocationState = {
  currentLocation: 'village',
  discoveredLocations: ['village'],
  locations: {
    village: {
      id: 'village',
      name: 'Village',
      description: 'A small, peaceful village surrounded by farmland.',
      type: 'settlement',
      connectedLocations: ['forest', 'market'],
      isLocked: false,
      resourceNodes: [
        { type: 'food', quantity: 10, respawnTime: 600 }
      ],
      npcs: ['elder', 'shopkeeper']
    },
    forest: {
      id: 'forest',
      name: 'Forest',
      description: 'A lush forest teeming with wildlife and resources.',
      type: 'wilderness',
      connectedLocations: ['village', 'mountains', 'deepForest'],
      isLocked: false,
      resourceNodes: [
        { type: 'wood', quantity: 20, respawnTime: 300 },
        { type: 'herbs', quantity: 5, respawnTime: 900 }
      ],
      enemies: ['wolf', 'bandit']
    },
    deepForest: {
      id: 'deepForest',
      name: 'Deep Forest',
      description: 'A dark, dense part of the forest with rare resources and dangerous creatures.',
      type: 'wilderness',
      connectedLocations: ['forest', 'ruins'],
      isLocked: true,
      resourceNodes: [
        { type: 'rareHerbs', quantity: 3, respawnTime: 1800 },
        { type: 'magicEssence', quantity: 1, respawnTime: 3600 }
      ],
      enemies: ['bear', 'magicBoar']
    }
  }
};

/**
 * Location reducer function
 */
const locationReducer = (
  state: LocationState = initialState,
  action: { type: string; payload: any }
): LocationState => {
  switch (action.type) {
    case MOVE_TO_LOCATION: {
      const locationId = action.payload;
      
      // Validate location exists
      if (!state.locations[locationId]) {
        console.error(`Location "${locationId}" does not exist.`);
        return state;
      }
      
      // Check if connected to current location
      const currentLoc = state.locations[state.currentLocation];
      if (!currentLoc.connectedLocations.includes(locationId)) {
        console.error(`Cannot move directly from ${currentLoc.name} to ${state.locations[locationId].name}.`);
        return state;
      }
      
      // Check if locked
      if (state.locations[locationId].isLocked) {
        console.error(`Location "${state.locations[locationId].name}" is locked.`);
        return state;
      }
      
      // Update location and increment visit count
      return {
        ...state,
        currentLocation: locationId,
        locations: {
          ...state.locations,
          [locationId]: {
            ...state.locations[locationId],
            visits: (state.locations[locationId].visits || 0) + 1
          }
        }
      };
    }
    
    case DISCOVER_LOCATION: {
      const locationId = action.payload;
      
      // Check if location exists
      if (!state.locations[locationId]) {
        console.error(`Location "${locationId}" does not exist.`);
        return state;
      }
      
      // Check if already discovered
      if (state.discoveredLocations.includes(locationId)) {
        return state;
      }
      
      // Mark location as discovered
      return {
        ...state,
        discoveredLocations: [...state.discoveredLocations, locationId],
        locations: {
          ...state.locations,
          [locationId]: {
            ...state.locations[locationId],
            discoveredAt: Date.now()
          }
        }
      };
    }
    
    case UPDATE_LOCATION: {
      const { locationId, updates } = action.payload;
      
      // Validate location exists
      if (!state.locations[locationId]) {
        console.error(`Cannot update: Location "${locationId}" does not exist.`);
        return state;
      }
      
      // Apply updates to location
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
      const locationId = action.payload;
      
      // Validate location exists
      if (!state.locations[locationId]) {
        console.error(`Cannot lock: Location "${locationId}" does not exist.`);
        return state;
      }
      
      // Lock the location
      return {
        ...state,
        locations: {
          ...state.locations,
          [locationId]: {
            ...state.locations[locationId],
            isLocked: true
          }
        }
      };
    }
    
    case UNLOCK_LOCATION: {
      const locationId = action.payload;
      
      // Validate location exists
      if (!state.locations[locationId]) {
        console.error(`Cannot unlock: Location "${locationId}" does not exist.`);
        return state;
      }
      
      // Unlock the location
      return {
        ...state,
        locations: {
          ...state.locations,
          [locationId]: {
            ...state.locations[locationId],
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
