/**
 * Type definitions for player actions
 */
import { 
  PlayerState, 
  PlayerAttributes,
  PlayerStats,
  StatusEffect,
} from './PlayerGameStateTypes';
import { Skill } from './combat/skills';
import { TraitEffect, ExtendedTrait as Trait } from './TraitsGameStateTypes';
import { PLAYER_ACTIONS, PlayerAction } from '../reducers/playerReducer';

// Define enums for action-related string literals
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
export interface PlayerUpdatePayload extends Partial<PlayerState> {
  [key: string]: unknown; // More type-safe than 'any'
  timestamp?: number;
}

export interface HealthModificationPayload {
  amount: number;
  reason?: string;
  timestamp: number;
}

export interface EnergyModificationPayload {
  amount: number;
  reason?: string;
  timestamp: number;
}

export interface TraitPayload {
  traitId: string;
  timestamp: number;
}

export interface EquipTraitPayload extends TraitPayload {
  slotIndex?: number;
}

export interface AttributeAllocationPayload {
  attributeName: string;
  amount: number;
  timestamp: number;
}

export interface RestPayload {
  duration: number;
  location?: string;
  timestamp: number;
}

export interface SkillPayload {
  skillId: string;
  timestamp: number;
}

export interface SkillUpgradePayload extends SkillPayload {
  level: number;
  cost: number;
}

export interface ActiveCharacterPayload {
  characterId: string;
  timestamp: number;
}

// Re-export the action types for convenience
export { PLAYER_ACTIONS, type PlayerAction };
