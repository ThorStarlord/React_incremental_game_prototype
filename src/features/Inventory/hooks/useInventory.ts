import { useState, useEffect } from 'react';
import { useInventoryContext } from '../../../context/InventoryContext';
import { Item } from '../../../context/initialStates/ItemsInitialState';

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
 * Custom hook for inventory management
 * @returns {UseInventoryReturn} Inventory state and functions
 */
const useInventory = (): UseInventoryReturn => {
  const { inventory, setInventory } = useInventoryContext();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      // Fetch items logic would go here
      // This is a placeholder for the async fetch
      try {
        // Example: const response = await fetchItemsFromAPI();
        // setItems(response.data);
        
        // For now, just use the items from inventory
        setItems(inventory.items || []);
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
        
        setInventory({
          ...inventory,
          items: updatedItems
        });
        
        return true;
      }
    }
    
    // Otherwise add as new item
    setInventory({
      ...inventory,
      items: [...inventory.items, item]
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
      
      setInventory({
        ...inventory,
        items: updatedItems
      });
    } else {
      // Remove the item completely
      setInventory({
        ...inventory,
        items: inventory.items.filter(i => i.id !== itemId)
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
