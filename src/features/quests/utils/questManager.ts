import { createAffinityAction } from '../../../context/GameStateContext';
import quests, { QuestData } from '../data/quests';
import { Quest, QuestProgress, QuestObjective, QuestRequirement, QuestsState } from '../../../context/initialStates/QuestsInitialState';

/**
 * Game state interface for requirement checking
 */
interface GameState {
  player: {
    level: number;
    skills: Array<{
      id: string;
      level: number;
    }>;
  };
  quests: {
    completedQuestIds: string[];
  };
  inventory: {
    items: Array<{
      id: string;
      quantity: number;
    }>;
  };
}

/**
 * Interface for event data in quest processing
 */
interface QuestEvent {
  type: string;
  enemyType?: string;
  itemId?: string;
  targetId?: string;
  locationId?: string;
  amount?: number;
}

/**
 * Interface for quest update data
 */
interface QuestUpdate {
  questId: string;
  objectiveId: string;
  amount: number;
}

/**
 * Interface for quest rewards
 */
interface QuestRewardsResult {
  experience?: number;
  gold?: number;
  items?: Array<{
    id: string;
    quantity: number;
  }>;
  skills?: Array<{
    id: string;
    points: number;
  }>;
  other?: any[];
}

/**
 * Check if all requirements for a quest are met
 * @param quest - The quest to check
 * @param gameState - Current game state
 * @returns Whether all requirements are met
 */
export const checkQuestRequirements = (quest: Quest, gameState: GameState): boolean => {
  if (!quest.requirements || quest.requirements.length === 0) {
    return true;
  }

  return quest.requirements.every((req: QuestRequirement) => {
    switch (req.type) {
      case 'level':
        return gameState.player.level >= req.value;
      case 'quest':
        return gameState.quests.completedQuestIds.includes(req.value);
      case 'item':
        const item = gameState.inventory.items.find(i => i.id === req.value);
        return item !== undefined && item.quantity >= (req.quantity || 1);
      case 'skill':
        const skill = gameState.player.skills.find(s => s.id === req.value);
        return skill !== undefined && skill.level >= (req as any).skillLevel;
      default:
        return false;
    }
  });
};

/**
 * Accept a quest
 * @param state - Current quest state
 * @param questId - ID of the quest to accept
 * @returns Updated state
 */
export const acceptQuest = (state: QuestsState, questId: string): QuestsState => {
  const quest = state.quests[questId];
  
  if (!quest || quest.status !== 'not_started') {
    return state;
  }

  // Create a deep copy to avoid mutating the original state
  const updatedState: QuestsState = {
    ...state,
    quests: {
      ...state.quests,
      [questId]: {
        ...quest,
        status: 'active'
      }
    },
    activeQuestIds: [...state.activeQuestIds, questId],
    questProgress: {
      ...state.questProgress,
      [questId]: {
        objectiveProgress: {},
        startedAt: new Date()
      }
    }
  };

  return updatedState;
};

/**
 * Abandon a quest
 * @param state - Current quest state
 * @param questId - ID of the quest to abandon
 * @returns Updated state
 */
export const abandonQuest = (state: QuestsState, questId: string): QuestsState => {
  const quest = state.quests[questId];
  
  if (!quest || quest.status !== 'active') {
    return state;
  }

  // Create a deep copy to avoid mutating the original state
  const updatedState: QuestsState = {
    ...state,
    quests: {
      ...state.quests,
      [questId]: {
        ...quest,
        status: 'not_started'
      }
    },
    activeQuestIds: state.activeQuestIds.filter(id => id !== questId)
  };

  // Remove progress data
  const { [questId]: removedProgress, ...remainingProgress } = state.questProgress;
  updatedState.questProgress = remainingProgress;

  return updatedState;
};

/**
 * Check if a quest can be completed
 * @param quest - The quest to check
 * @param progress - Progress data for the quest
 * @returns Whether the quest can be completed
 */
export const canCompleteQuest = (quest: Quest, progress: QuestProgress | undefined): boolean => {
  if (!quest || quest.status !== 'active' || !progress || !progress.objectiveProgress) {
    return false;
  }

  return quest.objectives.every((obj: QuestObjective) => {
    const currentProgress = progress.objectiveProgress[obj.id] || 0;
    return currentProgress >= obj.required;
  });
};

