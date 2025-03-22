import { useEffect } from 'react';
import { ACTION_TYPES } from '../../types/ActionTypes';
import { ExtendedGameState, Quest, QuestObjective } from '../../types/gameLoopStateTypes';
import { GameAction } from '../../GameDispatchContext';

/**
 * Hook for managing quest progress updates
 */
export const useQuestSystem = (
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) => {
  useEffect(() => {
    const questInterval = setInterval(() => {
      // Update time-based quest objectives
      const activeQuests = gameState.activeQuests || [];
      
      if (activeQuests.length > 0) {
        activeQuests.forEach(quest => {
          updateQuestObjectives(quest, dispatch);
        });
      }
    }, 60000); // Update quest timers every minute
    
    return () => clearInterval(questInterval);
  }, [dispatch, gameState.activeQuests]);
};

/**
 * Update time-based objectives for a quest
 */
function updateQuestObjectives(quest: Quest, dispatch: React.Dispatch<GameAction>) {
  if (quest.objectives) {
    // Check for time-based objectives
    const timeObjectives = quest.objectives.filter(obj => 
      obj.type === 'WAIT_TIME' && !obj.completed);
    
    if (timeObjectives.length > 0) {
      timeObjectives.forEach(objective => {
        updateObjectiveProgress(quest.id, objective, dispatch);
      });
    }
  }
}

/**
 * Update progress for a single quest objective
 */
function updateObjectiveProgress(
  questId: string, 
  objective: QuestObjective, 
  dispatch: React.Dispatch<GameAction>
) {
  dispatch({
    type: ACTION_TYPES.UPDATE_QUEST_OBJECTIVE,
    payload: {
      questId,
      objectiveId: objective.id,
      progress: (objective.progress || 0) + 1
    }
  });
}
