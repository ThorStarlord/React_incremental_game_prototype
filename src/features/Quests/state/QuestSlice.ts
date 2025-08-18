import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quest, QuestsState } from './QuestTypes';

const initialState: QuestsState = {
  quests: {},
  activeQuestIds: [],
};

const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    addQuest: (state, action: PayloadAction<Quest>) => {
      const quest = action.payload;
      state.quests[quest.id] = quest;
      if (quest.status === 'IN_PROGRESS' && !state.activeQuestIds.includes(quest.id)) {
        state.activeQuestIds.push(quest.id);
      }
    },
    updateObjectiveProgress: (
      state,
      action: PayloadAction<{ questId: string; objectiveId: string; progress: number }>
    ) => {
      const { questId, objectiveId, progress } = action.payload;
      const quest = state.quests[questId];
      if (quest) {
        const objective = quest.objectives.find((o) => o.objectiveId === objectiveId);
        if (objective) {
          objective.currentCount = progress;
          if (objective.currentCount >= objective.requiredCount) {
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

export const { addQuest, updateObjectiveProgress, completeQuest } = questsSlice.actions;

export default questsSlice.reducer;
