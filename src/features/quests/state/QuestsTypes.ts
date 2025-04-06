/**
 * Types for the Quests slice of the Redux store
 */

/**
 * Enum representing different quest types
 */
export enum QuestType {
  MAIN = 'main',
  SIDE = 'side',
  DAILY = 'daily',
  REPEATABLE = 'repeatable',
  EVENT = 'event'
}

/**
 * Enum representing quest status
 */
export enum QuestStatus {
  AVAILABLE = 'available',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Enum representing quest difficulty levels
 */
export enum QuestDifficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  EPIC = 'epic'
}

/**
 * Enum representing objective types
 */
export enum ObjectiveType {
  KILL = 'kill',
  GATHER = 'gather',
  EXPLORE = 'explore',
  TALK = 'talk',
  CRAFT = 'craft',
  DELIVER = 'deliver',
  WAIT_TIME = 'wait_time'
}

/**
 * Interface for quest objective
 */
export interface QuestObjective {
  /** Unique identifier for the objective */
  id: string;
  /** Description of what needs to be done */
  description: string;
  /** Type of the objective */
  type: ObjectiveType | string;
  /** Target entity for the objective (e.g., enemy type, item id, etc.) */
  target?: string;
  /** Current progress for the objective */
  current: number;
  /** Target amount needed to complete the objective */
  target: number;
  /** Whether the objective has been completed */
  completed: boolean;
  /** Optional location where the objective should be completed */
  location?: string;
  /** Optional additional details for the objective */
  details?: Record<string, any>;
  /** Progress percentage (0-100) */
  progress?: number;
}

/**
 * Interface for quest reward item
 */
export interface QuestRewardItem {
  /** Item identifier */
  id: string;
  /** Item name */
  name: string;
  /** Quantity of items to reward */
  quantity: number;
  /** Icon for the item */
  icon?: string;
}

/**
 * Interface for quest rewards
 */
export interface QuestReward {
  /** Experience points awarded */
  experience?: number;
  /** Gold awarded */
  gold?: number;
  /** Item rewards */
  items?: QuestRewardItem[];
  /** Reputation changes with factions */
  reputation?: Record<string, number>;
  /** Essence awarded */
  essence?: number;
}

/**
 * Interface for quest requirement
 */
export interface QuestRequirement {
  /** Type of requirement */
  type: 'level' | 'quest' | 'item' | 'skill' | 'faction';
  /** Value for the requirement (level number, quest ID, etc.) */
  value: string | number;
  /** Quantity required (for items) */
  quantity?: number;
  /** Skill level required (for skills) */
  skillLevel?: number;
  /** Description of the requirement */
  description?: string;
}

/**
 * Interface for a quest
 */
export interface Quest {
  /** Unique identifier for the quest */
  id: string;
  /** Title of the quest */
  title: string;
  /** Detailed description of the quest */
  description: string;
  /** Current status of the quest */
  status: QuestStatus | string;
  /** Objectives that need to be completed */
  objectives: QuestObjective[];
  /** Rewards for completing the quest */
  reward?: QuestReward;
  /** NPC who gave the quest */
  giver?: string;
  /** Location where the quest is available */
  location?: string;
  /** Level requirement to accept the quest */
  requiredLevel?: number;
  /** Whether the quest is part of the main storyline */
  isStory?: boolean;
  /** Whether the quest can be repeated */
  isRepeatable?: boolean;
  /** Type of the quest */
  type?: QuestType | string;
  /** Difficulty level of the quest */
  difficulty?: QuestDifficulty | string;
  /** Requirements to unlock the quest */
  requirements: QuestRequirement[];
  /** Time when the quest was started */
  startedAt?: number;
  /** Time when the quest expires */
  expiresAt?: number;
  /** Time limit to complete the quest (in ms) */
  timeLimit?: number;
  /** Overall progress percentage (0-100) */
  progress?: number;
  /** Whether the quest is available to the player */
  isAvailable?: boolean;
  /** Quest IDs that unlock after completing this quest */
  unlocks?: string[];
  /** Quest IDs that are required to be completed before this quest */
  requiredQuests?: string[];
  /** Faction associated with the quest */
  factionId?: string;
}

