import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  addQuest,
  completeQuest,
  startQuest,
  incrementQuestElapsed,
  updateObjectiveProgress,
  patchObjectiveFields,
  setQuestResolution,
} from './QuestSlice';
import type { Quest, QuestReward } from './QuestTypes';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { gainGold, addStatusEffect } from '../../Player/state/PlayerSlice';
import { addAvailableQuestToNPC } from '../../NPCs/state/NPCSlice';
import { updateNPCRelationshipThunk } from '../../NPCs/state/NPCThunks';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { addItem, removeItem } from '../../Inventory/state/InventorySlice';
import { recordAuthoredRelationshipExperienceThunk } from '../../Relationships/state/RelationshipThunks';
import { v4 as uuidv4 } from 'uuid';
import { toDisplayNameFromId } from '../../../shared/utils/formatUtils';
import type { StatusEffect } from '../../Player/state/PlayerTypes';
import { QUEST_CONSTANTS } from '../../../constants/gameConstants';

const applyQuestRewards = async (
  rewards: QuestReward[],
  quest: Quest,
  dispatch: any,
  essenceSource: string
): Promise<string[]> => {
  const rewardSummaries: string[] = [];

  for (const reward of rewards) {
    switch (reward.type) {
      case 'ESSENCE': {
        const amount = Number(reward.value) || 0;
        dispatch(gainEssence({ amount, source: essenceSource, description: quest.id }));
        rewardSummaries.push(`${amount} Essence`);
        break;
      }
      case 'GOLD': {
        const amount = Number(reward.value) || 0;
        dispatch(gainGold(amount));
        rewardSummaries.push(`${amount} Gold`);
        break;
      }
      case 'REPUTATION': {
        dispatch(
          updateNPCRelationshipThunk({
            npcId: quest.giver,
            change: Number(reward.value) || 0,
            reason: 'Quest Reward',
          })
        );
        rewardSummaries.push(`+${reward.value} Reputation with ${quest.giver}`);
        break;
      }
      case 'ITEM': {
        const itemId = String(reward.value);
        const qty = reward.amount || 1;
        dispatch(addItem({ itemId, quantity: qty }));
        rewardSummaries.push(`${qty}x ${toDisplayNameFromId(itemId, 'item_')}`);
        break;
      }
      default:
        break;
    }
  }

  return rewardSummaries;
};

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
      `Failed to initialize quests. Reason: ${errorMsg}\nPossible causes: network error, missing or invalid /data/quests.json file, or JSON parse error.\nNext steps: Check your network connection, ensure /data/quests.json exists and is valid JSON.`
    );
  }
});

export const startQuestThunk = createAsyncThunk(
  'quest/startQuest',
  async (questId: string, { dispatch, getState }) => {
    dispatch(startQuest(questId));

    // A GATHER objective must reflect items already held when the quest starts.
    // This closes a general prototype gap and lets authored dialogue hand over a
    // tutorial resource before the player formally accepts the quest.
    const state = getState() as RootState;
    const quest = state.quest.quests[questId];
    if (quest?.status === 'IN_PROGRESS') {
      for (const objective of quest.objectives) {
        if (objective.type !== 'GATHER') continue;
        const currentQuantity = state.inventory.items[objective.target] ?? 0;
        dispatch(updateObjectiveProgress({
          questId,
          objectiveId: objective.objectiveId,
          progress: currentQuantity,
        }));
      }
    }

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
      dispatch(removeItem({ itemId, quantity: 1 }));
      dispatch(patchObjectiveFields({ questId, objectiveId, changes: { delivered: true, isComplete: true, currentCount: 1 } }));
      dispatch(updateObjectiveProgress({ questId, objectiveId, progress: 1 }));
    }
  }
);

export const solveQuestPuzzleThunk = createAsyncThunk(
  'quest/solveQuestPuzzle',
  async ({ questId, objectiveId, solution }: { questId: string; objectiveId: string; solution: string }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const quest = state.quest.quests[questId];
    const objective = quest?.objectives.find((obj) => obj.objectiveId === objectiveId);

    if (!quest || !objective || !objective.outcomes) {
      dispatch(addNotification({ message: 'Failed to solve puzzle: Invalid quest or objective.', type: 'error' }));
      return;
    }

    const outcome = objective.outcomes.find((o) => o.solution === solution);

    if (!outcome) {
      dispatch(addNotification({ message: 'Incorrect solution.', type: 'error' }));
      return;
    }

    for (const reward of outcome.rewards) {
      switch (reward.type) {
        case 'GOLD':
          dispatch(gainGold(Number(reward.value) || 0));
          break;
        case 'ESSENCE':
          dispatch(gainEssence({ amount: Number(reward.value) || 0, source: 'puzzle_reward', description: quest.id }));
          break;
        case 'ITEM':
          dispatch(addItem({ itemId: String(reward.value), quantity: reward.amount || 1 }));
          break;
        default:
          break;
      }
    }

    for (const effect of outcome.effects) {
      if (effect.type === 'STATUS_EFFECT') {
        const newEffect: StatusEffect = {
          id: uuidv4(),
          name: effect.value,
          duration: QUEST_CONSTANTS.DEFAULT_STATUS_EFFECT_DURATION,
          potency: QUEST_CONSTANTS.DEFAULT_STATUS_EFFECT_POTENCY,
        };
        dispatch(addStatusEffect(newEffect));
      }
    }

    dispatch(addNotification({ message: outcome.logMessage, type: 'success' }));
    dispatch(updateObjectiveProgress({ questId, objectiveId, progress: 1 }));
  }
);

