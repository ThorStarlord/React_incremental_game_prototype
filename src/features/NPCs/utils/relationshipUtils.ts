/**
 * Types and utilities for NPC relationship management
 */

/**
 * Interface for trait requirements from an NPC
 */
interface TraitRequirement {
  /** Minimum relationship level needed for the trait */
  relationship: number;
  /** Optional trait name (otherwise determined from ID) */
  name?: string;
  /** Optional trait description */
  description?: string;
  /** Essence cost to learn the trait */
  essenceCost?: number;
  /** Prerequisite trait ID that must be learned first */
  prerequisiteTrait?: string;
  /** Effects this trait provides */
  effects?: Record<string, any>;
  /** Icon representing this trait */
  icon?: string;
  /** Tier/level of the trait (1-5 typically) */
  tier?: number;
  /** Rarity classification of the trait */
  rarity?: string;
}

/**
 * Interface for NPC quest information
 */
interface NPCQuest {
  /** Title of the quest */
  title: string;
  /** Minimum relationship requirement to unlock quest */
  relationshipRequirement: number;
}

/**
 * Interface for an NPC with relationship-based content
 */
interface NPC {
  /** Unique ID of the NPC */
  id: string;
  /** Traits this NPC can teach, keyed by trait ID */
  traitRequirements?: Record<string, TraitRequirement>;
  /** Quests this NPC offers */
  quests?: NPCQuest[];
}

/**
 * Interface for a relationship milestone
 */
interface RelationshipMilestone {
  /** Type of milestone (trait or quest) */
  type: 'trait' | 'quest';
  /** Relationship level required */
  level: number;
  /** Name of the trait or quest */
  name: string;
  /** Description of what unlocks */
  description: string;
}

/**
 * Interface for relationship tier information
 */
interface RelationshipTier {
  /** Minimum threshold for this tier */
  threshold: number;
  /** Name of this relationship tier */
  name: string;
}

/**
 * Interface for relationship progress information
 */
interface RelationshipProgress {
  /** Current tier threshold */
  currentTier: number;
  /** Next tier threshold or null if at max tier */
  nextTier: number | null;
  /** Progress toward next tier (0-100) */
  progress: number;
  /** Points remaining until next tier */
  remaining: number;
}

/**
 * Interface for an available trait
 */
interface AvailableTrait {
  /** Unique ID of the trait */
  id: string;
  /** Display name of the trait */
  name: string;
  /** Description of what the trait does */
  description: string;
  /** Essence cost to learn the trait */
  essenceCost: number;
  /** NPC that teaches this trait */
  sourceNpc: string;
  /** Relationship level required with the NPC */
  requiredRelationship: number;
  /** Effects this trait provides */
  effects: Record<string, any>;
  /** Icon for the trait */
  icon: string;
  /** Tier of the trait (1-5 typically) */
  tier: number;
  /** Rarity classification */
  rarity: string;
}

/**
 * Get relationship tier based on relationship value
 * @param relationshipValue - Numeric value of relationship (0-100)
 * @returns String description of the relationship tier
 */
export const getRelationshipTier = (relationshipValue: number): string => {
  if (relationshipValue >= 80) return "Trusted Ally";
  if (relationshipValue >= 60) return "Close Friend";
  if (relationshipValue >= 40) return "Friend";
  if (relationshipValue >= 20) return "Acquaintance";
  return "Stranger";
};

/**
 * Get color for relationship tier
 * @param relationshipValue - Numeric value of relationship (0-100)
 * @returns Color code representing this relationship level
 */
export const getRelationshipColor = (relationshipValue: number): string => {
  if (relationshipValue >= 80) return "#9c27b0"; // Purple for Trusted Ally
  if (relationshipValue >= 60) return "#2196f3"; // Blue for Close Friend
  if (relationshipValue >= 40) return "#4caf50"; // Green for Friend
  if (relationshipValue >= 20) return "#ff9800"; // Orange for Acquaintance
  return "#757575"; // Grey for Stranger
};

/**
 * Calculate next relationship milestone
 * @param npc - The NPC to check for milestones
 * @param currentRelationship - Current relationship value with this NPC
 * @returns Next milestone or null if no more milestones
 */
export const getNextRelationshipMilestone = (
  npc: NPC, 
  currentRelationship: number
): RelationshipMilestone | null => {
  // Find next trait unlock milestone
  let nextTraitMilestone: number | null = null;
  let nextTraitName: string | null = null;

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
  let nextQuestMilestone: number | null = null;
  let nextQuestName: string | null = null;

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
        name: nextTraitName!,
        description: `Learn "${nextTraitName}" trait`
      };
    } else {
      return {
        type: "quest",
        level: nextQuestMilestone,
        name: nextQuestName!,
        description: `Unlock "${nextQuestName}" quest`
      };
    }
  } else if (nextTraitMilestone) {
    return {
      type: "trait",
      level: nextTraitMilestone,
      name: nextTraitName!,
      description: `Learn "${nextTraitName}" trait`
    };
  } else if (nextQuestMilestone) {
    return {
      type: "quest",
      level: nextQuestMilestone,
      name: nextQuestName!,
      description: `Unlock "${nextQuestName}" quest`
    };
  } else {
    return null; // No more milestones
  }
};

/**
 * Gets available traits from an NPC based on player's relationship and acquired traits
 * @param npc - The NPC to check for available traits
 * @param playerRelationship - Current relationship level with the NPC
 * @param playerTraits - Array of trait IDs the player already has
 * @returns Array of traits available to learn
 */
export const getAvailableTraits = (
  npc: NPC, 
  playerRelationship: number, 
  playerTraits?: string[]
): AvailableTrait[] => {
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
 * @param traitId - The trait ID in camelCase
 * @returns Formatted trait name with spaces and proper capitalization
 */
const formatTraitName = (traitId: string): string => {
  return traitId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

/**
 * Calculate next relationship tier threshold
 * @param currentRelationship - Current relationship value
 * @returns Information about the next tier or null if at max tier
 */
export const getNextRelationshipTier = (currentRelationship: number): RelationshipTier | null => {
  if (currentRelationship < 20) return { threshold: 20, name: "Acquaintance" };
  if (currentRelationship < 40) return { threshold: 40, name: "Friend" };
  if (currentRelationship < 60) return { threshold: 60, name: "Close Friend" };
  if (currentRelationship < 80) return { threshold: 80, name: "Trusted Ally" };
  return null; // Already at max tier
};

/**
 * Calculate relationship progress towards next tier
 * @param currentRelationship - Current relationship value
 * @returns Progress information including percentages and thresholds
 */
export const getRelationshipProgress = (currentRelationship: number): RelationshipProgress => {
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
