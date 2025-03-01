import { ACTION_TYPES } from '../actions/actionTypes';
import { updateRelationship } from '../utils/relationshipUtils';
import { addNotification } from '../utils/notificationUtils';

/**
 * NPC Reducer
 * 
 * Purpose: Manages all aspects of Non-Player Characters in the game
 * - Tracks NPC relationships and interactions with the player
 * - Manages dialogue state and history for conversations
 * - Controls NPC schedules, locations, and behaviors
 * - Handles gift giving and favor systems
 * - Tracks NPC moods and special states
 * 
 * NPCs are a critical component of the game world, providing quests,
 * story progression, trading opportunities, and social interactions.
 * 
 * Actions:
 * - UPDATE_NPC_RELATIONSHIP: Changes relationship value with an NPC
 * - MEET_NPC: Records the first meeting with an NPC
 * - UPDATE_DIALOGUE_STATE: Changes the active dialogue branch
 * - UPDATE_DIALOGUE_HISTORY: Records conversation history
 * - GIVE_GIFT: Handles presenting gifts to NPCs
 * - UPDATE_NPC_LOCATION: Changes an NPC's position in the world
 * - SET_NPC_MOOD: Updates an NPC's emotional state
 * - COMPLETE_NPC_FAVOR: Resolves a favor requested by an NPC
 */
