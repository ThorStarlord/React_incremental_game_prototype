/**
 * Types for the Inventory slice of the Redux store
 */

/**
 * Item categories
 */
export enum ItemCategory {
  Weapon = 'weapon',
  Armor = 'armor',
  Consumable = 'consumable',
  Material = 'material',
  Quest = 'quest',
  Misc = 'misc'
}

export const ITEM_CATEGORIES = {
  WEAPON: 'weapon' as ItemCategory,
  ARMOR: 'armor' as ItemCategory,
  CONSUMABLE: 'consumable' as ItemCategory,
  MATERIAL: 'material' as ItemCategory,
  QUEST: 'quest' as ItemCategory,
  MISC: 'misc' as ItemCategory
};

/**
 * Item rarity levels
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Item effect
 */
export interface ItemEffect {
  type: string;
  value: number;
  duration?: number;
  target?: string;
}

/**
 * Item stats
 */
export interface ItemStats {
  attack?: number;
  defense?: number;
  health?: number;
  mana?: number;
  speed?: number;
  critChance?: number;
  critDamage?: number;
  physicalDamage?: number;
  magicalDamage?: number;
  armor?: number;
  [key: string]: number | undefined;
}

/**
 * Item requirements
 */
export interface ItemRequirements {
  level?: number;
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  reputation?: {
    faction: string;
    level: number;
  }[];
  quest?: string;
}

/**
 * Base Item interface
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
  image?: string;
  stackable?: boolean;
  consumable?: boolean;
  maxStack?: number;
  sellable?: boolean;
  tradeable?: boolean;
  usable?: boolean;
  stats?: ItemStats;
  effects?: ItemEffect[];
  requirements?: ItemRequirements;
  soulbound?: boolean;
  unique?: boolean;
  quantity: number;
  type?: string;
  materialType?: string;
  tier?: number;
  effect?: { type: string; value: number };
}

/**
 * Equipment slots
 */
export enum EquipmentSlot {
  Head = 'head',
  Body = 'body',
  Hands = 'hands',
  Legs = 'legs',
  Feet = 'feet',
  Weapon = 'weapon',
  Offhand = 'offhand',
  Accessory1 = 'accessory1',
  Accessory2 = 'accessory2'
}

/**
 * Equipment state
 */
export interface Equipment {
  [EquipmentSlot.Head]: Item | null;
  [EquipmentSlot.Body]: Item | null;
  [EquipmentSlot.Hands]: Item | null;
  [EquipmentSlot.Legs]: Item | null;
  [EquipmentSlot.Feet]: Item | null;
  [EquipmentSlot.Weapon]: Item | null;
  [EquipmentSlot.Offhand]: Item | null;
  [EquipmentSlot.Accessory1]: Item | null;
  [EquipmentSlot.Accessory2]: Item | null;
}

/**
 * Quick slot item
 */
export type QuickSlot = Item | null;

/**
 * Filter criteria for items
 */
export interface ItemFilter {
  category?: ItemCategory | 'all';
  minLevel?: number;
  maxLevel?: number;
  rarity?: ItemRarity[];
  search?: string;
  usable?: boolean;
  equipped?: boolean;
}

/**
 * Sort options for items
 */
export interface ItemSort {
  field: 'name' | 'value' | 'weight' | 'rarity' | 'level' | 'category';
  direction: 'asc' | 'desc';
}

/**
 * Inventory state in Redux store
 */
export interface InventoryState {
  items: Item[];
  capacity: number;
  gold: number;
  equipment: Equipment;
  quickSlots: QuickSlot[];
  activeFilters: ItemFilter;
  sorting: ItemSort;
  selectedItemId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Add item payload
 */
export interface AddItemPayload {
  item: Item;
  quantity?: number;
}

/**
 * Remove item payload
 */
export interface RemoveItemPayload {
  itemId: string;
  quantity?: number;
}

/**
 * Update item payload
 */
export interface UpdateItemPayload {
  itemId: string;
  updates: Partial<Item>;
}

/**
 * Equip item payload
 */
export interface EquipItemPayload {
  itemId: string;
  slot: EquipmentSlot;
}

/**
 * Unequip item payload
 */
export interface UnequipItemPayload {
  slot: EquipmentSlot;
}

/**
 * Move item payload
 */
export interface MoveItemPayload {
  itemId: string;
  targetSlot: number;
}

/**
 * Set quick slot payload
 */
export interface SetQuickSlotPayload {
  itemId: string | null;
  slotIndex: number;
}

/**
 * Sort items payload
 */
export interface SortItemsPayload {
  sortBy: ItemSort['field'];
  direction: ItemSort['direction'];
}

/**
 * Filter items payload
 */
export interface FilterItemsPayload {
  filter: Partial<ItemFilter>;
}

/**
 * Sell item payload
 */
export interface SellItemPayload {
  itemId: string;
  quantity: number;
  price: number;
}

/**
 * Buy item payload
 */
export interface BuyItemPayload {
  item: Item;
  price: number;
}

/**
 * Use item payload
 */
export interface UseItemPayload {
  itemId: string;
  targetId?: string;
}

/**
 * Add gold payload
 */
export interface AddGoldPayload {
  amount: number;
}

/**
 * Remove gold payload
 */
export interface RemoveGoldPayload {
  amount: number;
}
