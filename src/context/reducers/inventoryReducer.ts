import { ACTION_TYPES, INVENTORY_ACTIONS } from '../types/ActionTypes';
import { GameState, InventoryItem } from '../types/GameStateTypes';

// Extend the InventoryItem interface to include the acquired property
interface ExtendedInventoryItem extends InventoryItem {
  acquired?: {
    timestamp: number;
    source: string;
  };
  examined?: boolean;
}

// Helper functions
const findItem = (inventory: InventoryItem[] | undefined, itemId: string): number => {
  if (!inventory) return -1;
  return inventory.findIndex(item => item.id === itemId);
};

/**
 * Get item data from the appropriate state location
 * @param state - Game state
 * @param itemId - ID of the item to find
 * @returns Item data or undefined if not found
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
  
  // Fallback to the deprecated gameData (with safeguards)
  if (state.gameData && typeof state.gameData === 'object' && 'items' in state.gameData) {
    const items = state.gameData.items as Record<string, unknown>;
    if (items && typeof items === 'object' && itemId in items) {
      return items[itemId];
    }
  }
  
  // Item not found
  return undefined;
};

/**
 * Helper to update item quantity, removing if quantity reaches 0
 * Explicitly typed to work with the minimal required structure
 */
const updateInventoryQuantity = <T extends { id: string; quantity: number }>(
  inventory: T[], 
  index: number,
  changeAmount: number
): T[] => {
  if (!inventory || index < 0 || index >= inventory.length) {
    return inventory || [];
  }
  
  const newQuantity = inventory[index].quantity + changeAmount;
  
  if (newQuantity <= 0) {
    // Remove item if quantity is 0 or less
    return [
      ...inventory.slice(0, index),
      ...inventory.slice(index + 1)
    ];
  }
  
  // Update quantity
  return [
    ...inventory.slice(0, index),
    { ...inventory[index], quantity: newQuantity },
    ...inventory.slice(index + 1)
  ];
};

// Define an interface for the stats structure
interface GameStats {
  itemsUsed: Record<string, number>;
  [key: string]: any;
}

/**
 * Inventory Reducer - Manages player's inventory of items and equipment
 */
export const inventoryReducer = (
  state: GameState, 
  action: { type: string; payload: any }
): GameState => {
  // Ensure player exists and initialize inventory if needed
  if (!state.player) {
    console.warn('Warning: Player is undefined in inventoryReducer');
    return state;
  }

  // Ensure inventory exists and use it with explicit typing
  const inventory = (state.player.inventory || []) as ExtendedInventoryItem[];

  switch (action.type) {
    case INVENTORY_ACTIONS.ADD_ITEM: {
      const { itemId, quantity = 1, source } = action.payload;
      const existingItemIndex = findItem(inventory, itemId);
      const itemData = getItemData(state, itemId);
      
      if (!itemData) {
        // Invalid item data - return state unchanged
        return state;
      }
      
      if (existingItemIndex !== -1) {
        // If item exists, update quantity using typed function
        const updatedInventory = updateInventoryQuantity<InventoryItem>(inventory, existingItemIndex, quantity);
        return {
          ...state,
          player: {
            ...state.player,
            inventory: updatedInventory
          }
        };
      } else {
        // Add new item matching the expected GameItem type
        const newItem: ExtendedInventoryItem = {
          id: itemId,
          quantity,
          name: itemData.name,
          type: itemData.type || 'misc', // Default type if missing
          description: itemData.description || '',
          value: itemData.value || 0,
          rarity: itemData.rarity || 'common',
          stackable: itemData.stackable !== false, // Default to true
          tradeable: itemData.tradeable !== false, // Default to true
          sellable: itemData.sellable !== false, // Add the missing sellable property
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
    }
    
    case INVENTORY_ACTIONS.REMOVE_ITEM: {
      const { itemId, quantity = 1 } = action.payload;
      const existingItemIndex = findItem(inventory, itemId);
      
      if (existingItemIndex === -1) return state;
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: updateInventoryQuantity<InventoryItem>(inventory, existingItemIndex, -quantity)
        }
      };
    }
    
    case INVENTORY_ACTIONS.USE_ITEM: {
      const { itemId } = action.payload;
      const existingItemIndex = findItem(inventory, itemId);
      
      if (existingItemIndex === -1) {
        // Item not found - return state unchanged
        return state;
      }
      
      const itemData = getItemData(state, itemId);
      if (!itemData) {
        // Unknown item type - return state unchanged
        return state;
      }
      
      // Apply item effects based on type
      let updatedState = state;
      
      if (itemData.type === 'consumable' && itemData.effects) {
        const { effects } = itemData;
        
        // Update health/energy/experience if applicable
        if (effects.health || effects.energy || effects.experience) {
          // Get current values with safe fallbacks
          const playerStats = updatedState.player.stats || {};
          const playerHealth = playerStats.health || 0;
          const playerMaxHealth = playerStats.maxHealth || 100;
          const playerEnergy = updatedState.player.energy || 0;
          const playerMaxEnergy = updatedState.player.maxEnergy || 100;
          const playerExperience = updatedState.player.experience || 0;
          
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
                playerEnergy,
              // Experience is directly on player
              experience: effects.experience ? 
                playerExperience + effects.experience :
                playerExperience
            }
          };
        }
        
        // Track item usage for stats with proper typing
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
      
      // Remove one of the used item - use the generic function with explicit type parameter
      updatedState = {
        ...updatedState,
        player: {
          ...updatedState.player,
          inventory: updateInventoryQuantity<InventoryItem>(
            (updatedState.player.inventory || []) as InventoryItem[], 
            existingItemIndex, 
            -1
          )
        }
      };
      
      return updatedState;
    }
    
    case INVENTORY_ACTIONS.SORT_INVENTORY: {
      const { sortBy = 'name' } = action.payload;
      
      const sortFunctions = {
        name: (a: ExtendedInventoryItem, b: ExtendedInventoryItem) => a.name.localeCompare(b.name),
        type: (a: ExtendedInventoryItem, b: ExtendedInventoryItem) => a.type.localeCompare(b.type),
        quantity: (a: ExtendedInventoryItem, b: ExtendedInventoryItem) => b.quantity - a.quantity,
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
    }
    
    case INVENTORY_ACTIONS.EXAMINE_ITEM: {
      const { itemId } = action.payload;
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
    
    default:
      return state;
  }
};
