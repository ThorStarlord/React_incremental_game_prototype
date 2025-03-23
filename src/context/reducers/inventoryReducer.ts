import { INVENTORY_ACTIONS } from '../types/ActionTypes';
import { GameState, InventoryItem } from '../types/gameStates/GameStateTypes';
import { createReducer, Action, withNotification, updateInventoryQuantity } from '../utils/reducerUtils';

// Extend the InventoryItem interface to include additional properties
interface ExtendedInventoryItem extends InventoryItem {
  acquired?: {
    timestamp: number;
    source: string;
  };
  examined?: boolean;
}

// Type definitions for action payloads
interface AddItemPayload {
  itemId: string;
  quantity?: number;
  source?: string;
}

interface RemoveItemPayload {
  itemId: string;
  quantity?: number;
}

interface UseItemPayload {
  itemId: string;
}

interface SortInventoryPayload {
  sortBy?: 'name' | 'type' | 'quantity' | 'recent';
}

interface ExamineItemPayload {
  itemId: string;
}

// Type definitions for inventory actions
type InventoryAction = 
  | Action<typeof INVENTORY_ACTIONS.ADD_ITEM, AddItemPayload>
  | Action<typeof INVENTORY_ACTIONS.REMOVE_ITEM, RemoveItemPayload>
  | Action<typeof INVENTORY_ACTIONS.USE_ITEM, UseItemPayload>
  | Action<typeof INVENTORY_ACTIONS.SORT_INVENTORY, SortInventoryPayload>
  | Action<typeof INVENTORY_ACTIONS.EXAMINE_ITEM, ExamineItemPayload>;

// Helper functions
/**
 * Find an item in the inventory by its ID
 */
const findItem = (inventory: InventoryItem[] | undefined, itemId: string): number => {
  if (!inventory) return -1;
  return inventory.findIndex(item => item.id === itemId);
};

/**
 * Get item data from the appropriate state location
 */
const getItemData = (state: GameState, itemId: string): any => {
  // First check in inventory.items if it exists
  if (state.inventory?.items) {
    const item = state.inventory.items.find(item => item.id === itemId);
    if (item) return item;
  }
  
  // Check the player's current inventory items if inventory exists
  if (state.player?.inventory) {
    const playerItem = state.player.inventory.find(item => item.id === itemId);
    if (playerItem) return playerItem;
  }
  
  // Fallback to the deprecated gameData
  if (state.gameData && typeof state.gameData === 'object' && 'items' in state.gameData) {
    const items = state.gameData.items as Record<string, unknown>;
    if (items && typeof items === 'object' && itemId in items) {
      return items[itemId];
    }
  }
  
  // Item not found
  return undefined;
};

// Type guard functions to narrow action types
function isAddItemAction(action: InventoryAction): action is Action<typeof INVENTORY_ACTIONS.ADD_ITEM, AddItemPayload> {
  return action.type === INVENTORY_ACTIONS.ADD_ITEM;
}

function isRemoveItemAction(action: InventoryAction): action is Action<typeof INVENTORY_ACTIONS.REMOVE_ITEM, RemoveItemPayload> {
  return action.type === INVENTORY_ACTIONS.REMOVE_ITEM;
}

function isUseItemAction(action: InventoryAction): action is Action<typeof INVENTORY_ACTIONS.USE_ITEM, UseItemPayload> {
  return action.type === INVENTORY_ACTIONS.USE_ITEM;
}

function isSortInventoryAction(action: InventoryAction): action is Action<typeof INVENTORY_ACTIONS.SORT_INVENTORY, SortInventoryPayload> {
  return action.type === INVENTORY_ACTIONS.SORT_INVENTORY;
}

function isExamineItemAction(action: InventoryAction): action is Action<typeof INVENTORY_ACTIONS.EXAMINE_ITEM, ExamineItemPayload> {
  return action.type === INVENTORY_ACTIONS.EXAMINE_ITEM;
}

