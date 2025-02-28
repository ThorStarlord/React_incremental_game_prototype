export const updateRelationship = (state, payload) => {
  const { npcId, amount, notifyPlayer } = payload;
  
  // Update NPC relationship
  const newState = {
    ...state,
    npcs: state.npcs.map(npc => 
      npc.id === npcId
        ? { 
            ...npc,
            // Ensure relationship stays within 0-100 bounds
            relationship: Math.min(100, Math.max(0, (npc.relationship || 0) + amount))
          }
        : npc
    )
  };
  
  // Add notification if requested
  if (notifyPlayer) {
    const npc = newState.npcs.find(n => n.id === npcId);
    const message = amount > 0
      ? `Your relationship with ${npc?.name || npcId} has improved (+${amount})`
      : `Your relationship with ${npc?.name || npcId} has worsened (${amount})`;
      
    return {
      ...newState,
      notifications: [
        ...(newState.notifications || []),
        {
          id: Date.now(),
          message,
          type: amount > 0 ? 'success' : 'warning',
          duration: 3000
        }
      ]
    };
  }
  
  return newState;
};

// Add other relationship-related utility functions