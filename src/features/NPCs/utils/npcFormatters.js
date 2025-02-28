/**
 * Returns a formatted title and name for an NPC
 */
export const formatNPCName = (npc) => {
  if (!npc.title) return npc.name;
  return `${npc.name}, ${npc.title}`;
};

/**
 * Gets the relationship tier description based on relationship level
 */
export const getRelationshipTier = (relationshipLevel) => {
  if (relationshipLevel >= 80) return "Trusted Ally";
  if (relationshipLevel >= 60) return "Close Friend";
  if (relationshipLevel >= 40) return "Friend";
  if (relationshipLevel >= 20) return "Acquaintance";
  return "Stranger";
};

/**
 * Formats the NPC's current location based on time of day
 */
export const formatNPCLocation = (npc, currentTime) => {
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
 */
export const getRelationshipBenefits = (level) => {
  if (level >= 80) return "Can learn rare traits and access special quests";
  if (level >= 60) return "Can learn uncommon traits and access advanced quests";
  if (level >= 40) return "Can learn basic traits and access intermediate quests";
  if (level >= 20) return "Can access basic quests";
  return "Limited interaction";
};

/**
 * Format NPC type for display
 */
export const formatNPCType = (type) => {
  switch (type) {
    case 'Combat Instructor': return 'Combat Training';
    case 'Healer': return 'Healing & Herbalism';
    case 'Craftsman': return 'Crafting & Smithing';
    case 'Merchant': return 'Trading & Commerce';
    default: return type;
  }
};