import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quest, QuestObjective, QuestState, QuestStatus } from './QuestTypes';

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
      if ((quest.status === 'IN_PROGRESS' || quest.status === 'READY_TO_COMPLETE') && !state.activeQuestIds.includes(quest.id)) {
        state.activeQuestIds.push(quest.id);
      }
    },
    startQuest: (state, action: PayloadAction<string>) => {
      const questId = action.payload;
      const quest = state.quests[questId];
      if (quest && quest.status === 'NOT_STARTED') {
        quest.status = 'IN_PROGRESS';
        quest.startedAt = Date.now();
        quest.elapsedSeconds = 0;
        if (!state.activeQuestIds.includes(questId)) {
          state.activeQuestIds.push(questId);
        }
      }
    },
    incrementQuestElapsed: (state, action: PayloadAction<{ questId: string; deltaSeconds: number }>) => {
      const { questId, deltaSeconds } = action.payload;
      const quest = state.quests[questId];
      if (!quest || quest.status !== 'IN_PROGRESS') return;
      if (typeof quest.timeLimitSeconds !== 'number') return;
      quest.elapsedSeconds = Math.max(0, (quest.elapsedSeconds || 0) + Math.max(0, deltaSeconds));
      if (quest.elapsedSeconds >= quest.timeLimitSeconds) {
        quest.status = 'FAILED';
        state.activeQuestIds = state.activeQuestIds.filter((id) => id !== questId);
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
      if (!quest) return;

      const objective = quest.objectives.find((o) => o.objectiveId === objectiveId);
      if (!objective) return;

      // Normalize progress across objective types
      if (objective.type === 'REACH_LOCATION') {
        // One-and-done objective
        objective.currentCount = progress >= 1 ? 1 : 0;
        objective.isComplete = progress >= 1;
      } else {
        // Count-based objectives
        const target = Math.max(1, objective.requiredCount || 1);
        const next = Math.min(Math.max(0, progress), target);
        objective.currentCount = next;
        objective.isComplete = next >= target;
      }

      // If all objectives complete and quest is in progress, mark ready to turn in
      if (
        quest.status === 'IN_PROGRESS' &&
        quest.objectives.length > 0 &&
        quest.objectives.every((o) => o.isComplete)
      ) {
        quest.status = 'READY_TO_COMPLETE';
      }
    },
    /**
     * Patch arbitrary fields on a specific objective (e.g., hasItem, delivered)
     * without interfering with numeric progress handling.
     */
    patchObjectiveFields: (
      state,
      action: PayloadAction<{ questId: string; objectiveId: string; changes: Partial<QuestObjective> }>
    ) => {
      const { questId, objectiveId, changes } = action.payload;
      const quest = state.quests[questId];
      if (!quest) return;
      const objective = quest.objectives.find((o) => o.objectiveId === objectiveId);
      if (!objective) return;
      Object.assign(objective, changes);
    },
    completeQuest: (state, action: PayloadAction<string>) => {
      const questId = action.payload;
      const quest = state.quests[questId];
      if (quest) {
        quest.status = 'COMPLETED';
        state.activeQuestIds = state.activeQuestIds.filter((id) => id !== questId);
      }
    },
    failQuest: (state, action: PayloadAction<string>) => {
      const questId = action.payload;
      const quest = state.quests[questId];
      if (quest) {
        quest.status = 'FAILED';
        state.activeQuestIds = state.activeQuestIds.filter((id) => id !== questId);
      }
    },
  },
});

export const { addQuest, startQuest, updateQuestStatus, updateObjectiveProgress, patchObjectiveFields, completeQuest, failQuest, incrementQuestElapsed } = questSlice.actions;

export default questSlice.reducer;
