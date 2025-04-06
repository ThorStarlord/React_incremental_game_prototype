/**
 * Redux Thunks for Quests-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addNotification } from '../../Notifications/state/NotificationsSlice';
import {
  StartQuestPayload,
  CompleteQuestPayload,
  AbandonQuestPayload,
  FailQuestPayload,
  ProcessQuestEventPayload,
  CheckQuestRequirementsPayload,
  RequirementsCheckResult,
  ObjectiveType
} from './QuestsTypes';
import { 
  manuallyStartQuest, 
  manuallyCompleteQuest, 
  manuallyAbandonQuest, 
  manuallyFailQuest,
  updateObjectiveProgress
} from './QuestsSlice';

/**
 * Start a quest
 */
export const startQuest = createAsyncThunk<
  { questId: string; success: boolean },
  StartQuestPayload,
  { state: RootState }
>(
  'quests/startQuest',
  async (payload, { getState, dispatch }) => {
    const { questId, npcId } = payload;
    const state = getState();
    const quest = state.quests.quests[questId];
    
    if (!quest) {
      throw new Error(`Quest with ID ${questId} not found`);
    }
    
    // Check quest requirements
    const requirementsResult = await dispatch(checkQuestRequirements({ questId })).unwrap();
    if (!requirementsResult.allMet) {
      // Show error with requirements not met
      const unmetRequirements = requirementsResult.requirements
        .filter(req => !req.met)
        .map(req => req.description)
        .join(', ');
      
      dispatch(addNotification(
        `Cannot start quest: ${unmetRequirements}`,
        'error',
        {
          duration: 5000,
          category: 'quests'
        }
      ));
      
      throw new Error(`Quest requirements not met: ${unmetRequirements}`);
    }
    
    // Start the quest
    dispatch(manuallyStartQuest({ questId, npcId }));
    
    // Show notification
    dispatch(addNotification(
      `Started new quest: ${quest.title}`,
      'success',
      {
        duration: 3000,
        category: 'quests'
      }
    ));
    
    return { questId, success: true };
  }
);

/**
 * Complete a quest and process rewards
 */
export const completeQuest = createAsyncThunk<
  { questId: string; success: boolean; rewards: any },
  CompleteQuestPayload,
  { state: RootState }
>(
  'quests/completeQuest',
  async (payload, { getState, dispatch }) => {
    const { questId } = payload;
    const state = getState();
    const quest = state.quests.quests[questId];
    
    if (!quest) {
      throw new Error(`Quest with ID ${questId} not found`);
    }
    
    // Check if quest is active and can be completed
    if (!state.quests.activeQuestIds.includes(questId)) {
      throw new Error(`Cannot complete quest that is not active`);
    }
    
    // Check if all objectives are completed
    const allObjectivesCompleted = quest.objectives.every(obj => obj.completed);
    if (!allObjectivesCompleted) {
      throw new Error(`Cannot complete quest: not all objectives are completed`);
    }
    
    // Complete the quest in state
    dispatch(manuallyCompleteQuest({ questId }));
    
    // Process rewards
    const rewards = quest.reward || {};
    
    // Experience points
    if (rewards.experience) {
      dispatch({
        type: 'player/addExperience',
        payload: rewards.experience
      });
    }
    
    // Gold
    if (rewards.gold) {
      dispatch({
        type: 'player/addGold',
        payload: rewards.gold
      });
    }
    
    // Items
    if (rewards.items && rewards.items.length > 0) {
      rewards.items.forEach(item => {
        dispatch({
          type: 'inventory/addItem',
          payload: {
            itemId: item.id,
            quantity: item.quantity
          }
        });
      });
    }
    
    // Reputation with factions
    if (rewards.reputation) {
      Object.entries(rewards.reputation).forEach(([factionId, amount]) => {
        dispatch({
          type: 'factions/changeReputation',
          payload: {
            factionId,
            amount,
            reason: `Completed quest: ${quest.title}`
          }
        });
      });
    }
    
    // Essence
    if (rewards.essence) {
      dispatch({
        type: 'player/addEssence',
        payload: rewards.essence
      });
    }
    
    // Show notification
    const rewardString = [];
    if (rewards.experience) rewardString.push(`${rewards.experience} XP`);
    if (rewards.gold) rewardString.push(`${rewards.gold} Gold`);
    if (rewards.essence) rewardString.push(`${rewards.essence} Essence`);
    if (rewards.items && rewards.items.length > 0) {
      rewardString.push(`${rewards.items.length} Item(s)`);
    }
    
    dispatch(addNotification(
      `Completed quest: ${quest.title}`,
      'success',
      {
        duration: 5000,
        category: 'quests',
        description: `Rewards: ${rewardString.join(', ')}`
      }
    ));
    
    return { 
      questId, 
      success: true,
      rewards
    };
  }
);

/**
 * Abandon a quest
 */
export const abandonQuest = createAsyncThunk<
  { questId: string; success: boolean },
  AbandonQuestPayload,
  { state: RootState }
>(
  'quests/abandonQuest',
  async (payload, { getState, dispatch }) => {
    const { questId } = payload;
    const state = getState();
    const quest = state.quests.quests[questId];
    
    if (!quest) {
      throw new Error(`Quest with ID ${questId} not found`);
    }
    
    // Check if quest is active
    if (!state.quests.activeQuestIds.includes(questId)) {
      throw new Error(`Cannot abandon quest that is not active`);
    }
    
    // Abandon the quest
    dispatch(manuallyAbandonQuest({ questId }));
    
    // Show notification
    dispatch(addNotification(
      `Abandoned quest: ${quest.title}`,
      'info',
      {
        duration: 3000,
        category: 'quests'
      }
    ));
    
    return { questId, success: true };
  }
);

