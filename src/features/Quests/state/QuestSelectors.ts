import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { QuestsState } from './QuestTypes';

const selectQuestsState = (state: RootState): QuestsState => state.quests;

export const selectAllQuests = createSelector(
  [selectQuestsState],
  (questsState) => questsState.quests
);

export const selectActiveQuestIds = createSelector(
  [selectQuestsState],
  (questsState) => questsState.activeQuestIds
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
