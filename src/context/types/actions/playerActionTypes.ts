/**
 * Player-related action type definitions
 * 
 * This module defines the types and interfaces for player actions
 * in the game.
 * 
 * @module playerActionTypes
 */

import { PlayerState, PlayerAttributes, StatusEffect } from '../gameStates/PlayerGameStateTypes';

/**
 * Player action type constants
 */
export const PLAYER_ACTIONS = {
  // Core player actions
  UPDATE_PLAYER: 'player/updatePlayer' as const,
  SET_NAME: 'player/setName' as const,
  RESET_PLAYER: 'player/resetPlayer' as const,
  MODIFY_HEALTH: 'player/modifyHealth' as const,
  MODIFY_ENERGY: 'player/modifyEnergy' as const,
  REST: 'player/rest' as const,
  UPDATE_TOTAL_PLAYTIME: 'player/updateTotalPlayTime' as const,
  
  // Character management
  SET_ACTIVE_CHARACTER: 'player/setActiveCharacter' as const,
  SWITCH_CHARACTER: 'player/switchCharacter' as const,
  
  // Attribute actions
  ALLOCATE_ATTRIBUTE: 'player/allocateAttribute' as const,
  UPDATE_ATTRIBUTE: 'player/updateAttribute' as const,
  UPDATE_ATTRIBUTES: 'player/updateAttributes' as const,
  ADD_ATTRIBUTE_POINTS: 'player/addAttributePoints' as const,
  SPEND_ATTRIBUTE_POINTS: 'player/spendAttributePoints' as const,
  
  // Stat actions
  UPDATE_STAT: 'player/updateStat' as const,
  UPDATE_STATS: 'player/updateStats' as const,
  
  // Status effect actions
  ADD_STATUS_EFFECT: 'player/addStatusEffect' as const,
  REMOVE_STATUS_EFFECT: 'player/removeStatusEffect' as const,
  
  // Inventory actions
  EQUIP_ITEM: 'player/equipItem' as const,
  UNEQUIP_ITEM: 'player/unequipItem' as const,
  
  // Trait actions
  ADD_TRAIT: 'player/addTrait' as const,
  REMOVE_TRAIT: 'player/removeTrait' as const,
  EQUIP_TRAIT: 'player/equipTrait' as const,
  UNEQUIP_TRAIT: 'player/unequipTrait' as const,
  ACQUIRE_TRAIT: 'player/acquireTrait' as const,
  
  // Skill actions
  UPDATE_SKILL: 'player/updateSkill' as const,
  LEARN_SKILL: 'player/learnSkill' as const,
  UPGRADE_SKILL: 'player/upgradeSkill' as const
};

// Create a union type of all player action types
export type PlayerActionType = typeof PLAYER_ACTIONS[keyof typeof PLAYER_ACTIONS];

/**
 * Base player action interface
 */
export interface PlayerAction {
  type: PlayerActionType;
  payload?: any;
}

//=============================================================================
// Enums
//=============================================================================

/**
 * Standardized reasons for player modifications
 * Used to track the source of health, energy, or stat changes
 */
export enum ModificationReason {
  /** Changes due to combat actions */
  Combat = 'combat',
  
  /** Changes from consuming potions or other consumables */
  Potion = 'potion',
  
  /** Changes from using or passive skill effects */
  Skill = 'skill',
  
  /** Recovery from resting at inns, camps, etc. */
  Resting = 'resting',
  
  /** Changes from ongoing status effects */
  StatusEffect = 'status_effect',
  
  /** Changes from environment interactions (weather, terrain) */
  Environmental = 'environmental',
  
  /** Changes from completing quests */
  Quest = 'quest',
  
  /** Changes from using items other than potions */
  Item = 'item'
}

//=============================================================================
// Core Action Payloads
//=============================================================================

/**
 * Payload for general player state updates
 */
export interface PlayerUpdatePayload extends Partial<PlayerState> {
  /** Timestamp when the update occurred */
  timestamp?: number;
}

/**
 * Payload for setting the player's name
 */
export interface SetNamePayload {
  /** New name for the player */
  name: string;
}

/**
 * Payload for resetting the player state
 */
export interface ResetPlayerPayload {
  /** Whether to keep the player's name after reset */
  keepName?: boolean;
}

//=============================================================================
// Health & Energy Payloads
//=============================================================================

