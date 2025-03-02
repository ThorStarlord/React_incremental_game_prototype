/**
 * @fileoverview Initial state definition for the game's inventory system.
 * 
 * This file defines:
 * 1. Item categories and rarities as constants
 * 2. Item template structure
 * 3. Starting inventory items
 * 4. Initial inventory state object
 */

/**
 * Item categories enumeration
 * @readonly
 * @enum {string}
 */
export const ITEM_CATEGORIES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  CONSUMABLE: 'consumable',
  MATERIAL: 'material',
  QUEST: 'quest',
  MISC: 'misc',
};

/**
 * Item rarity levels enumeration
 * @readonly
 * @enum {string}
 */
export const ITEM_RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

/**
 * Base items catalog - defines all possible items in the game
 * @type {Object.<string, Object>}
 */
export const itemsCatalog = {
  // Weapons
  'rusty_sword': {
    id: 'rusty_sword',
    name: 'Rusty Sword',
    description: 'An old sword with a dull blade. Better than nothing.',
    category: ITEM_CATEGORIES.WEAPON,
    rarity: ITEM_RARITIES.COMMON,
    stats: {
      damage: 3,
      durability: 30,
    },
    stackable: false,
    value: 5,
    levelReq: 1,
    icon: 'sword_common',
  },
  'wooden_bow': {
    id: 'wooden_bow',
    name: 'Wooden Bow',
    description: 'A simple bow carved from oak. Decent for hunting.',
    category: ITEM_CATEGORIES.WEAPON,
    rarity: ITEM_RARITIES.COMMON,
    stats: {
      damage: 2,
      range: 8,
      durability: 25,
    },
    stackable: false,
    value: 7,
    levelReq: 1,
    icon: 'bow_common',
  },

  // Armor
  'leather_armor': {
    id: 'leather_armor',
    name: 'Leather Vest',
    description: 'Basic protection made from tanned hide.',
    category: ITEM_CATEGORIES.ARMOR,
    rarity: ITEM_RARITIES.COMMON,
    stats: {
      defense: 5,
      durability: 40,
    },
    stackable: false,
    value: 10,
    levelReq: 1,
    icon: 'armor_common',
  },

  // Consumables
  'health_potion': {
    id: 'health_potion',
    name: 'Minor Health Potion',
    description: 'Restores a small amount of health when consumed.',
    category: ITEM_CATEGORIES.CONSUMABLE,
    rarity: ITEM_RARITIES.COMMON,
    stats: {
      healthRestore: 20,
    },
    stackable: true,
    maxStack: 10,
    value: 5,
    levelReq: 1,
    icon: 'potion_red',
    onUse: 'RESTORE_HEALTH', // Function identifier to handle when used
  },

  // Materials
  'iron_ore': {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'Raw iron ore that can be smelted into bars.',
    category: ITEM_CATEGORIES.MATERIAL,
    rarity: ITEM_RARITIES.COMMON,
    stackable: true,
    maxStack: 50,
    value: 2,
    icon: 'ore_iron',
  },
  'herb': {
    id: 'herb',
    name: 'Medicinal Herb',
    description: 'A common herb with healing properties.',
    category: ITEM_CATEGORIES.MATERIAL,
    rarity: ITEM_RARITIES.COMMON,
    stackable: true,
    maxStack: 20,
    value: 1,
    icon: 'herb_common',
  },
};

/**
 * Initial inventory state - defines what the player starts with
 * @typedef {Object} InventoryState
 * @property {Array<InventoryItem>} items - Items currently in the inventory
 * @property {number} maxSlots - Maximum number of inventory slots
 * @property {number} gold - Current amount of gold
 */

/**
 * @typedef {Object} InventoryItem
 * @property {string} itemId - Reference to the item in the catalog
 * @property {number} quantity - Number of this item stacked (1 for non-stackable)
 * @property {number} durability - Current durability for equipment (optional)
 * @property {Object} customStats - Any modified or custom stats for this specific item instance (optional)
 */

/**
 * The initial inventory state when starting a new game
 * @type {InventoryState}
 */
const initialState = {
  items: [
    { 
      itemId: 'rusty_sword', 
      quantity: 1,
      durability: 30
    },
    { 
      itemId: 'health_potion', 
      quantity: 3
    },
    { 
      itemId: 'herb', 
      quantity: 5
    },
  ],
  maxSlots: 20,
  gold: 10,
  
  // Equipment slots (what the player has equipped)
  equipped: {
    weapon: null,
    head: null,
    chest: null,
    legs: null,
    feet: null,
    accessory1: null,
    accessory2: null,
  }
};

export default initialState;
