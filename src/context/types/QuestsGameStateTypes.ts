/**
 * Type definitions for quest system and related game state
 */

// Import from progression types for compatibility
import { 
  Quest as BaseQuest,
  QuestObjective as BaseQuestObjective,
  QuestReward as BaseQuestReward
} from './ProgressionGameStateTypes';

// Re-export basic types for backward compatibility
export type Quest = BaseQuest;
export type QuestObjective = BaseQuestObjective;
export type QuestReward = BaseQuestReward;

/**
 * Quest difficulty levels
 */
export type QuestDifficulty = 
  | 'trivial'
  | 'easy'
  | 'normal'
  | 'challenging'
  | 'hard'
  | 'epic'
  | 'legendary';

/**
 * Quest type categories
 */
export type QuestType = 
  | 'main'
  | 'side'
  | 'daily'
  | 'weekly'
  | 'repeatable'
  | 'timed'
  | 'hidden'
  | 'achievement'
  | 'tutorial';

/**
 * Extended quest structure with additional metadata
 */
export interface ExtendedQuest extends BaseQuest {
  type: QuestType;
  difficulty: QuestDifficulty;
  timeLimit?: number; // in seconds, for timed quests
  timeRemaining?: number; // in seconds, for timed quests
  expiresAt?: string; // ISO date string, for limited-time quests
  giver: string; // NPC or source that gives the quest
  turnInTarget?: string; // NPC to turn in the quest
  location: string; // Where the quest takes place
  tags: string[]; // For categorization/filtering ("combat", "crafting", etc)
  failureConditions?: QuestFailureCondition[];
  isHidden?: boolean; // Whether the quest is hidden until certain conditions are met
  relevantItems?: string[]; // Item IDs related to this quest
  relevantEnemies?: string[]; // Enemy IDs related to this quest
  isFailed?: boolean;
  priority?: number; // For sorting in the quest log
  recommendedLevel?: number;
  iconPath?: string;
}

/**
 * Quest failure condition
 */
export interface QuestFailureCondition {
  type: 'time-limit' | 'npc-death' | 'item-lost' | 'location-left' | 'custom';
  description: string;
  hasOccurred: boolean;
  customCheck?: string;
}

/**
 * Extended objective with more details
 */
export interface ExtendedQuestObjective extends BaseQuestObjective {
  location?: string; // Where to complete this objective
  hints?: string[]; // Optional hints for the player
  isOptional?: boolean;
  isBonus?: boolean; // Bonus objectives give extra rewards
  visibilityRequirement?: { // This objective is only shown when requirement is met
    objectiveId?: string; // Another objective must be completed
    progress?: number; // Main quest progress percentage
  };
  entityId?: string; // ID of NPC, item, location, etc.
  subObjectives?: BaseQuestObjective[]; // For complex objectives
}

/**
 * Quest update event structure
 */
export interface QuestUpdateEvent {
  questId: string;
  objectiveId?: string;
  type: 'started' | 'progressed' | 'completed' | 'failed' | 'abandoned' | 'expired';
  progress?: number;
  timestamp: string; // ISO date string
}

/**
 * Quest log filtering options
 */
export interface QuestLogFilter {
  status: 'active' | 'completed' | 'failed' | 'all';
  type?: QuestType[];
  location?: string;
  sortBy: 'priority' | 'level' | 'expiration' | 'progress' | 'recent';
  searchTerm?: string;
}

/**
 * Complete quest system state
 */
export interface QuestSystem {
  activeQuests: Record<string, ExtendedQuest>;
  completedQuests: Record<string, ExtendedQuest>;
  failedQuests: Record<string, ExtendedQuest>;
  availableQuests: Record<string, ExtendedQuest>;
  questUpdateHistory: QuestUpdateEvent[];
  currentFilter: QuestLogFilter;
  trackedQuestId?: string; // Currently tracked quest
  questsCompleted: number; // Total count for statistics
  questsFailed: number; // Total count for statistics
  dailyQuestsCompleted: number; // Resets daily
  weeklyQuestsCompleted: number; // Resets weekly
  dailyQuestResetTime?: string; // ISO date string
  weeklyQuestResetTime?: string; // ISO date string
}

/**
 * Quest template for generating new quests
 */
export interface QuestTemplate {
  id: string;
  name: string;
  descriptionTemplate: string;
  objectiveTemplates: {
    type: QuestObjective['type'];
    descriptionTemplate: string;
    targetRange: [number, number]; // Min/max target values
    potentialTargets?: string[]; // IDs of potential entities
  }[];
  rewardTemplates: {
    type: QuestReward['type'];
    amountRange?: [number, number]; // Min/max amounts
    potentialItems?: string[]; // For item rewards
  }[];
  difficulty: QuestDifficulty;
  type: QuestType;
  levelRange: [number, number]; // Min/max player levels
  tags: string[];
  timeLimitRange?: [number, number]; // Min/max time limits in seconds
  generateFunction?: string; // Reference to a function that generates this quest
}
