/**
 * Type definitions for quests system
 */

/**
 * Quest difficulty levels
 */
export enum QuestDifficulty {
  Trivial = 'trivial',
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  VeryHard = 'very_hard',
  Impossible = 'impossible'
}

/**
 * Quest types
 */
export enum QuestType {
  Main = 'main',
  Side = 'side',
  Daily = 'daily',
  Weekly = 'weekly',
  Event = 'event'
}

/**
 * Quest objective types
 */
export enum QuestObjectiveType {
  Kill = 'kill',
  Gather = 'gather',
  Explore = 'explore',
  Escort = 'escort',
  Deliver = 'deliver',
  Talk = 'talk'
}

/**
 * Quest reward types
 */
export enum QuestRewardType {
  Experience = 'experience',
  Gold = 'gold',
  Item = 'item',
  Reputation = 'reputation',
  Skill = 'skill'
}

/**
 * Quest reward definitions
 */
export type ExperienceReward = { type: QuestRewardType.Experience; amount: number };
export type GoldReward = { type: QuestRewardType.Gold; amount: number };
export type ItemReward = { type: QuestRewardType.Item; itemId: string; amount?: number };
// ...other reward types

export type QuestReward = ExperienceReward | GoldReward | ItemReward; // Union of reward types

/**
 * Quest objective
 */
export interface QuestObjective {
  id: string;
  type: QuestObjectiveType;
  description: string;
  targetId?: string;
  quantity?: number;
  locationId?: string;
  completed: boolean;
}

/**
 * Quest definition
 */
export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  prerequisites?: string[];
  repeatable: boolean;
  cooldown?: number; // Cooldown in hours before quest can be repeated
  expiration?: number; // Expiration time in hours
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
}

/**
 * Extended quest with additional runtime properties
 */
export interface ExtendedQuest extends Quest {
  objectives: ExtendedQuestObjective[]; // Use extended objectives
  progress: number; // Progress percentage
  timeStarted: number; // Timestamp when quest was started
  timeUpdated: number; // Timestamp of last update
  availableUntil?: number; // Timestamp when quest expires
}

/**
 * Extended quest objective with additional runtime properties
 */
export interface ExtendedQuestObjective extends QuestObjective {
  progress: number; // Current progress value
  progressRequired: number; // Total progress required
}

/**
 * Quest update event types
 */
export enum QuestUpdateEventType {
  Started = 'started',
  Updated = 'updated',
  Completed = 'completed',
  Failed = 'failed',
  Expired = 'expired',
  Abandoned = 'abandoned'
}

/**
 * Quest update event
 */
export interface QuestUpdateEvent {
  questId: string;
  type: QuestUpdateEventType;
  timestamp: number;
  objectiveId?: string;
  progress?: number;
}

/**
 * Quest system interface
 */
export interface QuestSystem {
  activeQuests: ExtendedQuest[]; // Use extended quests
  completedQuests: Quest[];
  failedQuests: Quest[];
  availableQuests: Quest[];
  questLog: QuestUpdateEvent[];
  dailyReset: number; // Timestamp of next daily quest reset
  weeklyReset: number; // Timestamp of next weekly quest reset
}
