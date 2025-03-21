/**
 * Utilities for managing NPC relationships in the game.
 * Functions to update relationship values, handle decay, and determine relationship tiers.
 */

interface NPC {
  id: string;
  name: string;
  relationship?: number;
  [key: string]: any;
}

interface GameStateWithNPCs {
  npcs: NPC[];
  notifications: NotificationState;
  settings?: {
    gameplay?: {
      relationshipDecayDisabled?: boolean;
    }
  };
  [key: string]: any;
}

interface NotificationState {
  items?: Array<{
    id: number;
    message: string;
    type: string;
    duration: number;
  }>;
  [key: string]: any;
}

interface UpdateRelationshipPayload {
  npcId: string;
  amount: number;
  notifyPlayer?: boolean;
  source?: string;
}

// Helper to add a notification to state
const addNotification = (
  state: GameStateWithNPCs,
  message: string,
  type: 'success' | 'warning' | 'info' | 'error'
): GameStateWithNPCs => ({
  ...state,
  notifications: {
    ...state.notifications,
    items: [
      ...(state.notifications.items || []),
      {
        id: Date.now(),
        message,
        type,
        duration: 3000
      }
    ]
  }
});

/**
 * Update relationship between player and an NPC
 */
export const updateRelationship = (
  state: GameStateWithNPCs, 
  payload: UpdateRelationshipPayload
): GameStateWithNPCs => {
  const { npcId, amount, notifyPlayer } = payload;
  
  // Update NPC relationship
  const newState = {
    ...state,
    npcs: state.npcs.map(npc => 
      npc.id === npcId
        ? { 
            ...npc,
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
    
    return addNotification(newState, message, amount > 0 ? 'success' : 'warning');
  }
  
  return newState;
};

/**
 * Decay all NPC relationships over time
 */
export const decayRelationships = (
  state: GameStateWithNPCs,
  decayAmount: number = 1
): GameStateWithNPCs => {
  // Skip decay if feature is disabled
  if (state.settings?.gameplay?.relationshipDecayDisabled) {
    return state;
  }
  
  return {
    ...state,
    npcs: state.npcs.map(npc => ({
      ...npc,
      // Only decay positive relationships above neutral (50)
      relationship: npc.relationship && npc.relationship > 50
        ? Math.max(50, npc.relationship - decayAmount)
        : npc.relationship || 0
    }))
  };
};

// Relationship tier thresholds
const RELATIONSHIP_TIERS = [
  { threshold: 90, name: 'BELOVED' },
  { threshold: 75, name: 'TRUSTED' },
  { threshold: 60, name: 'ALLY' },
  { threshold: 50, name: 'FRIEND' },
  { threshold: 40, name: 'ACQUAINTANCE' },
  { threshold: 25, name: 'NEUTRAL' },
  { threshold: 10, name: 'SUSPICIOUS' },
  { threshold: 1, name: 'UNFRIENDLY' }
];

/**
 * Get the current relationship tier with an NPC
 */
export const getRelationshipTier = (
  state: GameStateWithNPCs,
  npcId: string
): string | undefined => {
  const npc = state.npcs.find(n => n.id === npcId);
  if (!npc) return undefined;
  
  const relationship = npc.relationship || 0;
  
  // Find the first tier that matches the relationship value
  const tier = RELATIONSHIP_TIERS.find(tier => relationship >= tier.threshold);
  return tier ? tier.name : 'ENEMY';
};

/**
 * Get relationship color for UI representation
 */
export const getRelationshipColor = (tier: string): string => {
  const colorMap: Record<string, string> = {
    BELOVED: '#9c27b0',    // Purple
    TRUSTED: '#3f51b5',    // Indigo
    ALLY: '#2196f3',       // Blue
    FRIEND: '#4caf50',     // Green
    ACQUAINTANCE: '#8bc34a', // Light Green
    NEUTRAL: '#9e9e9e',    // Gray
    SUSPICIOUS: '#ff9800', // Orange
    UNFRIENDLY: '#ff5722', // Deep Orange
    ENEMY: '#f44336'       // Red
  };
  
  return colorMap[tier] || '#9e9e9e';
};

/**
 * Update relationship with multiple NPCs at once
 */
export const updateGroupRelationship = (
  state: GameStateWithNPCs,
  npcIds: string[],
  amount: number,
  notifyPlayer: boolean = false
): GameStateWithNPCs => {
  // First update all relationships
  let newState = { ...state };
  
  npcIds.forEach(id => {
    newState = updateRelationship(newState, { 
      npcId: id, 
      amount, 
      notifyPlayer: false
    });
  });
  
  // Add a single summary notification if requested
  if (notifyPlayer && npcIds.length > 0) {
    const message = amount > 0
      ? `Your relationship with ${npcIds.length} NPCs has improved (+${amount})`
      : `Your relationship with ${npcIds.length} NPCs has worsened (${amount})`;
    
    return addNotification(newState, message, amount > 0 ? 'success' : 'warning');
  }
  
  return newState;
};
