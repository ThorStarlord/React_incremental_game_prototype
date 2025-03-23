/**
 * Action Creators
 * ===============
 * 
 * This module provides factory functions for creating standardized actions
 * across different domains of the application. It serves as a centralized hub
 * for common action creation patterns and utilities.
 * 
 * @module actionCreators
 */

// Import action types from domain-specific files
import { PLAYER_ACTIONS, PlayerAction } from '../types/actions/playerActionTypes';
import { INVENTORY_ACTIONS } from '../types/actions/inventoryActionTypes';
import { SKILL_ACTIONS } from '../types/actions/skillActionTypes';
import { COMBAT_ACTIONS } from '../types/actions/combatActionTypes';
import { NOTIFICATION_ACTIONS } from '../types/actions/notificationActionTypes';
import { Action } from '../types/actions';

// Define essence actions directly since they're not exported elsewhere
const ESSENCE_ACTIONS = {
  GAIN_ESSENCE: 'essence/gain',
  SPEND_ESSENCE: 'essence/spend',
  UPGRADE_ESSENCE_RATE: 'essence/upgradeRate'
};

// Type definitions for common payloads
interface ResourcePayload {
  amount: number;
  source?: string;
  timestamp?: number;
}

interface SkillPayload {
  skillId: string;
  timestamp?: number;
}

interface ItemPayload {
  itemId: string;
  timestamp?: number;
}

interface EquipmentPayload extends ItemPayload {
  slot: string;
}

// Define a type for our action literals
type ActionLiteral = string;

/**
 * Creates a resource action (essence, gold, etc.)
 * 
 * @param type - The action type
 * @param amount - Amount to modify
 * @param source - Optional source of the change
 * @returns Properly formatted action
 */
export function createResourceAction<T extends ActionLiteral>(
  type: T,
  amount: number,
  source?: string
): { type: T, payload: ResourcePayload } {
  return {
    type,
    payload: { 
      amount,
      source,
      timestamp: Date.now()
    }
  };
}

/**
 * Creates a skill-related action
 * 
 * @param type - The action type
 * @param skillId - ID of the skill
 * @param additionalData - Any additional payload data
 * @returns Properly formatted action
 */
export function createSkillAction<T extends ActionLiteral>(
  type: T,
  skillId: string,
  additionalData?: Record<string, any>
): { type: T, payload: SkillPayload & Record<string, any> } {
  return {
    type,
    payload: {
      skillId,
      ...additionalData,
      timestamp: Date.now()
    }
  };
}

/**
 * Creates an item-related action
 * 
 * @param type - The action type
 * @param itemId - ID of the item
 * @param additionalData - Any additional payload data
 * @returns Properly formatted action
 */
export function createItemAction<T extends ActionLiteral>(
  type: T,
  itemId: string,
  additionalData?: Record<string, any>
): { type: T, payload: ItemPayload & Record<string, any> } {
  return {
    type,
    payload: {
      itemId,
      ...additionalData,
      timestamp: Date.now()
    }
  };
}

/**
 * Creates a notification action
 * 
 * @param message - Notification message
 * @param type - Notification type
 * @param duration - Display duration in ms
 * @returns ADD_NOTIFICATION action
 */
export function createNotification(
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  duration: number = 3000
): { type: typeof NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: any } {
  return {
    type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
    payload: {
      message,
      type,
      duration,
      id: Date.now(),
      timestamp: Date.now()
    }
  };
}

// Domain-specific action creators
// These should generally be moved to their respective domain files

// Essence actions
export const collectEssence = (amount: number) => 
  createResourceAction(ESSENCE_ACTIONS.GAIN_ESSENCE, amount, 'collection');

export const spendEssence = (amount: number) => 
  createResourceAction(ESSENCE_ACTIONS.SPEND_ESSENCE, amount, 'purchase');

// Player actions
export const gainExperience = (amount: number): PlayerAction => ({
  type: PLAYER_ACTIONS.UPDATE_PLAYER,
  payload: { experience: amount }
});

export const levelUp = (): PlayerAction => ({
  type: PLAYER_ACTIONS.UPDATE_PLAYER,
  payload: { 
    level: (currentLevel: number) => currentLevel + 1,
    timestamp: Date.now() 
  }
});

// Skill actions
export const learnSkill = (skillId: string) => 
  createSkillAction(SKILL_ACTIONS.LEARN_SKILL, skillId);

export const gainSkillExperience = (skillId: string, amount: number) => 
  createSkillAction(SKILL_ACTIONS.GAIN_SKILL_XP, skillId, { amount });

// Equipment actions
export const equipItem = (itemId: string, slot: string): PlayerAction => ({
  type: PLAYER_ACTIONS.EQUIP_ITEM,
  payload: { itemId, slot }
});

export const unequipItem = (slot: string): PlayerAction => ({
  type: PLAYER_ACTIONS.UNEQUIP_ITEM,
  payload: { slot }
});

// Inventory actions
export const addItemToInventory = (itemId: string, quantity: number = 1) => 
  createItemAction(INVENTORY_ACTIONS.ADD_ITEM, itemId, { quantity });

export const removeItemFromInventory = (itemId: string, quantity: number = 1) => 
  createItemAction(INVENTORY_ACTIONS.REMOVE_ITEM, itemId, { quantity });

// Export a general createAction utility
export function createAction<T extends ActionLiteral, P extends Record<string, any>>(
  type: T, 
  payload: P
): { type: T, payload: P & { timestamp?: number } } {
  return {
    type,
    payload: {
      ...payload,
      timestamp: payload.timestamp || Date.now()
    }
  };
}
