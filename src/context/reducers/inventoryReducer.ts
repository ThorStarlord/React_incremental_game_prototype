import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Inventory Reducer - Manages player's inventory of items and equipment
 */

// Define interfaces for state and items
interface GameState {
  player: {
    inventory: InventoryItem[];
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    experience: number;
  };
  items?: ItemData[];
  gameData?: {
    items?: Record<string, ItemData>;
  };
  stats?: {
    itemsUsed?: Record<string, number>;
  };
}

interface InventoryItem {
  id: string;
  quantity: number;
  name: string;
  type: string;
  examined?: boolean;
  acquired?: {
    timestamp: number;
    source: string;
  };
  [key: string]: any;
}

interface ItemData {
  id: string;
  name: string;
  type: string;
  effects?: {
    health?: number;
    energy?: number;
    experience?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

// Helper functions
const findItem = (inventory: InventoryItem[], itemId: string): number => 
  inventory.findIndex(item => item.id === itemId);

const getItemData = (state: GameState, itemId: string): ItemData | undefined => 
  state.items?.find(item => item.id === itemId) || state.gameData?.items?.[itemId];

const updateInventoryQuantity = (inventory: InventoryItem[], itemIndex: number, quantityChange: number): InventoryItem[] => {
  if (inventory[itemIndex].quantity + quantityChange <= 0) {
    return inventory.filter((_, idx) => idx !== itemIndex);
  }
  return inventory.map((item, idx) => 
    idx === itemIndex ? { ...item, quantity: item.quantity + quantityChange } : item
  );
};

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
        return addNotification(state, {
          message: "Invalid item data. Cannot add to inventory.",
          type: "error"
        });
      }
      
      // Either update existing item or add new one
      const newInventory = existingItemIndex !== -1 
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
          }];
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: newInventory
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
        return addNotification(state, {
          message: "You don't have this item.",
          type: "error"
        });
      }
      
      const itemData = getItemData(state, itemId);
      
      if (!itemData) {
        return addNotification(state, {
          message: "Unknown item type.",
          type: "error"
        });
      }
      
      // Apply item effects based on type
      let updatedState = state;
      
      if (itemData.type === 'consumable' && itemData.effects) {
        const { effects } = itemData;
        
        // Update player health if item has health effect
        if (effects.health) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              health: Math.min(
                updatedState.player.health + effects.health,
                updatedState.player.maxHealth
              )
            }
          };
        }
        
        // Update player energy if item has energy effect
        if (effects.energy) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              energy: Math.min(
                updatedState.player.energy + effects.energy,
                updatedState.player.maxEnergy
              )
            }
          };
        }
        
        // Update experience if item provides experience
        if (effects.experience) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              experience: updatedState.player.experience + effects.experience
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
      
      return addNotification(updatedState, {
        message: `Used ${itemData.name}.`,
        type: "info"
      });
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
