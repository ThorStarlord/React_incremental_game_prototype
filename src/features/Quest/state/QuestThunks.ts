import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addQuest, completeQuest, startQuest } from './QuestSlice';
import { Quest } from './QuestTypes';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { gainGold } from '../../Player/state/PlayerSlice';
import { addAvailableQuestToNPC, updateNPCRelationshipThunk } from '../../NPCs/state/NPCSlice';
import { addNotification } from '../../Notification/state/NotificationSlice';
import { addItem } from '../../Inventory/state/InventorySlice';

export const initializeQuestsThunk = createAsyncThunk('quest/initializeQuests', async (_, { dispatch }) => {
  try {
    const response = await fetch('/data/quests.json');
    const quests: Record<string, Quest> = await response.json();
    Object.values(quests).forEach(quest => {
      dispatch(addQuest(quest));
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(
      `Failed to initialize quests. Reason: ${errorMsg}
Possible causes: network error, missing or invalid /data/quests.json file, or JSON parse error.
Next steps: Check your network connection, ensure /data/quests.json exists and is valid JSON.`
    );
  }
});

export const startQuestThunk = createAsyncThunk(
  'quest/startQuest',
  async (questId: string, { dispatch }) => {
    dispatch(startQuest(questId));
    return questId;
  }
);

export const turnInQuestThunk = createAsyncThunk(
  'quest/turnInQuest',
  async (questId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const quest = state.quest.quests[questId];

    if (quest && quest.status === 'COMPLETE') {
      const rewards = quest.rewards;
      const rewardSummaries: string[] = [];

      for (const reward of rewards) {
        switch (reward.type) {
          case 'ESSENCE':
            dispatch(gainEssence(reward.value));
            rewardSummaries.push(`${reward.value} Essence`);
            break;
          case 'GOLD':
            dispatch(gainGold(reward.value));
            rewardSummaries.push(`${reward.value} Gold`);
            break;
          case 'REPUTATION':
            dispatch(
              updateNPCRelationshipThunk({
                npcId: quest.giver,
                change: reward.value,
                reason: 'Quest Reward',
              })
            );
            rewardSummaries.push(`+${reward.value} Reputation with ${quest.giver}`);
            break;
          case 'ITEM':
            dispatch(addItem({ itemId: reward.value, quantity: reward.amount || 1 }));
            rewardSummaries.push(`${reward.amount || 1}x ${reward.value}`);
            break;
          default:
            break;
        }
      }

      if (rewardSummaries.length > 0) {
        const summaryMessage = `Quest Complete! Rewards: ${rewardSummaries.join(', ')}.`;
        dispatch(addNotification({ message: summaryMessage, type: 'success' }));
      }

      dispatch(completeQuest(questId));

      // Quest Chaining Logic
      const allQuests = Object.values(state.quest.quests);
      for (const nextQuest of allQuests) {
        if (nextQuest.prerequisites?.quests?.includes(questId)) {
          dispatch(addAvailableQuestToNPC({ npcId: nextQuest.giver, questId: nextQuest.id }));
        }
      }

      return { questId, rewards: quest.rewards };
    }

    return Promise.reject(new Error('Quest not ready to be turned in.'));
  }
);
