import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addQuest, completeQuest, startQuest, failQuest } from './QuestSlice';
import { Quest } from './QuestTypes';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { gainGold } from '../../Player/state/PlayerSlice';
import { addAvailableQuestToNPC } from '../../NPCs/state/NPCSlice';
import { updateNPCRelationshipThunk } from '../../NPCs/state/NPCThunks';
import { addNotification } from '../../../shared/state/NotificationSlice';
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

    if (quest && quest.status === 'READY_TO_COMPLETE') {
      const rewards = quest.rewards;
      const rewardSummaries: string[] = [];

      for (const reward of rewards) {
        switch (reward.type) {
          case 'ESSENCE':
            {
              const amount = Number(reward.value) || 0;
              dispatch(gainEssence({ amount, source: 'quest_reward', description: quest.id }));
              rewardSummaries.push(`${amount} Essence`);
            }
            break;
          case 'GOLD':
            {
              const amount = Number(reward.value) || 0;
              dispatch(gainGold(amount));
              rewardSummaries.push(`${amount} Gold`);
            }
            break;
          case 'REPUTATION':
            dispatch(
              updateNPCRelationshipThunk({
                npcId: quest.giver,
                change: Number(reward.value) || 0,
                reason: 'Quest Reward',
              })
            );
            rewardSummaries.push(`+${reward.value} Reputation with ${quest.giver}`);
            break;
          case 'ITEM':
            {
              const itemId = String(reward.value);
              const qty = reward.amount || 1;
              dispatch(addItem({ itemId, quantity: qty }));
              rewardSummaries.push(`${qty}x ${itemId}`);
            }
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

      // Quest Chaining Logic: unlock quests that require this quest to be completed
      const allQuests = Object.values(state.quest.quests);
      for (const nextQuest of allQuests) {
        const requiresThisQuest = (nextQuest.prerequisites || []).some(
          (req) => req.type === 'QUEST_COMPLETED' && String(req.value) === questId
        );
        if (requiresThisQuest) {
          dispatch(addAvailableQuestToNPC({ npcId: nextQuest.giver, questId: nextQuest.id }));
        }
      }

      return { questId, rewards: quest.rewards };
    }

    return Promise.reject(new Error('Quest not ready to be turned in.'));
  }
);

export const processQuestTimersThunk = createAsyncThunk(
  'quest/processQuestTimers',
  async (deltaTime: number, { dispatch, getState }) => {
    const state = getState() as RootState;
    const activeQuests = state.quest.activeQuestIds.map(id => state.quest.quests[id]);

    for (const quest of activeQuests) {
      if (quest && quest.timeLimitSeconds && quest.startedAt) {
        const elapsedTime = (Date.now() - quest.startedAt) / 1000;
        if (elapsedTime > quest.timeLimitSeconds) {
          dispatch(failQuest(quest.id));
          dispatch(addNotification({ message: `Quest Failed: ${quest.title}`, type: 'error' }));
        }
      }
    }
  }
);
