import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * Interface for the resources state
 */
interface ResourcesState {
  [key: string]: number | ResourcesState | ResourceProductionRates;
  production?: ResourceProductionRates;
}

/**
 * Interface for resource production rates
 */
interface ResourceProductionRates {
  [key: string]: number;
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
  if (path.length === 1) {
    return {
      ...state,
      [path[0]]: value
    };
  }

  const [current, ...rest] = path;
  return {
    ...state,
    [current]: updateNestedResource(
      (state[current] as ResourcesState) || {}, 
      rest,
      value
    )
  };
};

/**
 * Resources reducer - Manages all resource quantities and production rates
 */
export const resourcesReducer = (
  state: ResourcesState = InitialState,
  action: ResourceAction
): ResourcesState => {
  switch (action.type) {
    case ACTION_TYPES.ADD_RESOURCES: {
      let result = { ...state };
      
      // Process all resources in the payload
      Object.entries(action.payload).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle nested resources
          result = {
            ...result,
            [key]: {
              ...(result[key] as ResourcesState || {}),
              ...value
            }
          };
        } else if (typeof value === 'number') {
          // Handle direct resource values
          const currentValue = (result[key] as number) || 0;
          result[key] = Math.max(0, currentValue + value);
        }
      });
      
      return result;
    }
      
    case ACTION_TYPES.SET_RESOURCE: {
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
      
    case ACTION_TYPES.UPDATE_PRODUCTION_RATE: {
      const { resource, rate } = action.payload as UpdateProductionRatePayload;
      
      return {
        ...state,
        production: {
          ...(state.production || {}),
          [resource]: rate
        }
      };
    }

    case ACTION_TYPES.APPLY_PRODUCTION: {
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
          type: ACTION_TYPES.ADD_RESOURCES,
          payload: resourceGains
        });
      }
      
      return state;
    }
    
    case ACTION_TYPES.RESET_RESOURCES:
      return InitialState;
      
    default:
      return state;
  }
};

export default resourcesReducer;