/**
 * Base payload for resource modifications
 */
export interface ResourceModificationPayload {
  /** Amount to modify (positive for gain, negative for loss) */
  amount: number;
  
  /** Reason for the modification */
  reason?: ModificationReason | string;
  
  /** Timestamp when the modification occurred */
  timestamp?: number;
}

/**
 * Payload for health modifications
 */
export interface HealthModificationPayload extends ResourceModificationPayload {}

/**
 * Payload for energy modifications
 */
export interface EnergyModificationPayload extends ResourceModificationPayload {}

/**
 * Payload for resting to recover resources
 */
export interface RestPayload {
  /** Duration of rest in hours or time units */
  duration: number;
  
  /** Location where resting occurs */
  location?: string;
  
  /** Timestamp when resting started */
  timestamp?: number;
}

//=============================================================================
// Trait & Attribute Payloads
//=============================================================================

/**
 * Base payload for trait actions
 */
export interface TraitPayload {
  /** ID of the trait */
  traitId: string;
  
  /** Timestamp when the action occurred */
  timestamp?: number;
}

/**
 * Payload for equipping a trait
 */
export interface EquipTraitPayload extends TraitPayload {
  /** Slot index to equip the trait in (optional) */
  slotIndex?: number;
}

/**
 * Payload for attribute allocation
 */
export interface AttributeAllocationPayload {
  /** Name of the attribute to allocate points to */
  attributeName: string;
  
  /** Number of points to allocate */
  amount: number;
  
  /** Timestamp when the allocation occurred */
  timestamp?: number;
}

/**
 * Payload for spending attribute points
 */
export interface AttributePointsPayload {
  /** Attribute to increase */
  attribute: keyof PlayerAttributes;
  
  /** Number of points to spend */
  points: number;
}

/**
 * Payload for updating a specific attribute
 */
export interface UpdateAttributePayload {
  /** Attribute to update */
  attribute: keyof PlayerAttributes;
  
  /** New value for the attribute */
  value: number;
}

/**
 * Payload for updating multiple attributes at once
 */
export interface UpdateAttributesPayload {
  [attribute: string]: number;
}

//=============================================================================
// Stat Payloads
//=============================================================================

/**
 * Payload for updating a specific player stat
 */
export interface UpdateStatPayload {
  /** Stat to update */
  stat: string;
  
  /** New value for the stat */
  value: number;
  
  /** Optional minimum value */
  min?: number;
  
  /** Optional maximum value */
  max?: number;
}

/**
 * Payload for updating multiple stats at once
 */
export interface UpdateStatsPayload {
  [stat: string]: number;
}

//=============================================================================
// Skill Payloads
//=============================================================================

/**
 * Base payload for skill actions
 */
export interface SkillPayload {
  /** ID of the skill */
  skillId: string;
  
  /** Timestamp when the action occurred */
  timestamp?: number;
}

/**
 * Payload for adding experience to a skill
 */
export interface SkillExperiencePayload {
  /** ID of the skill to update */
  skillId: string;
  
  /** Amount of experience to add */
  experience: number;
}

/**
 * Payload for upgrading a skill
 */
export interface SkillUpgradePayload extends SkillPayload {
  /** New level for the skill */
  level: number;
  
  /** Cost of the upgrade */
  cost: number;
}

//=============================================================================
// Character Management Payloads
//=============================================================================

/**
 * Payload for setting the active character
 */
export interface ActiveCharacterPayload {
  /** ID of the character to make active */
  characterId: string;
  
  /** Timestamp when the change occurred */
  timestamp?: number;
}

/**
 * Payload for status effect actions
 */
export interface StatusEffectPayload {
  /** The status effect to add or remove */
  effect: StatusEffect;
}

//=============================================================================
// Equipment Payloads
//=============================================================================

/**
 * Payload for equipping an item
 */
export interface EquipItemPayload {
  /** ID of the item to equip */
  itemId: string;
  
  /** Slot to equip the item in */
  slot: string;
}

/**
 * Payload for unequipping an item
 */
export interface UnequipItemPayload {
  /** Slot to unequip */
  slot: string;
}

//=============================================================================
// Type Definitions for Actions
//=============================================================================

