/**
 * Character-related action type definitions
 * 
 * This module defines the types and interfaces for character actions
 * in the game.
 * 
 * @module characterActionTypes
 */

/**
 * Character action type constants
 */
export const CHARACTER_ACTIONS = {
  SET_ACTIVE_CHARACTER: 'character/setActive' as const,
  UPDATE_PLAYTIME: 'character/updatePlaytime' as const,
  CREATE_CHARACTER: 'character/create' as const,
  DELETE_CHARACTER: 'character/delete' as const,
  UPDATE_CHARACTER: 'character/update' as const,
  SET_CHARACTER_TAB: 'character/setTab' as const,
  ALLOCATE_ATTRIBUTE_POINTS: 'character/allocateAttributePoints' as const,
  LEVEL_UP_CHARACTER_SKILL: 'character/levelUpSkill' as const
};

// Create a union type of all character action types
export type CharacterActionType = typeof CHARACTER_ACTIONS[keyof typeof CHARACTER_ACTIONS];

/**
 * Base character action interface
 */
export interface CharacterAction {
  type: CharacterActionType;
  payload?: any;
}

/**
 * Character data interface
 */
export interface Character {
  id: string;
  name: string;
  level?: number;
  class?: string;
  stats?: Record<string, number>;
  equipment?: Record<string, any>;
  appearance?: Record<string, any>;
  skills?: string[];
  [key: string]: any;
}

/**
 * Set active character payload
 */
export interface SetActiveCharacterPayload {
  id: string;
}

/**
 * Update playtime payload
 */
export interface UpdatePlaytimePayload {
  seconds: number;
}

/**
 * Create character payload
 */
export interface CreateCharacterPayload {
  character: Character;
}

/**
 * Delete character payload
 */
export interface DeleteCharacterPayload {
  id: string;
}

/**
 * Update character payload
 */
export interface UpdateCharacterPayload {
  id: string;
  updates: Partial<Character>;
}

/**
 * Set character tab payload
 */
export interface SetCharacterTabPayload {
  tab: string;
}

/**
 * Allocate attribute points payload
 */
export interface AllocateAttributePointsPayload {
  characterId: string;
  attribute: string;
  points: number;
}

/**
 * Level up character skill payload
 */
export interface LevelUpCharacterSkillPayload {
  characterId: string;
  skillId: string;
}
