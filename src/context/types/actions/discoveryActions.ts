/**
 * Discovery-related action types
 */

export const DISCOVERY_ACTIONS = {
  DISCOVER_LOCATION: 'discovery/location' as const,
  DISCOVER_RESOURCE: 'discovery/resource' as const,
  DISCOVER_TECHNOLOGY: 'discovery/technology' as const,
  DISCOVER_RECIPE: 'discovery/recipe' as const,
  UPDATE_EXPLORATION_PROGRESS: 'discovery/updateExploration' as const,
  UNLOCK_ACHIEVEMENT: 'discovery/unlockAchievement' as const,
  COMPLETE_TUTORIAL_STEP: 'discovery/completeTutorial' as const,
  RESET_DISCOVERY: 'discovery/reset' as const
};
