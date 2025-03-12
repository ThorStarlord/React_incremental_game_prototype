/**
 * Initial state configuration for player equipment
 */

import { EquipmentState } from '../types/GameStateTypes';

/**
 * Default equipment slots that the player can use
 */
export const DEFAULT_EQUIPMENT_SLOTS = [
  'weapon',
  'offhand',
  'head',
  'body',
  'hands',
  'legs',
  'feet',
  'accessory1',
  'accessory2'
];

/**
 * Initial state for player equipment - all slots start empty
 */
const equipmentInitialState: EquipmentState = {
  weapon: null,     // Primary weapon slot
  offhand: null,    // Shield or dual-wield weapon
  head: null,       // Helmet, hat, crown, etc.
  body: null,       // Chest armor, robes, etc.
  hands: null,      // Gloves, gauntlets, etc.
  legs: null,       // Pants, greaves, etc.
  feet: null,       // Boots, shoes, etc.
  accessory1: null, // Ring, amulet, etc.
  accessory2: null  // Secondary accessory slot
};

export default equipmentInitialState;
