import { useMemo } from 'react';
import { useGameState, useGameDispatch } from '../../context/gameContext';

const useNPCRelations = (npcId) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  // Add safety check for npcs property
  const npcs = gameState?.npcs || [];

  const npc = useMemo(() => 
    // Use optional chaining to safely handle npcs being undefined
    Array.isArray(npcs) ? npcs.find(n => n && n.id === npcId) : null,
    [npcs, npcId]
  );

  const relationshipLevel = useMemo(() => {
    if (!npc) return null;
    const value = npc.relationship || 0;
    
    if (value >= 80) return { name: 'Devoted', color: '#9C27B0', tier: 5 };
    if (value >= 60) return { name: 'Trusted', color: '#4CAF50', tier: 4 };
    if (value >= 40) return { name: 'Friendly', color: '#2196F3', tier: 3 };
    if (value >= 20) return { name: 'Warm', color: '#8BC34A', tier: 2 };
    // Add default return for values below 20
    return { name: 'Neutral', color: '#9E9E9E', tier: 1 };
  }, [npc]);

  // Update NPC relationship with specified amount
  const updateRelationship = (amount) => {
    if (!npcId) return;
    
    dispatch({
      type: 'UPDATE_NPC_RELATIONSHIP',
      payload: {
        npcId,
        changeAmount: amount
      }
    });
  };

  // Return useful values from the hook
  return {
    npc,
    relationshipLevel,
    updateRelationship
  };
};

export default useNPCRelations;