export const npcReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_NPC_RELATIONSHIP:
      return updateRelationship(state, action.payload);
      
    case ACTION_TYPES.MEET_NPC: {
      const { npcId } = action.payload;
      const npc = state.npcs.find(n => n.id === npcId);
      
      if (!npc) return state;
      
      // If this is a first meeting, add notification
      if (!npc.metAt) {
        return addNotification({
          ...state,
          npcs: state.npcs.map(npc => 
            npc.id === npcId
              ? { 
                  ...npc, 
                  metAt: Date.now(),
                  relationship: npc.relationship || 0, // Ensure relationship exists
                  // Initialize NPC stats on first meeting
                  conversationCount: 0,
                  giftHistory: [],
                  favorHistory: []
                }
              : npc
          )
        }, {
          message: `You've met ${npc.name} for the first time.`,
          type: "discovery"
        });
      }
      
      // Update meeting counter for already met NPCs
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === npcId
            ? { 
                ...npc, 
                encounterCount: (npc.encounterCount || 0) + 1,
                lastEncounter: Date.now()
              }
            : npc
        )
      };
    }
      
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
    
    case ACTION_TYPES.GIVE_GIFT: {
      const { npcId, itemId } = action.payload;
      
      // Get NPC and gift preferences
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;
      
      // Get the item data
      const item = state.items.find(i => i.id === itemId) || 
                   state.gameData?.items?.[itemId];
      if (!item) return state;
      
      // Calculate relationship change based on NPC preferences
      let relationshipChange = 1; // Default modest increase
      let responseType = "neutral";
      
      if (npc.preferences) {
        if (npc.preferences.lovedGifts?.includes(itemId)) {
          relationshipChange = 8;
          responseType = "loved";
        } else if (npc.preferences.likedGifts?.includes(itemId)) {
          relationshipChange = 4;
          responseType = "liked";
        } else if (npc.preferences.dislikedGifts?.includes(itemId)) {
          relationshipChange = -2;
          responseType = "disliked";
        } else if (npc.preferences.hatedGifts?.includes(itemId)) {
          relationshipChange = -4;
          responseType = "hated";
        }
      }
      
      // Check if gift was already given today
      const today = state.gameTime ? 
        `${state.gameTime.day}-${state.gameTime.season || ''}` : 
        new Date().toDateString();
      
      const giftedToday = npc.giftHistory && npc.giftHistory.some(
        g => g.day === today
      );
      
      // Reduce relationship change if already gifted today
      if (giftedToday) {
        relationshipChange = Math.floor(relationshipChange / 2);
      }
      
      // Update NPC state
      const updatedState = {
        ...state,
        npcs: state.npcs.map(n => 
          n.id === npcId
            ? { 
                ...n, 
                relationship: Math.min(100, Math.max(-100, (n.relationship || 0) + relationshipChange)),
                giftHistory: [
                  ...(n.giftHistory || []),
                  { 
                    itemId, 
                    itemName: item.name,
                    day: today, 
                    timestamp: Date.now(),
                    relationshipChange
                  }
                ]
              }
            : n
        )
      };
      
      // Remove the gifted item from inventory
      const updatedStateWithItemRemoved = {
        ...updatedState,
        player: {
          ...updatedState.player,
          inventory: updatedState.player.inventory.map(i => 
            i.id === itemId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ).filter(i => i.quantity > 0)
        }
      };
      
      // Generate appropriate response message
      let message = "";
      switch (responseType) {
        case "loved":
          message = `${npc.name} absolutely loves this gift!`;
          break;
        case "liked":
          message = `${npc.name} likes this gift.`;
          break;
        case "disliked":
          message = `${npc.name} doesn't really like this gift...`;
          break;
        case "hated":
          message = `${npc.name} hates this gift.`;
          break;
        default:
          message = `${npc.name} accepts your gift.`;
      }
      
      return addNotification(updatedStateWithItemRemoved, {
        message,
        type: responseType === "loved" || responseType === "liked" ? "success" : 
              responseType === "disliked" || responseType === "hated" ? "warning" : "info"
      });
    }
    
    case ACTION_TYPES.UPDATE_NPC_LOCATION: {
      const { npcId, locationId, position } = action.payload;
      
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === npcId
            ? { 
                ...npc, 
                currentLocation: locationId,
                position: position || npc.position,
                locationHistory: [
                  ...(npc.locationHistory || []),
                  {
                    from: npc.currentLocation,
                    to: locationId,
                    timestamp: Date.now(),
                    gamePeriod: state.gameTime?.period,
                    gameDay: state.gameTime?.day
                  }
                ].slice(-10) // Keep only recent history
              }
            : npc
        )
      };
    }
    
    case ACTION_TYPES.SET_NPC_MOOD: {
      const { npcId, mood, reason } = action.payload;
      
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === npcId
            ? { 
                ...npc, 
                mood,
                moodReason: reason,
                moodSince: Date.now(),
                previousMood: npc.mood
              }
            : npc
        )
      };
    }
    
    case ACTION_TYPES.COMPLETE_NPC_FAVOR: {
      const { npcId, favorId, success } = action.payload;
      
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;
      
      const favor = npc.activeFavors?.find(f => f.id === favorId);
      if (!favor) return state;
      
      // Calculate relationship impact
      const relationshipChange = success ? 
        (favor.rewards?.relationship || 3) : 
        (favor.penalties?.relationship || -1);
      
      // Update NPC state
      const updatedState = {
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
        )
      };
      
      // Apply rewards if successful
      if (success && favor.rewards) {
        // Handle essence reward
        if (favor.rewards.essence) {
          updatedState.essence = {
            ...updatedState.essence,
            amount: updatedState.essence.amount + favor.rewards.essence
          };
        }
        
        // Handle item rewards
        if (favor.rewards.items && favor.rewards.items.length > 0) {
          // Add each reward item to inventory
          favor.rewards.items.forEach(item => {
            const existingItemIndex = updatedState.player.inventory.findIndex(i => i.id === item.id);
            
            if (existingItemIndex !== -1) {
              // Update existing item quantity
              updatedState.player.inventory[existingItemIndex].quantity += item.quantity || 1;
            } else {
              // Add new item to inventory
              updatedState.player.inventory.push({
                id: item.id,
                quantity: item.quantity || 1,
                acquired: {
                  timestamp: Date.now(),
                  source: `favor_${favorId}`
                }
              });
            }
          });
        }
      }
      
      return addNotification(updatedState, {
        message: success ? 
          `You completed the favor for ${npc.name}!` : 
          `You failed the favor for ${npc.name}.`,
        type: success ? "success" : "warning"
      });
    }
    
    case ACTION_TYPES.REQUEST_NPC_FAVOR: {
      const { npcId, favorType } = action.payload;
      
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;
      
      // Check if NPC relationship is high enough
      const relationshipThreshold = {
        'basic': 10,
        'standard': 30,
        'important': 50,
        'critical': 75
      };
      
      if ((npc.relationship || 0) < relationshipThreshold[favorType || 'basic']) {
        return addNotification(state, {
          message: `${npc.name} doesn't know you well enough to grant this favor.`,
          type: "warning"
        });
      }
      
      // Generate a new favor (this would be more complex in a real game)
      const newFavor = {
        id: `favor_${npc.id}_${Date.now()}`,
        type: favorType || 'basic',
        description: `Help ${npc.name} with a ${favorType || 'basic'} favor.`,
        requested: Date.now(),
        deadline: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        rewards: {
          essence: favorType === 'basic' ? 10 : 
                  favorType === 'standard' ? 25 :
                  favorType === 'important' ? 50 :
                  favorType === 'critical' ? 100 : 5,
          relationship: favorType === 'basic' ? 2 : 
                       favorType === 'standard' ? 4 :
                       favorType === 'important' ? 6 :
                       favorType === 'critical' ? 10 : 1
        }
      };
      
      return addNotification({
        ...state,
        npcs: state.npcs.map(n => 
          n.id === npcId
            ? { 
                ...n, 
                activeFavors: [
                  ...(n.activeFavors || []),
                  newFavor
                ]
              }
            : n
        )
      }, {
        message: `${npc.name} has requested your help with a favor.`,
        type: "quest"
      });
    }
    
    case ACTION_TYPES.UPDATE_NPC_SCHEDULE: {
      const { npcId, schedule } = action.payload;
      
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === npcId
            ? { ...npc, schedule }
            : npc
        )
      };
    }
    
    default:
      return state;
  }
};