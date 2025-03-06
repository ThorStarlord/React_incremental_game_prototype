import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * Interface for the discovery state in the game
 */
interface DiscoveryState {
  locations: Record<string, boolean>;
  resources: Record<string, boolean>;
  recipes: Record<string, boolean>;
  technologies: Record<string, boolean>;
  explorationProgress: Record<string, number>;
  achievements: string[];
  tutorialSteps: Record<string, boolean>;
}

/**
 * Initial state for discovery features
 */
const InitialState: DiscoveryState = {
  // Starting defaults
  locations: { village: true },
  resources: { gold: true, wood: true },
  recipes: {},
  technologies: {},
  explorationProgress: { village: 100, forest: 0, mountains: 0, caves: 0, ruins: 0 },
  achievements: [],
  tutorialSteps: {
    introduction: false,
    basicResourceGathering: false,
    firstCraft: false,
    firstBattle: false
  }
};

/**
 * Action interfaces
 */
interface DiscoveryAction {
  type: string;
  payload: any;
}

interface DiscoverPayload {
  locationId?: string;
  resourceId?: string;
  recipeId?: string;
  technologyId?: string;
  achievementId?: string;
  stepId?: string;
  progress?: number;
}

/**
 * Manages player's discovery progress including locations, resources, and achievements
 */
export const discoveryReducer = (state = InitialState, action: DiscoveryAction): DiscoveryState => {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPES.DISCOVER_LOCATION:
      return {
        ...state,
        locations: { ...state.locations, [payload.locationId]: true }
      };
      
    case ACTION_TYPES.DISCOVER_RESOURCE:
      return {
        ...state,
        resources: { ...state.resources, [payload.resourceId]: true }
      };
      
    case ACTION_TYPES.DISCOVER_RECIPE:
      return {
        ...state,
        recipes: { ...state.recipes, [payload.recipeId]: true }
      };
      
    case ACTION_TYPES.DISCOVER_TECHNOLOGY:
      return {
        ...state,
        technologies: { ...state.technologies, [payload.technologyId]: true }
      };
      
    case ACTION_TYPES.UPDATE_EXPLORATION_PROGRESS: {
      const { locationId, progress } = payload;
      const currentProgress = state.explorationProgress[locationId] || 0;
      
      return {
        ...state,
        explorationProgress: {
          ...state.explorationProgress,
          [locationId]: Math.min(100, currentProgress + progress)
        }
      };
    }
      
    case ACTION_TYPES.UNLOCK_ACHIEVEMENT:
      // Only add if not already achieved
      return state.achievements.includes(payload.achievementId) 
        ? state 
        : {
            ...state,
            achievements: [...state.achievements, payload.achievementId]
          };
      
    case ACTION_TYPES.COMPLETE_TUTORIAL_STEP:
      return {
        ...state,
        tutorialSteps: { ...state.tutorialSteps, [payload.stepId]: true }
      };
      
    case ACTION_TYPES.RESET_DISCOVERY:
      return InitialState;
      
    default:
      return state;
  }
};
