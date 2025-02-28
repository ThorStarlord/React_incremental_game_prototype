/**
 * Format objective text for display
 * @param {Object} objective - Quest objective
 * @returns {string} Formatted text
 */
export const formatObjective = (objective) => {
  switch (objective.type) {
    case 'defeat':
      return `Defeat ${objective.count} ${formatEntityName(objective.target)}`;
    case 'collect':
      return `Collect ${objective.count} ${formatEntityName(objective.target)}`;
    case 'visit':
      return `Visit ${formatLocationName(objective.target)}`;
    case 'talk':
      return `Talk to ${formatEntityName(objective.target)}`;
    case 'craft':
      return `Craft ${objective.count} ${formatEntityName(objective.target)}`;
    default:
      return `Complete objective (${objective.progress}/${objective.count})`;
  }
};

/**
 * Format entity name to be more human-readable
 * @param {string} name - Entity ID (e.g., "forest_wolf")
 * @returns {string} Formatted name (e.g., "Forest Wolf")
 */
export const formatEntityName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format location name to be more human-readable
 * @param {string} name - Location ID (e.g., "dark_forest")
 * @returns {string} Formatted name (e.g., "Dark Forest")
 */
export const formatLocationName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Quest types constants for use throughout the application
 */
export const QUEST_TYPES = {
  DEFEAT: 'defeat',
  COLLECT: 'collect',
  VISIT: 'visit',
  TALK: 'talk',
  CRAFT: 'craft',
  DELIVER: 'deliver',
};

/**
 * Quest category constants for filtering and display
 */
export const QUEST_CATEGORIES = {
  COMBAT: 'combat',
  EXPLORATION: 'exploration',
  CRAFTING: 'crafting',
  SOCIAL: 'social',
  TRAINING: 'training',
};