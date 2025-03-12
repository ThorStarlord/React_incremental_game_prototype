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
 * Equipment slot types
 */
export type EquipmentSlot = 
  | 'weapon'
  | 'offhand'
  | 'head'
  | 'body'
  | 'hands'
  | 'legs'
  | 'feet'
  | 'accessory1'
  | 'accessory2';

/**
 * Equipment slots for the player
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
 * Aggregated equipment bonuses
 */
export interface EquipmentBonuses {
  physicalDamage: number;
  magicalDamage: number;
  armor: number;
  healthBonus: number;
  manaBonus: number;
  strengthBonus: number;
  intelligenceBonus: number;
  dexterityBonus: number;
  vitalityBonus: number;
  luckBonus: number;
  [key: string]: number; // Allow for additional bonuses
}

/**
 * Equipment requirements to wear or use an item
 */
export interface EquipmentRequirements {
  level?: number;
  strength?: number;
  intelligence?: number;
  dexterity?: number;
  skillRequirements?: {
    skillName: string;
    level: number;
  }[];
  questRequirements?: string[];
  [key: string]: any; // Allow for additional requirements
}
