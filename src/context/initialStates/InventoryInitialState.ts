/**
 * Initial state configuration for player inventory
 */

import { InventoryState, GameItem } from '../types/GameStateTypes';

/**
 * Starting items for new players
 */
export const STARTING_ITEMS: GameItem[] = [
  {
    id: 'health_potion_minor',
    name: 'Minor Health Potion',
    type: 'consumable',
    effect: { health: 25 },
    quantity: 3,
    value: 10,
    rarity: 'common',
    description: 'A small vial containing a red liquid that restores a small amount of health.'
  },
  {
    id: 'wooden_sword',
    name: 'Wooden Sword',
    type: 'weapon',
    stats: { physicalDamage: 3 },
    quantity: 1,
    value: 15,
    rarity: 'common',
    description: 'A simple training sword made of wood. Better than nothing.'
  },
  {
    id: 'leather_scraps',
    name: 'Leather Scraps',
    type: 'material',
    quantity: 5,
    value: 2,
    rarity: 'common',
    description: 'Small pieces of leather that can be used for basic crafting.'
  }
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
  items: STARTING_ITEMS
};

export default inventoryInitialState;
