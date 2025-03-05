/**
 * Type definitions and utility functions for formatting NPC data
 */

/**
 * Basic NPC structure with properties needed for formatting
 */
interface NPC {
  /** NPC's name */
  name: string;
  /** Optional title of the NPC (e.g., "the Wise") */
  title?: string;
  /** Map of time periods to locations */
  availability?: Record<string, string>;
  /** Type of NPC (e.g., "Merchant", "Healer") */
  type?: string;
}

/**
 * Returns a formatted title and name for an NPC
 * @param npc - The NPC object
 * @returns Formatted name with title (if present)
 */
export const formatNPCName = (npc: NPC): string => {
  if (!npc.title) return npc.name;
  return `${npc.name}, ${npc.title}`;
};

/**
 * Gets the relationship tier description based on relationship level
 * @param relationshipLevel - Numeric value of relationship (0-100)
 * @returns String description of the relationship tier
 */
export const getRelationshipTier = (relationshipLevel: number): string => {
  if (relationshipLevel >= 80) return "Trusted Ally";
  if (relationshipLevel >= 60) return "Close Friend";
  if (relationshipLevel >= 40) return "Friend";
  if (relationshipLevel >= 20) return "Acquaintance";
  return "Stranger";
};

/**
 * Formats the NPC's current location based on time of day
 * @param npc - The NPC object
 * @param currentTime - Current time period string (e.g., "morning", "evening")
 * @returns Formatted location name or availability status
 */
export const formatNPCLocation = (npc: NPC, currentTime: string): string => {
  if (!npc.availability) return "Unknown";
  
  const location = npc.availability[currentTime];
  if (!location) return "Unavailable";
  
  return location
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Returns a description of relationship benefits at different levels
 * @param level - Numeric relationship level (0-100)
 * @returns Description of benefits available at this relationship level
 */
export const getRelationshipBenefits = (level: number): string => {
  if (level >= 80) return "Can learn rare traits and access special quests";
  if (level >= 60) return "Can learn uncommon traits and access advanced quests";
  if (level >= 40) return "Can learn basic traits and access intermediate quests";
  if (level >= 20) return "Can access basic quests";
  return "Limited interaction";
};

/**
 * Format NPC type for display
 * @param type - Raw NPC type string
 * @returns Formatted NPC occupation/specialty description
 */
export const formatNPCType = (type: string): string => {
  switch (type) {
    case 'Combat Instructor': return 'Combat Training';
    case 'Healer': return 'Healing & Herbalism';
    case 'Craftsman': return 'Crafting & Smithing';
    case 'Merchant': return 'Trading & Commerce';
    default: return type;
  }
};
