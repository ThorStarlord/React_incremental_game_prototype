/**
 * Player Actions
 * ==============
 * 
 * This file contains all action creators related to the player character in the
 * incremental RPG. These actions handle player attributes, traits, skills,
 * and other player-specific state changes.
 * 
 * @module playerActions
 */

import { 
  PlayerState, 
  PlayerAttributes,
  PlayerStats,
  StatusEffect,
  Skill,
  TraitEffect,
  Trait
} from '../types/PlayerGameStateTypes';
import { PlayerInitialState, DefaultPlayerAttributes } from '../initialStates/PlayerInitialState';

// Import the action types from the reducer to stay in sync
import { PLAYER_ACTIONS, PlayerAction } from '../reducers/playerReducer';

// Define enums for action-related string literals to improve type safety
export enum ModificationReason {
  Combat = 'combat',
  Potion = 'potion',
  Skill = 'skill',
  Resting = 'resting',
  StatusEffect = 'status_effect',
  Environmental = 'environmental',
  Quest = 'quest',
  Item = 'item'
}

// Define interfaces for action payloads with consistent naming pattern
interface PlayerUpdatePayload extends Partial<PlayerState> {
  [key: string]: unknown; // More type-safe than 'any'
  timestamp?: number;
}

interface HealthModificationPayload {
  amount: number;
  reason?: string;
  timestamp: number;
}

interface EnergyModificationPayload {
  amount: number;
  reason?: string;
  timestamp: number;
}

interface TraitPayload {
  traitId: string;
  timestamp: number;
}

interface EquipTraitPayload extends TraitPayload {
  slotIndex?: number;
}

interface AttributeAllocationPayload {
  attributeName: string;
  amount: number;
  timestamp: number;
}

interface RestPayload {
  duration: number;
  location?: string;
  timestamp: number;
}

interface SkillPayload {
  skillId: string;
  timestamp: number;
}

interface SkillUpgradePayload extends SkillPayload {
  level: number;
  cost: number;
}

interface ActiveCharacterPayload {
  characterId: string;
  timestamp: number;
}

// Validation functions
const validateNonNegative = (value: number, name: string): void => {
  if (value < 0) {
    console.warn(`Warning: ${name} should not be negative. Got ${value}`);
  }
};

const validatePositive = (value: number, name: string): void => {
  if (value <= 0) {
    console.warn(`Warning: ${name} should be positive. Got ${value}`);
  }
};

const validateString = (value: string | undefined, name: string): void => {
  if (!value || value.trim() === '') {
    console.warn(`Warning: ${name} should be a non-empty string.`);
  }
};

// Generic action creator factory to reduce repetition
function createActionWithTimestamp<T, P extends { timestamp?: number }>(
  type: T, 
  payloadFn: (args: any[]) => Omit<P, 'timestamp'>
): (...args: any[]) => { type: T, payload: P } {
  return (...args: any[]) => ({
    type,
    payload: {
      ...payloadFn(args),
      timestamp: Date.now()
    } as P
  });
}

/**
 * ==============================
 * PLAYER STATE ACTIONS
 * ==============================
 */

/**
 * Update player properties
 * 
 * @param {PlayerUpdatePayload} updates - Object containing properties to update
 * @returns {PlayerAction} The UPDATE_PLAYER action
 * 
 * @example
 * // Update player name
 * updatePlayer({ name: "Sir Galahad" })
 */
export const updatePlayer = (updates: PlayerUpdatePayload): PlayerAction => ({
  type: PLAYER_ACTIONS.UPDATE_PLAYER,
  payload: {
    ...updates,
    timestamp: updates.timestamp || Date.now()
  }
});

/**
 * Set the player's name
 * 
 * @param {string} name - New name for the player
 * @returns {PlayerAction} The SET_NAME action
 * 
 * @example
 * // Change character name
 * setPlayerName("Elrond the Wise")
 */
export const setPlayerName = (name: string): PlayerAction => {
  validateString(name, 'Player name');
  return {
    type: PLAYER_ACTIONS.SET_NAME,
    payload: name
  };
};

/**
 * Reset the player to initial state
 * 
 * @param {boolean} [keepName=false] - Whether to keep the player's name after reset
 * @returns {PlayerAction} The RESET_PLAYER action
 * 
 * @example
 * // Complete reset
 * resetPlayer()
 * 
 * @example
 * // Reset but keep name
 * resetPlayer(true)
 */
export const resetPlayer = (keepName: boolean = false): PlayerAction => ({
  type: PLAYER_ACTIONS.RESET_PLAYER,
  payload: { keepName }
});

/**
 * ==============================
 * HEALTH AND ENERGY ACTIONS
 * ==============================
 */

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

/**
 * ==============================
 * TRAIT RELATED ACTIONS
 * ==============================
 */

/**
 * Add a new trait to the player's acquired traits
 * 
 * @param {string} traitId - ID of the trait to acquire
 * @returns {PlayerAction} The ADD_TRAIT action
 * 
 * @example
 * // Acquire a trait
 * acquireTrait("trait_firestarter")
 */
