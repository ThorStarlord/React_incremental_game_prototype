/**
 * @file characterActions.ts
 * @description Action creators for character management in the incremental RPG.
 * 
 * This module provides a set of typed action creators for managing characters in the game,
 * including creating, updating, and equipping characters, as well as managing character progression.
 * 
 * The character system allows players to:
 * - Create and customize multiple characters
 * - Switch between active characters for gameplay
 * - Allocate attribute points to improve character stats
 * - Level up character skills and abilities
 * - Equip different items and gear
 * 
 * These action creators follow a consistent pattern:
 * - Each returns a properly typed action object
 * - Actions include a type from ACTION_TYPES
 * - Actions include a payload with relevant data
 * 
 * @example
 * // Creating a new character
 * dispatch(addCharacter({
 *   id: 'char-001',
 *   name: 'Elyndria',
 *   class: 'mage',
 *   level: 1,
 *   stats: { strength: 3, intelligence: 8, dexterity: 5, vitality: 4 }
 * }));
 * 
 * @example
 * // Switching active characters
 * dispatch(setActiveCharacter('char-002'));
 */
import { ACTION_TYPES } from '../types/ActionTypes';

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
 * Base action interface for character actions
 * 
 * Defines the structure of all character-related actions with proper typing
 * to ensure consistent action structure throughout the application.
 */
interface CharacterAction {
  /** Action type identifier from ACTION_TYPES */
  type: string;
  
  /** Action payload containing relevant data */
  payload: any;
}

/**
 * Action creator for setting the active tab in character management UI
 * 
 * Used to control which section of the character management screen is currently visible,
 * such as "Stats", "Equipment", "Skills", etc.
 * 
 * @param tab - The tab identifier to activate
 * @returns The formatted action object
 * 
 * @example
 * // Navigate to the equipment tab
 * dispatch(setCharacterTab('equipment'));
 * 
 * @example
 * // Navigate to the skills tab
 * dispatch(setCharacterTab('skills'));
 */
export const setCharacterTab = (tab: string): CharacterAction => ({
  type: ACTION_TYPES.SET_CHARACTER_TAB,
  payload: { tab }
});

/**
 * Action creator for adding a character to the player's roster
 * 
 * Creates a new character with the specified properties and adds it to the roster.
 * Characters in the roster can be selected as the active character for gameplay.
 * 
 * @param character - Character data object with required properties
 * @returns The formatted action object
 * 
 * @example
 * // Add a simple character
 * dispatch(addCharacter({
 *   id: generateUniqueId(),
 *   name: 'Tharnuld',
 *   class: 'warrior',
 *   level: 1
 * }));
 * 
 * @example
 * // Add a more detailed character
 * dispatch(addCharacter({
 *   id: 'char-003',
 *   name: 'Lyra',
 *   class: 'rogue',
 *   level: 3,
 *   stats: {
 *     strength: 6,
 *     intelligence: 4,
 *     dexterity: 12,
 *     vitality: 7,
 *     luck: 9
 *   },
 *   appearance: {
 *     hairColor: 'auburn',
 *     eyeColor: 'green',
 *     skinTone: 'olive'
 *   },
 *   skills: ['backstab', 'lockpicking', 'stealth']
 * }));
 */
export const addCharacter = (character: Character): CharacterAction => ({
  type: ACTION_TYPES.ADD_CHARACTER,
  payload: { character }
});

/**
 * Action creator for updating an existing character's data
 * 
 * Used to modify properties of an existing character, such as changing
 * appearance, updating stats, or renaming the character.
 * 
 * @param id - Character ID to be updated
 * @param updates - Object containing properties to update
 * @returns The formatted action object
 * 
 * @example
 * // Change a character's name
 * dispatch(updateCharacter('char-001', { name: 'Sir Tharnuld the Brave' }));
 * 
 * @example
 * // Update multiple character properties
 * dispatch(updateCharacter('char-002', {
 *   level: currentLevel + 1,
 *   stats: {
 *     ...currentStats,
 *     strength: currentStats.strength + 2,
 *     vitality: currentStats.vitality + 1
 *   }
 * }));
 */
