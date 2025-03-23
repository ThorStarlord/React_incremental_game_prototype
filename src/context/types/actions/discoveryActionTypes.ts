/**
 * Discovery Action Types
 * =====================
 * 
 * This file defines action types related to the discovery system,
 * including locations, resources, recipes, achievements, and tutorial steps.
 * 
 * @module discoveryActionTypes
 */

/**
 * Action types for discovery operations
 */
export const DISCOVERY_ACTIONS = {
  /**
   * Discover a new location on the map
   */
  DISCOVER_LOCATION: 'discovery/location',

  /**
   * Discover a new resource type
   */
  DISCOVER_RESOURCE: 'discovery/resource',

  /**
   * Discover a new crafting recipe
   */
  DISCOVER_RECIPE: 'discovery/recipe',

  /**
   * Discover a new technology
   */
  DISCOVER_TECHNOLOGY: 'discovery/technology',

  /**
   * Update exploration progress for a location
   */
  UPDATE_EXPLORATION_PROGRESS: 'discovery/updateExploration',

  /**
   * Unlock a new achievement
   */
  UNLOCK_ACHIEVEMENT: 'discovery/achievement',

  /**
   * Complete a tutorial step
   */
  COMPLETE_TUTORIAL_STEP: 'discovery/tutorialStep',

  /**
   * Reset all discovery progress
   */
  RESET_DISCOVERY: 'discovery/reset'
};

/**
 * Discovery action payload interfaces
 */
export interface LocationDiscoveryPayload {
  locationId: string;
}

export interface ResourceDiscoveryPayload {
  resourceId: string;
}

export interface RecipeDiscoveryPayload {
  recipeId: string;
}

export interface TechnologyDiscoveryPayload {
  technologyId: string;
}

export interface ExplorationProgressPayload {
  locationId: string;
  progress: number;
}

export interface AchievementPayload {
  achievementId: string;
}

export interface TutorialStepPayload {
  stepId: string;
}

/**
 * Discovery action interface
 */
export interface DiscoveryAction {
  type: keyof typeof DISCOVERY_ACTIONS;
  payload: LocationDiscoveryPayload | ResourceDiscoveryPayload | RecipeDiscoveryPayload |
    TechnologyDiscoveryPayload | ExplorationProgressPayload | AchievementPayload | TutorialStepPayload;
}

/**
 * Discovery action type union
 */
export type DiscoveryActionType = typeof DISCOVERY_ACTIONS[keyof typeof DISCOVERY_ACTIONS];