/**
 * Resolve an authored quest decision after objectives are complete and before
 * ordinary turn-in. This keeps narrative/relationship evidence separate from
 * immediately consumable resource rewards.
 */
export const resolveQuestOutcomeThunk = createAsyncThunk<
  { questId: string; resolutionId: string; rewards: string[] },
  { questId: string; resolutionId: string },
  { state: RootState; rejectValue: string }
>(
  'quest/resolveOutcome',
  async ({ questId, resolutionId }, { dispatch, getState, rejectWithValue }) => {
    try {
      let state = getState() as RootState;
      const quest = state.quest.quests[questId];

      if (!quest) throw new Error(`Quest not found: ${questId}`);
      if (quest.status !== 'READY_TO_COMPLETE') {
        throw new Error('Quest objectives must be complete before choosing a resolution.');
      }
      if (quest.selectedResolutionId) {
        if (quest.selectedResolutionId === resolutionId) {
          return { questId, resolutionId, rewards: [] };
        }
        throw new Error('This quest resolution has already been chosen.');
      }

      const option = quest.resolutionOptions?.find(candidate => candidate.id === resolutionId);
      if (!option) throw new Error(`Unknown quest resolution: ${resolutionId}`);

      for (const cost of option.consumeItems ?? []) {
        const available = state.inventory.items[cost.itemId] ?? 0;
        if (available < cost.quantity) {
          throw new Error(
            `Resolution requires ${cost.quantity}x ${toDisplayNameFromId(cost.itemId, 'item_')}.`
          );
        }
      }

      // Relationship evidence is recorded before irreversible resource changes so a
      // failed authored-data lookup cannot consume the player's item/reward choice.
      if (option.relationshipExperienceId) {
        const result = await dispatch(
          recordAuthoredRelationshipExperienceThunk({
            experienceId: option.relationshipExperienceId,
          })
        );
        if (recordAuthoredRelationshipExperienceThunk.rejected.match(result)) {
          throw new Error(String(result.payload ?? 'Failed to record relationship consequence.'));
        }
      }

      for (const cost of option.consumeItems ?? []) {
        dispatch(removeItem({ itemId: cost.itemId, quantity: cost.quantity }));
      }

      const rewardSummaries = await applyQuestRewards(
        option.rewards ?? [],
        quest,
        dispatch,
        'quest_resolution'
      );

      dispatch(setQuestResolution({ questId, resolutionId }));
      dispatch(addNotification({
        message: option.logMessage ?? `Decision recorded: ${option.label}`,
        type: 'success',
      }));

      state = getState() as RootState;
      return {
        questId,
        resolutionId: state.quest.quests[questId]?.selectedResolutionId ?? resolutionId,
        rewards: rewardSummaries,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch(addNotification({ message, type: 'warning' }));
      return rejectWithValue(message);
    }
  }
);

export const generateRadiantQuestThunk = createAsyncThunk(
  'quest/generateRadiantQuest',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const allNpcs = Object.values(state.npcs.npcs);
    const guildMasterId = 'npc_guild_master_rook';
    const targetableNpcs = allNpcs.filter(npc => npc.id !== guildMasterId);
    if (targetableNpcs.length === 0) {
      console.error('No targetable NPCs found for radiant quest.');
      return;
    }

    const targetNpc = targetableNpcs[Math.floor(Math.random() * targetableNpcs.length)];
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
          destination: targetNpc.id,
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
        { type: 'REPUTATION', value: 10, faction: "Adventurer's Guild" },
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
      if (quest.resolutionRequired && !quest.selectedResolutionId) {
        dispatch(addNotification({
          message: 'Choose how to resolve this quest before turning it in.',
          type: 'info',
        }));
        return Promise.reject(new Error('Quest resolution required.'));
      }

      if (!quest.isAutoComplete) {
        const selectedNpcId = state.npcs.selectedNPCId;
        if (selectedNpcId !== quest.giver) {
          dispatch(addNotification({
            message: 'Return to the quest giver to turn in this quest.',
            type: 'info',
          }));
          return Promise.reject(new Error('Must return to quest giver.'));
        }
      }

      const rewardSummaries = await applyQuestRewards(
        quest.rewards,
        quest,
        dispatch,
        'quest_reward'
      );

      if (rewardSummaries.length > 0) {
        dispatch(addNotification({
          message: `Quest Complete! Rewards: ${rewardSummaries.join(', ')}.`,
          type: 'success',
        }));
      } else {
        dispatch(addNotification({
          message: `Quest Complete: ${quest.title}.`,
          type: 'success',
        }));
      }

      dispatch(completeQuest(questId));

      const allQuests = Object.values(state.quest.quests);
      for (const nextQuest of allQuests) {
        const prerequisites = Array.isArray(nextQuest.prerequisites)
          ? nextQuest.prerequisites
          : [];
        const requiresThisQuest = prerequisites.some(
          req => req.type === 'QUEST_COMPLETED' && String(req.value) === questId
        );
        if (requiresThisQuest) {
          dispatch(addAvailableQuestToNPC({ npcId: nextQuest.giver, questId: nextQuest.id }));
        }
      }

      return { questId, rewards: quest.rewards, resolutionId: quest.selectedResolutionId };
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
