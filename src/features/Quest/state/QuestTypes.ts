// As per DataModel.md, defining placeholder types for now.
export type QuestType = 'MAIN_STORY' | 'SIDE' | 'REPEATABLE' | 'TUTORIAL';
export type ObjectiveType = 'GATHER' | 'KILL' | 'TALK' | 'REACH_LOCATION' | 'USE_ITEM' | 'ESCORT' | 'DELIVER' | 'PUZZLE' | 'INTERACT_PUZZLE';
export type QuestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY_TO_COMPLETE' | 'COMPLETED' | 'FAILED';

export interface QuestRequirement {
  type: 'LEVEL' | 'QUEST_COMPLETED' | 'ITEM_OWNED';
  value: string | number;
}

export interface QuestReward {
  type: 'XP' | 'GOLD' | 'ITEM' | 'REPUTATION' | 'ESSENCE';
  value: string | number;
  amount?: number;
  faction?: string;
}

export interface QuestResolutionItemCost {
  itemId: string;
  quantity: number;
}

/**
 * Optional authored choice made after objectives are satisfied but before turn-in.
 * Relationship consequences are emitted as durable authored Experiences; immediate
 * rewards remain ordinary quest/resource consequences and are not relationship loot.
 */
export interface QuestResolutionOption {
  id: string;
  label: string;
  description: string;
  relationshipExperienceId?: string;
  consumeItems?: QuestResolutionItemCost[];
  rewards?: QuestReward[];
  logMessage?: string;
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
  solution: string;
  rewards: PuzzleReward[];
  effects: PuzzleEffect[];
  logMessage: string;
}

export interface QuestObjective {
  objectiveId: string;
  description: string;
  type: ObjectiveType;
  target: string;
  destination?: string;
  requiredCount: number;
  currentCount: number;
  isHidden: boolean;
  isComplete: boolean;
  hasItem?: boolean;
  delivered?: boolean;
  puzzleData?: PuzzleData;
  outcomes?: PuzzleOutcome[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  giver: string;
  type: QuestType;
  objectives: QuestObjective[];
  prerequisites: QuestRequirement[];
  rewards: QuestReward[];
  status: QuestStatus;
  isAutoComplete: boolean;
  timeLimitSeconds?: number;
  startedAt?: number;
  elapsedSeconds?: number;
  resolutionRequired?: boolean;
  resolutionOptions?: QuestResolutionOption[];
  selectedResolutionId?: string;
}

export interface QuestState {
  quests: Record<string, Quest>;
  activeQuestIds: string[];
}
