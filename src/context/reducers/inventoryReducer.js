import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

export const inventoryReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_ITEM: {
      const { itemId, quantity = 1 } = action.payload;
      const existingItemIndex = state.player.inventory.findIndex(item => item.id === itemId);
      
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        return {
          ...state,
          player: {
            ...state.player,
            inventory: state.player.inventory.map((item, index) => 
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }
        };
      } else {
        // Add new item
        const itemData = state.items.find(item => item.id === itemId);
        if (!itemData) return state;
        
        return {
          ...state,
          player: {
            ...state.player,
            inventory: [
              ...state.player.inventory,
              {
                id: itemId,
                quantity,
                name: itemData.name,
                type: itemData.type
              }
            ]
          }
        };
      }
    }
    
    case ACTION_TYPES.REMOVE_ITEM: {
      const { itemId, quantity = 1 } = action.payload;
      const existingItem = state.player.inventory.find(item => item.id === itemId);
      
      if (!existingItem) return state;
      
      if (existingItem.quantity <= quantity) {
        // Remove item completely
        return {
          ...state,
          player: {
            ...state.player,
            inventory: state.player.inventory.filter(item => item.id !== itemId)
          }
        };
      } else {
        // Reduce quantity
        return {
          ...state,
          player: {
            ...state.player,
            inventory: state.player.inventory.map(item => 
              item.id === itemId
                ? { ...item, quantity: item.quantity - quantity }
                : item
            )
          }
        };
      }
    }
    
    case ACTION_TYPES.USE_ITEM: {
      const { itemId } = action.payload;
      
      // Find item in inventory
      const existingItemIndex = state.player.inventory.findIndex(item => item.id === itemId);
      
      if (existingItemIndex === -1) {
        return addNotification(state, {
          message: "You don't have this item.",
          type: "error"
        });
      }
      
      // Apply item effects (this would be expanded based on item type)
      const items = state.gameData?.items || {};
      const itemData = items[itemId];
      
      if (!itemData) {
        return addNotification(state, {
          message: "Unknown item type.",
          type: "error"
        });
      }
      
      let newState = state;
      
      // Handle different item types
      if (itemData.type === 'consumable') {
        if (itemData.effects.health) {
          newState = {
            ...newState,
            player: {
              ...newState.player,
              health: Math.min(
                newState.player.health + itemData.effects.health,
                newState.player.maxHealth
              )
            }
          };
        }
        
        // More effect types can be added here
      }
      
      // Remove one of the item
      newState = {
        ...newState,
        player: {
          ...newState.player,
          inventory: newState.player.inventory.map((item, idx) => 
            idx === existingItemIndex 
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ).filter(item => item.quantity > 0)
        }
      };
      
      return addNotification(newState, {
        message: `Used ${itemData.name}.`,
        type: "info"
      });
    }
    
    default:
      return state;
  }
};