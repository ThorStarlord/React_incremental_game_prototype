import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { QuestState } from './QuestTypes';

const selectQuestState = (state: RootState): QuestState => state.quest;

export const selectAllQuests = createSelector(
  [selectQuestState],
  (questState) => questState.quests
);

export const selectActiveQuestIds = createSelector(
  [selectQuestState],
  (questState) => questState.activeQuestIds
);

export const selectActiveQuests = createSelector(
  [selectAllQuests, selectActiveQuestIds],
  (quests, activeQuestIds) => {
    return activeQuestIds.map(id => quests[id]).filter(quest => quest);
  }
);

export const selectQuestById = createSelector(
  [selectAllQuests, (state: RootState, questId: string) => questId],
  (quests, questId) => quests[questId]
);
