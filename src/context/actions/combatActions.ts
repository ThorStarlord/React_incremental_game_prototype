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

// Common Action interface
interface Action<T, P> {
  type: T;
  payload: P;
}

// Enemy interface
interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  stats?: Record<string, number>;
  [key: string]: any;
}

// Combat Statistics interface
interface CombatStatistics {
  damageDealt?: number;
  damageTaken?: number;
  turnsElapsed?: number;
  criticalHits?: number;
  abilitiesUsed?: number;
  [key: string]: any;
}

// Ability option interface
interface AbilityOptions {
  powerModifier?: number;
  ignoreDefense?: boolean;
  areaOfEffect?: boolean;
  [key: string]: any;
}

// Status effect data interface
interface EffectData {
  strength?: number;
  tickDamage?: number;
  statModifiers?: Record<string, number>;
  [key: string]: any;
}

// Combat reward items interface
interface RewardItem {
  id: string;
  name: string;
  type: string;
  rarity?: string;
  [key: string]: any;
}

// Reputation changes interface
interface ReputationChanges {
  [factionId: string]: number;
}

// Enemy action data interface
interface EnemyActionData {
  targetId?: string;
  abilityId?: string;
  damage?: number;
  [key: string]: any;
}

// Action payload interfaces
interface StartCombatPayload {
  enemies: Enemy[];
  location: string;
  ambush: boolean;
  startTime: number;
  turn: 'player' | 'enemy';
  round: number;
}

interface EndCombatPayload {
  result: 'victory' | 'defeat' | 'retreat';
  statistics: CombatStatistics;
  endTime: number;
}

interface PerformAttackPayload {
  attackerId: string;
  targetId: string;
  attackType: string;
  modifiers: Record<string, any>;
  timestamp: number;
}

interface UseAbilityPayload {
  characterId: string;
  abilityId: string;
  targetIds: string[];
  options: AbilityOptions;
  timestamp: number;
}

interface TakeDamagePayload {
  targetId: string;
  amount: number;
  damageType: string;
  sourceId: string | null;
  timestamp: number;
}

interface HealCharacterPayload {
  targetId: string;
  amount: number;
  healType: string;
  sourceId: string | null;
  timestamp: number;
}

interface ApplyStatusEffectPayload {
  targetId: string;
  effectId: string;
  duration: number;
  effectData: EffectData;
  sourceId: string | null;
  timestamp: number;
}

interface RemoveStatusEffectPayload {
  targetId: string;
  effectId: string;
  reason: string;
  timestamp: number;
}

interface RetreatFromCombatPayload {
  successful: boolean;
  penaltyPercent: number;
  timestamp: number;
}

interface CollectCombatRewardsPayload {
  experience: number;
  items: RewardItem[];
  currency: number;
  reputation: ReputationChanges;
  timestamp: number;
}

interface EnemyActionPayload {
  enemyId: string;
  actionType: string;
  actionData: EnemyActionData;
  timestamp: number;
}

interface UpdateCombatStatePayload {
  [key: string]: any;
  timestamp: number;
}

/**
 * Start a new combat encounter
 * 
 * @param {Enemy[]} enemies - Array of enemy objects to fight
 * @param {string} location - Location ID where combat takes place
 * @param {boolean} ambush - Whether this is a surprise attack (true if enemies get first move)
 * @returns {Object} The START_COMBAT action
 */
export const startCombat = (
  enemies: Enemy[], 
  location: string, 
  ambush: boolean = false
): Action<typeof START_COMBAT, StartCombatPayload> => ({
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
 * @param {CombatStatistics} statistics - Combat statistics (damage dealt, turns taken, etc.)
 * @returns {Object} The END_COMBAT action
 */
export const endCombat = (
  result: 'victory' | 'defeat' | 'retreat', 
  statistics: CombatStatistics = {}
): Action<typeof END_COMBAT, EndCombatPayload> => ({
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
 * @param {Record<string, any>} modifiers - Any modifiers to the attack
 * @returns {Object} The PERFORM_ATTACK action
 */
export const performAttack = (
  attackerId: string, 
  targetId: string, 
  attackType: string = "melee", 
  modifiers: Record<string, any> = {}
): Action<typeof PERFORM_ATTACK, PerformAttackPayload> => ({
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
 * @param {AbilityOptions} options - Additional options for ability usage
 * @returns {Object} The USE_ABILITY action
 */
export const useAbility = (
  characterId: string, 
  abilityId: string, 
  targetIds: string | string[], 
  options: AbilityOptions = {}
): Action<typeof USE_ABILITY, UseAbilityPayload> => ({
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
 * @param {string|null} sourceId - ID of damage source (character, trap, etc.)
 * @returns {Object} The TAKE_DAMAGE action
 */
export const takeDamage = (
  targetId: string, 
  amount: number, 
  damageType: string = "physical", 
  sourceId: string | null = null
): Action<typeof TAKE_DAMAGE, TakeDamagePayload> => ({
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
 * @param {string|null} sourceId - ID of healing source (character, item, etc.)
 * @returns {Object} The HEAL_CHARACTER action
 */
export const healCharacter = (
  targetId: string, 
  amount: number, 
  healType: string = "potion", 
  sourceId: string | null = null
): Action<typeof HEAL_CHARACTER, HealCharacterPayload> => ({
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
 * @param {EffectData} effectData - Additional data for the effect (strength, etc.)
 * @param {string|null} sourceId - ID of character or object causing the effect
 * @returns {Object} The APPLY_STATUS_EFFECT action
 */
export const applyStatusEffect = (
  targetId: string, 
  effectId: string, 
  duration: number, 
  effectData: EffectData = {}, 
  sourceId: string | null = null
): Action<typeof APPLY_STATUS_EFFECT, ApplyStatusEffectPayload> => ({
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
export const removeStatusEffect = (
  targetId: string, 
  effectId: string, 
  reason: string = "expired"
): Action<typeof REMOVE_STATUS_EFFECT, RemoveStatusEffectPayload> => ({
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
export const retreatFromCombat = (
  successful: boolean = true, 
  penaltyPercent: number = 0
): Action<typeof RETREAT_FROM_COMBAT, RetreatFromCombatPayload> => ({
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
 * @param {number} experience - Experience points gained
 * @param {RewardItem[]} items - Items looted
 * @param {number} currency - Currency gained
 * @param {ReputationChanges} reputation - Reputation changes with factions
 * @returns {Object} The COLLECT_COMBAT_REWARDS action
 */
export const collectCombatRewards = (
  experience: number = 0, 
  items: RewardItem[] = [], 
  currency: number = 0, 
  reputation: ReputationChanges = {}
): Action<typeof COLLECT_COMBAT_REWARDS, CollectCombatRewardsPayload> => ({
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
 * @param {EnemyActionData} actionData - Data specific to the action type
 * @returns {Object} The ENEMY_ACTION action
 */
export const enemyAction = (
  enemyId: string, 
  actionType: string, 
  actionData: EnemyActionData = {}
): Action<typeof ENEMY_ACTION, EnemyActionPayload> => ({
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
 * @param {Record<string, any>} updates - Object containing combat state updates
 * @returns {Object} The UPDATE_COMBAT_STATE action
 */
export const updateCombatState = (
  updates: Record<string, any> = {}
): Action<typeof UPDATE_COMBAT_STATE, UpdateCombatStatePayload> => ({
  type: UPDATE_COMBAT_STATE,
  payload: {
    ...updates,
    timestamp: Date.now()
  }
});
