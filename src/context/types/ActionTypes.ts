/**
 * Action Types
 * 
 * This file now re-exports action types from the modular structure.
 * It maintains backward compatibility while offering a more organized codebase.
 */

// Import all action type constants from the modular structure
import { 
  PLAYER_ACTIONS,
  COMBAT_ACTIONS,
  INVENTORY_ACTIONS,
  QUEST_ACTIONS,
  NOTIFICATION_ACTIONS,
  NPC_ACTIONS,
  CHARACTER_ACTIONS,
  TRAIT_ACTIONS,
  SKILL_ACTIONS,
  WORLD_ACTIONS,
  GAME_INIT_ACTIONS,
  ESSENCE_ACTIONS,
  CRAFTING_ACTIONS,
  DISCOVERY_ACTIONS,
  RESOURCE_ACTIONS,
  ENVIRONMENT_ACTIONS,
  TIME_ACTIONS
} from './actions';

// Export everything from the new modular structure
export * from './actions';

/**
 * Consolidated ACTION_TYPES object that combines all domain-specific action types
 * This maintains backward compatibility with code that relies on the ACTION_TYPES object
 */
export const ACTION_TYPES = {
  ...PLAYER_ACTIONS,
  ...COMBAT_ACTIONS,
  ...INVENTORY_ACTIONS,
  ...QUEST_ACTIONS,
  ...NOTIFICATION_ACTIONS,
  ...NPC_ACTIONS,
  ...CHARACTER_ACTIONS,
  ...TRAIT_ACTIONS,
  ...SKILL_ACTIONS,
  ...WORLD_ACTIONS,
  ...GAME_INIT_ACTIONS,
  ...ESSENCE_ACTIONS,
  ...CRAFTING_ACTIONS,
  ...DISCOVERY_ACTIONS,
  ...RESOURCE_ACTIONS,
  ...ENVIRONMENT_ACTIONS,
  ...TIME_ACTIONS
};
