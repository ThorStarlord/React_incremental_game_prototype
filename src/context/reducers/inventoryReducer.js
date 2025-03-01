import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Inventory Reducer
 * 
 * Purpose: Manages the player's inventory of items and equipment
 * - Handles adding items to inventory with quantity tracking
 * - Handles removing items from inventory
 * - Processes item usage effects
 * - Enforces inventory constraints and item interactions
 * 
 * The inventory system is central to resource management, 
 * character progression, and gameplay mechanics.
 * 
 * Actions:
 * - ADD_ITEM: Adds an item to inventory or increments quantity
 * - REMOVE_ITEM: Removes specified quantity of an item
 * - USE_ITEM: Applies item effects and removes from inventory
 * - SORT_INVENTORY: Reorganizes inventory based on criteria
 * - EXAMINE_ITEM: Marks an item as examined/identified
 */
export const inventoryReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_ITEM: {
      const { itemId, quantity = 1 } = action.payload;
      const existingItemIndex = state.player.inventory.findIndex(item => item.id === itemId);
      
      // Get item data from game database
      const itemData = state.items.find(item => item.id === itemId) || 
                       state.gameData?.items?.[itemId];
      
      if (!itemData) {
        return addNotification(state, {
          message: "Invalid item data. Cannot add to inventory.",
          type: "error"
        });
      }
      
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
        const newItem = {
          id: itemId,
          quantity,
          name: itemData.name,
          type: itemData.type,
          // Track acquisition time and source (if provided)
          acquired: {
            timestamp: Date.now(),
            source: action.payload.source || 'unknown'
          }
        };
        
        return {
          ...state,
          player: {
            ...state.player,
            inventory: [...state.player.inventory, newItem]
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
        
        if (itemData.effects.energy) {
          newState = {
            ...newState,
            player: {
              ...newState.player,
              energy: Math.min(
                newState.player.energy + itemData.effects.energy,
                newState.player.maxEnergy
              )
            }
          };
        }
        
        if (itemData.effects.experience) {
          newState = {
            ...newState,
            player: {
              ...newState.player,
              experience: newState.player.experience + itemData.effects.experience
            }
          };
        }
        
        // Track item usage for achievements/quests
        newState = {
          ...newState,
          stats: {
            ...newState.stats,
            itemsUsed: {
              ...(newState.stats?.itemsUsed || {}),
              [itemId]: (newState.stats?.itemsUsed?.[itemId] || 0) + 1
            }
          }
        };
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
    
    case ACTION_TYPES.SORT_INVENTORY: {
      const { sortBy = 'name' } = action.payload;
      
      const sortedInventory = [...state.player.inventory].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'type':
            return a.type.localeCompare(b.type);
          case 'quantity':
            return b.quantity - a.quantity;
          case 'recent':
            return (b.acquired?.timestamp || 0) - (a.acquired?.timestamp || 0);
          default:
            return 0;
        }
      });
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: sortedInventory
        }
      };
    }
    
    case ACTION_TYPES.EXAMINE_ITEM: {
      const { itemId } = action.payload;
      const itemIndex = state.player.inventory.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) return state;
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory.map((item, idx) => 
            idx === itemIndex
              ? { ...item, examined: true }
              : item
          )
        }
      };
    }
    
    default:
      return state;
  }
};