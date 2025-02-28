/**
 * Get the relationship tier based on relationship value
 * @param {number} relationship The relationship value (-100 to 100)
 * @returns {object} The relationship tier object
 */
export const getRelationshipTier = (relationship) => {
  if (relationship >= 80) return { name: "Devoted", color: "#9c27b0", threshold: 80 };
  if (relationship >= 60) return { name: "Ally", color: "#3f51b5", threshold: 60 };
  if (relationship >= 40) return { name: "Friend", color: "#4caf50", threshold: 40 };
  if (relationship >= 20) return { name: "Acquaintance", color: "#cddc39", threshold: 20 };
  if (relationship >= 0) return { name: "Neutral", color: "#9e9e9e", threshold: 0 };
  if (relationship >= -30) return { name: "Wary", color: "#ff9800", threshold: -30 };
  if (relationship >= -60) return { name: "Hostile", color: "#f44336", threshold: -60 };
  return { name: "Nemesis", color: "#b71c1c", threshold: -100 };
};

/**
 * Get available interactions based on relationship tier
 * @param {object} npc The NPC object
 * @returns {array} Array of available interactions
 */
export const getAvailableInteractions = (npc) => {
  const tier = getRelationshipTier(npc.relationship || 0);
  const baseInteractions = ["talk"];
  
  // Add more interactions based on relationship tier
  if (tier.threshold >= 20) baseInteractions.push("ask_questions");
  if (tier.threshold >= 40) baseInteractions.push("request_help");
  if (tier.threshold >= 60) baseInteractions.push("learn_trait");
  if (tier.threshold >= 80) baseInteractions.push("special_quest");
  
  // Add NPC specific interactions
  return [...baseInteractions, ...(npc.specialInteractions || [])];
};

/**
 * Check if NPC can teach a trait
 * @param {object} npc The NPC object
 * @param {object} player The player object
 * @returns {object|null} The available trait or null
 */
export const getTeachableTrait = (npc, player) => {
  if (!npc.availableTraits || npc.availableTraits.length === 0) return null;
  
  // Find first trait that meets relationship requirements and isn't already acquired
  return npc.availableTraits.find(traitId => {
    const traitConfig = npc.traitRequirements?.[traitId] || {};
    const requiredRelationship = traitConfig.relationship || 0;
    
    return npc.relationship >= requiredRelationship && 
           !player.acquiredTraits.includes(traitId);
  });
};