export type UpdatePlayerAction = { type: typeof PLAYER_ACTIONS.UPDATE_PLAYER; payload: PlayerUpdatePayload };
export type SetNameAction = { type: typeof PLAYER_ACTIONS.SET_NAME; payload: string };
export type ResetPlayerAction = { type: typeof PLAYER_ACTIONS.RESET_PLAYER; payload: ResetPlayerPayload };
export type ModifyHealthAction = { type: typeof PLAYER_ACTIONS.MODIFY_HEALTH; payload: HealthModificationPayload };
export type ModifyEnergyAction = { type: typeof PLAYER_ACTIONS.MODIFY_ENERGY; payload: EnergyModificationPayload };
export type RestAction = { type: typeof PLAYER_ACTIONS.REST; payload: RestPayload };
export type AddTraitAction = { type: typeof PLAYER_ACTIONS.ADD_TRAIT; payload: string };
export type RemoveTraitAction = { type: typeof PLAYER_ACTIONS.REMOVE_TRAIT; payload: string };
export type EquipTraitAction = { type: typeof PLAYER_ACTIONS.EQUIP_TRAIT; payload: EquipTraitPayload };
export type UnequipTraitAction = { type: typeof PLAYER_ACTIONS.UNEQUIP_TRAIT; payload: TraitPayload };
export type AcquireTraitAction = { type: typeof PLAYER_ACTIONS.ACQUIRE_TRAIT; payload: { traitId: string } };
export type UpdateSkillAction = { type: typeof PLAYER_ACTIONS.UPDATE_SKILL; payload: SkillExperiencePayload };
export type LearnSkillAction = { type: typeof PLAYER_ACTIONS.LEARN_SKILL; payload: SkillPayload };
export type UpgradeSkillAction = { type: typeof PLAYER_ACTIONS.UPGRADE_SKILL; payload: SkillUpgradePayload };
export type SetActiveCharacterAction = { type: typeof PLAYER_ACTIONS.SET_ACTIVE_CHARACTER; payload: ActiveCharacterPayload };
export type AddStatusEffectAction = { type: typeof PLAYER_ACTIONS.ADD_STATUS_EFFECT; payload: StatusEffectPayload };
export type RemoveStatusEffectAction = { type: typeof PLAYER_ACTIONS.REMOVE_STATUS_EFFECT; payload: { effectId: string } };
export type AllocateAttributeAction = { type: typeof PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE; payload: AttributeAllocationPayload };
export type AddAttributePointsAction = { type: typeof PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS; payload: number };
export type SpendAttributePointsAction = { type: typeof PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS; payload: AttributePointsPayload };
export type UpdateAttributeAction = { type: typeof PLAYER_ACTIONS.UPDATE_ATTRIBUTE; payload: UpdateAttributePayload };
export type UpdateAttributesAction = { type: typeof PLAYER_ACTIONS.UPDATE_ATTRIBUTES; payload: UpdateAttributesPayload };
export type UpdateStatAction = { type: typeof PLAYER_ACTIONS.UPDATE_STAT; payload: UpdateStatPayload };
export type UpdateStatsAction = { type: typeof PLAYER_ACTIONS.UPDATE_STATS; payload: UpdateStatsPayload };
export type EquipItemAction = { type: typeof PLAYER_ACTIONS.EQUIP_ITEM; payload: EquipItemPayload };
export type UnequipItemAction = { type: typeof PLAYER_ACTIONS.UNEQUIP_ITEM; payload: UnequipItemPayload };
export type UpdateTotalPlaytimeAction = { type: typeof PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME; payload: number };

/**
 * Union of all typed player actions
 */
export type TypedPlayerAction = 
  | UpdatePlayerAction
  | SetNameAction
  | ResetPlayerAction
  | ModifyHealthAction
  | ModifyEnergyAction
  | RestAction
  | AddTraitAction
  | RemoveTraitAction
  | EquipTraitAction
  | UnequipTraitAction
  | AcquireTraitAction
  | UpdateSkillAction
  | LearnSkillAction
  | UpgradeSkillAction
  | SetActiveCharacterAction
  | AddStatusEffectAction
  | RemoveStatusEffectAction
  | AllocateAttributeAction
  | AddAttributePointsAction
  | SpendAttributePointsAction
  | UpdateAttributeAction
  | UpdateAttributesAction
  | UpdateStatAction
  | UpdateStatsAction
  | EquipItemAction
  | UnequipItemAction
  | UpdateTotalPlaytimeAction;