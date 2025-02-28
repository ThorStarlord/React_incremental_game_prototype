import { ACTION_TYPES } from '../actions/actionTypes';
import { updateRelationship } from '../utils/relationshipUtils';

export const npcReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_NPC_RELATIONSHIP:
      return updateRelationship(state, action.payload);
      
    case ACTION_TYPES.MEET_NPC:
      const { npcId } = action.payload;
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === npcId
            ? { ...npc, metAt: Date.now() }
            : npc
        )
      };
      
    case ACTION_TYPES.UPDATE_DIALOGUE_STATE:
      const { npcId: dialogueNpcId, dialogueId } = action.payload;
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === dialogueNpcId
            ? { ...npc, dialogueState: dialogueId }
            : npc
        )
      };
      
    case ACTION_TYPES.UPDATE_DIALOGUE_HISTORY:
      const { npcId: historyNpcId, dialogue } = action.payload;
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === historyNpcId
            ? { 
                ...npc, 
                dialogueHistory: [
                  ...(npc.dialogueHistory || []), 
                  { ...dialogue, timestamp: Date.now() }
                ]
              }
            : npc
        )
      };
      
    default:
      return state;
  }
};