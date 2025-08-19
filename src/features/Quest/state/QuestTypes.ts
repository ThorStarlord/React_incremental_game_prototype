// As per DataModel.md, defining placeholder types for now.
export type QuestType = 'MAIN_STORY' | 'SIDE' | 'REPEATABLE' | 'TUTORIAL';
export type ObjectiveType = 'GATHER' | 'KILL' | 'TALK' | 'REACH_LOCATION' | 'USE_ITEM' | 'ESCORT' | 'DELIVER' | 'PUZZLE';
export type QuestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY_TO_COMPLETE' | 'COMPLETED' | 'FAILED';

// Placeholder for requirements, e.g., level, previous quest, etc.
export interface QuestRequirement {
  type: 'LEVEL' | 'QUEST_COMPLETED' | 'ITEM_OWNED';
  value: string | number;
}

// Placeholder for rewards
export interface QuestReward {
  type: 'XP' | 'GOLD' | 'ITEM' | 'REPUTATION' | 'ESSENCE';
  value: string | number;
  amount?: number;
  faction?: string;
}

// Puzzle-related types used by puzzle objectives
export interface PuzzleData {
  prompt: string;
  options: string[];
}

export interface PuzzleEffect {
  type: 'STATUS_EFFECT';
  value: string; // Status effect identifier
}

export interface PuzzleReward {
  type: 'XP' | 'GOLD' | 'ITEM' | 'REPUTATION' | 'ESSENCE';
  value: string | number;
  amount?: number;
  faction?: string;
}

export interface PuzzleOutcome {
  solution: string; // e.g., comma-joined string of options or keyword like 'force'
  rewards: PuzzleReward[];
  effects: PuzzleEffect[];
  logMessage: string;
}

export interface QuestObjective {
  objectiveId: string;
  description: string;
  type: ObjectiveType;
  target: string; // e.g., 'item_id', 'npc_id', 'location_id'
  /** Optional destination for objectives like ESCORT where target is the NPC and destination is a location */
  destination?: string;
  requiredCount: number;
  currentCount: number;
  isHidden: boolean;
  isComplete: boolean;
  // For DELIVER objectives
  hasItem?: boolean;
  delivered?: boolean;
  // For PUZZLE objectives
  puzzleData?: PuzzleData;
  outcomes?: PuzzleOutcome[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  giver: string; // NPC ID
  type: QuestType;
  objectives: QuestObjective[];
  prerequisites: QuestRequirement[];
  rewards: QuestReward[];
  status: QuestStatus;
  isAutoComplete: boolean;
  timeLimitSeconds?: number;
  startedAt?: number;
  /** Accumulated elapsed time (in seconds) for timed quests; used instead of wall-clock deltas. */
  elapsedSeconds?: number;
}

export interface QuestState {
  quests: Record<string, Quest>;
  activeQuestIds: string[];
}
