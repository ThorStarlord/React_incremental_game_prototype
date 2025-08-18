// As per DataModel.md, defining placeholder types for now.
export type QuestType = 'MAIN_STORY' | 'SIDE' | 'REPEATABLE' | 'TUTORIAL';
export type ObjectiveType = 'GATHER' | 'KILL' | 'TALK' | 'REACH_LOCATION' | 'USE_ITEM';
export type QuestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY_TO_COMPLETE' | 'COMPLETED' | 'FAILED';

// Placeholder for requirements, e.g., level, previous quest, etc.
export interface QuestRequirement {
  type: 'LEVEL' | 'QUEST_COMPLETED' | 'ITEM_OWNED';
  value: string | number;
}

// Placeholder for rewards
export interface QuestReward {
  type: 'XP' | 'GOLD' | 'ITEM' | 'REPUTATION';
  value: string | number;
  amount?: number;
}

export interface QuestObjective {
  objectiveId: string;
  description: string;
  type: ObjectiveType;
  target: string; // e.g., 'item_id', 'npc_id', 'location_id'
  requiredCount: number;
  currentCount: number;
  isHidden: boolean;
  isComplete: boolean;
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
  timeLimit?: number; // in seconds
}

export interface QuestState {
  quests: Record<string, Quest>;
  activeQuestIds: string[];
}
