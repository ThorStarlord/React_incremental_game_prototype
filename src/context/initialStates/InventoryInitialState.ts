/**
 * Initial state configuration for player inventory
 */

import { InventoryState, EquipmentState } from '../types/InventoryGameStateTypes';
import { GameItem, ItemType, ItemRarity } from '../types/ItemGameStateTypes';

/**
 * Create a game item with validation
 */
export const createGameItem = (item: Partial<GameItem>): GameItem => {
  // Validate all required fields first
  if (!item.id || !item.name || !item.type) {
    throw new Error(`Invalid item: missing required properties (id, name, type)`);
  }
  
  // Create the complete item with defaults
  const completeItem: GameItem = {
    id: item.id!,
    name: item.name!,
    type: item.type!,
    value: 0,
    rarity: ItemRarity.Common,
    description: '',
    stackable: false,
    tradeable: true,
    sellable: true,
    ...item,
    // Ensure quantity is at least 1
    quantity: item.quantity !== undefined ? Math.max(1, item.quantity) : 1
  };
  
  // Post-creation validation
  validateItemByType(completeItem);
  
  return completeItem;
};

/**
 * Validate item properties based on type
 */
const validateItemByType = (item: GameItem): void => {
  switch (item.type) {
    case ItemType.Weapon:
      if (!item.stats?.physicalDamage) {
        console.warn(`Weapon item ${item.id} is missing physical damage stats`);
      }
      break;
    case ItemType.Armor:
      if (!item.stats?.armor) {
        console.warn(`Armor item ${item.id} is missing armor stats`);
      }
      break;
    case ItemType.Consumable:
      if (!item.effect) {
        console.warn(`Consumable item ${item.id} is missing effect properties`);
      }
      break;
    case ItemType.Material:
      if (!item.materialType) {
        console.warn(`Material item ${item.id} is missing materialType property`);
      }
      break;
  }

  // Validate rarity
  if (item.rarity && !Object.values(ItemRarity).includes(item.rarity)) {
    console.warn(`Item ${item.id} has invalid rarity: ${item.rarity}`);
  }

  // Validate numeric values are not negative
  if (item.value !== undefined && item.value < 0) {
    console.warn(`Item ${item.id} has negative value: ${item.value}`);
  }
};

/**
 * Utility function to create weapons with common defaults
 */
export const createWeapon = (weapon: Partial<GameItem>): GameItem => {
  return createGameItem({
    type: ItemType.Weapon,
    stackable: false,
    ...weapon
  });
};

/**
 * Utility function to create armor with common defaults
 */
export const createArmor = (armor: Partial<GameItem>): GameItem => {
  return createGameItem({
    type: ItemType.Armor,
    stackable: false,
    ...armor
  });
};

/**
 * Utility function to create consumables with common defaults
 */
export const createConsumable = (consumable: Partial<GameItem>): GameItem => {
  return createGameItem({
    type: ItemType.Consumable,
    stackable: true,
    ...consumable
  });
};

/**
 * Utility function to create materials with common defaults
 */
export const createMaterial = (material: Partial<GameItem>): GameItem => {
  return createGameItem({
    type: ItemType.Material,
    stackable: true,
    ...material
  });
};

/**
 * Starting weapons for new players
 */
export const STARTING_WEAPONS: GameItem[] = [
  createWeapon({
    id: 'wooden_sword',
    name: 'Wooden Sword',
    stats: { physicalDamage: 3 },
    quantity: 1,
    value: 15,
    rarity: ItemRarity.Common,
    description: 'A simple training sword made of wood. Better than nothing.'
  })
];

/**
 * Starting armor for new players
 */
export const STARTING_ARMOR: GameItem[] = [
  createArmor({
    id: 'leather_vest',
    name: 'Leather Vest',
    stats: { armor: 5 },
    quantity: 1,
    value: 20,
    rarity: ItemRarity.Common,
    description: 'A basic vest made of leather offering minimal protection.'
  })
];

/**
 * Starting consumables for new players
 */
export const STARTING_CONSUMABLES: GameItem[] = [
  createConsumable({
    id: 'health_potion_minor',
    name: 'Minor Health Potion',
    effect: { type: 'heal', value: 25 },
    quantity: 3,
    value: 10,
    rarity: ItemRarity.Common,
    description: 'A small vial containing a red liquid that restores a small amount of health.'
  })
];

/**
 * Starting materials for new players
 */
export const STARTING_MATERIALS: GameItem[] = [
  createMaterial({
    id: 'leather_scraps',
    name: 'Leather Scraps',
    materialType: 'leather',
    tier: 1,
    quantity: 5,
    value: 2,
    rarity: ItemRarity.Common,
    description: 'Small pieces of leather that can be used for basic crafting.'
  })
];

/**
 * Initial inventory capacity for new players
 */
export const INITIAL_CAPACITY = 20;

/**
 * Initial equipment setup (all empty)
 */
export const initialEquipment: EquipmentState = {
  weapon: null,
  offhand: null,
  head: null,
  body: null,
  hands: null,
  legs: null,
  feet: null,
  accessory1: null,
  accessory2: null
};

/**
 * Initial state for player inventory
 */
const inventoryInitialState: InventoryState = {
  capacity: INITIAL_CAPACITY,
  items: [...STARTING_WEAPONS, ...STARTING_ARMOR, ...STARTING_CONSUMABLES, ...STARTING_MATERIALS],
  gold: 0, // Starting with no gold
  equipment: initialEquipment,
  quickSlots: [null, null, null, null] // Added quick slots
};

export default inventoryInitialState;
