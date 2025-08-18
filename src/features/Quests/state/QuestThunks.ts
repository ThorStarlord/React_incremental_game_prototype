import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addQuest, completeQuest } from './QuestSlice';
import { Quest } from './QuestTypes';

// Placeholder thunk for starting a quest
export const startQuestThunk = createAsyncThunk(
  'quests/startQuest',
  async (quest: Quest, { dispatch }) => {
    // In the future, this could involve checks for prerequisites,
    // updating NPC dialogue, etc.
    dispatch(addQuest(quest));
    return quest;
  }
);

// Placeholder thunk for turning in a completed quest
export const turnInQuestThunk = createAsyncThunk(
  'quests/turnInQuest',
  async (questId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const quest = state.quests.quests[questId];

    if (quest && quest.status === 'READY_TO_COMPLETE') {
      // In the future, this would grant rewards, update game state, etc.
      dispatch(completeQuest(questId));
      return { questId, rewards: quest.rewards };
    }

    // Handle cases where the quest isn't ready to be turned in
    return Promise.reject(new Error('Quest not ready to be turned in.'));
  }
);
