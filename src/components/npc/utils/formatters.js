/**
 * Format an objective to display text
 */
export const formatObjective = (objective) => {
  switch (objective.type) {
    case 'defeat':
      return `Defeat ${objective.count} ${formatEntityName(objective.target)}`;
    case 'collect':
      return `Collect ${objective.count} ${formatEntityName(objective.target)}`;
    case 'craft':
      return `Craft ${objective.count} ${formatEntityName(objective.target)}`;
    case 'visit':
      return `Visit ${formatLocationName(objective.target)}`;
    default:
      return `${objective.type}: ${objective.count} ${objective.target}`;
  }
};

/**
 * Format entity names from snake_case to Title Case
 */
export const formatEntityName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format location names from snake_case to Title Case
 */
export const formatLocationName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format time period names
 */
export const formatTimePeriod = (period) => {
  switch (period) {
    case 'morning': return 'Morning';
    case 'afternoon': return 'Afternoon';
    case 'evening': return 'Evening';
    case 'night': return 'Night';
    default: return period;
  }
};

/**
 * Format resource amounts with appropriate units
 */
export const formatResource = (amount, type) => {
  switch (type) {
    case 'essence':
      return `${amount} Essence`;
    case 'gold':
      return `${amount} Gold`;
    default:
      return `${amount} ${type}`;
  }
};