export const acquireTrait = (traitId: string): PlayerAction => {
  validateString(traitId, 'Trait ID');
  return {
    type: PLAYER_ACTIONS.ADD_TRAIT,
    payload: traitId
  };
};

/**
 * Equip a trait in one of the player's trait slots
 * 
 * @param {string} traitId - ID of the trait to equip
 * @param {number} [slotIndex] - Slot index to equip the trait in (auto-assigns if omitted)
 * @returns {PlayerAction} The EQUIP_TRAIT action
 * 
 * @example
 * // Equip a trait in a specific slot
 * equipTrait("trait_quickthinking", 2)
 */
export const equipTrait = (traitId: string, slotIndex?: number): PlayerAction => {
  validateString(traitId, 'Trait ID');
  if (slotIndex !== undefined) validateNonNegative(slotIndex, 'Slot index');
  
  return {
    type: PLAYER_ACTIONS.EQUIP_TRAIT,
    payload: { 
      traitId, 
      slotIndex,
      timestamp: Date.now()
    } as EquipTraitPayload
  };
};

/**
 * Remove a trait from the player's equipped traits
 * 
 * @param {string} traitId - ID of the trait to unequip
 * @returns {PlayerAction} The UNEQUIP_TRAIT action
 * 
 * @example
 * // Unequip a trait
 * unequipTrait("trait_quickthinking")
 */
export const unequipTrait = (traitId: string): PlayerAction => {
  validateString(traitId, 'Trait ID');
  return {
    type: PLAYER_ACTIONS.UNEQUIP_TRAIT,
    payload: { 
      traitId,
      timestamp: Date.now()
    } as TraitPayload
  };
};

/**
 * ==============================
 * ATTRIBUTE AND SKILL ACTIONS
 * ==============================
 */

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

/**
 * Update a player's skill with additional experience
 * 
 * @param {string} skillId - ID of the skill to update
 * @param {number} experience - Amount of experience to add
 * @returns {PlayerAction} The UPDATE_SKILL action
 * 
 * @example
 * // Add 150 experience to the archery skill
 * updateSkill("archery", 150)
 */
export const updateSkill = (skillId: string, experience: number): PlayerAction => {
  validateString(skillId, 'Skill ID');
  validatePositive(experience, 'Skill experience');
  
  return {
    type: PLAYER_ACTIONS.UPDATE_SKILL,
    payload: { skillId, experience }
  };
};

/**
 * Learn a new skill
 * 
 * @param {string} skillId - ID of the skill to learn
 * @returns {PlayerAction} The LEARN_SKILL action
 * 
 * @example
 * // Learn fireball skill
 * learnSkill("fireball")
 */
export const learnSkill = (skillId: string): PlayerAction => {
  validateString(skillId, 'Skill ID');
  return {
    type: PLAYER_ACTIONS.LEARN_SKILL,
    payload: { 
      skillId,
      timestamp: Date.now() 
    } as SkillPayload
  };
};

/**
 * Upgrade an existing skill to a higher level
 * 
 * @param {string} skillId - ID of the skill to upgrade
 * @param {number} level - New level for the skill
 * @param {number} cost - Cost of the upgrade
 * @returns {PlayerAction} The UPGRADE_SKILL action
 * 
 * @example
 * // Upgrade lockpicking to level 3
 * upgradeSkill("lockpicking", 3, 500)
 */
export const upgradeSkill = (skillId: string, level: number, cost: number): PlayerAction => {
  validateString(skillId, 'Skill ID');
  validatePositive(level, 'Skill level');
  validateNonNegative(cost, 'Upgrade cost');
  
  return {
    type: PLAYER_ACTIONS.UPGRADE_SKILL,
    payload: { 
      skillId, 
      level, 
      cost,
      timestamp: Date.now()
    } as SkillUpgradePayload
  };
};

/**
 * ==============================
 * CHARACTER MANAGEMENT ACTIONS
 * ==============================
 */

/**
 * Set the currently active character in a multi-character party
 * 
 * @param {string} characterId - ID of the character to make active
 * @returns {PlayerAction} The SET_ACTIVE_CHARACTER action
 * 
 * @example
 * // Switch to another character in party
 * setActiveCharacter("char-042")
 */
export const setActiveCharacter = (characterId: string): PlayerAction => {
  validateString(characterId, 'Character ID');
  return {
    type: PLAYER_ACTIONS.SET_ACTIVE_CHARACTER,
    payload: { 
      characterId,
      timestamp: Date.now() 
    } as ActiveCharacterPayload
  };
};

/**
 * Update the player's total play time
 * 
 * @param {number} seconds - Seconds to add to play time
 * @returns {PlayerAction} The UPDATE_TOTAL_PLAYTIME action
 * 
 * @example
 * // Add 300 seconds (5 minutes) of playtime
 * updatePlayTime(300)
 */
export const updatePlayTime = (seconds: number): PlayerAction => {
  validatePositive(seconds, 'Play time seconds');
  return {
    type: PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME,
    payload: seconds
  };
};

// Export validation functions for use elsewhere
export const playerActionValidation = {
  validateNonNegative,
  validatePositive,
  validateString
};
