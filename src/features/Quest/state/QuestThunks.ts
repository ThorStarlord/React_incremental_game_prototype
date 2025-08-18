import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addQuest, completeQuest, startQuest, incrementQuestElapsed } from './QuestSlice';
import { Quest } from './QuestTypes';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { gainGold } from '../../Player/state/PlayerSlice';
import { addAvailableQuestToNPC } from '../../NPCs/state/NPCSlice';
import { updateNPCRelationshipThunk } from '../../NPCs/state/NPCThunks';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { addItem, removeItem } from '../../Inventory/state/InventorySlice';
import { v4 as uuidv4 } from 'uuid';
import { updateObjectiveProgress, patchObjectiveFields } from './QuestSlice';
import { toDisplayNameFromId } from '../../../shared/utils/formatUtils';

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

export const deliverQuestItemThunk = createAsyncThunk(
  'quest/deliverQuestItem',
  async ({ questId, objectiveId }: { questId: string, objectiveId: string }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const quest = state.quest.quests[questId];
    const objective = quest?.objectives.find(obj => obj.objectiveId === objectiveId);

    if (quest && objective && objective.type === 'DELIVER' && objective.hasItem && !objective.delivered) {
      const itemId = objective.target;

      // Remove item from inventory
      dispatch(removeItem({ itemId, quantity: 1 }));

  // Mark delivered and complete
  dispatch(patchObjectiveFields({ questId, objectiveId, changes: { delivered: true, isComplete: true, currentCount: 1 } }));
  // Also normalize numeric progress to 1/1
  dispatch(updateObjectiveProgress({ questId, objectiveId, progress: 1 }));
    }
  }
);

export const generateRadiantQuestThunk = createAsyncThunk(
  'quest/generateRadiantQuest',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const allNpcs = Object.values(state.npcs.npcs);
    const guildMasterId = 'npc_guild_master_rook';

    // Exclude the Guild Master himself from being a target
    const targetableNpcs = allNpcs.filter(npc => npc.id !== guildMasterId);
    if (targetableNpcs.length === 0) {
      console.error("No targetable NPCs found for radiant quest.");
      return;
    }

    // Randomly select a target NPC
    const targetNpc = targetableNpcs[Math.floor(Math.random() * targetableNpcs.length)];

    // Predefined list of fetchable items
    const fetchableItems = ['item_ancient_relic', 'item_glowing_crystal'];
    const targetItemId = fetchableItems[Math.floor(Math.random() * fetchableItems.length)];

  const questId = `radiant_quest_${uuidv4()}`;
  const objectiveId = `objective_${uuidv4()}`;
  const targetItemDisplayName = toDisplayNameFromId(targetItemId, 'item_');

    const newQuest: Quest = {
      id: questId,
      title: `Item Delivery: ${targetItemDisplayName} for ${targetNpc.name}`,
      description: `Guild Master Rook has tasked you with delivering a ${targetItemDisplayName} to ${targetNpc.name} in ${targetNpc.location}.`,
      giver: guildMasterId,
      type: 'REPEATABLE',
      status: 'IN_PROGRESS',
      objectives: [
        {
          objectiveId,
          description: `Deliver ${targetItemDisplayName} to ${targetNpc.name}.`,
          type: 'DELIVER',
          target: targetItemId,
          destination: targetNpc.id, // Storing NPC id in destination
          requiredCount: 1,
          currentCount: 0,
          isComplete: false,
          isHidden: false,
          hasItem: false,
          delivered: false,
        },
      ],
      prerequisites: [],
      rewards: [
        { type: 'GOLD', value: 100 },
        { type: 'REPUTATION', value: 10, faction: "Adventurer's Guild" }
      ],
      isAutoComplete: false,
    };

    dispatch(addQuest(newQuest));
    dispatch(startQuest(questId));
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
        const disp = toDisplayNameFromId(itemId, 'item_');
        rewardSummaries.push(`${qty}x ${disp}`);
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
    const activeQuests = state.quest.activeQuestIds
      .map(id => state.quest.quests[id])
      .filter(q => q && typeof q.timeLimitSeconds === 'number') as Quest[];

    for (const quest of activeQuests) {
      const before = quest.elapsedSeconds || 0;
      const after = before + Math.max(0, deltaTime);
      const willFail = quest.timeLimitSeconds !== undefined && before < quest.timeLimitSeconds && after >= quest.timeLimitSeconds;
      dispatch(incrementQuestElapsed({ questId: quest.id, deltaSeconds: Math.max(0, deltaTime) }));
      if (willFail) {
        dispatch(addNotification({ message: `Quest Failed: ${quest.title}`, type: 'error' }));
      }
    }
  }
);