// Define an interface for the stats structure
interface GameStats {
  itemsUsed: Record<string, number>;
  [key: string]: any;
}

/**
 * Inventory Reducer - Manages player's inventory of items and equipment
 * 
 * Uses the createReducer utility to simplify action handling and maintain
 * consistent state updates.
 */
export const inventoryReducer = createReducer<GameState, InventoryAction>(
  {} as GameState, // Initial state will be provided by the GameProvider
  {
    [INVENTORY_ACTIONS.ADD_ITEM]: (state, action) => {
      // Ensure action is of the correct type and has a payload
      if (action.type !== INVENTORY_ACTIONS.ADD_ITEM || !action.payload) return state;

      // Ensure player exists
      if (!state.player) {
        console.warn('Warning: Player is undefined in inventoryReducer');
        return state;
      }

      const { itemId, quantity = 1, source } = action.payload;
      const inventory = state.player.inventory || [];
      const existingItemIndex = findItem(inventory, itemId);
      const itemData = getItemData(state, itemId);
      
      if (!itemData) {
        // Invalid item data - return state without notification to fix type error
        return state;
      }
      
      if (existingItemIndex !== -1) {
        // If item exists, update quantity
        const updatedInventory = updateInventoryQuantity(inventory, existingItemIndex, quantity);
        return {
          ...state,
          player: {
            ...state.player,
            inventory: updatedInventory
          }
        };
      } else {
        // Add new item
        const newItem: ExtendedInventoryItem = {
          id: itemId,
          quantity,
          name: itemData.name,
          type: itemData.type || 'misc',
          description: itemData.description || '',
          value: itemData.value || 0,
          rarity: itemData.rarity || 'common',
          stackable: itemData.stackable !== false,
          tradeable: itemData.tradeable !== false,
          sellable: itemData.sellable !== false,
          acquired: {
            timestamp: Date.now(),
            source: source || 'unknown'
          }
        };
        
        return {
          ...state,
          player: {
            ...state.player,
            inventory: [...inventory, newItem]
          }
        };
      }
    },
    
    [INVENTORY_ACTIONS.REMOVE_ITEM]: (state, action) => {
      // Ensure action is of the correct type and has a payload
      if (action.type !== INVENTORY_ACTIONS.REMOVE_ITEM || !action.payload) return state;
      
      if (!state.player) return state;
      
      const { itemId, quantity = 1 } = action.payload;
      const inventory = state.player.inventory || [];
      const existingItemIndex = findItem(inventory, itemId);
      
      if (existingItemIndex === -1) return state;
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: updateInventoryQuantity(inventory, existingItemIndex, -quantity)
        }
      };
    },
    
    [INVENTORY_ACTIONS.USE_ITEM]: (state, action) => {
      // Ensure action is of the correct type and has a payload
      if (action.type !== INVENTORY_ACTIONS.USE_ITEM || !action.payload) return state;
      
      if (!state.player) return state;
      
      const { itemId } = action.payload;
      const inventory = state.player.inventory || [];
      const existingItemIndex = findItem(inventory, itemId);
      
      if (existingItemIndex === -1) {
        return state; // Skip notification to fix type error
      }
      
      const itemData = getItemData(state, itemId);
      if (!itemData) {
        return state; // Skip notification to fix type error
      }
      
      // Apply item effects based on type
      let updatedState = state;
      
      if (itemData.type === 'consumable' && itemData.effects) {
        const { effects } = itemData;
        
        // Update health/energy if applicable
        if (effects.health || effects.energy) {
          // Get current values with safe fallbacks
          const playerStats = updatedState.player.stats || {};
          const playerHealth = playerStats.health || 0;
          const playerMaxHealth = playerStats.maxHealth || 100;
          const playerEnergy = updatedState.player.energy || 0;
          const playerMaxEnergy = updatedState.player.maxEnergy || 100;
          
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              // Health is on player.stats
              stats: {
                ...playerStats,
                health: effects.health ? 
                  Math.min(playerHealth + effects.health, playerMaxHealth) :
                  playerHealth
              },
              // Energy is directly on player
              energy: effects.energy ?
                Math.min(playerEnergy + effects.energy, playerMaxEnergy) :
                playerEnergy
            }
          };
        }
        
        // Track item usage for stats
        const currentStats: GameStats = updatedState.stats as GameStats || { itemsUsed: {} };
        const currentItemsUsed: Record<string, number> = currentStats.itemsUsed || {};
        const currentItemUsage: number = currentItemsUsed[itemId] || 0;
        
        updatedState = {
          ...updatedState,
          stats: {
            ...currentStats,
            itemsUsed: {
              ...currentItemsUsed,
              [itemId]: currentItemUsage + 1
            }
          }
        };
      }
      
      // Remove one of the used item
      updatedState = {
        ...updatedState,
        player: {
          ...updatedState.player,
          inventory: updateInventoryQuantity(
            updatedState.player.inventory || [], 
            existingItemIndex, 
            -1
          )
        }
      };
      
      // Return without using withNotification to fix type error
      return updatedState;
    },
    
    [INVENTORY_ACTIONS.SORT_INVENTORY]: (state, action) => {
      // Ensure action is of the correct type and has a payload
      if (action.type !== INVENTORY_ACTIONS.SORT_INVENTORY || !action.payload) return state;
      
      if (!state.player) return state;
      
      const { sortBy = 'name' } = action.payload;
      const inventory = state.player.inventory || [];
      
      const sortFunctions = {
        name: (a: ExtendedInventoryItem, b: ExtendedInventoryItem) => 
          a.name.localeCompare(b.name),
        type: (a: ExtendedInventoryItem, b: ExtendedInventoryItem) => 
          a.type.localeCompare(b.type),
        quantity: (a: ExtendedInventoryItem, b: ExtendedInventoryItem) => 
          b.quantity - a.quantity,
        recent: (a: ExtendedInventoryItem, b: ExtendedInventoryItem) => 
          (b.acquired?.timestamp || 0) - (a.acquired?.timestamp || 0)
      };
      
      const sortFn = sortFunctions[sortBy as keyof typeof sortFunctions] || sortFunctions.name;
      const sortedInventory = [...inventory].sort(sortFn);
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: sortedInventory
        }
      };
    },
    
    [INVENTORY_ACTIONS.EXAMINE_ITEM]: (state, action) => {
      // Ensure action is of the correct type and has a payload
      if (action.type !== INVENTORY_ACTIONS.EXAMINE_ITEM || !action.payload) return state;
      
      if (!state.player) return state;
      
      const { itemId } = action.payload;
      const inventory = state.player.inventory || [];
      const itemIndex = findItem(inventory, itemId);
      
      if (itemIndex === -1) return state;
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: inventory.map((item, idx) => 
            idx === itemIndex ? { ...item, examined: true } : item
          )
        }
      };
    }
  }
);

// Custom wrapper for notifications that handles the correct structure
const safeNotification = (state: GameState, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  // Handle the case where notifications might be an object with a notifications array property
  // rather than being an array directly
  if (!state.notifications) {
    return {
      ...state,
      notifications: {
        notifications: [{
          id: `notification-${Date.now()}`,
          message,
          type,
          duration: 3000,
          timestamp: Date.now()
        }],
        unreadCount: 1
      }
    };
  }
  
  // Handle the case where notifications is an object with a notifications array
  if ('notifications' in state.notifications) {
    return {
      ...state,
      notifications: {
        ...state.notifications,
        notifications: [
          ...(state.notifications.notifications || []),
          {
            id: `notification-${Date.now()}`,
            message,
            type,
            duration: 3000,
            timestamp: Date.now()
          }
        ],
        unreadCount: (state.notifications.unreadCount || 0) + 1
      }
    };
  }
  
  // Fallback case if the structure is different
  console.warn('Unexpected notifications structure in safeNotification');
  return state;
};

export default inventoryReducer;
