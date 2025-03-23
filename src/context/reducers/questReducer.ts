import { ACTION_TYPES, QUEST_ACTIONS } from '../types/ActionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Quest system reducer - Manages quest state and progression
 */

interface GameState {
  player: {
    activeQuests: Quest[];
    completedQuests?: string[];
    acquiredTraits?: string[];
    questStats?: Record<string, any>;
    experience?: number; // Add experience property to fix type error
    gold?: number; // Add gold property to fix type error
    level?: number; // Add level for requirement checks
    [key: string]: any;
  };
  npcs?: Array<{
    id: string;
    name: string;
    relationship?: number;
    [key: string]: any;
  }>;
  gameData?: {
    quests?: Record<string, QuestData>;
  };
  [key: string]: any;
}

interface Quest {
  id: string;
  status: 'active' | 'completed' | 'failed';
  progress?: number;
  startedAt?: number;
  objectives?: Record<string, number>;
  npcId?: string;
  [key: string]: any;
}

interface QuestData {
  id: string;
  name: string;
  description: string;
  objectives?: Array<{
    id: string;
    description: string;
    target: number;
  }>;
  requirements?: {
    level?: number;
    quests?: string[];
    [key: string]: any;
  };
  reward?: {
    experience?: number;
    gold?: number;
    items?: Array<{ id: string; quantity: number }>;
    reputation?: Record<string, number>;
    relationship?: number;
    trait?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const questReducer = (state: GameState, action: { type: string; payload: any }): GameState => {
  switch (action.type) {
    case QUEST_ACTIONS.START_QUEST: {
      const { questId, npcId } = action.payload;
      
      // Check if quest already active
      if (state.player.activeQuests.some(q => q.id === questId)) {
        return addNotification(state, {
          message: "This quest is already active.",
          type: "info"
        });
      }
      
      // Get quest data
      const questData = state.gameData?.quests?.[questId];
      if (!questData) {
        return addNotification(state, {
          message: "Invalid quest data.",
          type: "error"
        });
      }
      
      // Check requirements
      if (questData.requirements) {
        // Fix the undefined level check by providing a default value
        const playerLevel = state.player.level || 0;
        if (questData.requirements.level && playerLevel < questData.requirements.level) {
          return addNotification(state, {
            message: `You need to be level ${questData.requirements.level} to start this quest.`,
            type: "warning"
          });
        }
        
        if (questData.requirements.quests) {
          const missingQuests = questData.requirements.quests.filter(
            id => !state.player.completedQuests?.includes(id)
          );
          
          if (missingQuests.length > 0) {
            return addNotification(state, {
              message: "You haven't completed the prerequisite quests.",
              type: "warning"
            });
          }
        }
      }
      
      // Create new active quest
      const newQuest = {
        id: questId,
        status: 'active',
        progress: 0,
        startedAt: Date.now(),
        objectives: {},
        npcId
      } as Quest;
      
      // Initialize objectives if they exist
      if (questData.objectives) {
        questData.objectives.forEach(obj => {
          newQuest.objectives![obj.id] = 0;
        });
      }
      
      return addNotification({
        ...state,
        player: {
          ...state.player,
          activeQuests: [...state.player.activeQuests, newQuest]
        }
      }, {
        message: `Started new quest: ${questData.name}`,
        type: "success"
      });
    }
    
    case QUEST_ACTIONS.COMPLETE_QUEST: {
      const { questId } = action.payload;
      
      // Find active quest
      const activeQuestIndex = state.player.activeQuests.findIndex(q => q.id === questId);
      if (activeQuestIndex === -1) {
        return addNotification(state, {
          message: "This quest is not active.",
          type: "error"
        });
      }
      
      const activeQuest = state.player.activeQuests[activeQuestIndex];
      
      // Get quest data
      const questData = state.gameData?.quests?.[questId];
      if (!questData) {
        return addNotification(state, {
          message: "Invalid quest data.",
          type: "error"
        });
      }
      
      // Process rewards
      let newState = {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.filter((_, idx) => idx !== activeQuestIndex),
          completedQuests: [...(state.player.completedQuests || []), questId],
          questStats: {
            ...(state.player.questStats || {}),
            completed: (state.player.questStats?.completed || 0) + 1
          }
        }
      };
      
      // Process gold reward
      if (questData.reward?.gold) {
        newState.player = {
          ...newState.player,
          gold: (newState.player.gold || 0) + questData.reward.gold
        };
      }
      
      // Process relationship reward
      if (questData.reward?.relationship && activeQuest.npcId && newState.npcs) {
        newState = {
          ...newState,
          npcs: newState.npcs.map(n => 
            n.id === activeQuest.npcId
              ? { 
                  ...n, 
                  relationship: Math.min(100, (n.relationship || 0) + questData.reward!.relationship!)
                }
              : n
          )
        };
      }
      
      // Add trait reward if present
      if (questData.reward?.trait && !newState.player.acquiredTraits?.includes(questData.reward.trait)) {
        newState = {
          ...newState,
          player: {
            ...newState.player,
            acquiredTraits: [
              ...(newState.player.acquiredTraits || []),
              questData.reward.trait
            ]
          }
        };
      }
      
      return addNotification(newState, {
        message: `Completed quest: ${questData.name}`,
        type: "success",
        duration: 5000
      });
    }
    
    case QUEST_ACTIONS.ABANDON_QUEST: {
      const { questId } = action.payload;
      
      return {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.filter(q => q.id !== questId),
          questStats: {
            ...(state.player.questStats || {}),
            abandoned: (state.player.questStats?.abandoned || 0) + 1
          }
        }
      };
    }
    
    case QUEST_ACTIONS.UPDATE_QUEST_PROGRESS: {
      const { questId, progress } = action.payload;
      
      const questIndex = state.player.activeQuests.findIndex(q => q.id === questId);
      if (questIndex === -1) return state;
      
      return {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.map((quest, idx) =>
            idx === questIndex 
              ? { ...quest, progress: Math.min(100, Math.max(0, progress)) }
              : quest
          )
        }
      };
    }
    
    case QUEST_ACTIONS.UPDATE_QUEST_OBJECTIVE: {
      const { questId, objectiveId, value, completed } = action.payload;
      
      const questIndex = state.player.activeQuests.findIndex(q => q.id === questId);
      if (questIndex === -1) return state;
      
      const quest = state.player.activeQuests[questIndex];
      const updatedObjectives = { ...quest.objectives, [objectiveId]: value };
      
      return {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.map((q, idx) =>
            idx === questIndex 
              ? { ...q, objectives: updatedObjectives }
              : q
          )
        }
      };
    }
    
    default:
      return state;
  }
};
