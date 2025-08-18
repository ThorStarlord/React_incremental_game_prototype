import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quest, QuestState, QuestStatus } from './QuestTypes';

const initialState: QuestState = {
  quests: {},
  activeQuestIds: [],
};

const questSlice = createSlice({
  name: 'quest',
  initialState,
  reducers: {
    addQuest: (state, action: PayloadAction<Quest>) => {
      const quest = action.payload;
      state.quests[quest.id] = quest;
      if (quest.status === 'IN_PROGRESS' && !state.activeQuestIds.includes(quest.id)) {
        state.activeQuestIds.push(quest.id);
      }
    },
    startQuest: (state, action: PayloadAction<string>) => {
      const questId = action.payload;
      const quest = state.quests[questId];
      if (quest && quest.status === 'NOT_STARTED') {
        quest.status = 'IN_PROGRESS';
        if (!state.activeQuestIds.includes(questId)) {
          state.activeQuestIds.push(questId);
        }
      }
    },
    updateQuestStatus: (state, action: PayloadAction<{ questId: string; status: QuestStatus }>) => {
      const { questId, status } = action.payload;
      const quest = state.quests[questId];
      if (quest) {
        quest.status = status;
      }
    },
    updateObjectiveProgress: (
      state,
      action: PayloadAction<{ questId: string; objectiveId: string; progress: number }>
    ) => {
      const { questId, objectiveId, progress } = action.payload;
      const quest = state.quests[questId];
      if (quest) {
        const objective = quest.objectives.find((o) => o.id === objectiveId);
        if (objective) {
          objective.progress = progress;
          if (objective.progress >= objective.targetValue) {
            objective.isComplete = true;
          }
        }
      }
    },
    completeQuest: (state, action: PayloadAction<string>) => {
      const questId = action.payload;
      const quest = state.quests[questId];
      if (quest) {
        quest.status = 'COMPLETED';
        state.activeQuestIds = state.activeQuestIds.filter((id) => id !== questId);
      }
    },
  },
});

export const { addQuest, startQuest, updateQuestStatus, updateObjectiveProgress, completeQuest } = questSlice.actions;

export default questSlice.reducer;
