import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addQuest, completeQuest, startQuest } from './QuestSlice';
import { Quest } from './QuestTypes';

export const initializeQuestsThunk = createAsyncThunk('quest/initializeQuests', async (_, { dispatch }) => {
  try {
    const response = await fetch('/data/quests.json');
    const quests: Record<string, Quest> = await response.json();
    Object.values(quests).forEach(quest => {
      dispatch(addQuest(quest));
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(
      `Failed to initialize quests. Reason: ${errorMsg}
Possible causes: network error, missing or invalid /data/quests.json file, or JSON parse error.
Next steps: Check your network connection, ensure /data/quests.json exists and is valid JSON.`
    );
  }
});

export const startQuestThunk = createAsyncThunk(
  'quest/startQuest',
  async (questId: string, { dispatch }) => {
    dispatch(startQuest(questId));
    return questId;
  }
);

// Placeholder thunk for turning in a completed quest
export const turnInQuestThunk = createAsyncThunk(
  'quest/turnInQuest',
  async (questId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const quest = state.quest.quests[questId];

    if (quest && quest.status === 'IN_PROGRESS' && quest.objectives.every(o => o.isComplete)) {
      // In the future, this would grant rewards, update game state, etc.
      dispatch(completeQuest(questId));
      return { questId, rewards: quest.rewards };
    }

    // Handle cases where the quest isn't ready to be turned in
    return Promise.reject(new Error('Quest not ready to be turned in.'));
  }
);
