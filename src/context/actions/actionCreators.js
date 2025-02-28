import { ACTION_TYPES } from './actionTypes';

// Essence action creators
export const createEssenceAction = (amount) => ({
  type: ACTION_TYPES.GAIN_ESSENCE,
  payload: { amount }
});

export const spendEssence = (amount, reason) => ({
  type: ACTION_TYPES.SPEND_ESSENCE,
  payload: { amount, reason }
});

// NPC action creators
export const updateRelationship = (npcId, amount, notifyPlayer = true) => ({
  type: ACTION_TYPES.UPDATE_NPC_RELATIONSHIP,
  payload: { npcId, amount, notifyPlayer }
});

export const meetNpc = (npcId) => ({
  type: ACTION_TYPES.MEET_NPC,
  payload: { npcId }
});

export const updateDialogueState = (npcId, dialogueId) => ({
  type: ACTION_TYPES.UPDATE_DIALOGUE_STATE,
  payload: { npcId, dialogueId }
});

export const addDialogueToHistory = (npcId, dialogue) => ({
  type: ACTION_TYPES.UPDATE_DIALOGUE_HISTORY,
  payload: { npcId, dialogue }
});

// Quest action creators
export const startQuest = (questId, npcId) => ({
  type: ACTION_TYPES.START_QUEST,
  payload: { questId, npcId }
});

export const updateQuestProgress = (questId, objectiveIndex, progress) => ({
  type: ACTION_TYPES.UPDATE_QUEST_PROGRESS,
  payload: { questId, objectiveIndex, progress }
});

export const completeQuest = (questId) => ({
  type: ACTION_TYPES.COMPLETE_QUEST,
  payload: { questId }
});

export const abandonQuest = (questId) => ({
  type: ACTION_TYPES.ABANDON_QUEST,
  payload: { questId }
});