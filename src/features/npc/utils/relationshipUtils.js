/**
 * Get relationship tier based on relationship value
 */
export const getRelationshipTier = (relationshipValue) => {
  if (relationshipValue >= 80) return "Trusted Ally";
  if (relationshipValue >= 60) return "Close Friend";
  if (relationshipValue >= 40) return "Friend";
  if (relationshipValue >= 20) return "Acquaintance";
  return "Stranger";
};

/**
 * Get color for relationship tier
 */
export const getRelationshipColor = (relationshipValue) => {
  if (relationshipValue >= 80) return "#9c27b0"; // Purple for Trusted Ally
  if (relationshipValue >= 60) return "#2196f3"; // Blue for Close Friend
  if (relationshipValue >= 40) return "#4caf50"; // Green for Friend
  if (relationshipValue >= 20) return "#ff9800"; // Orange for Acquaintance
  return "#757575"; // Grey for Stranger
};

/**
 * Calculate next relationship milestone
 */
export const getNextRelationshipMilestone = (npc, currentRelationship) => {
  // Find next trait unlock milestone
  let nextTraitMilestone = null;
  let nextTraitName = null;

  if (npc.traitRequirements) {
    Object.entries(npc.traitRequirements).forEach(([traitId, requirement]) => {
      const requiredRelationship = requirement.relationship;
      
      // Check if this trait is the next milestone
      if (requiredRelationship > currentRelationship && 
          (!nextTraitMilestone || requiredRelationship < nextTraitMilestone)) {
        nextTraitMilestone = requiredRelationship;
        nextTraitName = requirement.name || formatTraitName(traitId);
      }
    });
  }

  // Find next quest unlock milestone
  let nextQuestMilestone = null;
  let nextQuestName = null;

  if (npc.quests) {
    npc.quests.forEach(quest => {
      const requiredRelationship = quest.relationshipRequirement;
      
      // Check if this quest is the next milestone
      if (requiredRelationship > currentRelationship && 
          (!nextQuestMilestone || requiredRelationship < nextQuestMilestone)) {
        nextQuestMilestone = requiredRelationship;
        nextQuestName = quest.title;
      }
    });
  }

  // Return the next closest milestone
  if (nextTraitMilestone && nextQuestMilestone) {
    if (nextTraitMilestone <= nextQuestMilestone) {
      return {
        type: "trait",
        level: nextTraitMilestone,
        name: nextTraitName,
        description: `Learn "${nextTraitName}" trait`
      };
    } else {
      return {
        type: "quest",
        level: nextQuestMilestone,
        name: nextQuestName,
        description: `Unlock "${nextQuestName}" quest`
      };
    }
  } else if (nextTraitMilestone) {
    return {
      type: "trait",
      level: nextTraitMilestone,
      name: nextTraitName,
      description: `Learn "${nextTraitName}" trait`
    };
  } else if (nextQuestMilestone) {
    return {
      type: "quest",
      level: nextQuestMilestone,
      name: nextQuestName,
      description: `Unlock "${nextQuestName}" quest`
    };
  } else {
    return null; // No more milestones
  }
};

/**
 * Gets available traits from an NPC based on player's relationship and acquired traits
 */
export const getAvailableTraits = (npc, playerRelationship, playerTraits) => {
  if (!npc.traitRequirements) return [];
  
  return Object.entries(npc.traitRequirements)
    .filter(([traitId, requirement]) => {
      // Check if player meets relationship requirement
      if (playerRelationship < requirement.relationship) return false;
      
      // Check if player already has this trait
      if (playerTraits?.includes(traitId)) return false;
      
      // Check if player has prerequisite trait
      if (requirement.prerequisiteTrait && !playerTraits?.includes(requirement.prerequisiteTrait)) {
        return false;
      }
      
      return true;
    })
    .map(([traitId, requirement]) => {
      // Convert the trait ID and details into a structured object
      return {
        id: traitId,
        name: requirement.name || formatTraitName(traitId),
        description: requirement.description || "",
        essenceCost: requirement.essenceCost || 0,
        sourceNpc: npc.id,
        requiredRelationship: requirement.relationship,
        effects: requirement.effects || {},
        icon: requirement.icon || "star",
        tier: requirement.tier || 1,
        rarity: requirement.rarity || "Common"
      };
    });
};

/**
 * Format trait name from camelCase to display text
 */
const formatTraitName = (traitId) => {
  return traitId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

/**
 * Calculate next relationship tier threshold
 */
export const getNextRelationshipTier = (currentRelationship) => {
  if (currentRelationship < 20) return { threshold: 20, name: "Acquaintance" };
  if (currentRelationship < 40) return { threshold: 40, name: "Friend" };
  if (currentRelationship < 60) return { threshold: 60, name: "Close Friend" };
  if (currentRelationship < 80) return { threshold: 80, name: "Trusted Ally" };
  return null; // Already at max tier
};

/**
 * Calculate relationship progress towards next tier
 */
export const getRelationshipProgress = (currentRelationship) => {
  const currentTier = Math.floor(currentRelationship / 20) * 20;
  const nextTier = currentTier + 20;
  
  if (currentRelationship >= 80) { // Max tier
    return {
      currentTier: 80,
      nextTier: null,
      progress: 100,
      remaining: 0
    };
  }
  
  const progress = ((currentRelationship - currentTier) / 20) * 100;
  const remaining = nextTier - currentRelationship;
  
  return {
    currentTier,
    nextTier,
    progress,
    remaining
  };
};