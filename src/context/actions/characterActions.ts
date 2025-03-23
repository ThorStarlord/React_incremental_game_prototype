/**
 * Character Management Actions
 * ===========================
 * 
 * Action creators for managing characters in a multi-character system.
 * These actions handle character activation, switching, and other operations
 * that facilitate gameplay with multiple playable characters.
 * 
 * @module characterActions
 */

import { 
  PlayerAction,
  PLAYER_ACTIONS
} from '../types/actions/playerActionTypes';
import { validateId, getTimestamp } from './player/utils';

/**
 * Character-specific action types
 */
export const CHARACTER_ACTIONS = {
  SET_ACTIVE_CHARACTER: PLAYER_ACTIONS.SET_ACTIVE_CHARACTER,
  SWITCH_CHARACTER: PLAYER_ACTIONS.SWITCH_CHARACTER,
  // For actions that aren't in PLAYER_ACTIONS, use UPDATE_PLAYER as a wrapper
  ADD_CHARACTER: PLAYER_ACTIONS.UPDATE_PLAYER,
  UPDATE_CHARACTER: PLAYER_ACTIONS.UPDATE_PLAYER,
  REMOVE_CHARACTER: PLAYER_ACTIONS.UPDATE_PLAYER,
  SET_CHARACTER_TAB: PLAYER_ACTIONS.UPDATE_PLAYER,
  ALLOCATE_ATTRIBUTE_POINTS: PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE,
  LEVEL_UP_CHARACTER_SKILL: PLAYER_ACTIONS.UPDATE_SKILL
};

/**
 * Character action payload interfaces
 */
export interface ActiveCharacterPayload {
  characterId: string;
  timestamp?: number;
}

/**
 * Character data interface
 * 
 * Represents all data associated with a playable character in the game.
 * Characters are the player-controlled entities with stats, equipment, and abilities.
 */
export interface Character {
  /** Unique identifier for the character */
  id: string;
  
  /** Character display name */
  name: string;
  
  /** Character level (determines base stats and available skills) */
  level?: number;
  
  /** Character class/profession (affects growth rates and available skills) */
  class?: string;
  
  /** Character attributes and statistics */
  stats?: Record<string, number>;
  
  /** Currently equipped items in equipment slots */
  equipment?: Record<string, any>;
  
  /** Physical appearance customization options */
  appearance?: Record<string, any>;
  
  /** Unlocked skills and abilities */
  skills?: string[];
  
  /** Additional character properties */
  [key: string]: any;
}

/**
 * Set a character as the active one
 * 
 * @param id - Character ID to activate
 * @returns SET_ACTIVE_CHARACTER action
 * 
 * @example
 * // Character selection screen
 * function CharacterSelection({ characters }) {
 *   return (
 *     <div>
 *       <h2>Select Your Character</h2>
 *       {characters.map(char => (
 *         <CharacterCard 
 *           key={char.id}
 *           character={char}
 *           onSelect={() => dispatch(setActiveCharacter(char.id))}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 */
export function setActiveCharacter(id: string): PlayerAction {
  validateId(id, 'Character ID');
  
  return {
    type: PLAYER_ACTIONS.SET_ACTIVE_CHARACTER,
    payload: {
      characterId: id,
      timestamp: getTimestamp()
    } as ActiveCharacterPayload
  };
}

/**
 * Switch to another character (with potential state handling)
 * 
 * @param id - Character ID to switch to
 * @returns SWITCH_CHARACTER action
 */
export function switchCharacter(id: string): PlayerAction {
  validateId(id, 'Character ID');
  
  return {
    type: PLAYER_ACTIONS.SWITCH_CHARACTER,
    payload: {
      characterId: id,
      timestamp: getTimestamp()
    }
  };
}

/**
 * Add a character to the player's roster
 * 
 * @param character - Character data object with required properties
 * @returns The ADD_CHARACTER action
 * 
 * @example
 * // Add a simple character
 * dispatch(addCharacter({
 *   id: generateUniqueId(),
 *   name: 'Tharnuld',
 *   class: 'warrior',
 *   level: 1
 * }));
 */
export function addCharacter(character: Character): PlayerAction {
  validateId(character.id, 'Character ID');
  
  return {
    type: PLAYER_ACTIONS.UPDATE_PLAYER,
    payload: {
      characters: {
        [character.id]: character
      },
      timestamp: getTimestamp()
    }
  };
}

/**
 * Update an existing character's data
 * 
 * @param id - Character ID to be updated
 * @param updates - Object containing properties to update
 * @returns The UPDATE_CHARACTER action
 */
export function updateCharacter(id: string, updates: Partial<Character>): PlayerAction {
  validateId(id, 'Character ID');
  
  return {
    type: CHARACTER_ACTIONS.UPDATE_CHARACTER,
    payload: { 
      id, 
      updates,
      timestamp: getTimestamp()
    }
  };
}

/**
 * Remove a character from the roster
 * 
 * @param id - Character ID to remove
 * @returns The REMOVE_CHARACTER action
 */
export function removeCharacter(id: string): PlayerAction {
  validateId(id, 'Character ID');
  
  return {
    type: CHARACTER_ACTIONS.REMOVE_CHARACTER,
    payload: { 
      id,
      timestamp: getTimestamp()
    }
  };
}

/**
 * Set the active tab in character management UI
 * 
 * @param tab - The tab identifier to activate
 * @returns The SET_CHARACTER_TAB action
 */
export function setCharacterTab(tab: string): PlayerAction {
  return {
    type: CHARACTER_ACTIONS.SET_CHARACTER_TAB,
    payload: { 
      tab,
      timestamp: getTimestamp()
    }
  };
}

/**
 * Allocate attribute points for a character
 * 
 * @param characterId - Character ID
 * @param attribute - Attribute name to increase
 * @param points - Number of points to allocate
 * @returns The ALLOCATE_ATTRIBUTE_POINTS action
 */
export function allocateAttributePoints(
  characterId: string, 
  attribute: string, 
  points: number = 1
): PlayerAction {
  validateId(characterId, 'Character ID');
  
  return {
    type: CHARACTER_ACTIONS.ALLOCATE_ATTRIBUTE_POINTS,
    payload: { 
      characterId, 
      attribute, 
      points,
      timestamp: getTimestamp()
    }
  };
}

/**
 * Level up a character skill
 * 
 * @param characterId - Character ID
 * @param skillId - Skill ID to level up
 * @returns The LEVEL_UP_CHARACTER_SKILL action
 */
export function levelUpCharacterSkill(
  characterId: string, 
  skillId: string
): PlayerAction {
  validateId(characterId, 'Character ID');
  validateId(skillId, 'Skill ID');
  
  return {
    type: CHARACTER_ACTIONS.LEVEL_UP_CHARACTER_SKILL,
    payload: { 
      characterId, 
      skillId,
      timestamp: getTimestamp()
    }
  };
}
