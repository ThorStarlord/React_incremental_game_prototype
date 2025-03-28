import React from 'react';
import { SvgIconProps } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import SecurityIcon from '@mui/icons-material/Security';
import InventoryIcon from '@mui/icons-material/Inventory';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpIcon from '@mui/icons-material/Help';

/**
 * Interface for a quest objective
 */
interface QuestObjective {
  /** Type of objective (defeat, collect, craft, visit, etc.) */
  type: string;
  /** Target of the objective (enemy type, item name, location, etc.) */
  target: string;
  /** Quantity required to complete (for countable objectives) */
  count: number;
  /** Whether this objective is completed */
  completed?: boolean;
  /** How many remain to complete this objective */
  remaining?: number;
}

/**
 * Interface for quest reward items
 */
interface QuestRewardItem {
  /** Item identifier */
  id: string;
  /** Quantity of this item */
  count: number;
}

/**
 * Interface for quest rewards
 */
interface QuestReward {
  /** Essence reward */
  essence?: number;
  /** Relationship points reward */
  relationship?: number;
  /** Special trait reward */
  trait?: string;
  /** Item rewards */
  items?: QuestRewardItem[];
}

/**
 * Interface for a quest
 */
interface Quest {
  /** Unique quest identifier */
  id?: string;
  /** Quest title */
  title: string;
  /** Quest objectives */
  objectives?: QuestObjective[];
  /** NPC that gives this quest */
  sourceNpc?: string;
  /** Minimum relationship needed with the NPC */
  relationshipRequirement?: number;
  /** Quest rewards */
  reward?: QuestReward;
  /** Level requirement for the quest */
  levelRequirement?: number;
  /** Prerequisite quests that must be completed */
  prerequisiteQuests?: string[];
  /** Difficulty level (1-5) */
  difficulty?: number;
  /** Quest type (exploration, combat, collection, etc.) */
  type?: string;
  /** Deadline for timed quests */
  deadline?: number;
}

/**
 * Interface for player progress tracking
 */
interface PlayerProgress {
  /** Progress on defeat objectives */
  defeat?: Record<string, number>;
  /** Progress on collect objectives */
  collect?: Record<string, number>;
  /** Progress on craft objectives */
  craft?: Record<string, number>;
  /** Progress on visit objectives */
  visit?: Record<string, number>;
  /** Other objective types */
  [key: string]: Record<string, number> | undefined;
}

/**
 * Interface for player state
 */
interface Player {
  /** Player level */
  level: number;
  /** Completed quests IDs */
  completedQuests?: string[];
  /** Relationships with NPCs, indexed by NPC ID */
  npcRelationships?: Record<string, number>;
}

/**
 * Icon component for quest types
 */
type QuestIconComponent = React.ComponentType<SvgIconProps>;

/**
 * Calculate the completion percentage for a quest
 * @param quest - The quest to calculate progress for
 * @param playerProgress - The player's current progress on objectives
 * @returns Percentage of quest completion (0-100)
 */
export const calculateQuestProgress = (quest: Quest, playerProgress?: PlayerProgress): number => {
  if (!playerProgress || !quest.objectives) return 0;
  
  let totalObjectives = 0;
  let completedAmount = 0;
  
  quest.objectives.forEach(objective => {
    totalObjectives += objective.count;
    
    const progress = playerProgress[objective.type]?.[objective.target] || 0;
    completedAmount += Math.min(progress, objective.count);
  });
  
  return totalObjectives > 0 ? (completedAmount / totalObjectives) * 100 : 0;
};

/**
 * Check if a quest is available based on player's relationship with the NPC
 * @param quest - The quest to check
 * @param playerRelationship - Current relationship value with the NPC
 * @returns Whether the quest is available based on relationship
 */
export const isQuestAvailable = (quest: Quest, playerRelationship: number): boolean => {
  return (playerRelationship >= (quest.relationshipRequirement || 0));
};

/**
 * Check if a player meets prerequisites for a quest
 * @param quest - The quest to check prerequisites for
 * @param player - The player's current state
 * @returns Whether the player meets all prerequisites
 */
export const meetsQuestPrerequisites = (quest: Quest, player: Player): boolean => {
  // Check relationship requirement
  const relationshipValue = player.npcRelationships?.[quest.sourceNpc || ''] || 0;
  if (relationshipValue < (quest.relationshipRequirement || 0)) {
    return false;
  }
  
  // Check prerequisite quests if they exist
  if (quest.prerequisiteQuests && quest.prerequisiteQuests.length > 0) {
    const hasCompletedAllPrerequisites = quest.prerequisiteQuests.every(
      questId => player.completedQuests?.includes(questId)
    );
    if (!hasCompletedAllPrerequisites) return false;
  }
  
  // Check level requirement if it exists
  if (quest.levelRequirement && player.level < quest.levelRequirement) {
    return false;
  }
  
  return true;
};

