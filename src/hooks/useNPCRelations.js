import { useContext, useMemo } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';

const useNPCRelations = (npcId) => {
  const { npcs } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  const npc = useMemo(() => 
    npcs.find(n => n.id === npcId),
    [npcs, npcId]
  );

  const relationshipLevel = useMemo(() => {
    if (!npc) return null;
    const value = npc.relationship || 0;
    
    if (value >= 80) return { name: 'Devoted', color: '#9C27B0', tier: 5 };
    if (value >= 60) return { name: 'Trusted', color: '#4CAF50', tier: 4 };
    if (value >= 40) return { name: 'Friendly', color: '#2196F3', tier: 3 };
    if (value >= 20) return { name: 'Warm', color: '#8BC34A', tier: 2 };
    if (value >= 0) return { name: 'Neutral', color: '#9E9E9E', tier: 1 };
    if (value >= -20) return { name: 'Cold', color: '#FF9800', tier: 0 };
    if (value >= -40) return { name: 'Unfriendly', color: '#F44336', tier: -1 };
    if (value >= -60) return { name: 'Hostile', color: '#D32F2F', tier: -2 };
    return { name: 'Nemesis', color: '#B71C1C', tier: -3 };
  }, [npc]);

  const updateRelationship = (change) => {
    if (!npc) return;
    
    dispatch({
      type: 'UPDATE_NPC_RELATIONSHIP',
      payload: {
        npcId,
        changeAmount: change
      }
    });
  };

  const updateDialogueState = (changes) => {
    if (!npc) return;

    dispatch({
      type: 'UPDATE_DIALOGUE_STATE',
      payload: {
        npcId,
        dialogueState: changes
      }
    });
  };

  const checkRelationshipRequirement = (required) => {
    if (!npc) return false;
    return (npc.relationship || 0) >= required;
  };

  return {
    npc,
    relationshipLevel,
    updateRelationship,
    updateDialogueState,
    checkRelationshipRequirement,
    currentRelationship: npc?.relationship || 0,
    dialogueState: npc?.dialogueState || {}
  };
};

export default useNPCRelations;