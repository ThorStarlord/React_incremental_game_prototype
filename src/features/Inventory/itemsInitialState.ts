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
 * Item category type
 */
export type ItemCategory = 'weapon' | 'armor' | 'consumable' | 'material' | 'quest' | 'misc';

/**
 * Item rarity type
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Item categories enumeration
 * @readonly
 */
export const ITEM_CATEGORIES: Record<string, ItemCategory> = {
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
 */
export const ITEM_RARITIES: Record<string, ItemRarity> = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

/**
 * Interface for item statistics
 */
export interface ItemStats {
  attack?: number;
  defense?: number;
  health?: number;
  speed?: number;
  magic?: number;
  critChance?: number;
  critDamage?: number;
  [key: string]: number | undefined;
}

/**
 * Interface for item effects
 */
export interface ItemEffect {
  type: string;
  potency: number;
  duration?: number;
  chance?: number;
  target?: string;
  [key: string]: any;
}

/**
 * Interface for a game item
 */
export interface Item {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  value: number;
  weight?: number;
  level?: number;
  stats?: ItemStats;
  effects?: ItemEffect[];
  stackable?: boolean;
  maxStack?: number;
  quantity?: number;
  usable?: boolean;
  consumable?: boolean;
  questItem?: boolean;
  sellable?: boolean;
  image?: string;
  [key: string]: any;
}

/**
 * Interface for the inventory state
 */
export interface InventoryState {
  maxSlots: number;
  maxWeight: number;
  currentWeight: number;
  gold: number;
  items: Item[];
  equipment: Record<string, Item | null>;
  quickSlots: (Item | null)[];
}

/**
 * Base items catalog - defines all possible items in the game
 * @type {Record<string, Item>}
 */
export const BASE_ITEMS: Record<string, Item> = {
  // Define actual items here in the complete implementation
};

/**
 * Initial inventory state object
 */
const itemsInitialState: InventoryState = {
  maxSlots: 20,
  maxWeight: 100,
  currentWeight: 0,
  gold: 50,
  items: [],
  equipment: {
    head: null,
    chest: null,
    legs: null,
    feet: null,
    hands: null,
    weapon: null,
    offhand: null,
    accessory1: null,
    accessory2: null,
  },
  quickSlots: [null, null, null, null]
};

export default itemsInitialState;
