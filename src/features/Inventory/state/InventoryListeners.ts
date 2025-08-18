import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addItem } from './InventorySlice';
import { updateObjectiveProgress } from '../../Quest/state/QuestSlice';
import { Quest, QuestObjective } from '../../Quest/state/QuestTypes';

export const inventoryListeners = createListenerMiddleware();

inventoryListeners.startListening({
  matcher: isAnyOf(addItem),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { itemId } = action.payload;

    const activeQuestIds = state.quest.activeQuestIds;

    for (const questId of activeQuestIds) {
      const quest: Quest | undefined = state.quest.quests[questId];

      if (quest) {
        quest.objectives.forEach((objective: QuestObjective) => {
          if (objective.type === 'GATHER' && objective.target === itemId) {
            const currentQuantity = state.inventory.items[itemId] || 0;
            listenerApi.dispatch(
              updateObjectiveProgress({
                questId,
                objectiveId: objective.id,
                progress: currentQuantity,
              })
            );
          }
        });
      }
    }
  },
});
