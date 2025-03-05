/**
 * Quest Actions
 * =============
 * 
 * This file contains all action creators related to the quest system in the
 * incremental RPG. These actions handle quests discovery, progression, completion,
 * and rewards throughout the game.
 * 
 * @module questActions
 */

// Action Types
export const QUEST_ACTION_TYPES = {
  DISCOVER_QUEST: 'quests/discoverQuest',
  START_QUEST: 'quests/startQuest',
  UPDATE_QUEST_PROGRESS: 'quests/updateProgress',
  UPDATE_QUEST_OBJECTIVE: 'quests/updateObjective',
  COMPLETE_QUEST: 'quests/completeQuest',
  FAIL_QUEST: 'quests/failQuest',
  ABANDON_QUEST: 'quests/abandonQuest',
  REFRESH_QUESTS: 'quests/refreshQuests',
  SET_ACTIVE_QUEST: 'quests/setActiveQuest',
};

// Define interfaces for action payloads
interface QuestIdPayload {
  questId: string;
}

interface QuestStartPayload extends QuestIdPayload {
  startTime: number;
}

interface QuestProgressPayload extends QuestIdPayload {
  progress: Record<string, any>;
}

interface QuestObjectivePayload extends QuestIdPayload {
  objectiveId: string;
  value: number;
  completed?: boolean;
}

interface QuestCompletionPayload extends QuestIdPayload {
  completionTime: number;
  rewards?: QuestRewards;
}

interface QuestFailurePayload extends QuestIdPayload {
  failureTime: number;
  reason?: string;
}

interface QuestAbandonPayload extends QuestIdPayload {
  abandonTime: number;
}

interface RefreshQuestsPayload {
  availableQuestIds: string[];
  location?: string;
}

interface QuestRewards {
  experience?: number;
  gold?: number;
  items?: Array<{ id: string; quantity: number }>;
  reputation?: Record<string, number>;
  traits?: string[];
  [key: string]: any;
}

/**
 * Discover a new quest (makes it available but not necessarily started)
 * 
 * @param {string} questId - ID of the quest to discover
 * @returns {Object} The DISCOVER_QUEST action
 */
export const discoverQuest = (questId: string) => ({
  type: QUEST_ACTION_TYPES.DISCOVER_QUEST,
  payload: { questId } as QuestIdPayload
});

/**
 * Start a quest (add it to active quests)
 * 
 * @param {string} questId - ID of the quest to start
 * @returns {Object} The START_QUEST action
 */
export const startQuest = (questId: string) => ({
  type: QUEST_ACTION_TYPES.START_QUEST,
  payload: { 
    questId,
    startTime: Date.now() 
  } as QuestStartPayload
});

/**
 * Update the overall progress of a quest
 * 
 * @param {string} questId - ID of the quest to update
 * @param {Object} progress - Progress data object
 * @returns {Object} The UPDATE_QUEST_PROGRESS action
 */
export const updateQuestProgress = (questId: string, progress: Record<string, any>) => ({
  type: QUEST_ACTION_TYPES.UPDATE_QUEST_PROGRESS,
  payload: { questId, progress } as QuestProgressPayload
});

/**
 * Update a specific objective within a quest
 * 
 * @param {string} questId - ID of the quest containing the objective
 * @param {string} objectiveId - ID of the objective to update
 * @param {number} value - New value for the objective
 * @param {boolean} [completed] - Whether the objective is now complete
 * @returns {Object} The UPDATE_QUEST_OBJECTIVE action
 */
export const updateQuestObjective = (
  questId: string, 
  objectiveId: string, 
  value: number, 
  completed?: boolean
) => ({
  type: QUEST_ACTION_TYPES.UPDATE_QUEST_OBJECTIVE,
  payload: { questId, objectiveId, value, completed } as QuestObjectivePayload
});

/**
 * Mark a quest as completed and award rewards
 * 
 * @param {string} questId - ID of the quest to complete
 * @param {QuestRewards} [rewards] - Rewards to give the player
 * @returns {Object} The COMPLETE_QUEST action
 */
export const completeQuest = (questId: string, rewards?: QuestRewards) => ({
  type: QUEST_ACTION_TYPES.COMPLETE_QUEST,
  payload: { 
    questId, 
    completionTime: Date.now(),
    rewards 
  } as QuestCompletionPayload
});

/**
 * Mark a quest as failed
 * 
 * @param {string} questId - ID of the quest that failed
 * @param {string} [reason] - Reason for failure
 * @returns {Object} The FAIL_QUEST action
 */
export const failQuest = (questId: string, reason?: string) => ({
  type: QUEST_ACTION_TYPES.FAIL_QUEST,
  payload: { 
    questId,
    failureTime: Date.now(),
    reason 
  } as QuestFailurePayload
});

/**
 * Abandon an active quest
 * 
 * @param {string} questId - ID of the quest to abandon
 * @returns {Object} The ABANDON_QUEST action
 */
export const abandonQuest = (questId: string) => ({
  type: QUEST_ACTION_TYPES.ABANDON_QUEST,
  payload: { 
    questId,
    abandonTime: Date.now() 
  } as QuestAbandonPayload
});

/**
 * Refresh available quests based on location
 * 
 * @param {string[]} availableQuestIds - Array of available quest IDs
 * @param {string} [location] - Location where quests are being refreshed
 * @returns {Object} The REFRESH_QUESTS action
 */
export const refreshQuests = (availableQuestIds: string[], location?: string) => ({
  type: QUEST_ACTION_TYPES.REFRESH_QUESTS,
  payload: { availableQuestIds, location } as RefreshQuestsPayload
});

/**
 * Set the currently tracked quest
 * 
 * @param {string} questId - ID of the quest to track
 * @returns {Object} The SET_ACTIVE_QUEST action
 */
export const setActiveQuest = (questId: string) => ({
  type: QUEST_ACTION_TYPES.SET_ACTIVE_QUEST,
  payload: { questId } as QuestIdPayload
});
