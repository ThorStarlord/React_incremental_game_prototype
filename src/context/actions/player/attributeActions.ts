/**
 * Player attribute actions
 * 
 * Actions for managing player attributes like strength, dexterity, etc.
 */
import { 
  AttributeAllocationPayload, 
  PLAYER_ACTIONS, 
  PlayerAction
} from '../../types/playerActionTypes';
import { validateString, validatePositive } from './utils';
import { PlayerAttributes } from '../../types/PlayerGameStateTypes';

/**
 * Allocate attribute points to a specific attribute
 * 
 * @param {string} attributeName - Name of the attribute to allocate points to
 * @param {number} amount - Number of points to allocate
 * @returns {PlayerAction} The ALLOCATE_ATTRIBUTE action
 * 
 * @example
 * // Allocate 3 points to strength
 * allocateAttribute("strength", 3)
 */
export const allocateAttribute = (attributeName: string, amount: number): PlayerAction => {
  validateString(attributeName, 'Attribute name');
  validatePositive(amount, 'Allocation amount');
  
  return {
    type: PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE,
    payload: { 
      attributeName, 
      amount,
      timestamp: Date.now()
    } as AttributeAllocationPayload
  };
};

/**
 * Add attribute points to the player's pool
 * 
 * @param {number} points - Number of points to add
 * @returns {PlayerAction} The ADD_ATTRIBUTE_POINTS action
 * 
 * @example
 * // Add 3 attribute points
 * addAttributePoints(3)
 */
export const addAttributePoints = (points: number): PlayerAction => {
  validatePositive(points, 'Attribute points');
  return {
    type: PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS,
    payload: points
  };
};

/**
 * Spend attribute points on a specific attribute
 * 
 * @param {string} attribute - Attribute to improve
 * @param {number} points - Number of points to spend
 * @returns {PlayerAction} The SPEND_ATTRIBUTE_POINTS action
 * 
 * @example
 * // Spend 2 points on dexterity
 * spendAttributePoints("dexterity", 2)
 */
export const spendAttributePoints = (
  attribute: keyof PlayerAttributes, 
  points: number
): PlayerAction => {
  validateString(attribute as string, 'Attribute');
  validatePositive(points, 'Points to spend');
  
  return {
    type: PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS,
    payload: { attribute, points }
  };
};