export const updateCharacter = (id: string, updates: Partial<Character>): CharacterAction => ({
  type: ACTION_TYPES.UPDATE_CHARACTER,
  payload: { id, updates }
});

/**
 * Action creator for removing a character from the roster
 * 
 * Permanently removes a character from the player's roster.
 * Use with caution as this operation cannot be undone.
 * 
 * @param id - Character ID to remove
 * @returns The formatted action object
 * 
 * @example
 * // Remove a character
 * const handleDeleteCharacter = (characterId) => {
 *   if (window.confirm('Are you sure you want to delete this character?')) {
 *     dispatch(removeCharacter(characterId));
 *   }
 * };
 */
export const removeCharacter = (id: string): CharacterAction => ({
  type: ACTION_TYPES.REMOVE_CHARACTER,
  payload: { id }
});

/**
 * Action creator for setting a character as the active one for gameplay
 * 
 * Sets which character the player is currently controlling.
 * Only one character can be active at a time.
 * 
 * @param id - Character ID to activate
 * @returns The formatted action object
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
export const setActiveCharacter = (id: string): CharacterAction => ({
  type: ACTION_TYPES.SET_ACTIVE_CHARACTER,
  payload: { id }
});

/**
 * Action creator for allocating attribute points for a character
 * 
 * Used when leveling up or at character creation to increase character attributes.
 * Each attribute affects different aspects of character performance.
 * 
 * @param characterId - Character ID
 * @param attribute - Attribute name to increase (e.g., 'strength', 'intelligence')
 * @param points - Number of points to allocate (defaults to 1)
 * @returns The formatted action object
 * 
 * @example
 * // Single point allocation
 * dispatch(allocateAttributePoints('char-001', 'strength'));
 * 
 * @example
 * // Multi-point allocation
 * function handleAttributeAllocation(attribute, amount) {
 *   if (availablePoints >= amount) {
 *     dispatch(allocateAttributePoints(currentCharacter.id, attribute, amount));
 *     setAvailablePoints(availablePoints - amount);
 *   } else {
 *     showNotification('Not enough attribute points available!');
 *   }
 * }
 */
export const allocateAttributePoints = (
  characterId: string, 
  attribute: string, 
  points: number = 1
): CharacterAction => ({
  type: ACTION_TYPES.ALLOCATE_ATTRIBUTE_POINTS,
  payload: { characterId, attribute, points }
});

/**
 * Action creator for leveling up a character skill
 * 
 * Increases the level of a specific skill, unlocking new abilities
 * and improving the effectiveness of existing ones.
 * 
 * @param characterId - Character ID
 * @param skillId - Skill ID to level up
 * @returns The formatted action object
 * 
 * @example
 * // Basic skill upgrade
 * dispatch(levelUpCharacterSkill('char-002', 'fireball'));
 * 
 * @example
 * // Skill upgrade with confirmation and requirements check
 * function handleSkillUpgrade(skillId) {
 *   const skill = availableSkills.find(s => s.id === skillId);
 *   
 *   if (skillPoints <= 0) {
 *     showNotification('No skill points available!');
 *     return;
 *   }
 *   
 *   if (skill.prerequisite && !unlockedSkills.includes(skill.prerequisite)) {
 *     showNotification(`You must unlock ${prerequisiteSkill.name} first!`);
 *     return;
 *   }
 *   
 *   dispatch(levelUpCharacterSkill(activeCharacter.id, skillId));
 *   setSkillPoints(skillPoints - 1);
 * }
 */
export const levelUpCharacterSkill = (
  characterId: string, 
  skillId: string
): CharacterAction => ({
  type: ACTION_TYPES.LEVEL_UP_CHARACTER_SKILL,
  payload: { characterId, skillId }
});