/**
 * Complete a quest
 * @param state - Current quest state
 * @param questId - ID of the quest to complete
 * @returns Updated state and rewards
 */
export const completeQuest = (state: QuestsState, questId: string): { state: QuestsState, rewards: QuestRewardsResult | null } => {
  const quest = state.quests[questId];
  const progress = state.questProgress[questId];
  
  if (!canCompleteQuest(quest, progress)) {
    return { state, rewards: null };
  }

  // Create a deep copy to avoid mutating the original state
  const updatedState: QuestsState = {
    ...state,
    quests: {
      ...state.quests,
      [questId]: {
        ...quest,
        status: 'completed'
      }
    },
    activeQuestIds: state.activeQuestIds.filter(id => id !== questId),
    completedQuestIds: [...state.completedQuestIds, questId],
    questProgress: {
      ...state.questProgress,
      [questId]: {
        ...progress,
        completedAt: new Date()
      }
    }
  };

  // Get rewards to return to the caller
  const rewards = getQuestRewards(quest);

  return { state: updatedState, rewards };
};

/**
 * Update quest progress for an objective
 * @param state - Current quest state
 * @param questId - ID of the quest
 * @param objectiveId - ID of the objective
 * @param amount - Amount of progress to add
 * @returns Updated state
 */
export const updateQuestProgress = (
  state: QuestsState,
  questId: string,
  objectiveId: string,
  amount: number = 1
): QuestsState => {
  const quest = state.quests[questId];
  
  if (!quest || quest.status !== 'active') {
    return state;
  }

  const objective = quest.objectives.find(obj => obj.id === objectiveId);
  if (!objective) {
    return state;
  }

  const currentProgress = state.questProgress[questId]?.objectiveProgress?.[objectiveId] || 0;
  const newProgress = Math.min(currentProgress + amount, objective.required);

  // If there's no actual change, return the original state
  if (newProgress === currentProgress) {
    return state;
  }

  // Create a deep copy to avoid mutating the original state
  const updatedState: QuestsState = {
    ...state,
    questProgress: {
      ...state.questProgress,
      [questId]: {
        ...state.questProgress[questId] || { startedAt: new Date(), objectiveProgress: {} },
        objectiveProgress: {
          ...(state.questProgress[questId]?.objectiveProgress || {}),
          [objectiveId]: newProgress
        }
      }
    }
  };

  // Check if objective should be marked as completed
  if (newProgress >= objective.required) {
    updatedState.quests = {
      ...state.quests,
      [questId]: {
        ...quest,
        objectives: quest.objectives.map(obj => 
          obj.id === objectiveId
            ? { ...obj, completed: true }
            : obj
        )
      }
    };
  }

  return updatedState;
};

/**
 * Get rewards from a quest
 * @param quest - The quest to get rewards from
 * @returns Reward data
 */
export const getQuestRewards = (quest: Quest): QuestRewardsResult | null => {
  if (!quest || !quest.rewards) {
    return null;
  }

  return quest.rewards.reduce((acc: QuestRewardsResult, reward) => {
    switch (reward.type) {
      case 'experience':
        acc.experience = (acc.experience || 0) + reward.value;
        break;
      case 'gold':
        acc.gold = (acc.gold || 0) + reward.value;
        break;
      case 'item':
        if (!acc.items) acc.items = [];
        acc.items.push({
          id: reward.value,
          quantity: reward.quantity || 1
        });
        break;
      case 'skill':
        if (!acc.skills) acc.skills = [];
        acc.skills.push({
          id: reward.value,
          points: reward.points || 1
        });
        break;
      default:
        if (!acc.other) acc.other = [];
        acc.other.push(reward);
    }
    return acc;
  }, {});
};

/**
 * Get all quests that can be started based on requirements
 * @param state - Current quest state
 * @param gameState - Current game state
 * @returns Available quests
 */
export const getAvailableQuests = (state: QuestsState, gameState: GameState): Quest[] => {
  const notStartedQuests = Object.values(state.quests)
    .filter(quest => quest.status === 'not_started');

  return notStartedQuests.filter(quest => checkQuestRequirements(quest, gameState));
};

/**
 * Process a game event and update related quest objectives
 * @param state - Current quest state
 * @param event - Event data (type, target, amount, etc.)
 * @returns Updated state
 */
