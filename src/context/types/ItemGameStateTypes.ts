/**
 * Type definitions for game items and related structures
 */

/**
 * Item rarity levels that determine quality and value
 */
export enum ItemRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
  Artifact = 'artifact',  // Unique items with special effects
}

/**
 * Item types categorize items by their function
 */
export enum ItemType {
  Weapon = 'weapon',
  Armor = 'armor',
  Accessory = 'accessory',
  Consumable = 'consumable',
  Material = 'material',
  QuestItem = 'quest',
  Treasure = 'treasure',
  Tool = 'tool',
}

/**
 * Weapon types specify the class of weapon
 */
export enum WeaponType {
  Sword = 'sword',
  Axe = 'axe',
  Mace = 'mace',
  Dagger = 'dagger',
  Staff = 'staff',
  Wand = 'wand',
  Bow = 'bow',
  Spear = 'spear',
  Shield = 'shield',  // Can be used as offhand weapon
}

/**
 * Armor types specify where the armor is worn
 */
export enum ArmorType {
  Head = 'head',
  Body = 'body',
  Hands = 'hands',
  Legs = 'legs',
  Feet = 'feet',
  Offhand = 'offhand',  // Shields as armor
}

/**
 * Accessory types specify what type of accessory
 */
export enum AccessoryType {
  Ring = 'ring',
  Amulet = 'amulet',
  Earring = 'earring',
  Belt = 'belt',
  Trinket = 'trinket',
}

/**
 * Material types categorize crafting materials
 */
export enum MaterialType {
  Metal = 'metal',
  Wood = 'wood',
  Leather = 'leather',
  Cloth = 'cloth',
  Stone = 'stone',
  Herb = 'herb',
  Gem = 'gem',
  Essence = 'essence',
  Component = 'component',
}

/**
 * Consumable types categorize consumable items
 */
export enum ConsumableType {
  Potion = 'potion',
  Food = 'food',
  Scroll = 'scroll',
  Elixir = 'elixir',
  Bomb = 'bomb',
}

/**
 * Effect that can be applied by consumables or equipment
 */
export interface ItemEffect {
  health?: number;
  mana?: number;
  strength?: number;
  intelligence?: number;
  dexterity?: number;
  vitality?: number;
  luck?: number;
  statusEffect?: string;
  statusDuration?: number;
  skillBoost?: {
    skillId: string;
    amount: number;
  };
  [key: string]: number | string | object | undefined;
}

/**
 * Item statistics for weapons and armor
 */
export interface ItemStats {
  physicalDamage?: number;
  magicalDamage?: number;
  armor?: number;
  healthBonus?: number;
  manaBonus?: number;
  strengthBonus?: number;
  intelligenceBonus?: number;
  dexterityBonus?: number;
  vitalityBonus?: number;
  luckBonus?: number;
  critChance?: number;
  critDamage?: number;
  attackSpeed?: number;
  damageReduction?: number;
  elementalResistance?: {
    fire?: number;
    ice?: number;
    lightning?: number;
    poison?: number;
  };
  [key: string]: number | object | undefined;
}

/**
 * Requirements to equip or use an item
 */
export interface ItemRequirement {
  level?: number;
  strength?: number;
  intelligence?: number;
  dexterity?: number;
  vitality?: number;
  questCompleted?: string;
  reputation?: {
    faction: string;
    level: string;
  };
  [key: string]: number | string | object | undefined;
}

/**
 * Base interface for all game items
 */
export interface BaseItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  value: number;          // Base vendor value in gold
  weight?: number;        // Weight for inventory management
  stackable: boolean;     // Whether items can stack
  maxStackSize?: number;  // Maximum stack size (if stackable)
  iconPath?: string;      // UI icon path
  lore?: string;          // Extended lore description
  tags?: string[];        // Searchable tags
  tradeable: boolean;     // Can be traded with other players
  sellable: boolean;      // Can be sold to vendors
  questItem?: boolean;    // Is this a quest item
  acquiredTimestamp?: number; // When item was acquired
  source?: string;        // How item was obtained
}

/**
 * Weapon item type
 */
export interface WeaponItem extends BaseItem {
  type: ItemType.Weapon;
  weaponType: WeaponType;
  stats: ItemStats;
  requirements?: ItemRequirement;
  durability?: {
    current: number;
    maximum: number;
  };
  level: number;          // Item level/tier
  twoHanded: boolean;     // Requires both hands
  elementalDamage?: {     // Additional elemental damage
    type: string;
    amount: number;
  };
}

/**
 * Armor item type
 */
export interface ArmorItem extends BaseItem {
  type: ItemType.Armor;
  armorType: ArmorType;
  stats: ItemStats;
  requirements?: ItemRequirement;
  durability?: {
    current: number;
    maximum: number;
  };
  level: number;          // Item level/tier
  setId?: string;         // ID of armor set this belongs to
}

/**
 * Accessory item type
 */
export interface AccessoryItem extends BaseItem {
  type: ItemType.Accessory;
  accessoryType: AccessoryType;
  stats: ItemStats;
  requirements?: ItemRequirement;
  level: number;          // Item level/tier
  uniqueEquip?: boolean;  // Only one of this accessory can be equipped
}

/**
 * Consumable item type
 */
export interface ConsumableItem extends BaseItem {
  type: ItemType.Consumable;
  consumableType: ConsumableType;
  effect: ItemEffect;
  cooldown?: number;      // Cooldown in seconds before using again
  requirements?: ItemRequirement;
  charges?: number;       // Number of uses before depleted
  duration?: number;      // Effect duration in seconds
}

/**
 * Material item type
 */
export interface MaterialItem extends BaseItem {
  type: ItemType.Material;
  materialType: MaterialType;
  tier: number;           // Quality tier of material
  refinementLevel?: number; // Level of refinement/processing
}

/**
 * Quest item type
 */
export interface QuestItem extends BaseItem {
  type: ItemType.QuestItem;
  questId: string;        // Associated quest ID
  objective?: string;     // Associated objective ID
}

/**
 * Union type for all specific item types
 */
export type GameItem = 
  | WeaponItem 
  | ArmorItem 
  | AccessoryItem 
  | ConsumableItem 
  | MaterialItem 
  | QuestItem 
  | BaseItem;

/**
 * Item drop specification for loot tables
 */
export interface ItemDrop {
  itemId: string;
  chance: number;         // 0-1 probability
  minQuantity: number;
  maxQuantity: number;
  condition?: {           // Optional condition for drop
    type: string;
    value: any;
  };
}

/**
 * Crafting recipe requirements
 */
export interface CraftingRecipe {
  resultItemId: string;
  resultQuantity: number;
  materials: {
    itemId: string;
    quantity: number;
  }[];
  skillRequirements?: {
    skillId: string;
    level: number;
  }[];
  stationRequired?: string;
  craftingTime: number;   // Time in seconds to craft
  failChance?: number;    // Chance of failing (0-1)
}
