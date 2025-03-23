/**
 * Action Types Index
 * =================
 * 
 * Central hub for all action type definitions across the application.
 * This module provides:
 * 
 * 1. A unified export of all domain-specific action types
 * 2. Utility types for working with actions
 * 3. Type-safe action creation helpers
 * 
 * @module actions
 */

// Import action types from all domain-specific modules
import { PLAYER_ACTIONS, PlayerAction, PlayerActionType, TypedPlayerAction } from './playerActionTypes';
import { COMBAT_ACTIONS, CombatAction, CombatActionType, TypedCombatAction } from './combatActionTypes';
import { INVENTORY_ACTIONS, InventoryAction, InventoryActionType } from './inventoryActionTypes';
import { QUEST_ACTIONS, QuestAction, QuestActionType } from './questActionTypes';
import { NOTIFICATION_ACTIONS, NotificationAction, NotificationActionType } from './notificationActionTypes';
import { NPC_ACTIONS, NpcAction, NpcActionType } from './npcActionTypes';
import { CHARACTER_ACTIONS, CharacterAction, CharacterActionType } from './characterActionTypes';
import { TRAIT_ACTIONS, TraitAction, TraitActionType } from './traitActionTypes';
import { SKILL_ACTIONS, SkillAction, SkillActionType } from './skillActionTypes';
import { WORLD_ACTIONS, WorldAction, WorldActionType } from './worldActionTypes';
import { GAME_INIT_ACTIONS, GameInitAction, GameInitActionType } from './gameInitActionTypes';
import { ESSENCE_ACTIONS, EssenceAction, EssenceActionType } from './essenceActionTypes';
import { CRAFTING_ACTIONS, CraftingAction, CraftingActionType } from './craftingActionTypes';
import { DISCOVERY_ACTIONS, DiscoveryAction, DiscoveryActionType } from './discoveryActionTypes';
import { RESOURCE_ACTIONS, ResourceAction, ResourceActionType } from './resourceActionTypes';
import { ENVIRONMENT_ACTIONS, EnvironmentAction, EnvironmentActionType } from './environmentActionTypes';
import { TIME_ACTIONS, TimeAction, TimeActionType } from './timeActionTypes';

// Re-export all action types
export {
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
  TIME_ACTIONS,
};

// Re-export domain-specific action interfaces
export type {
  PlayerAction,
  CombatAction,
  InventoryAction,
  QuestAction,
  NotificationAction,
  NpcAction,
  CharacterAction,
  TraitAction,
  SkillAction,
  WorldAction,
  GameInitAction,
  EssenceAction,
  CraftingAction,
  DiscoveryAction,
  ResourceAction,
  EnvironmentAction,
  TimeAction,
};

// Re-export domain-specific action type unions
export type {
  PlayerActionType,
  CombatActionType,
  InventoryActionType,
  QuestActionType,
  NotificationActionType,
  NpcActionType,
  CharacterActionType,
  TraitActionType,
  SkillActionType,
  WorldActionType,
  GameInitActionType,
  EssenceActionType,
  CraftingActionType,
  DiscoveryActionType,
  ResourceActionType,
  EnvironmentActionType,
  TimeActionType,
};

// Re-export typed action unions when available
export type {
  TypedPlayerAction,
  TypedCombatAction,
};

/**
 * Comprehensive union of all action types across the application
 */
export type ActionType =
  | PlayerActionType
  | CombatActionType
  | InventoryActionType
  | QuestActionType
  | NotificationActionType
  | NpcActionType
  | CharacterActionType
  | TraitActionType
  | SkillActionType
  | WorldActionType
  | GameInitActionType
  | EssenceActionType
  | CraftingActionType
  | DiscoveryActionType
  | ResourceActionType
  | EnvironmentActionType
  | TimeActionType;

/**
 * Generic action interface for the entire application
 * 
 * @template T - The action type
 * @template P - The payload type
 */
export interface Action<T extends ActionType, P = any> {
  type: T;
  payload: P;
}

/**
 * Type for actions with no payload
 */
export type SimpleAction<T extends ActionType> = Action<T, void>;

/**
 * Union of all possible actions in the application
 */
export type AnyAction = Action<ActionType>;

/**
 * Type guard to check if an action is of a specific type
 * 
 * @param action - The action to check
 * @param type - The action type to test for
 * @returns Whether the action matches the specified type
 * 
 * @example
 * if (isActionOfType(action, PLAYER_ACTIONS.MODIFY_HEALTH)) {
 *   // TypeScript now knows this is a health modification action
 *   const amount = action.payload.amount;
 * }
 */
export function isActionOfType<T extends ActionType>(action: AnyAction, type: T): action is Action<T> {
  return action.type === type;
}

/**
 * Helper to create a typed action
 * 
 * @param type - The action type
 * @param payload - The action payload
 * @returns A properly typed action object
 * 
 * @example
 * const action = createAction(PLAYER_ACTIONS.MODIFY_HEALTH, { amount: 10 });
 */
export function createAction<T extends ActionType, P>(type: T, payload: P): Action<T, P> {
  return { type, payload };
}
