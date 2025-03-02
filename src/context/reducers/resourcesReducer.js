import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * @typedef {Object} ResourceState
 * @property {number} gold - Player's currency amount
 * @property {Object} materials - Basic materials for crafting and building
 * @property {number} materials.wood - Amount of wood resource
 * @property {number} materials.stone - Amount of stone resource
 * @property {number} materials.ore - Amount of ore resource
 * @property {Object} rare - Rare resources with special properties
 * @property {number} rare.gems - Amount of gems
 * @property {number} rare.crystals - Amount of magic crystals
 * @property {Object} production - Resource production rates per minute
 */

/**
 * Initial state for the resources reducer
 * @type {ResourceState}
 */
const initialState = {
  gold: 0,
  materials: {
    wood: 0,
    stone: 0,
    ore: 0
  },
  rare: {
    gems: 0,
    crystals: 0
  },
  production: {
    gold: 0,
    wood: 0,
    stone: 0,
    ore: 0,
    gems: 0,
    crystals: 0
  }
};

/**
 * @function resourcesReducer
 * @description Manages all game resources including currency, materials, and production rates
 * 
 * @param {ResourceState} state - Current resources state
 * @param {Object} action - Dispatched action
 * @returns {ResourceState} Updated resources state
 */
export const resourcesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_RESOURCES:
      // Deep merge the resources from payload into current state
      return {
        ...state,
        ...Object.keys(action.payload).reduce((result, key) => {
          if (typeof action.payload[key] === 'object' && action.payload[key] !== null) {
            result[key] = {
              ...state[key],
              ...action.payload[key]
            };
          } else {
            result[key] = state[key] + action.payload[key];
          }
          return result;
        }, {})
      };
      
    case ACTION_TYPES.SET_RESOURCE:
      // Set a specific resource to an exact value
      return {
        ...state,
        [action.payload.resource]: action.payload.amount
      };
      
    case ACTION_TYPES.UPDATE_PRODUCTION_RATE:
      // Update production rates for resources
      return {
        ...state,
        production: {
          ...state.production,
          [action.payload.resource]: action.payload.rate
        }
      };
      
    default:
      return state;
  }
};
