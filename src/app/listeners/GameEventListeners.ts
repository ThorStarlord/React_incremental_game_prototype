import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { addItem } from '../../features/Inventory/state/InventorySlice';
import { setLocation } from '../../features/Player/state/PlayerSlice';
import { targetKilled } from '../../features/Combat/CombatSlice';
import { updateObjectiveProgress } from '../../features/Quest/state/QuestSlice';
import { Quest, QuestObjective } from '../../features/Quest/state/QuestTypes';

export const gameEventListeners = createListenerMiddleware();

// Listener for item additions (GATHER objectives)
gameEventListeners.startListening({
  matcher: isAnyOf(addItem),
  effect: async (action: ReturnType<typeof addItem>, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { itemId } = action.payload;
    const activeQuests = state.quest.activeQuestIds.map(id => state.quest.quests[id]);

    for (const quest of activeQuests) {
      if (!quest) continue;
      for (const objective of quest.objectives) {
        if (objective.type === 'GATHER' && objective.target === itemId) {
          const currentQuantity = state.inventory.items[itemId] || 0;
          listenerApi.dispatch(
            updateObjectiveProgress({
              questId: quest.id,
              objectiveId: objective.objectiveId,
              progress: currentQuantity,
            })
          );
        }
      }
    }
  },
});

// Listener for location changes (REACH_LOCATION objectives)
gameEventListeners.startListening({
  actionCreator: setLocation,
  effect: async (action: ReturnType<typeof setLocation>, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const newLocation = action.payload;
    const activeQuests = state.quest.activeQuestIds.map(id => state.quest.quests[id]);

    for (const quest of activeQuests) {
      if (!quest) continue;
      for (const objective of quest.objectives) {
        if (objective.type === 'REACH_LOCATION' && objective.target === newLocation) {
          listenerApi.dispatch(
            updateObjectiveProgress({
              questId: quest.id,
              objectiveId: objective.objectiveId,
              progress: 1, // REACH_LOCATION is a one-and-done objective
            })
          );
        }
      }
    }
  },
});

// Listener for combat victories (KILL objectives)
gameEventListeners.startListening({
  actionCreator: targetKilled,
  effect: async (action: ReturnType<typeof targetKilled>, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { targetId } = action.payload;
    const activeQuests = state.quest.activeQuestIds.map(id => state.quest.quests[id]);

    for (const quest of activeQuests) {
      if (!quest) continue;
      for (const objective of quest.objectives) {
        if (objective.type === 'KILL' && objective.target === targetId) {
          const newProgress = (objective.currentCount || 0) + 1;
          listenerApi.dispatch(
            updateObjectiveProgress({
              questId: quest.id,
              objectiveId: objective.objectiveId,
              progress: newProgress,
            })
          );
        }
      }
    }
  },
});
