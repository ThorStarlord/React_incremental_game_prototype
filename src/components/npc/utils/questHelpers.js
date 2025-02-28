import React from 'react';
import ExploreIcon from '@mui/icons-material/Explore';
import SecurityIcon from '@mui/icons-material/Security';
import InventoryIcon from '@mui/icons-material/Inventory';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpIcon from '@mui/icons-material/Help';

/**
 * Calculate the completion percentage for a quest
 */
export const calculateQuestProgress = (quest, playerProgress) => {
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
 */
export const isQuestAvailable = (quest, playerRelationship) => {
  return (playerRelationship >= quest.relationshipRequirement);
};

/**
 * Check if a player meets prerequisites for a quest
 */
export const meetsQuestPrerequisites = (quest, player) => {
  // Check relationship requirement
  if (player.npcRelationships?.[quest.sourceNpc] < quest.relationshipRequirement) {
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
 */
export const formatQuestRewards = (quest) => {
  const rewards = [];
  
  if (quest.reward.essence) {
    rewards.push(`${quest.reward.essence} Essence`);
  }
  
  if (quest.reward.relationship) {
    rewards.push(`+${quest.reward.relationship} Relationship`);
  }
  
  if (quest.reward.trait) {
    rewards.push(`Trait: ${formatTraitName(quest.reward.trait)}`);
  }
  
  if (quest.reward.items && quest.reward.items.length > 0) {
    quest.reward.items.forEach(item => {
      rewards.push(`${item.count}x ${formatItemName(item.id)}`);
    });
  }
  
  return rewards;
};

/**
 * Format trait names from camelCase to display text
 */
const formatTraitName = (traitId) => {
  // Split by capital letters and join with spaces
  return traitId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

/**
 * Format item names from snake_case to Title Case
 */
const formatItemName = (itemId) => {
  return itemId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get remaining objectives for a quest
 */
export const getRemainingObjectives = (quest, playerProgress) => {
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
 */
export const getQuestTypeIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'exploration':
      return ExploreIcon;
    case 'combat':
      return SecurityIcon;
    case 'collection':
      return InventoryIcon;
    case 'achievement':
      return EmojiEventsIcon;
    default:
      return HelpIcon;
  }
};

/**
 * Returns a color representing quest difficulty
 */
export const getQuestDifficultyColor = (difficulty) => {
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
 */
export const isQuestCompletable = (quest) => {
  if (!quest || !quest.objectives) return false;
  return quest.objectives.every(obj => obj.completed);
};

/**
 * Formats quest time (duration or completion time)
 */
export const formatQuestTime = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Calculate time remaining for timed quests
 */
export const calculateTimeRemaining = (deadline) => {
  if (!deadline) return null;
  
  const now = Date.now();
  const remaining = deadline - now;
  
  if (remaining <= 0) return 'Expired';
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m remaining`;
};