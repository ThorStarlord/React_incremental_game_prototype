/**
 * Player Actions
 * ==============
 * 
 * This file contains all action creators related to the player character in the
 * incremental RPG. These actions handle player attributes, experience, leveling,
 * traits, skills, and other player-specific state changes.
 * 
 * @module playerActions
 */

// Action Types
export const PLAYER_ACTION_TYPES = {
  UPDATE_PLAYER: 'player/updatePlayer',
  GAIN_EXPERIENCE: 'player/gainExperience',
  LEVEL_UP: 'player/levelUp',
  MODIFY_HEALTH: 'player/modifyHealth',
  MODIFY_ENERGY: 'player/modifyEnergy',
  ACQUIRE_TRAIT: 'player/acquireTrait',
  EQUIP_TRAIT: 'player/equipTrait',
  UNEQUIP_TRAIT: 'player/unequipTrait',
  ALLOCATE_ATTRIBUTE: 'player/allocateAttribute',
  REST: 'player/rest',
  LEARN_SKILL: 'player/learnSkill',
  UPGRADE_SKILL: 'player/upgradeSkill',
  SET_ACTIVE_CHARACTER: 'player/setActiveCharacter',
};

// Define interfaces for action payloads
interface PlayerUpdate {
  [key: string]: any;
}

interface ExperiencePayload {
  amount: number;
  source?: string;
}

interface HealthModificationPayload {
  amount: number;
  reason?: string;
}

interface EnergyModificationPayload {
  amount: number;
  reason?: string;
}

interface TraitPayload {
  traitId: string;
}

interface EquipTraitPayload extends TraitPayload {
  slotIndex?: number;
}

interface AttributeAllocationPayload {
  attributeName: string;
  amount: number;
}

interface RestPayload {
  duration: number;
  location?: string;
}

interface SkillPayload {
  skillId: string;
}

interface SkillUpgradePayload extends SkillPayload {
  level: number;
  cost: number;
}

interface ActiveCharacterPayload {
  characterId: string;
}

/**
 * Update player properties
 * 
 * @param {PlayerUpdate} updates - Object containing properties to update
 * @returns {Object} The UPDATE_PLAYER action
 */
export const updatePlayer = (updates: PlayerUpdate) => ({
  type: PLAYER_ACTION_TYPES.UPDATE_PLAYER,
  payload: updates
});

/**
 * Award experience points to the player
 * 
 * @param {number} amount - Amount of experience to gain
 * @param {string} [source] - Source of the experience (combat, quest, etc.)
 * @returns {Object} The GAIN_EXPERIENCE action
 */
export const gainExperience = (amount: number, source?: string) => ({
  type: PLAYER_ACTION_TYPES.GAIN_EXPERIENCE,
  payload: { amount, source } as ExperiencePayload
});

/**
 * Level up the player character
 * 
 * @returns {Object} The LEVEL_UP action
 */
export const levelUp = () => ({
  type: PLAYER_ACTION_TYPES.LEVEL_UP
});

/**
 * Modify the player's current health
 * 
 * @param {number} amount - Amount to modify health by (positive or negative)
 * @param {string} [reason] - Reason for health modification
 * @returns {Object} The MODIFY_HEALTH action
 */
export const modifyHealth = (amount: number, reason?: string) => ({
  type: PLAYER_ACTION_TYPES.MODIFY_HEALTH,
  payload: { amount, reason } as HealthModificationPayload
});

/**
 * Modify the player's current energy
 * 
 * @param {number} amount - Amount to modify energy by (positive or negative)
 * @param {string} [reason] - Reason for energy modification
 * @returns {Object} The MODIFY_ENERGY action
 */
export const modifyEnergy = (amount: number, reason?: string) => ({
  type: PLAYER_ACTION_TYPES.MODIFY_ENERGY,
  payload: { amount, reason } as EnergyModificationPayload
});

/**
 * Add a new trait to the player's acquired traits
 * 
 * @param {string} traitId - ID of the trait to acquire
 * @returns {Object} The ACQUIRE_TRAIT action
 */
export const acquireTrait = (traitId: string) => ({
  type: PLAYER_ACTION_TYPES.ACQUIRE_TRAIT,
  payload: { traitId } as TraitPayload
});

/**
 * Equip a trait in one of the player's trait slots
 * 
 * @param {string} traitId - ID of the trait to equip
 * @param {number} [slotIndex] - Slot index to equip the trait in (auto-assigns if omitted)
 * @returns {Object} The EQUIP_TRAIT action
 */
export const equipTrait = (traitId: string, slotIndex?: number) => ({
  type: PLAYER_ACTION_TYPES.EQUIP_TRAIT,
  payload: { traitId, slotIndex } as EquipTraitPayload
});

/**
 * Remove a trait from the player's equipped traits
 * 
 * @param {string} traitId - ID of the trait to unequip
 * @returns {Object} The UNEQUIP_TRAIT action
 */
export const unequipTrait = (traitId: string) => ({
  type: PLAYER_ACTION_TYPES.UNEQUIP_TRAIT,
  payload: { traitId } as TraitPayload
});

/**
 * Allocate attribute points to a specific attribute
 * 
 * @param {string} attributeName - Name of the attribute to allocate points to
 * @param {number} amount - Number of points to allocate
 * @returns {Object} The ALLOCATE_ATTRIBUTE action
 */
export const allocateAttribute = (attributeName: string, amount: number) => ({
  type: PLAYER_ACTION_TYPES.ALLOCATE_ATTRIBUTE,
  payload: { attributeName, amount } as AttributeAllocationPayload
});

/**
 * Make the player rest to recover health and energy
 * 
 * @param {number} duration - Duration of rest in game hours
 * @param {string} [location] - Location where resting occurs
 * @returns {Object} The REST action
 */
export const rest = (duration: number, location?: string) => ({
  type: PLAYER_ACTION_TYPES.REST,
  payload: { duration, location } as RestPayload
});

/**
 * Learn a new skill
 * 
 * @param {string} skillId - ID of the skill to learn
 * @returns {Object} The LEARN_SKILL action
 */
export const learnSkill = (skillId: string) => ({
  type: PLAYER_ACTION_TYPES.LEARN_SKILL,
  payload: { skillId } as SkillPayload
});

/**
 * Upgrade an existing skill to a higher level
 * 
 * @param {string} skillId - ID of the skill to upgrade
 * @param {number} level - New level for the skill
 * @param {number} cost - Cost of the upgrade
 * @returns {Object} The UPGRADE_SKILL action
 */
export const upgradeSkill = (skillId: string, level: number, cost: number) => ({
  type: PLAYER_ACTION_TYPES.UPGRADE_SKILL,
  payload: { skillId, level, cost } as SkillUpgradePayload
});

/**
 * Set the currently active character in a multi-character party
 * 
 * @param {string} characterId - ID of the character to make active
 * @returns {Object} The SET_ACTIVE_CHARACTER action
 */
export const setActiveCharacter = (characterId: string) => ({
  type: PLAYER_ACTION_TYPES.SET_ACTIVE_CHARACTER,
  payload: { characterId } as ActiveCharacterPayload
});
