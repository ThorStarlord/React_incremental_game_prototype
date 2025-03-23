/**
 * Type definitions for equipment-related game state
 */

// Import types from inventory since equipment and items are closely related
import { 
  GameItem, 
  ItemEffect, 
  ItemStats 
} from './InventoryGameStateTypes';

// Re-export these types for convenience
export type { 
  GameItem,
  ItemEffect, 
  ItemStats 
};

/**
 * Equipment slots for the player
 */
export const EQUIPMENT_SLOTS = [
  'weapon', 'offhand', 'head', 'body', 
  'hands', 'legs', 'feet', 'accessory1', 'accessory2'
] as const;

export type EquipmentSlot = typeof EQUIPMENT_SLOTS[number];

/**
 * Equipment state
 */
export interface EquipmentState {
  weapon: GameItem | null;
  offhand: GameItem | null;
  head: GameItem | null;
  body: GameItem | null;
  hands: GameItem | null;
  legs: GameItem | null;
  feet: GameItem | null;
  accessory1: GameItem | null;
  accessory2: GameItem | null;
  [key: string]: GameItem | null; // Allow for additional equipment slots
}

/**
 * Equipment bonuses
 */
export interface EquipmentBonuses {
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
  [key: string]: number | undefined; // Allow for additional bonuses
}

/**
 * Equipment requirements
 */
export interface EquipmentRequirements {
  level?: number;
  strength?: number;
  intelligence?: number;
  dexterity?: number;
  vitality?: number;
  skillRequirements?: {
    skillName: string;
    level: number;
  }[];
  questRequirements?: string[];
  [key: string]: number | undefined | any[]; // Improve this typing
}

/**
 * Item-slot compatibility
 */
export interface ItemSlotCompatibility {
  itemType: string;
  compatibleSlots: EquipmentSlot[];
}

/**
 * Derived equipment stats
 */
export interface DerivedEquipmentStats {
  totalPhysicalDamage: number;
  totalArmor: number;
  // ...other derived stats
}
