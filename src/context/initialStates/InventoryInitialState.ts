/**
 * Initial state configuration for player inventory
 */

import { InventoryState, GameItem } from '../types/GameStateTypes';

/**
 * Create a game item with validation
 */
export const createGameItem = (item: Partial<GameItem>): GameItem => {
  if (!item.id || !item.name || !item.type) {
    throw new Error(`Invalid item: missing required properties`);
  }
  
  return {
    quantity: 1, // Default quantity
    value: 0, // Default value
    rarity: 'common', // Default rarity
    description: '', // Default description
    ...item,
    quantity: Math.max(1, item.quantity || 1) // Ensure positive quantity
  };
};

/**
 * Starting weapons for new players
 */
export const STARTING_WEAPONS: GameItem[] = [
  createGameItem({
    id: 'wooden_sword',
    name: 'Wooden Sword',
    type: 'weapon',
    stats: { physicalDamage: 3 },
    quantity: 1,
    value: 15,
    rarity: 'common',
    description: 'A simple training sword made of wood. Better than nothing.'
  })
];

/**
 * Starting consumables for new players
 */
export const STARTING_CONSUMABLES: GameItem[] = [
  createGameItem({
    id: 'health_potion_minor',
    name: 'Minor Health Potion',
    type: 'consumable',
    effect: { health: 25 },
    quantity: 3,
    value: 10,
    rarity: 'common',
    description: 'A small vial containing a red liquid that restores a small amount of health.'
  })
];

/**
 * Starting materials for new players
 */
export const STARTING_MATERIALS: GameItem[] = [
  createGameItem({
    id: 'leather_scraps',
    name: 'Leather Scraps',
    type: 'material',
    quantity: 5,
    value: 2,
    rarity: 'common',
    description: 'Small pieces of leather that can be used for basic crafting.'
  })
];

/**
 * Initial inventory capacity for new players
 */
export const INITIAL_CAPACITY = 20;

/**
 * Initial state for player inventory
 */
const inventoryInitialState: InventoryState = {
  capacity: INITIAL_CAPACITY,
  items: [...STARTING_WEAPONS, ...STARTING_CONSUMABLES, ...STARTING_MATERIALS]
};

export default inventoryInitialState;
