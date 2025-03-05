/**
 * Type definitions and utility functions for formatting game data
 */

/**
 * Objective types supported by the formatter
 */
type ObjectiveType = 'defeat' | 'collect' | 'craft' | 'visit' | string;

/**
 * Interface for an objective in a quest
 */
interface Objective {
  /** Type of objective */
  type: ObjectiveType;
  /** Target entity or location for the objective */
  target: string;
  /** Quantity required for completion (not used for 'visit' type) */
  count?: number;
}

/**
 * Format an objective to display text
 * @param objective - The objective object to format
 * @returns Formatted string describing the objective
 */
export const formatObjective = (objective: Objective): string => {
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
      return `${objective.type}: ${objective.count || ''} ${objective.target}`;
  }
};

/**
 * Format entity names from snake_case to Title Case
 * @param name - Entity name in snake_case format
 * @returns Name formatted in Title Case
 */
export const formatEntityName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format location names from snake_case to Title Case
 * @param name - Location name in snake_case format
 * @returns Location name formatted in Title Case
 */
export const formatLocationName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format time period names
 * @param period - Time period identifier
 * @returns Human-readable time period name
 */
export const formatTimePeriod = (period: string): string => {
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
 * @param amount - Quantity of the resource
 * @param type - Type of resource
 * @returns Formatted string with amount and resource name
 */
export const formatResource = (amount: number, type: string): string => {
  switch (type) {
    case 'essence':
      return `${amount} Essence`;
    case 'gold':
      return `${amount} Gold`;
    default:
      return `${amount} ${type}`;
  }
};
