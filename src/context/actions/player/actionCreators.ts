/**
 * Player Action Creators
 * ======================
 * 
 * Factory functions for creating standardized player actions
 */

import { PlayerActionType, PlayerAction } from '../../types/actions/playerActionTypes';
import { getTimestamp } from './utils';

/**
 * Creates a generic player action with timestamp
 * 
 * @param type - The action type
 * @param payload - The action payload
 * @returns A properly formatted player action
 */
export function createActionWithTimestamp<T extends PlayerActionType, P>(
  type: T, 
  payload: P
): PlayerAction {
  return {
    type,
    payload: {
      ...payload,
      timestamp: Date.now()
    }
  };
}

/**
 * Creates a player action
 * 
 * @param type - The action type
 * @param payload - The action payload
 * @returns A player action object
 */
export function createPlayerAction<T extends PlayerActionType, P>(
  type: T, 
  payload: P
): PlayerAction {
  return { type, payload };
}

/**
 * Creates a resource modification action (health, energy, etc.)
 * 
 * @param type - The action type
 * @param amount - Amount to modify
 * @param reason - Optional reason for the modification
 * @returns A properly formatted resource action
 */
export function createResourceAction<T extends PlayerActionType>(
  type: T,
  amount: number,
  reason?: string
): PlayerAction {
  return {
    type,
    payload: { 
      amount,
      reason,
      timestamp: Date.now()
    }
  };
}
