import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

export const questReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.START_QUEST: {
      const { questId, npcId } = action.payload;
      
      // Find the quest in the NPC's quests
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;
      
      const quest = npc.quests?.find(q => q.id === questId);
      if (!quest) return state;
      
      // Check if already active
      if (state.player.activeQuests?.some(q => q.id === questId)) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          activeQuests: [
            ...(state.player.activeQuests || []),
            {
              id: questId,
              npcId,
              title: quest.title,
              started: Date.now(),
              objectives: quest.objectives.map(obj => ({
                ...obj,
                progress: 0
              }))
            }
          ]
        }
      };
    }
    
    case ACTION_TYPES.UPDATE_QUEST_PROGRESS: {
      const { questId, objectiveIndex, progress } = action.payload;
      
      return {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.map(quest => 
            quest.id === questId
              ? {
                  ...quest,
                  objectives: quest.objectives.map((obj, i) => 
                    i === objectiveIndex
                      ? { ...obj, progress: Math.min(obj.progress + progress, obj.count) }
                      : obj
                  )
                }
              : quest
          )
        }
      };
    }
    
    case ACTION_TYPES.COMPLETE_QUEST: {
      const { questId } = action.payload;
      
      // Get the quest to apply rewards
      const activeQuest = state.player.activeQuests?.find(q => q.id === questId);
      if (!activeQuest) return state;
      
      // Find original quest in NPC data
      const npc = state.npcs.find(n => n.id === activeQuest.npcId);
      const questData = npc?.quests?.find(q => q.id === questId);
      
      if (!questData) return state;
      
      // Apply rewards
      let newState = {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.filter(q => q.id !== questId),
          completedQuests: [
            ...(state.player.completedQuests || []),
            {
              ...activeQuest,
              completed: Date.now()
            }
          ]
        }
      };
      
      // Add essence reward if present
      if (questData.reward.essence) {
        newState = {
          ...newState,
          essence: newState.essence + questData.reward.essence
        };
      }
      
      // Add relationship reward if present
      if (questData.reward.relationship) {
        newState = {
          ...newState,
          npcs: newState.npcs.map(n => 
            n.id === activeQuest.npcId
              ? { 
                  ...n, 
                  relationship: Math.min(100, (n.relationship || 0) + questData.reward.relationship)
                }
              : n
          )
        };
      }
      
      // Add trait reward if present
      if (questData.reward.trait && !newState.player.acquiredTraits.includes(questData.reward.trait)) {
        newState = {
          ...newState,
          player: {
            ...newState.player,
            acquiredTraits: [
              ...newState.player.acquiredTraits,
              questData.reward.trait
            ]
          }
        };
      }
      
      return newState;
    }
    
    case ACTION_TYPES.ABANDON_QUEST: {
      const { questId } = action.payload;
      
      return {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.filter(q => q.id !== questId)
        }
      };
    }
    
    default:
      return state;
  }
};