import { Item, ITEM_CATEGORIES, ITEM_RARITIES } from '../itemsInitialState';

/**
 * Collection of game items organized by category
 */
const items: Record<string, Item> = {
  // Weapons
  'rusty_sword': {
    id: 'rusty_sword',
    name: 'Rusty Sword',
    description: 'An old sword with rust spots. Still sharp enough to cut.',
    category: ITEM_CATEGORIES.WEAPON,
    rarity: ITEM_RARITIES.COMMON,
    value: 5,
    weight: 3,
    stats: {
      attack: 3
    },
    sellable: true,
    level: 1
  },
  'hunters_bow': {
    id: 'hunters_bow',
    name: 'Hunter\'s Bow',
    description: 'A simple wooden bow for hunting small game.',
    category: ITEM_CATEGORIES.WEAPON,
    rarity: ITEM_RARITIES.COMMON,
    value: 8,
    weight: 2,
    stats: {
      attack: 4,
      critChance: 5
    },
    sellable: true,
    level: 1
  },
  'apprentice_wand': {
    id: 'apprentice_wand',
    name: 'Apprentice Wand',
    description: 'A beginner\'s wand used by magic students.',
    category: ITEM_CATEGORIES.WEAPON,
    rarity: ITEM_RARITIES.COMMON,
    value: 10,
    weight: 1,
    stats: {
      attack: 2,
      magic: 5
    },
    sellable: true,
    level: 1
  },

  // Armor
  'leather_vest': {
    id: 'leather_vest',
    name: 'Leather Vest',
    description: 'Simple protection made from tanned hide.',
    category: ITEM_CATEGORIES.ARMOR,
    rarity: ITEM_RARITIES.COMMON,
    value: 7,
    weight: 2,
    stats: {
      defense: 2
    },
    sellable: true,
    level: 1
  },
  'cloth_robe': {
    id: 'cloth_robe',
    name: 'Cloth Robe',
    description: 'A basic robe providing minimal protection but comfortable to wear.',
    category: ITEM_CATEGORIES.ARMOR,
    rarity: ITEM_RARITIES.COMMON,
    value: 5,
    weight: 1,
    stats: {
      defense: 1,
      magic: 2
    },
    sellable: true,
    level: 1
  },

  // Consumables
  'health_potion_minor': {
    id: 'health_potion_minor',
    name: 'Minor Health Potion',
    description: 'Restores a small amount of health.',
    category: ITEM_CATEGORIES.CONSUMABLE,
    rarity: ITEM_RARITIES.COMMON,
    value: 5,
    weight: 0.5,
    stackable: true,
    maxStack: 10,
    usable: true,
    consumable: true,
    effects: [
      {
        type: 'heal',
        potency: 20,
        target: 'self'
      }
    ]
  },
  'mana_potion_minor': {
    id: 'mana_potion_minor',
    name: 'Minor Mana Potion',
    description: 'Restores a small amount of mana.',
    category: ITEM_CATEGORIES.CONSUMABLE,
    rarity: ITEM_RARITIES.COMMON,
    value: 5,
    weight: 0.5,
    stackable: true,
    maxStack: 10,
    usable: true,
    consumable: true,
    effects: [
      {
        type: 'restore_mana',
        potency: 20,
        target: 'self'
      }
    ]
  },
  'bread': {
    id: 'bread',
    name: 'Bread',
    description: 'A loaf of bread. Restores a small amount of health.',
    category: ITEM_CATEGORIES.CONSUMABLE,
    rarity: ITEM_RARITIES.COMMON,
    value: 2,
    weight: 0.5,
    stackable: true,
    maxStack: 5,
    usable: true,
    consumable: true,
    effects: [
      {
        type: 'heal',
        potency: 5,
        target: 'self'
      }
    ]
  },

  // Materials
  'herb': {
    id: 'herb',
    name: 'Healing Herb',
    description: 'A common herb with minor healing properties.',
    category: ITEM_CATEGORIES.MATERIAL,
    rarity: ITEM_RARITIES.COMMON,
    value: 1,
    weight: 0.1,
    stackable: true,
    maxStack: 50
  },
  'cloth': {
    id: 'cloth',
    name: 'Cloth Scrap',
    description: 'A piece of cloth. Useful for crafting.',
    category: ITEM_CATEGORIES.MATERIAL,
    rarity: ITEM_RARITIES.COMMON,
    value: 1,
    weight: 0.1,
    stackable: true,
    maxStack: 50
  },
  
  // Quest items
  'ancient_relic': {
    id: 'ancient_relic',
    name: 'Ancient Relic',
    description: 'A mysterious artifact from a forgotten civilization.',
    category: ITEM_CATEGORIES.QUEST,
    rarity: ITEM_RARITIES.UNCOMMON,
    value: 0,
    weight: 1,
    questItem: true,
    sellable: false
  }
};

/**
 * Get all available items
 * @returns {Item[]} Array of all game items
 */
export const getAllItems = (): Item[] => {
  return Object.values(items);
};

/**
 * Get an item by its ID
 * @param {string} id - The item ID to look for
 * @returns {Item|undefined} The found item or undefined
 */
export const getItemById = (id: string): Item | undefined => {
  return items[id];
};

/**
 * Get items filtered by category
 * @param {string} category - The category to filter by
 * @returns {Item[]} Array of items in the specified category
 */
export const getItemsByCategory = (category: string): Item[] => {
  return Object.values(items).filter(item => item.category === category);
};

/**
 * Get starter items for a new player
 * @returns {Item[]} Array of starter items
 */
export const getStarterItems = (): Item[] => {
  return [
    { ...items.rusty_sword },
    { ...items.leather_vest },
    { ...items.health_potion_minor, quantity: 3 },
    { ...items.bread, quantity: 2 },
  ];
};

export default items;
