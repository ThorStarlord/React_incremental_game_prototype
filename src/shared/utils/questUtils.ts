/**
 * Interface for a quest objective
 */
interface QuestObjective {
  type: string;
  target: string;
  count?: number;
  progress?: number;
  [key: string]: any; // Additional objective properties
}

/**
 * Format objective text for display
 * @param {QuestObjective} objective - Quest objective
 * @returns {string} Formatted text
 */
export const formatObjective = (objective: QuestObjective): string => {
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
export const formatEntityName = (name: string): string => {
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
export const formatLocationName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Quest types constants for use throughout the application
 */
export const QUEST_TYPES: Record<string, string> = {
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
export const QUEST_CATEGORIES: Record<string, string> = {
  COMBAT: 'combat',
  EXPLORATION: 'exploration',
  CRAFTING: 'crafting',
  SOCIAL: 'social',
  TRAINING: 'training',
};
