import { ACTION_TYPES } from '../actions/actionTypes';
import { GameState, InventoryItem } from './types';
import { withNotification, updateInventoryQuantity } from './utils';

// Helper functions
const findItem = (inventory: InventoryItem[], itemId: string): number => 
  inventory.findIndex(item => item.id === itemId);

const getItemData = (state: GameState, itemId: string): any => 
  state.items?.find((item: any) => item.id === itemId) || 
  state.gameData?.items?.[itemId];

/**
 * Inventory Reducer - Manages player's inventory of items and equipment
 */
export const inventoryReducer = (
  state: GameState, 
  action: { type: string; payload: any }
): GameState => {
  switch (action.type) {
    case ACTION_TYPES.ADD_ITEM: {
      const { itemId, quantity = 1, source } = action.payload;
      const existingItemIndex = findItem(state.player.inventory, itemId);
      const itemData = getItemData(state, itemId);
      
      if (!itemData) {
        return withNotification(state, "Invalid item data. Cannot add to inventory.", "error");
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: existingItemIndex !== -1 
            ? updateInventoryQuantity(state.player.inventory, existingItemIndex, quantity)
            : [...state.player.inventory, {
                id: itemId,
                quantity,
                name: itemData.name,
                type: itemData.type,
                acquired: {
                  timestamp: Date.now(),
                  source: source || 'unknown'
                }
              }]
        }
      };
    }
    
    case ACTION_TYPES.REMOVE_ITEM: {
      const { itemId, quantity = 1 } = action.payload;
      const existingItemIndex = findItem(state.player.inventory, itemId);
      
      if (existingItemIndex === -1) return state;
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: updateInventoryQuantity(state.player.inventory, existingItemIndex, -quantity)
        }
      };
    }
    
    case ACTION_TYPES.USE_ITEM: {
      const { itemId } = action.payload;
      const existingItemIndex = findItem(state.player.inventory, itemId);
      
      if (existingItemIndex === -1) {
        return withNotification(state, "You don't have this item.", "error");
      }
      
      const itemData = getItemData(state, itemId);
      if (!itemData) {
        return withNotification(state, "Unknown item type.", "error");
      }
      
      // Apply item effects based on type
      let updatedState = state;
      
      if (itemData.type === 'consumable' && itemData.effects) {
        const { effects } = itemData;
        
        // Update health/energy/experience if applicable
        if (effects.health || effects.energy || effects.experience) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              health: effects.health ? 
                Math.min(updatedState.player.health + effects.health, updatedState.player.maxHealth) :
                updatedState.player.health,
              energy: effects.energy ?
                Math.min(updatedState.player.energy + effects.energy, updatedState.player.maxEnergy) :
                updatedState.player.energy,
              experience: effects.experience ? 
                updatedState.player.experience + effects.experience :
                updatedState.player.experience
            }
          };
        }
        
        // Track item usage for stats
        updatedState = {
          ...updatedState,
          stats: {
            ...updatedState.stats,
            itemsUsed: {
              ...(updatedState.stats?.itemsUsed || {}),
              [itemId]: (updatedState.stats?.itemsUsed?.[itemId] || 0) + 1
            }
          }
        };
      }
      
      // Remove one of the used item
      updatedState = {
        ...updatedState,
        player: {
          ...updatedState.player,
          inventory: updateInventoryQuantity(updatedState.player.inventory, existingItemIndex, -1)
        }
      };
      
      return withNotification(updatedState, `Used ${itemData.name}.`, "info");
    }
    
    case ACTION_TYPES.SORT_INVENTORY: {
      const { sortBy = 'name' } = action.payload;
      
      const sortFunctions = {
        name: (a: InventoryItem, b: InventoryItem) => a.name.localeCompare(b.name),
        type: (a: InventoryItem, b: InventoryItem) => a.type.localeCompare(b.type),
        quantity: (a: InventoryItem, b: InventoryItem) => b.quantity - a.quantity,
        recent: (a: InventoryItem, b: InventoryItem) => 
          (b.acquired?.timestamp || 0) - (a.acquired?.timestamp || 0)
      };
      
      const sortFn = sortFunctions[sortBy as keyof typeof sortFunctions] || sortFunctions.name;
      const sortedInventory = [...state.player.inventory].sort(sortFn);
      
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
      const itemIndex = findItem(state.player.inventory, itemId);
      
      if (itemIndex === -1) return state;
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory.map((item, idx) => 
            idx === itemIndex ? { ...item, examined: true } : item
          )
        }
      };
    }
    
    default:
      return state;
  }
};
