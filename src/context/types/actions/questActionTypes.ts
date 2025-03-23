/**
 * Quest-related action type definitions
 * 
 * This module defines the types and interfaces for quest actions
 * in the game.
 * 
 * @module questActionTypes
 */

/**
 * Quest action type constants
 */
export const QUEST_ACTIONS = {
  DISCOVER_QUEST: 'quests/discoverQuest' as const,
  START_QUEST: 'quests/startQuest' as const,
  UPDATE_QUEST_PROGRESS: 'quests/updateProgress' as const,
  UPDATE_QUEST_OBJECTIVE: 'quests/updateObjective' as const,
  COMPLETE_QUEST: 'quests/completeQuest' as const,
  FAIL_QUEST: 'quests/failQuest' as const,
  ABANDON_QUEST: 'quests/abandonQuest' as const,
  REFRESH_QUESTS: 'quests/refreshQuests' as const,
  SET_ACTIVE_QUEST: 'quests/setActiveQuest' as const
};

// Create a union type of all quest action types
export type QuestActionType = typeof QUEST_ACTIONS[keyof typeof QUEST_ACTIONS];

/**
 * Base quest action interface
 */
export interface QuestAction {
  type: QuestActionType;
  payload?: any;
}

/**
 * Quest ID payload
 */
export interface QuestIdPayload {
  questId: string;
}

/**
 * Quest start payload
 */
export interface QuestStartPayload extends QuestIdPayload {
  startTime: number;
}

/**
 * Quest progress payload
 */
export interface QuestProgressPayload extends QuestIdPayload {
  progress: Record<string, any>;
}

/**
 * Quest objective payload
 */
export interface QuestObjectivePayload extends QuestIdPayload {
  objectiveId: string;
  value: number;
  completed?: boolean;
}

/**
 * Quest completion payload
 */
export interface QuestCompletionPayload extends QuestIdPayload {
  completionTime: number;
  rewards?: QuestRewards;
}

/**
 * Quest failure payload
 */
export interface QuestFailurePayload extends QuestIdPayload {
  failureTime: number;
  reason?: string;
}

/**
 * Quest abandon payload
 */
export interface QuestAbandonPayload extends QuestIdPayload {
  abandonTime: number;
}

/**
 * Refresh quests payload
 */
export interface RefreshQuestsPayload {
  availableQuestIds: string[];
  location?: string;
}

/**
 * Quest rewards interface
 */
export interface QuestRewards {
  experience?: number;
  gold?: number;
  items?: Array<{ id: string; quantity: number }>;
  reputation?: Record<string, number>;
  traits?: string[];
  [key: string]: any;
}
