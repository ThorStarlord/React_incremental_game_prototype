import { useState, useEffect } from 'react';
import { useGameState, useGameDispatch, ACTION_TYPES } from '../../../context/GameStateExports';
import { Item } from '../../../context/initialStates/ItemsInitialState';
import { GameItem } from '../../../context/types/gameStates/ItemsGameStateTypes';

/**
 * Interface for inventory state
 */
interface Inventory {
  items: Item[];
  maxSlots: number;
  gold: number;
  [key: string]: any;
}

/**
 * Interface for useInventory hook return value
 */
interface UseInventoryReturn {
  items: Item[];
  inventory: Inventory;
  addItem: (item: Item) => boolean;
  removeItem: (itemId: string) => boolean;
}

/**
 * Converts a GameItem to an Item with required category property
 */
const convertToItem = (gameItem: GameItem): Item => {
  return {
    ...gameItem,
    // Map item type to category - by default use the type as category
    category: (gameItem as any).category || gameItem.type || 'misc'
  } as Item;
};

/**
 * Custom hook for inventory management
 * @returns {UseInventoryReturn} Inventory state and functions
 */
const useInventory = (): UseInventoryReturn => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Get inventory from game state and map to our interface
  // Convert GameItem[] to Item[] by adding the missing category property
  const inventory: Inventory = {
    items: (gameState.inventory?.items || []).map(convertToItem),
    maxSlots: gameState.inventory?.capacity || 20, // Map capacity to maxSlots
    gold: gameState.inventory?.gold || 0
  };
  
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      try {
        // Use inventory items from game state, already converted in the inventory object
        setItems(inventory.items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [inventory.items]);

  /**
   * Add an item to the inventory
   * @param {Item} item - The item to add
   * @returns {boolean} Whether the item was successfully added
   */
  const addItem = (item: Item): boolean => {
    // Check if inventory is full
    if (inventory.items.length >= inventory.maxSlots) {
      return false;
    }

    // If the item is stackable, check if we already have it
    if (item.stackable) {
      const existingItemIndex = inventory.items.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Clone the inventory to avoid direct state mutation
        const updatedItems = [...inventory.items];
        const existingItem = updatedItems[existingItemIndex];
        
        // Update quantity
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 1) + (item.quantity || 1)
        };
        
        // Dispatch action to update inventory
        dispatch({
          type: ACTION_TYPES.SORT_INVENTORY,
          payload: {
            items: updatedItems
          }
        });
        
        return true;
      }
    }
    
    // Otherwise add as new item - ensure it's converted back to GameItem when dispatching
    dispatch({
      type: ACTION_TYPES.ADD_ITEM,
      payload: {
        item: {
          ...item,
          // Remove category property if it doesn't exist in GameItem
          ...(item.type ? { type: item.type } : { type: item.category })
        }
      }
    });
    
    return true;
  };

  /**
   * Remove an item from the inventory
   * @param {string} itemId - ID of the item to remove
   * @returns {boolean} Whether the item was successfully removed
   */
  const removeItem = (itemId: string): boolean => {
    const itemIndex = inventory.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return false;
    }
    
    const item = inventory.items[itemIndex];
    
    // If stackable and quantity > 1, reduce quantity
    if (item.stackable && (item.quantity || 0) > 1) {
      const updatedItems = [...inventory.items];
      updatedItems[itemIndex] = {
        ...item,
        quantity: (item.quantity || 0) - 1
      };
      
      dispatch({
        type: ACTION_TYPES.SORT_INVENTORY,
        payload: {
          items: updatedItems
        }
      });
    } else {
      // Remove the item completely
      dispatch({
        type: ACTION_TYPES.REMOVE_ITEM,
        payload: {
          itemId
        }
      });
    }
    
    return true;
  };

  return {
    items,
    inventory,
    addItem,
    removeItem,
  };
};

export default useInventory;
