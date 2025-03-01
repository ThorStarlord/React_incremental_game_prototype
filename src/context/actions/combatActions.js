/**
 * Combat Actions
 * ==============
 * 
 * This file contains all action creators related to the combat system in the
 * incremental RPG. These actions handle starting and ending combat, attacking,
 * using abilities, handling damage, and managing combat rewards.
 * 
 * @module combatActions
 */

// Action Types
export const START_COMBAT = 'START_COMBAT';
export const END_COMBAT = 'END_COMBAT';
export const PERFORM_ATTACK = 'PERFORM_ATTACK';
export const USE_ABILITY = 'USE_ABILITY';
export const TAKE_DAMAGE = 'TAKE_DAMAGE';
export const HEAL_CHARACTER = 'HEAL_CHARACTER';
export const APPLY_STATUS_EFFECT = 'APPLY_STATUS_EFFECT';
export const REMOVE_STATUS_EFFECT = 'REMOVE_STATUS_EFFECT';
export const RETREAT_FROM_COMBAT = 'RETREAT_FROM_COMBAT';
export const COLLECT_COMBAT_REWARDS = 'COLLECT_COMBAT_REWARDS';
export const ENEMY_ACTION = 'ENEMY_ACTION';
export const UPDATE_COMBAT_STATE = 'UPDATE_COMBAT_STATE';

/**
 * Start a new combat encounter
 * 
 * @param {Object[]} enemies - Array of enemy objects to fight
 * @param {string} location - Location ID where combat takes place
 * @param {boolean} ambush - Whether this is a surprise attack (true if enemies get first move)
 * @returns {Object} The START_COMBAT action
 */
export const startCombat = (enemies, location, ambush = false) => ({
  type: START_COMBAT,
  payload: {
    enemies,
    location,
    ambush,
    startTime: Date.now(),
    turn: ambush ? 'enemy' : 'player',
    round: 1
  }
});

/**
 * End the current combat encounter
 * 
 * @param {string} result - The result of combat ("victory", "defeat", "retreat")
 * @param {Object} statistics - Combat statistics (damage dealt, turns taken, etc.)
 * @returns {Object} The END_COMBAT action
 */
export const endCombat = (result, statistics = {}) => ({
  type: END_COMBAT,
  payload: {
    result,
    statistics,
    endTime: Date.now()
  }
});

/**
 * Perform a basic attack against a target
 * 
 * @param {string} attackerId - ID of the attacker (player character or enemy)
 * @param {string} targetId - ID of the attack target
 * @param {string} attackType - Type of attack ("melee", "ranged", etc.)
 * @param {Object} modifiers - Any modifiers to the attack
 * @returns {Object} The PERFORM_ATTACK action
 */
export const performAttack = (attackerId, targetId, attackType = "melee", modifiers = {}) => ({
  type: PERFORM_ATTACK,
  payload: {
    attackerId,
    targetId,
    attackType,
    modifiers,
    timestamp: Date.now()
  }
});

/**
 * Use a special ability in combat
 * 
 * @param {string} characterId - ID of character using the ability
 * @param {string} abilityId - ID of the ability being used
 * @param {string|string[]} targetIds - ID or array of IDs of targets
 * @param {Object} options - Additional options for ability usage
 * @returns {Object} The USE_ABILITY action
 */
export const useAbility = (characterId, abilityId, targetIds, options = {}) => ({
  type: USE_ABILITY,
  payload: {
    characterId,
    abilityId,
    targetIds: Array.isArray(targetIds) ? targetIds : [targetIds],
    options,
    timestamp: Date.now()
  }
});

/**
 * Apply damage to a character
 * 
 * @param {string} targetId - ID of character taking damage
 * @param {number} amount - Amount of damage to apply
 * @param {string} damageType - Type of damage ("physical", "fire", "magic", etc.)
 * @param {string} sourceId - ID of damage source (character, trap, etc.)
 * @returns {Object} The TAKE_DAMAGE action
 */
