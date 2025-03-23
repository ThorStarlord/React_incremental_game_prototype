/**
 * Player health and energy actions
 * 
 * Actions for managing player health, energy, and related states
 */
import { 
  HealthModificationPayload, 
  EnergyModificationPayload, 
  RestPayload, 
  PLAYER_ACTIONS, 
  PlayerAction,
  ModificationReason
} from '../../types/actions/playerActionTypes';
import { validatePositive } from './utils';

/**
 * Modify the player's current health
 * 
 * @param {number} amount - Amount to modify health by (positive or negative)
 * @param {string} [reason] - Reason for health modification
 * @returns {PlayerAction} The MODIFY_HEALTH action
 * 
 * @example
 * // Damage player for 10 health points
 * modifyHealth(-10, ModificationReason.Combat)
 */
export const modifyHealth = (amount: number, reason?: string): PlayerAction => {
  return {
    type: PLAYER_ACTIONS.MODIFY_HEALTH,
    payload: { 
      amount, 
      reason,
      timestamp: Date.now()
    } as HealthModificationPayload
  };
};

/**
 * Modify the player's current energy
 * 
 * @param {number} amount - Amount to modify energy by (positive or negative)
 * @param {string} [reason] - Reason for energy modification
 * @returns {PlayerAction} The MODIFY_ENERGY action
 * 
 * @example
 * // Restore 25 energy points
 * modifyEnergy(25, ModificationReason.Potion)
 */
export const modifyEnergy = (amount: number, reason?: string): PlayerAction => {
  return {
    type: PLAYER_ACTIONS.MODIFY_ENERGY,
    payload: { 
      amount, 
      reason,
      timestamp: Date.now()
    } as EnergyModificationPayload
  };
};

/**
 * Make the player rest to recover health and energy
 * 
 * @param {number} [duration=1] - Duration of rest in game hours
 * @param {string} [location] - Location where resting occurs
 * @returns {PlayerAction} The REST action
 * 
 * @example
 * // Rest for 8 hours at an inn
 * rest(8, "Mountain View Inn")
 */
export const rest = (duration: number = 1, location?: string): PlayerAction => {
  validatePositive(duration, 'Rest duration');
  return {
    type: PLAYER_ACTIONS.REST,
    payload: { 
      duration, 
      location,
      timestamp: Date.now()
    } as RestPayload
  };
};