export const processQuestEvent = (state: QuestsState, event: QuestEvent): QuestsState => {
  const updates: QuestUpdate[] = [];
  
  // Only process events for active quests
  state.activeQuestIds.forEach(questId => {
    const quest = state.quests[questId];
    
    if (!quest) return;
    
    quest.objectives.forEach(objective => {
      if (objective.completed) return;
      
      // Check if this event matches the objective
      let matchesObjective = false;
      
      switch (objective.type) {
        case 'kill':
          matchesObjective = 
            event.type === 'enemy_defeated' && 
            event.enemyType === objective.target;
          break;
        case 'collect':
          matchesObjective = 
            event.type === 'item_collected' && 
            event.itemId === objective.target;
          break;
        case 'interact':
          matchesObjective = 
            event.type === 'interaction' && 
            event.targetId === objective.target;
          break;
        case 'visit':
          matchesObjective = 
            event.type === 'location_visited' && 
            event.locationId === objective.target;
          break;
        default:
          // Custom objective types can be handled here
          matchesObjective = false;
      }
      
      if (matchesObjective) {
        updates.push({
          questId,
          objectiveId: objective.id,
          amount: event.amount || 1
        });
      }
    });
  });
  
  // Apply all the updates to get the final state
  return applyQuestUpdates(state, updates);
};

/**
 * Apply multiple progress updates to quests
 * @param state - Current quest state
 * @param updates - Array of update objects
 * @returns Updated state
 */
export const applyQuestUpdates = (state: QuestsState, updates: QuestUpdate[]): QuestsState => {
  let updatedState: QuestsState = { ...state };
  
  updates.forEach(update => {
    updatedState = updateQuestProgress(
      updatedState,
      update.questId,
      update.objectiveId,
      update.amount
    );
  });
  
  return updatedState;
};

/**
 * Check for newly available quests after completing a quest
 * @param state - Current quest state
 * @param gameState - Current game state
 * @returns IDs of newly available quests
 */
export const checkForNewlyAvailableQuests = (state: QuestsState, gameState: GameState): string[] => {
  const availableQuestsBefore = getAvailableQuests({
    ...state,
    completedQuestIds: state.completedQuestIds.slice(0, -1) // Remove the most recently completed quest
  }, gameState);
  
  const availableQuestsAfter = getAvailableQuests(state, gameState);
  
  // Find quests that are in the "after" list but not the "before" list
  const newlyAvailableQuestIds = availableQuestsAfter
    .filter(quest => !availableQuestsBefore.some(q => q.id === quest.id))
    .map(quest => quest.id);
  
  return newlyAvailableQuestIds;
};

/**
 * Helper type for dispatch function
 */
type DispatchFunction = (action: { type: string; payload: any }) => void;

/**
 * Start a quest
 * @param questId - ID of the quest to start
 * @param dispatch - Dispatch function for updating state
 */
export const startQuest = (questId: string, dispatch: DispatchFunction): void => {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return;

  dispatch({
    type: 'UPDATE_QUESTS',
    payload: quest
  });

  // If quest has immediate affinity reward, grant it
  if (quest.rewards?.affinity) {
    dispatch(createAffinityAction.update(
      quest.rewards.affinity.npc,
      quest.rewards.affinity.amount
    ));
  }
};

/**
 * Complete a quest (legacy implementation)
 * @param questId - ID of the quest to complete
 * @param dispatch - Dispatch function for updating state
 */
export const completeQuestLegacy = (questId: string, dispatch: DispatchFunction): void => {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return;

  // Grant quest rewards
  if (quest.rewards) {
    if (quest.rewards.essence) {
      dispatch({
        type: 'GAIN_ESSENCE',
        payload: quest.rewards.essence
      });
    }

    if (quest.rewards.affinity) {
      dispatch(createAffinityAction.update(
        quest.rewards.affinity.npc,
        quest.rewards.affinity.amount
      ));
    }

    if (quest.rewards.skill) {
      dispatch({
        type: 'LEARN_SKILL',
        payload: {
          skillId: quest.rewards.skill
        }
      });
    }
  }

  // Update quest status
  dispatch({
    type: 'UPDATE_QUESTS',
    payload: { ...quest, completed: true }
  });
};
