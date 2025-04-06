/**
 * Redux selectors for Quests state
 */
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { QuestsState, Quest, QuestObjective, QuestStatus, QuestType, QuestLogEntry } from './QuestsTypes';

// Basic selectors
export const selectQuestsState = (state: RootState) => state.quests;
export const selectAllQuests = (state: RootState) => state.quests.quests;
export const selectActiveQuestIds = (state: RootState) => state.quests.activeQuestIds;
export const selectCompletedQuestIds = (state: RootState) => state.quests.completedQuestIds;
export const selectFailedQuestIds = (state: RootState) => state.quests.failedQuestIds;
export const selectAvailableQuestIds = (state: RootState) => state.quests.availableQuestIds;
export const selectQuestProgress = (state: RootState) => state.quests.questProgress;
export const selectQuestLog = (state: RootState) => state.quests.questLog;
export const selectTrackedQuestId = (state: RootState) => state.quests.trackedQuestId;
export const selectSelectedQuestId = (state: RootState) => state.quests.selectedQuestId;
export const selectQuestsError = (state: RootState) => state.quests.error;
export const selectQuestsLoading = (state: RootState) => state.quests.isLoading;

// Derived selectors
export const selectActiveQuests = createSelector(
  [selectAllQuests, selectActiveQuestIds],
  (quests, activeIds) => activeIds.map(id => quests[id]).filter(Boolean)
);

export const selectCompletedQuests = createSelector(
  [selectAllQuests, selectCompletedQuestIds],
  (quests, completedIds) => completedIds.map(id => quests[id]).filter(Boolean)
);

export const selectFailedQuests = createSelector(
  [selectAllQuests, selectFailedQuestIds],
  (quests, failedIds) => failedIds.map(id => quests[id]).filter(Boolean)
);

export const selectAvailableQuests = createSelector(
  [selectAllQuests, selectAvailableQuestIds],
  (quests, availableIds) => availableIds.map(id => quests[id]).filter(Boolean)
);

export const selectTrackedQuest = createSelector(
  [selectAllQuests, selectTrackedQuestId],
  (quests, trackedId) => trackedId ? quests[trackedId] : null
);

export const selectSelectedQuest = createSelector(
  [selectAllQuests, selectSelectedQuestId],
  (quests, selectedId) => selectedId ? quests[selectedId] : null
);

export const selectQuestById = (questId: string) => 
  createSelector(
    [selectAllQuests],
    (quests) => quests[questId] || null
  );

export const selectQuestProgressById = (questId: string) => 
  createSelector(
    [selectQuestProgress],
    (progress) => progress[questId] || null
  );

export const selectQuestsByType = (type: QuestType | string) => 
  createSelector(
    [selectAllQuests],
    (quests) => Object.values(quests).filter(quest => quest.type === type)
  );

export const selectQuestsByStatus = (status: QuestStatus | string) => 
  createSelector(
    [selectAllQuests],
    (quests) => Object.values(quests).filter(quest => quest.status === status)
  );

export const selectQuestsByLocation = (location: string) => 
  createSelector(
    [selectAllQuests],
    (quests) => Object.values(quests).filter(quest => quest.location === location)
  );

export const selectQuestsByNPC = (npcId: string) => 
  createSelector(
    [selectAllQuests],
    (quests) => Object.values(quests).filter(quest => quest.giver === npcId)
  );

export const selectUnreadQuestLogEntries = createSelector(
  [selectQuestLog],
  (questLog) => questLog.filter(entry => !entry.read)
);

export const selectQuestLogEntriesByQuest = (questId: string) => 
  createSelector(
    [selectQuestLog],
    (questLog) => questLog.filter(entry => entry.questId === questId)
  );

export const selectCompletedQuestObjectives = (questId: string) => 
  createSelector(
    [selectQuestById(questId)],
    (quest) => quest ? quest.objectives.filter(obj => obj.completed) : []
  );

export const selectIncompleteQuestObjectives = (questId: string) => 
  createSelector(
    [selectQuestById(questId)],
    (quest) => quest ? quest.objectives.filter(obj => !obj.completed) : []
  );

export const selectIsQuestCompletable = (questId: string) => 
  createSelector(
    [selectQuestById(questId)],
    (quest) => quest ? quest.objectives.every(obj => obj.completed) : false
  );

