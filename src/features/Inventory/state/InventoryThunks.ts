/**
 * Redux Thunks for Inventory-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  addNotification 
} from '../../Notifications/state/NotificationsSlice';
import {
  Item,
  EquipmentSlot,
  AddItemPayload,
  RemoveItemPayload,
  EquipItemPayload,
  UnequipItemPayload,
  UseItemPayload,
  SellItemPayload,
  BuyItemPayload
} from './InventoryTypes';
import {
  addItemToInventory,
  removeItemFromInventory,
  setEquipment,
  addGold,
  removeGold
} from './InventorySlice';
import { 
  canAddItem, 
  calculateTotalWeight 
} from '../utils/inventoryUtils';

/**
 * Adds an item to the inventory with additional logic and notifications
 */
export const addItem = createAsyncThunk<
  Item,
  AddItemPayload,
  { state: RootState }
>(
  'inventory/addItem',
  async (payload, { getState, dispatch }) => {
    const { item, quantity = 1 } = payload;
    const state = getState();
    const inventory = state.inventory;
    
    // Check if we can add the item
    // We're simplifying the check here, as the full function would need the maxWeight which we're not tracking in our slice
    if (inventory.items.length >= inventory.capacity && !item.stackable) {
      throw new Error('Inventory is full');
    }
    
    // Add item to inventory
    dispatch(addItemToInventory({ item, quantity }));
    
    // Show notification
    dispatch(addNotification(
      `Added ${quantity}x ${item.name} to inventory`,
      'success',
      {
        duration: 3000,
        category: 'inventory'
      }
    ));
    
    return item;
  }
);

/**
 * Removes an item from the inventory with additional logic and notifications
 */
export const removeItem = createAsyncThunk<
  { itemId: string; quantity: number },
  RemoveItemPayload,
  { state: RootState }
>(
  'inventory/removeItem',
  async (payload, { getState, dispatch }) => {
    const { itemId, quantity = 1 } = payload;
    const state = getState();
    const item = state.inventory.items.find(i => i.id === itemId);
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    // Remove item from inventory
    dispatch(removeItemFromInventory({ itemId, quantity }));
    
    // Show notification
    dispatch(addNotification(
      `Removed ${quantity}x ${item.name} from inventory`,
      'info',
      {
        duration: 3000,
        category: 'inventory'
      }
    ));
    
    return { itemId, quantity };
  }
);

/**
 * Equips an item to the specified slot with additional logic and notifications
 */
export const equip = createAsyncThunk<
  { item: Item; slot: EquipmentSlot },
  EquipItemPayload,
  { state: RootState }
>(
  'inventory/equip',
  async (payload, { getState, dispatch }) => {
    const { itemId, slot } = payload;
    const state = getState();
    const item = state.inventory.items.find(i => i.id === itemId);
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    // Get currently equipped item if any
    const currentlyEquipped = state.inventory.equipment[slot];
    
    // If there's an item already equipped, unequip it first
    if (currentlyEquipped) {
      // Add the currently equipped item back to inventory
      dispatch(addItemToInventory({ item: currentlyEquipped }));
    }
    
    // Remove the item from inventory
    dispatch(removeItemFromInventory({ itemId }));
    
    // Equip the new item
    dispatch(setEquipment({ slot, item }));
    
    // Show notification
    dispatch(addNotification(
      `Equipped ${item.name}`,
      'success',
      {
        duration: 3000,
        category: 'equipment'
      }
    ));
    
    return { item, slot };
  }
);

/**
 * Unequips an item from the specified slot with additional logic and notifications
 */
export const unequip = createAsyncThunk<
  { slot: EquipmentSlot },
  UnequipItemPayload,
  { state: RootState }
>(
  'inventory/unequip',
  async (payload, { getState, dispatch }) => {
    const { slot } = payload;
    const state = getState();
    const item = state.inventory.equipment[slot];
    
    if (!item) {
      throw new Error('No item equipped in this slot');
    }
    
    // Add the equipped item back to inventory
    dispatch(addItemToInventory({ item }));
    
    // Remove the item from equipment
    dispatch(setEquipment({ slot, item: null }));
    
    // Show notification
    dispatch(addNotification(
      `Unequipped ${item.name}`,
      'info',
      {
        duration: 3000,
        category: 'equipment'
      }
    ));
    
    return { slot };
  }
);

