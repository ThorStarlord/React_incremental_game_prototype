import { ACTION_TYPES, NPC_ACTIONS } from '../types/ActionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * NPC-related interfaces
 */
interface GameState {
  npcs: NPC[];
  player: {
    inventory: InventoryItem[];
    [key: string]: any;
  };
  essence: {
    amount: number;
    [key: string]: any;
  };
  stats?: {
    favorsCompleted?: number;
    favorsSucesses?: number;
    favorsFailures?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

interface NPC {
  id: string;
  name: string;
  relationship?: number;
  activeFavors?: Favor[];
  favorHistory?: CompletedFavor[];
  [key: string]: any;
}

interface Favor {
  id: string;
  name: string;
  description?: string;
  difficulty?: number;
  rewards?: FavorReward;
  [key: string]: any;
}

interface CompletedFavor extends Favor {
  completed: number;
  success: boolean;
  relationshipChange: number;
}

interface FavorReward {
  essence?: number;
  items?: RewardItem[];
  [key: string]: any;
}

interface RewardItem {
  id: string;
  name?: string;
  quantity?: number;
  [key: string]: any;
}

interface InventoryItem {
  id: string;
  name?: string;
  quantity: number;
  acquired?: {
    timestamp: number;
    source: string;
  };
  [key: string]: any;
}

/**
 * NPC Reducer - Manages NPCs, relationship values, and favor systems
 */
export const npcReducer = (state: GameState, action: { type: string, payload: any }): GameState => {
  switch (action.type) {
    case NPC_ACTIONS.UPDATE_NPC_RELATIONSHIP: {
      const { npcId, changeAmount, reason } = action.payload;
      
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === npcId
            ? { 
                ...npc, 
                relationship: Math.min(100, Math.max(-100, (npc.relationship || 0) + changeAmount))
              }
            : npc
        )
      };
    }
    
    case NPC_ACTIONS.COMPLETE_NPC_FAVOR: {
      const { npcId, favorId, success = true } = action.payload;
      
      // Find NPC and active favor
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;
      
      const favor = npc.activeFavors?.find(f => f.id === favorId);
      if (!favor) return state;
      
      // Calculate relationship change based on success and difficulty
      const difficulty = favor.difficulty || 1;
      const relationshipChange = success 
        ? Math.ceil(5 * difficulty)
        : Math.floor(-3 * difficulty);
      
      // Update NPC state
      let updatedState = {
        ...state,
        npcs: state.npcs.map(n => 
          n.id === npcId
            ? { 
                ...n, 
                relationship: Math.min(100, Math.max(-100, (n.relationship || 0) + relationshipChange)),
                activeFavors: n.activeFavors?.filter(f => f.id !== favorId) || [],
                favorHistory: [
                  ...(n.favorHistory || []),
                  { 
                    ...favor,
                    completed: Date.now(),
                    success,
                    relationshipChange
                  }
                ]
              }
            : n
        ),
        stats: {
          ...state.stats,
          favorsCompleted: (state.stats?.favorsCompleted || 0) + 1,
          favorsSucesses: (state.stats?.favorsSucesses || 0) + (success ? 1 : 0),
          favorsFailures: (state.stats?.favorsFailures || 0) + (success ? 0 : 1)
        }
      };
      
      // Apply rewards if successful
      if (success && favor.rewards) {
        // Handle essence reward
        if (favor.rewards.essence) {
          updatedState = {
            ...updatedState,
            essence: {
              ...updatedState.essence,
              amount: updatedState.essence.amount + favor.rewards.essence
            }
          };
        }
        
        // Handle item rewards
        if (favor.rewards.items && favor.rewards.items.length > 0) {
          // Add each reward item to inventory
          const updatedInventory = [...updatedState.player.inventory];
          
          favor.rewards.items.forEach(item => {
            const existingItemIndex = updatedInventory.findIndex(i => i.id === item.id);
            const quantity = item.quantity || 1;
            
            if (existingItemIndex !== -1) {
              // Update existing item quantity
              updatedInventory[existingItemIndex] = {
                ...updatedInventory[existingItemIndex],
                quantity: updatedInventory[existingItemIndex].quantity + quantity
              };
            } else {
              // Add new item to inventory
              updatedInventory.push({
                id: item.id,
                name: item.name,
                quantity,
                acquired: {
                  timestamp: Date.now(),
                  source: `favor_${favorId}`
                }
              });
            }
          });
          
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              inventory: updatedInventory
            }
          };
        }
      }
      
      // Create a notification message
      const message = success
        ? `Successfully completed ${favor.name} for ${npc.name}! Relationship ${relationshipChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(relationshipChange)}.`
        : `Failed to complete ${favor.name} for ${npc.name}. Relationship decreased by ${Math.abs(relationshipChange)}.`;
      
      return addNotification(updatedState, {
        message,
        type: success ? "success" : "warning",
        duration: 4000
      });
    }
    
    case NPC_ACTIONS.ADD_NPC_FAVOR: {
      const { npcId, favor } = action.payload;
      
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;
      
      return {
        ...state,
        npcs: state.npcs.map(n => 
          n.id === npcId
            ? { 
                ...n, 
                activeFavors: [...(n.activeFavors || []), favor]
              }
            : n
        )
      };
    }
    
    case NPC_ACTIONS.DECLINE_NPC_FAVOR: {
      const { npcId, favorId } = action.payload;
      
      // Find NPC
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;
      
      // Small relationship penalty for declining
      const relationshipChange = -1;
      
      return {
        ...state,
        npcs: state.npcs.map(n => 
          n.id === npcId
            ? { 
                ...n,
                relationship: Math.max(-100, (n.relationship || 0) + relationshipChange),
                activeFavors: n.activeFavors?.filter(f => f.id !== favorId) || []
              }
            : n
        )
      };
    }
    
    // Additional NPC-related actions would be handled here
    
    default:
      return state;
  }
};