export const selectMainStoryProgress = createSelector(
  [selectAllQuests, selectCompletedQuestIds],
  (quests, completedIds) => {
    const mainStoryQuests = Object.values(quests).filter(quest => quest.isStory);
    const completedMainStoryQuests = mainStoryQuests.filter(quest => completedIds.includes(quest.id));
    
    return mainStoryQuests.length > 0
      ? (completedMainStoryQuests.length / mainStoryQuests.length) * 100
      : 0;
  }
);

export const selectQuestsCompletionStats = createSelector(
  [selectAllQuests, selectCompletedQuestIds],
  (quests, completedIds) => {
    const allQuests = Object.values(quests);
    const mainQuests = allQuests.filter(quest => quest.type === QuestType.MAIN);
    const sideQuests = allQuests.filter(quest => quest.type === QuestType.SIDE);
    
    // Calculate completion percentages
    const totalCompletionPercent = allQuests.length > 0
      ? (completedIds.length / allQuests.length) * 100
      : 0;
      
    const mainCompletionPercent = mainQuests.length > 0
      ? (mainQuests.filter(q => completedIds.includes(q.id)).length / mainQuests.length) * 100
      : 0;
      
    const sideCompletionPercent = sideQuests.length > 0
      ? (sideQuests.filter(q => completedIds.includes(q.id)).length / sideQuests.length) * 100
      : 0;
    
    return {
      total: {
        completed: completedIds.length,
        available: allQuests.length,
        percent: totalCompletionPercent
      },
      main: {
        completed: mainQuests.filter(q => completedIds.includes(q.id)).length,
        available: mainQuests.length,
        percent: mainCompletionPercent
      },
      side: {
        completed: sideQuests.filter(q => completedIds.includes(q.id)).length,
        available: sideQuests.length,
        percent: sideCompletionPercent
      }
    };
  }
);

export const selectRecentQuestLogEntries = (count = 5) => 
  createSelector(
    [selectQuestLog],
    (questLog) => 
      [...questLog]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, count)
  );

export const selectDailyQuestProgress = createSelector(
  [selectAllQuests, selectCompletedQuestIds],
  (quests, completedIds) => {
    const dailyQuests = Object.values(quests).filter(quest => quest.type === QuestType.DAILY);
    const completedDailyQuests = dailyQuests.filter(quest => completedIds.includes(quest.id));
    
    return {
      completed: completedDailyQuests.length,
      total: dailyQuests.length,
      percent: dailyQuests.length > 0
        ? (completedDailyQuests.length / dailyQuests.length) * 100
        : 0
    };
  }
);

export const selectQuestCountByLocation = createSelector(
  [selectAllQuests],
  (quests) => {
    const locations: Record<string, { available: number, active: number, completed: number }> = {};
    
    Object.values(quests).forEach(quest => {
      const location = quest.location || 'unknown';
      
      if (!locations[location]) {
        locations[location] = { available: 0, active: 0, completed: 0 };
      }
      
      switch (quest.status) {
        case QuestStatus.AVAILABLE:
          locations[location].available++;
          break;
        case QuestStatus.ACTIVE:
          locations[location].active++;
          break;
        case QuestStatus.COMPLETED:
          locations[location].completed++;
          break;
      }
    });
    
    return locations;
  }
);

export const selectQuestRequiresItem = (itemId: string) => 
  createSelector(
    [selectActiveQuests],
    (quests) => {
      return quests.some(quest => 
        quest.objectives.some(obj => 
          obj.type === 'gather' && obj.target === itemId && !obj.completed
        )
      );
    }
  );

export const selectQuestRequiresEnemy = (enemyType: string) => 
  createSelector(
    [selectActiveQuests],
    (quests) => {
      return quests.some(quest => 
        quest.objectives.some(obj => 
          obj.type === 'kill' && obj.target === enemyType && !obj.completed
        )
      );
    }
  );

export const selectQuestRequiresLocation = (locationId: string) => 
  createSelector(
    [selectActiveQuests],
    (quests) => {
      return quests.some(quest => 
        quest.objectives.some(obj => 
          (obj.type === 'explore' && obj.target === locationId && !obj.completed) ||
          (obj.type === 'deliver' && obj.location === locationId && !obj.completed)
        )
      );
    }
  );

export const selectQuestRequiresNPC = (npcId: string) => 
  createSelector(
    [selectActiveQuests],
    (quests) => {
      return quests.some(quest => 
        quest.objectives.some(obj => 
          obj.type === 'talk' && obj.target === npcId && !obj.completed
        )
      );
    }
  );
