// This file contains utility functions for managing inventory in the game.

export const addItemToInventory = (inventory, item) => {
    return [...inventory, item];
};

export const removeItemFromInventory = (inventory, itemId) => {
    return inventory.filter(item => item.id !== itemId);
};

export const getItemFromInventory = (inventory, itemId) => {
    return inventory.find(item => item.id === itemId);
};

export const inventoryContainsItem = (inventory, itemId) => {
    return inventory.some(item => item.id === itemId);
};