/**
 * Uses an item with additional logic and notifications
 */
export const useItem = createAsyncThunk<
  { itemId: string },
  UseItemPayload,
  { state: RootState }
>(
  'inventory/useItem',
  async (payload, { getState, dispatch }) => {
    const { itemId, targetId } = payload;
    const state = getState();
    const item = state.inventory.items.find(i => i.id === itemId);
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    if (!item.usable) {
      throw new Error('This item cannot be used');
    }
    
    // Process item use effects
    if (item.effects && item.effects.length > 0) {
      for (const effect of item.effects) {
        switch (effect.type) {
          case 'heal':
            // Apply healing effect to player or target
            dispatch({
              type: 'player/heal',
              payload: {
                amount: effect.value,
                targetId
              }
            });
            break;
            
          case 'mana':
            // Restore mana
            dispatch({
              type: 'player/restoreMana',
              payload: {
                amount: effect.value,
                targetId
              }
            });
            break;
            
          case 'buff':
            // Apply buff to player or target
            dispatch({
              type: 'player/applyBuff',
              payload: {
                buffId: `${item.id}_buff`,
                strength: effect.value,
                duration: effect.duration || 30,
                targetId
              }
            });
            break;
            
          case 'damage':
            // Apply damage to target
            if (targetId) {
              dispatch({
                type: 'combat/damage',
                payload: {
                  amount: effect.value,
                  targetId
                }
              });
            }
            break;
            
          default:
            console.warn(`Unknown effect type: ${effect.type}`);
        }
      }
    }
    
    // If item is consumable, reduce quantity or remove it
    if (item.consumable) {
      dispatch(removeItemFromInventory({ itemId, quantity: 1 }));
    }
    
    // Show notification
    dispatch(addNotification(
      `Used ${item.name}`,
      'info',
      {
        duration: 3000,
        category: 'inventory'
      }
    ));
    
    return { itemId };
  }
);

/**
 * Sells an item to a vendor with additional logic and notifications
 */
export const sellItem = createAsyncThunk<
  { itemId: string; quantity: number; gold: number },
  SellItemPayload,
  { state: RootState }
>(
  'inventory/sellItem',
  async (payload, { getState, dispatch }) => {
    const { itemId, quantity, price } = payload;
    const state = getState();
    const item = state.inventory.items.find(i => i.id === itemId);
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    if (!item.sellable) {
      throw new Error('This item cannot be sold');
    }
    
    if (item.quantity < quantity) {
      throw new Error('Not enough items to sell');
    }
    
    // Calculate total sale value
    const totalValue = price * quantity;
    
    // Remove items from inventory
    dispatch(removeItemFromInventory({ itemId, quantity }));
    
    // Add gold to inventory
    dispatch(addGold({ amount: totalValue }));
    
    // Show notification
    dispatch(addNotification(
      `Sold ${quantity}x ${item.name} for ${totalValue} gold`,
      'success',
      {
        duration: 3000,
        category: 'trade'
      }
    ));
    
    return { itemId, quantity, gold: totalValue };
  }
);

/**
 * Buys an item from a vendor with additional logic and notifications
 */
export const buyItem = createAsyncThunk<
  { item: Item; quantity: number; gold: number },
  BuyItemPayload,
  { state: RootState }
>(
  'inventory/buyItem',
  async (payload, { getState, dispatch }) => {
    const { item, price } = payload;
    const state = getState();
    const quantity = item.quantity || 1;
    
    // Check if player has enough gold
    if (state.inventory.gold < price) {
      throw new Error('Not enough gold');
    }
    
    // Check if inventory has space for the item
    if (!canAddItem(
      state.inventory.items as any[], 
      item as any, 
      Number.MAX_SAFE_INTEGER, // Maximum weight, which we're not enforcing here
      state.inventory.capacity
    )) {
      throw new Error('Inventory is full');
    }
    
    // Remove gold from inventory
    dispatch(removeGold({ amount: price }));
    
    // Add item to inventory
    dispatch(addItemToInventory({ item, quantity }));
    
    // Show notification
    dispatch(addNotification(
      `Purchased ${quantity}x ${item.name} for ${price} gold`,
      'success',
      {
        duration: 3000,
        category: 'trade'
      }
    ));
    
    return { item, quantity, gold: price };
  }
);