/**
 * Interface for quest progress tracking
 */
export interface QuestProgress {
  /** When the quest was started */
  startedAt: Date | number;
  /** When the quest was completed */
  completedAt?: Date | number;
  /** Progress of individual objectives */
  objectiveProgress: Record<string, number>;
}

/**
 * Interface for quest log entry
 */
export interface QuestLogEntry {
  /** Unique identifier for the log entry */
  id: string;
  /** Time when the entry was created */
  timestamp: number;
  /** Content of the log entry */
  message: string;
  /** Associated quest ID */
  questId: string;
  /** Type of log entry */
  type: 'start' | 'progress' | 'complete' | 'fail';
  /** Whether the entry has been read by the player */
  read: boolean;
}

/**
 * Interface for the quests state in Redux
 */
export interface QuestsState {
  /** All quests in the game */
  quests: Record<string, Quest>;
  /** IDs of active quests */
  activeQuestIds: string[];
  /** IDs of completed quests */
  completedQuestIds: string[];
  /** IDs of failed quests */
  failedQuestIds: string[];
  /** IDs of available quests */
  availableQuestIds: string[];
  /** Progress of quests */
  questProgress: Record<string, QuestProgress>;
  /** Quest log entries */
  questLog: QuestLogEntry[];
  /** Timer for daily quest reset */
  dailyReset: number;
  /** Timer for weekly quest reset */
  weeklyReset: number;
  /** Currently tracked quest ID */
  trackedQuestId: string | null;
  /** Currently selected quest ID (for UI) */
  selectedQuestId: string | null;
  /** Error message if any */
  error: string | null;
  /** Loading state for async operations */
  isLoading: boolean;
}

/**
 * Payload for starting a quest
 */
export interface StartQuestPayload {
  /** ID of the quest to start */
  questId: string;
  /** ID of the NPC who gives the quest (optional) */
  npcId?: string;
}

/**
 * Payload for completing a quest
 */
export interface CompleteQuestPayload {
  /** ID of the quest to complete */
  questId: string;
}

/**
 * Payload for abandoning a quest
 */
export interface AbandonQuestPayload {
  /** ID of the quest to abandon */
  questId: string;
}

/**
 * Payload for failing a quest
 */
export interface FailQuestPayload {
  /** ID of the quest that failed */
  questId: string;
  /** Reason for failure */
  reason?: string;
}

/**
 * Payload for updating quest objective progress
 */
export interface UpdateQuestObjectivePayload {
  /** ID of the quest */
  questId: string;
  /** ID of the objective */
  objectiveId: string;
  /** Amount of progress to add */
  progress: number;
}

/**
 * Payload for tracking a quest
 */
export interface TrackQuestPayload {
  /** ID of the quest to track */
  questId: string;
}

/**
 * Payload for adding a quest log entry
 */
export interface AddQuestLogEntryPayload {
  /** ID of the associated quest */
  questId: string;
  /** Content of the log entry */
  message: string;
  /** Type of log entry */
  type: 'start' | 'progress' | 'complete' | 'fail';
}

/**
 * Payload for unlocking a quest
 */
export interface UnlockQuestPayload {
  /** ID of the quest to unlock */
  questId: string;
}

/**
 * Payload for checking quest requirements
 */
export interface CheckQuestRequirementsPayload {
  /** ID of the quest to check */
  questId: string;
}

/**
 * Result of checking quest requirements
 */
export interface RequirementsCheckResult {
  /** Whether all requirements are met */
  allMet: boolean;
  /** Details about individual requirements */
  requirements: {
    /** Type of requirement */
    type: string;
    /** Whether this requirement is met */
    met: boolean;
    /** Description of the requirement */
    description: string;
  }[];
}

/**
 * Payload for processing quest event
 */
export interface ProcessQuestEventPayload {
  /** Type of event */
  eventType: string;
  /** Target of the event (monster ID, item ID, etc.) */
  target?: string;
  /** Amount to process (e.g., number of kills, items, etc.) */
  amount?: number;
  /** Location where the event occurred */
  location?: string;
  /** Additional event data */
  data?: Record<string, any>;
}
