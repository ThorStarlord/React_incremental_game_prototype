import { ACTION_TYPES, RESOURCE_ACTIONS } from '../types/ActionTypes';

/**
 * Interface for resource production rates
 */
interface ResourceProductionRates {
  [key: string]: number;
}

/**
 * Interface for the resources state
 * Restructured to avoid type conflicts between index signature and specific properties
 */
interface ResourcesState {
  // Explicit properties
  gold: number;
  wood: number;
  stone: number;
  food: number;
  iron: number;
  herbs: number;
  production: ResourceProductionRates;
  
  // Additional dynamic properties
  [key: string]: number | Record<string, any>;
}

// Type for nested resources which doesn't require all ResourcesState properties
interface NestedResources {
  [key: string]: number | NestedResources;
}

/**
 * Resource action interfaces
 */
interface ResourceAction {
  type: string;
  payload: any;
}

interface AddResourcesPayload {
  [key: string]: number | Record<string, number>;
}

interface SetResourcePayload {
  resource: string;
  amount: number;
}

interface UpdateProductionRatePayload {
  resource: string;
  rate: number;
}

/**
 * Initial state for resources
 */
const InitialState: ResourcesState = {
  gold: 100,
  wood: 50,
  stone: 20,
  food: 30,
  iron: 10,
  herbs: 5,
  production: {
    gold: 0,
    wood: 0,
    stone: 0,
    food: 0,
    iron: 0,
    herbs: 0
  }
};

/**
 * Helper to safely update nested resource values
 */
const updateNestedResource = (
  state: ResourcesState,
  path: string[], 
  value: number
): ResourcesState => {
  // Create a copy of the state to work with
  const result = { ...state };
  
  // Helper function to set a nested value
  const setNestedValue = (obj: any, parts: string[], val: number): void => {
    const [head, ...tail] = parts;
    
    if (tail.length === 0) {
      // We've reached the final property to set
      obj[head] = val;
    } else {
      // Create the path if it doesn't exist
      if (typeof obj[head] !== 'object' || obj[head] === null) {
        obj[head] = {};
      }
      // Continue recursively
      setNestedValue(obj[head], tail, val);
    }
  };
  
  // Update the nested value
  setNestedValue(result, path, value);
  
  return result;
};

/**
 * Resources reducer - Manages all resource quantities and production rates
 */
export const resourcesReducer = (
  state: ResourcesState = InitialState,
  action: ResourceAction
): ResourcesState => {
  switch (action.type) {
    case RESOURCE_ACTIONS.ADD_RESOURCES: {
      // Create a structured copy of the state with all required properties
      const result: ResourcesState = {
        gold: state.gold,
        wood: state.wood, 
        stone: state.stone,
        food: state.food,
        iron: state.iron,
        herbs: state.herbs,
        production: { ...state.production },
        // Copy any additional dynamic properties
        ...Object.entries(state)
          .filter(([key]) => !['gold', 'wood', 'stone', 'food', 'iron', 'herbs', 'production'].includes(key))
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
      };
      
      // Process all resources in the payload
      Object.entries(action.payload).forEach(([key, value]) => {
        // Handle special case for production which is of special type
        if (key === 'production' && typeof value === 'object' && value !== null) {
          result.production = {
            ...result.production,
            ...value as ResourceProductionRates
          };
          return; // Skip to next iteration
        }
        
        // Handle known resource types explicitly to maintain type safety
        if (['gold', 'wood', 'stone', 'food', 'iron', 'herbs'].includes(key) && typeof value === 'number') {
          // Use type-safe property assignment for known properties
          const typedKey = key as keyof Pick<ResourcesState, 'gold' | 'wood' | 'stone' | 'food' | 'iron' | 'herbs'>;
          result[typedKey] = Math.max(0, result[typedKey] + value);
          return; // Skip to next iteration
        }
        
        // Handle nested objects by using the dynamic indexer
        if (typeof value === 'object' && value !== null) {
          if (key in result && typeof result[key] === 'object') {
            // We need to ensure type safety when merging objects
            // Use type assertion to tell TypeScript this is safe
            const existingValue = result[key] as Record<string, any>;
            const newValue = value as Record<string, any>;
            
            // Create a new object that preserves the structure expected by ResourcesState's index signature
            result[key] = { ...existingValue, ...newValue };
          } else {
            // If it doesn't exist yet, just add it
            result[key] = value as Record<string, any>;
          }
        } else if (typeof value === 'number') {
          // Handle numeric values - this is already covered by the ResourcesState index signature
          const currentValue = (result[key] as number) || 0;
          result[key] = Math.max(0, currentValue + value);
        }
      });

      // Verify the required properties still exist
      ['gold', 'wood', 'stone', 'food', 'iron', 'herbs', 'production'].forEach(prop => {
        if (result[prop] === undefined) {
          // Restore from original state if missing
          result[prop as keyof ResourcesState] = state[prop as keyof ResourcesState];
        }
      });
      
      return result;
    }
      
    case RESOURCE_ACTIONS.SET_RESOURCE: {
      const { resource, amount } = action.payload as SetResourcePayload;
      
      // Handle nested resources with dot notation (e.g., "ores.copper")
      if (resource.includes('.')) {
        const path = resource.split('.');
        return updateNestedResource(state, path, amount);
      }
      
      // Simple resource update
      return {
        ...state,
        [resource]: amount
      };
    }
      
    case RESOURCE_ACTIONS.UPDATE_PRODUCTION_RATE: {
      const { resource, rate } = action.payload as UpdateProductionRatePayload;
      
      return {
        ...state,
        production: {
          ...(state.production || {}),
          [resource]: rate
        }
      };
    }

    case RESOURCE_ACTIONS.APPLY_PRODUCTION: {
      const { timeElapsed = 1 } = action.payload;
      const production = state.production || {};
      
      // Calculate production gains based on time elapsed
      const resourceGains: Record<string, number> = {};
      Object.entries(production).forEach(([resource, rate]) => {
        if (rate > 0) {
          resourceGains[resource] = rate * timeElapsed;
        }
      });
      
      // Apply all gains at once
      if (Object.keys(resourceGains).length > 0) {
        return resourcesReducer(state, {
          type: RESOURCE_ACTIONS.ADD_RESOURCES, // Changed from ACTION_TYPES to RESOURCE_ACTIONS
          payload: resourceGains
        });
      }
      
      return state;
    }
    
    case RESOURCE_ACTIONS.RESET_RESOURCES:
      return InitialState;
      
    default:
      return state;
  }
};

export default resourcesReducer;