/**
 * Format quest rewards for display
 * @param quest - The quest with rewards to format
 * @returns Array of formatted reward strings
 */
export const formatQuestRewards = (quest: Quest): string[] => {
  const rewards: string[] = [];
  
  if (quest.reward?.essence) {
    rewards.push(`${quest.reward.essence} Essence`);
  }
  
  if (quest.reward?.relationship) {
    rewards.push(`+${quest.reward.relationship} Relationship`);
  }
  
  if (quest.reward?.trait) {
    rewards.push(`Trait: ${formatTraitName(quest.reward.trait)}`);
  }
  
  if (quest.reward?.items && quest.reward.items.length > 0) {
    quest.reward.items.forEach(item => {
      rewards.push(`${item.count}x ${formatItemName(item.id)}`);
    });
  }
  
  return rewards;
};

/**
 * Format trait names from camelCase to display text
 * @param traitId - The trait ID in camelCase
 * @returns Formatted trait name with spaces and proper capitalization
 */
const formatTraitName = (traitId: string): string => {
  // Split by capital letters and join with spaces
  return traitId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

/**
 * Format item names from snake_case to Title Case
 * @param itemId - The item ID in snake_case
 * @returns Formatted item name in Title Case
 */
const formatItemName = (itemId: string): string => {
  return itemId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get remaining objectives for a quest
 * @param quest - The quest to check objectives for
 * @param playerProgress - The player's progress on objectives
 * @returns Enhanced objectives with completion information
 */
export const getRemainingObjectives = (
  quest: Quest, 
  playerProgress?: PlayerProgress
): QuestObjective[] => {
  if (!quest.objectives) return [];
  
  return quest.objectives.map(objective => {
    const progress = playerProgress?.[objective.type]?.[objective.target] || 0;
    const remaining = Math.max(0, objective.count - progress);
    return {
      ...objective,
      remaining,
      completed: remaining === 0
    };
  });
};

/**
 * Returns the appropriate icon component for a quest type
 * @param type - The quest type
 * @returns React component for the icon
 */
export const getQuestTypeIcon = (type: string): QuestIconComponent => {
  switch (type.toLowerCase()) {
    case 'exploration':
      return ExploreIcon as QuestIconComponent;
    case 'combat':
      return SecurityIcon as QuestIconComponent;
    case 'collection':
      return InventoryIcon as QuestIconComponent;
    case 'achievement':
      return EmojiEventsIcon as QuestIconComponent;
    default:
      return HelpIcon as QuestIconComponent;
  }
};

/**
 * Returns a color representing quest difficulty
 * @param difficulty - Difficulty level (1-5)
 * @returns Hex color string
 */
export const getQuestDifficultyColor = (difficulty: number): string => {
  switch (difficulty) {
    case 1:
      return '#4caf50'; // Easy - Green
    case 2:
      return '#8bc34a'; // Normal - Light Green
    case 3:
      return '#ffeb3b'; // Moderate - Yellow
    case 4:
      return '#ff9800'; // Hard - Orange
    case 5:
      return '#f44336'; // Very Hard - Red
    default:
      return '#9e9e9e'; // Unknown - Grey
  }
};

/**
 * Checks if a quest is completable based on its objectives
 * @param quest - The quest to check
 * @returns Whether the quest can be completed
 */
export const isQuestCompletable = (quest?: Quest): boolean => {
  if (!quest || !quest.objectives) return false;
  return quest.objectives.every(obj => obj.completed);
};

/**
 * Formats quest time (duration or completion time)
 * @param timestamp - The timestamp to format
 * @returns Formatted date and time string
 */
export const formatQuestTime = (timestamp?: number): string => {
  if (!timestamp) return 'Unknown';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Calculate time remaining for timed quests
 * @param deadline - The timestamp deadline for the quest
 * @returns Formatted time remaining or 'Expired' if past deadline
 */
export const calculateTimeRemaining = (deadline?: number): string | null => {
  if (!deadline) return null;
  
  const now = Date.now();
  const remaining = deadline - now;
  
  if (remaining <= 0) return 'Expired';
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m remaining`;
};
