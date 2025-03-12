/**
 * Type definitions for game items and their properties
 */

/**
 * Item categories/types
 */
export enum ItemType {
  Weapon = 'weapon',
  Armor = 'armor',
  Consumable = 'consumable',
  Material = 'material',
  Quest = 'quest',
  Miscellaneous = 'misc'
}

/**
 * Item rarity levels
 */
export enum ItemRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary'
}

/**
 * Stats that can be modified by items
 */
export interface ItemStats {
  physicalDamage?: number;
  magicDamage?: number;
  armor?: number;
  health?: number;
  mana?: number;
  strength?: number;
  intelligence?: number;
  dexterity?: number;
  critChance?: number;
  critDamage?: number;
}

/**
 * Effects that can be applied by items (primarily consumables)
 */
export interface ItemEffect {
  type: 'heal' | 'damage' | 'buff' | 'debuff';
  target?: 'self' | 'enemy' | 'area';
  value: number;
  duration?: number;
  attribute?: string;
}

/**
 * Core game item definition - represents any item in the game
 */
export interface GameItem {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  value: number;
  rarity: ItemRarity;
  quantity: number;
  stackable: boolean;
  tradeable: boolean;
  sellable: boolean;
  stats?: ItemStats;
  effect?: ItemEffect;
  materialType?: string;
  tier?: number;
}