export const takeDamage = (targetId, amount, damageType = "physical", sourceId = null) => ({
  type: TAKE_DAMAGE,
  payload: {
    targetId,
    amount,
    damageType,
    sourceId,
    timestamp: Date.now()
  }
});

/**
 * Heal a character for a specified amount
 * 
 * @param {string} targetId - ID of character to heal
 * @param {number} amount - Amount of healing to apply
 * @param {string} healType - Type of healing ("potion", "spell", "natural", etc.)
 * @param {string} sourceId - ID of healing source (character, item, etc.)
 * @returns {Object} The HEAL_CHARACTER action
 */
export const healCharacter = (targetId, amount, healType = "potion", sourceId = null) => ({
  type: HEAL_CHARACTER,
  payload: {
    targetId,
    amount,
    healType,
    sourceId,
    timestamp: Date.now()
  }
});

/**
 * Apply a status effect to a character
 * 
 * @param {string} targetId - ID of character receiving the status effect
 * @param {string} effectId - ID of the status effect
 * @param {number} duration - Duration in rounds or turns
 * @param {Object} effectData - Additional data for the effect (strength, etc.)
 * @param {string} sourceId - ID of character or object causing the effect
 * @returns {Object} The APPLY_STATUS_EFFECT action
 */
export const applyStatusEffect = (targetId, effectId, duration, effectData = {}, sourceId = null) => ({
  type: APPLY_STATUS_EFFECT,
  payload: {
    targetId,
    effectId,
    duration,
    effectData,
    sourceId,
    timestamp: Date.now()
  }
});

/**
 * Remove a status effect from a character
 * 
 * @param {string} targetId - ID of character with the status effect
 * @param {string} effectId - ID of the status effect to remove
 * @param {string} reason - Reason for removal ("expired", "dispelled", "immunized", etc.)
 * @returns {Object} The REMOVE_STATUS_EFFECT action
 */
export const removeStatusEffect = (targetId, effectId, reason = "expired") => ({
  type: REMOVE_STATUS_EFFECT,
  payload: {
    targetId,
    effectId,
    reason,
    timestamp: Date.now()
  }
});

/**
 * Retreat from the current combat encounter
 * 
 * @param {boolean} successful - Whether the retreat attempt was successful
 * @param {number} penaltyPercent - Any resource penalty for retreating
 * @returns {Object} The RETREAT_FROM_COMBAT action
 */
export const retreatFromCombat = (successful = true, penaltyPercent = 0) => ({
  type: RETREAT_FROM_COMBAT,
  payload: {
    successful,
    penaltyPercent,
    timestamp: Date.now()
  }
});

/**
 * Collect rewards after successful combat
 * 
 * @param {Object} experience - Experience points gained
 * @param {Object} items - Items looted
 * @param {Object} currency - Currency gained
 * @param {Object} reputation - Reputation changes with factions
 * @returns {Object} The COLLECT_COMBAT_REWARDS action
 */
export const collectCombatRewards = (experience = 0, items = [], currency = 0, reputation = {}) => ({
  type: COLLECT_COMBAT_REWARDS,
  payload: {
    experience,
    items,
    currency,
    reputation,
    timestamp: Date.now()
  }
});

/**
 * Process enemy AI actions during their turn
 * 
 * @param {string} enemyId - ID of the enemy taking action
 * @param {string} actionType - Type of action ("attack", "ability", "heal", etc.)
 * @param {Object} actionData - Data specific to the action type
 * @returns {Object} The ENEMY_ACTION action
 */
export const enemyAction = (enemyId, actionType, actionData = {}) => ({
  type: ENEMY_ACTION,
  payload: {
    enemyId,
    actionType,
    actionData,
    timestamp: Date.now()
  }
});

/**
 * Update the current state of combat (turn transitions, etc.)
 * 
 * @param {Object} updates - Object containing combat state updates
 * @returns {Object} The UPDATE_COMBAT_STATE action
 */
export const updateCombatState = (updates = {}) => ({
  type: UPDATE_COMBAT_STATE,
  payload: {
    ...updates,
    timestamp: Date.now()
  }
});
