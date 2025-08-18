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
    // Build an index of objectives by itemId for active quests
    const objectivesByItem: Record<string, Array<{ questId: string, objective: QuestObjective }>> = {};
    for (const questId of activeQuestIds) {
      const quest: Quest | undefined = state.quest.quests[questId];
      if (quest) {
        quest.objectives.forEach((objective: QuestObjective) => {
          if (objective.type === 'GATHER') {
            if (!objectivesByItem[objective.target]) {
              objectivesByItem[objective.target] = [];
            }
            objectivesByItem[objective.target].push({ questId, objective });
          }
        });
      }
    }

    // Only process objectives that care about this itemId
    const relevantObjectives = objectivesByItem[itemId] || [];
    const currentQuantity = state.inventory.items[itemId] || 0;
    for (const { questId, objective } of relevantObjectives) {
      listenerApi.dispatch(
        updateObjectiveProgress({
          questId,
          objectiveId: objective.id,
          progress: currentQuantity,
        })
      );
    }
  },
});
