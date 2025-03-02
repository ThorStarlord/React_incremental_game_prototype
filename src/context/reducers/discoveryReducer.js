import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * @typedef {Object} DiscoveryState
 * @property {Object<string, boolean>} locations - Map of discovered locations
 * @property {Object<string, boolean>} resources - Map of discovered resources
 * @property {Object<string, boolean>} recipes - Map of discovered crafting recipes
 * @property {Object<string, boolean>} technologies - Map of discovered technologies
 * @property {Object<string, number>} explorationProgress - Exploration progress for each area (0-100%)
 * @property {Array<string>} achievements - List of unlocked achievements related to discovery
 * @property {Object} tutorialSteps - Map of completed tutorial steps
 */

/**
 * Initial state for the discovery reducer
 * @type {DiscoveryState}
 */
const initialState = {
  locations: {
    village: true, // Starting location is discovered by default
  },
  resources: {
    gold: true, // Basic currency is discovered by default
    wood: true, // Basic resource is discovered by default
  },
  recipes: {},
  technologies: {},
  explorationProgress: {
    village: 100, // Starting location is fully explored
    forest: 0,
    mountains: 0,
    caves: 0,
    ruins: 0,
  },
  achievements: [],
  tutorialSteps: {
    introduction: false,
    basicResourceGathering: false,
    firstCraft: false,
    firstBattle: false,
  }
};

/**
 * @function discoveryReducer
 * @description Manages the player's discovery progress including locations, resources, and achievements
 * 
 * @param {DiscoveryState} state - Current discovery state
 * @param {Object} action - Dispatched action
 * @returns {DiscoveryState} Updated discovery state
 */
export const discoveryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.DISCOVER_LOCATION:
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.payload.locationId]: true
        }
      };
      
    case ACTION_TYPES.DISCOVER_RESOURCE:
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.payload.resourceId]: true
        }
      };
      
    case ACTION_TYPES.DISCOVER_RECIPE:
      return {
        ...state,
        recipes: {
          ...state.recipes,
          [action.payload.recipeId]: true
        }
      };
      
    case ACTION_TYPES.DISCOVER_TECHNOLOGY:
      return {
        ...state,
        technologies: {
          ...state.technologies,
          [action.payload.technologyId]: true
        }
      };
      
    case ACTION_TYPES.UPDATE_EXPLORATION_PROGRESS:
      return {
        ...state,
        explorationProgress: {
          ...state.explorationProgress,
          [action.payload.locationId]: Math.min(
            100, 
            (state.explorationProgress[action.payload.locationId] || 0) + action.payload.progress
          )
        }
      };
      
    case ACTION_TYPES.UNLOCK_ACHIEVEMENT:
      // Only add the achievement if it's not already in the list
      if (state.achievements.includes(action.payload.achievementId)) {
        return state;
      }
      return {
        ...state,
        achievements: [...state.achievements, action.payload.achievementId]
      };
      
    case ACTION_TYPES.COMPLETE_TUTORIAL_STEP:
      return {
        ...state,
        tutorialSteps: {
          ...state.tutorialSteps,
          [action.payload.stepId]: true
        }
      };
      
    case ACTION_TYPES.RESET_DISCOVERY:
      return initialState;
      
    default:
      return state;
  }
};
