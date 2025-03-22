/**
 * Action Types Index
 * 
 * This file re-exports all action types from their respective modules to maintain
 * backward compatibility while providing a more modular structure.
 */

// Import all domain-specific action types first
import { PLAYER_ACTIONS } from './playerActions';
import { INVENTORY_ACTIONS } from './inventoryActions';
import { ESSENCE_ACTIONS } from './essenceActions';
import { COMBAT_ACTIONS } from './combatActions';
import { CRAFTING_ACTIONS } from './craftingActions';
import { QUEST_ACTIONS } from './questActions';
import { TRAIT_ACTIONS } from './traitActions';
import { SKILL_ACTIONS } from './skillActions';
import { WORLD_ACTIONS } from './worldActions';
import { TIME_ACTIONS } from './timeActions';
import { DISCOVERY_ACTIONS } from './discoveryActions';
import { RESOURCE_ACTIONS } from './resourceActions';
import { SETTINGS_ACTIONS } from './settingsActions';
import { GAME_INIT_ACTIONS } from './gameInitActions';
import { CHARACTER_ACTIONS } from './characterActions';
import { NPC_ACTIONS } from './npcActions';
import { NOTIFICATION_ACTIONS } from './notificationActions';
import { ENCOUNTER_ACTIONS } from './encounterActions';

// Re-export all domain-specific action types
export * from './playerActions';
export * from './inventoryActions';
export * from './essenceActions';
export * from './combatActions';
export * from './craftingActions';
export * from './questActions';
export * from './traitActions';
export * from './skillActions';
export * from './worldActions';
export * from './timeActions';
export * from './discoveryActions';
export * from './resourceActions';
export * from './settingsActions';
export * from './gameInitActions';
export * from './characterActions';
export * from './npcActions';
export * from './notificationActions';
export * from './encounterActions';

// Re-export action interfaces
export * from './actionInterfaces';

/**
 * Combine all action types into a single export for convenience
 */
export const ACTION_TYPES = {
  ...PLAYER_ACTIONS,
  ...INVENTORY_ACTIONS,
  ...ESSENCE_ACTIONS,
  ...COMBAT_ACTIONS,
  ...CRAFTING_ACTIONS,
  ...QUEST_ACTIONS,
  ...TRAIT_ACTIONS,
  ...SKILL_ACTIONS,
  ...WORLD_ACTIONS,
  ...TIME_ACTIONS,
  ...DISCOVERY_ACTIONS,
  ...RESOURCE_ACTIONS,
  ...SETTINGS_ACTIONS,
  ...GAME_INIT_ACTIONS,
  ...CHARACTER_ACTIONS,
  ...NPC_ACTIONS,
  ...NOTIFICATION_ACTIONS,
  ...ENCOUNTER_ACTIONS
};

/**
 * Create a union type of all action types
 */
export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];

/**
 * Helper function to create an action creator for a specific action type
 * 
 * @param {string} type - The action type from ACTION_TYPES
 * @returns {function} Action creator function that accepts a payload
 * 
 * @example
 * const gainExp = createAction(ACTION_TYPES.GAIN_EXPERIENCE);
 * dispatch(gainExp({ amount: 100 }));
 */
export function createAction<P = any>(type: string) {
  return (payload?: P) => ({
    type,
    payload
  });
}

/**
 * Get all action types as an array of strings
 * Useful for debugging or dynamic action handling
 * 
 * @returns {string[]} Array of all action type strings
 */
export function getAllActionTypes(): string[] {
  return Object.values(ACTION_TYPES);
}