/**
 * Fail a quest
 */
export const failQuest = createAsyncThunk<
  { questId: string; success: boolean },
  FailQuestPayload,
  { state: RootState }
>(
  'quests/failQuest',
  async (payload, { getState, dispatch }) => {
    const { questId, reason } = payload;
    const state = getState();
    const quest = state.quests.quests[questId];
    
    if (!quest) {
      throw new Error(`Quest with ID ${questId} not found`);
    }
    
    // Check if quest is active
    if (!state.quests.activeQuestIds.includes(questId)) {
      throw new Error(`Cannot fail quest that is not active`);
    }
    
    // Fail the quest
    dispatch(manuallyFailQuest({ questId, reason }));
    
    // Show notification
    dispatch(addNotification(
      `Failed quest: ${quest.title}`,
      'error',
      {
        duration: 5000,
        category: 'quests',
        description: reason || 'Quest conditions were not met'
      }
    ));
    
    return { questId, success: true };
  }
);

/**
 * Process game events for quest objectives
 */
export const processQuestEvent = createAsyncThunk<
  { updatedQuestIds: string[] },
  ProcessQuestEventPayload,
  { state: RootState }
>(
  'quests/processQuestEvent',
  async (payload, { getState, dispatch }) => {
    const { eventType, target, amount = 1, location } = payload;
    const state = getState();
    const activeQuestIds = state.quests.activeQuestIds;
    const updatedQuestIds: string[] = [];
    
    // Process each active quest
    for (const questId of activeQuestIds) {
      const quest = state.quests.quests[questId];
      
      // Skip if quest not found
      if (!quest) continue;
      
      // Check each objective
      for (const objective of quest.objectives) {
        // Skip if objective is already completed
        if (objective.completed) continue;
        
        let matches = false;
        
        // Match based on objective type
        switch (objective.type) {
          case ObjectiveType.KILL:
            matches = eventType === 'kill' && objective.target === target;
            break;
          case ObjectiveType.GATHER:
            matches = eventType === 'gather' && objective.target === target;
            break;
          case ObjectiveType.EXPLORE:
            matches = eventType === 'explore' && objective.target === location;
            break;
          case ObjectiveType.TALK:
            matches = eventType === 'talk' && objective.target === target;
            break;
          case ObjectiveType.CRAFT:
            matches = eventType === 'craft' && objective.target === target;
            break;
          case ObjectiveType.DELIVER:
            matches = eventType === 'deliver' && 
                     objective.target === target && 
                     objective.location === location;
            break;
        }
        
        // If objective matches the event, update progress
        if (matches) {
          dispatch(updateObjectiveProgress({
            questId,
            objectiveId: objective.id,
            progress: amount
          }));
          
          if (!updatedQuestIds.includes(questId)) {
            updatedQuestIds.push(questId);
          }
        }
      }
    }
    
    return { updatedQuestIds };
  }
);

/**
 * Check if player meets quest requirements
 */
export const checkQuestRequirements = createAsyncThunk<
  RequirementsCheckResult & { questId: string },
  CheckQuestRequirementsPayload,
  { state: RootState }
>(
  'quests/checkQuestRequirements',
  async (payload, { getState }) => {
    const { questId } = payload;
    const state = getState();
    const quest = state.quests.quests[questId];
    
    if (!quest) {
      throw new Error(`Quest with ID ${questId} not found`);
    }
    
    const result: RequirementsCheckResult = {
      allMet: true,
      requirements: []
    };
    
    // Check each requirement
    if (quest.requirements && quest.requirements.length > 0) {
      for (const req of quest.requirements) {
        let met = false;
        
        switch (req.type) {
          case 'level':
            met = state.player.level >= (req.value as number);
            result.requirements.push({
              type: 'level',
              met,
              description: `Requires level ${req.value}`
            });
            break;
            
          case 'quest':
            met = state.quests.completedQuestIds.includes(req.value as string);
            result.requirements.push({
              type: 'quest',
              met,
              description: `Requires completion of ${state.quests.quests[req.value as string]?.title || `quest ${req.value}`}`
            });
            break;
            
          case 'item':
            const item = state.inventory.items.find(i => i.id === req.value);
            met = item ? item.quantity >= (req.quantity || 1) : false;
            result.requirements.push({
              type: 'item',
              met,
              description: `Requires ${req.quantity || 1}x ${req.value}`
            });
            break;
            
          case 'skill':
            const skill = state.skills.skills[req.value as string];
            met = skill ? skill.level >= (req.skillLevel || 1) : false;
            result.requirements.push({
              type: 'skill',
              met,
              description: `Requires ${skill?.name || req.value} level ${req.skillLevel || 1}`
            });
            break;
            
          case 'faction':
            const reputation = state.factions?.playerStandings.find(
              s => s.factionId === req.value
            )?.reputation || 0;
            met = reputation >= (req.quantity || 0);
            result.requirements.push({
              type: 'faction',
              met,
              description: `Requires ${req.quantity || 0} reputation with ${req.value}`
            });
            break;
        }
        
        // If any requirement is not met, the overall check fails
        if (!met) {
          result.allMet = false;
        }
      }
    }
    
    return { ...result, questId };
  }
);
