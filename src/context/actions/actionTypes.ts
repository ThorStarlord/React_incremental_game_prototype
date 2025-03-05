/**
 * @file actionTypes.ts
 * @description Defines all action type constants used throughout the RPG game.
 * 
 * This module provides centralized constants for all Redux-style actions,
 * ensuring consistency and preventing typos when dispatching and handling actions.
 * Actions are organized into logical categories based on their purpose and related
 * game subsystems.
 * 
 * Using these constants rather than string literals provides several benefits:
 * - Type safety through TypeScript's string literal types
 * - Better IDE autocomplete and refactoring support
 * - Centralized documentation of all possible actions
 * - Prevention of duplicate action types
 * 
 * @example
 * // Importing action types
 * import { ACTION_TYPES } from '../actions/actionTypes';
 * 
 * // Using in a dispatch call
 * dispatch({
 *   type: ACTION_TYPES.GAIN_EXPERIENCE,
 *   payload: { amount: 100 }
 * });
 * 
 * // Using in a reducer
 * case ACTION_TYPES.GAIN_EXPERIENCE:
 *   return {
 *     ...state,
 *     experience: state.experience + action.payload.amount
 *   };
 */

/**
 * Constants for action types used in reducers
 * These string constants help avoid typos in action type names
 */
export const ACTION_TYPES = {
  /**
   * Game initialization actions
   * Used during game loading, saving, and resetting
   * 
   * @example
   * // Load a saved game
   * dispatch({
   *   type: ACTION_TYPES.INITIALIZE_GAME_DATA,
   *   payload: savedGameState
   * });
   * 
   * // Reset to a fresh game
   * dispatch({ type: ACTION_TYPES.RESET_GAME });
   */
  // Game initialization
  INITIALIZE_GAME_DATA: 'INITIALIZE_GAME_DATA', // Load saved game data
  RESET_GAME: 'RESET_GAME',                     // Reset to a fresh game
  
  /**
   * Game time actions
   * Control the passage of time in the game world
   * 
   * @example
   * // Advance time by one unit
   * dispatch({ type: ACTION_TYPES.ADVANCE_TIME });
   * 
   * // Advance time by a specific amount
   * dispatch({
   *   type: ACTION_TYPES.ADVANCE_TIME,
   *   payload: { amount: 5 }
   * });
   */
  // Game time
  ADVANCE_TIME: 'ADVANCE_TIME',                 // Progress game time forward
  SET_TIME: 'SET_TIME',
  SKIP_TO_PERIOD: 'SKIP_TO_PERIOD',
  CHANGE_SEASON: 'CHANGE_SEASON',
  SET_WEATHER: 'SET_WEATHER',
  
  /**
   * Player actions
   * Affect player state including stats, experience, and level
   * 
   * @example
   * // Update player name
   * dispatch({
   *   type: ACTION_TYPES.UPDATE_PLAYER,
   *   payload: { name: 'Aragorn' }
   * });
   * 
   * // Gain experience
   * dispatch({
   *   type: ACTION_TYPES.GAIN_EXPERIENCE,
   *   payload: { amount: 150 }
   * });
   * 
   * // Level up the player
   * dispatch({ type: ACTION_TYPES.LEVEL_UP });
   */
  // Player actions
  UPDATE_PLAYER: 'UPDATE_PLAYER',               // Update any player properties
  GAIN_EXPERIENCE: 'GAIN_EXPERIENCE',           // Add experience points
  LEVEL_UP: 'LEVEL_UP',                         // Increase player level
  MODIFY_HEALTH: 'MODIFY_HEALTH',
  MODIFY_ENERGY: 'MODIFY_ENERGY',
  ACQUIRE_TRAIT: 'ACQUIRE_TRAIT',
  EQUIP_TRAIT: 'EQUIP_TRAIT',
  SWITCH_CHARACTER: 'SWITCH_CHARACTER',
  ALLOCATE_ATTRIBUTE: 'ALLOCATE_ATTRIBUTE',
  REST: 'REST',
  
  /**
   * Resource management actions
   * Handle gaining and spending in-game resources
   * 
   * @example
   * // Gain wood from chopping trees
   * dispatch({
   *   type: ACTION_TYPES.GAIN_RESOURCE,
   *   payload: {
   *     resourceType: 'materials.wood',
   *     amount: 5
   *   }
   * });
   * 
   * // Spend gold at a shop
   * dispatch({
   *   type: ACTION_TYPES.SPEND_RESOURCE,
   *   payload: {
   *     resourceType: 'gold',
   *     amount: 50
   *   }
   * });
   */
  // Resource management
  GAIN_RESOURCE: 'GAIN_RESOURCE',               // Add resources (gold, materials, etc.)
  SPEND_RESOURCE: 'SPEND_RESOURCE',             // Use up resources
  GAIN_GOLD: 'GAIN_GOLD',                       // Add gold to player's resources
  
  /**
   * Essence management actions
   * Special resource used for trait copying and special abilities
   * 
   * @example
   * // Gain essence from defeating a special enemy
   * dispatch({
   *   type: ACTION_TYPES.GAIN_ESSENCE,
   *   payload: { amount: 3 }
   * });
   * 
   * // Spend essence to copy a trait
   * dispatch({
   *   type: ACTION_TYPES.SPEND_ESSENCE,
   *   payload: { amount: 10 }
   * });
   */
  // Essence management
  GAIN_ESSENCE: 'GAIN_ESSENCE',                 // Add essence points
  SPEND_ESSENCE: 'SPEND_ESSENCE',               // Use essence points
  
  /**
   * Inventory actions
   * Handle items in player inventory and equipment
   * 
   * @example
   * // Add a new item to inventory
   * dispatch({
   *   type: ACTION_TYPES.ADD_ITEM,
   *   payload: {
   *     item: {
   *       id: 'steel_sword',
   *       name: 'Steel Sword',
   *       type: 'weapon',
   *       stats: { physicalDamage: 8 },
   *       quantity: 1,
   *       value: 75
   *     }
   *   }
   * });
   * 
   * // Use a healing potion
   * dispatch({
   *   type: ACTION_TYPES.USE_ITEM,
   *   payload: { itemId: 'healing_potion_3' }
   * });
   * 
   * // Equip a new helmet
   * dispatch({
   *   type: ACTION_TYPES.EQUIP_ITEM,
   *   payload: {
   *     itemId: 'iron_helmet',
   *     slot: 'head'
   *   }
   * });
   */
  // Inventory actions
  ADD_ITEM: 'ADD_ITEM',                         // Add item to inventory
  REMOVE_ITEM: 'REMOVE_ITEM',                   // Remove item from inventory
  USE_ITEM: 'USE_ITEM',                         // Use a consumable item
  EQUIP_ITEM: 'EQUIP_ITEM',                     // Equip item to a slot
  UNEQUIP_ITEM: 'UNEQUIP_ITEM',                 // Remove item from equipment slot
  
  /**
   * Quest actions
   * Manage the player's quest log and progress
   * 
   * @example
   * // Start a new quest
   * dispatch({
   *   type: ACTION_TYPES.START_QUEST,
   *   payload: { questId: 'save_the_village' }
   * });
   * 
   * // Complete a quest
   * dispatch({
   *   type: ACTION_TYPES.COMPLETE_QUEST,
   *   payload: { questId: 'gather_herbs' }
   * });
   * 
   * // Update quest progress
   * dispatch({
   *   type: ACTION_TYPES.UPDATE_QUEST_PROGRESS,
   *   payload: {
   *     questId: 'hunt_wolves',
   *     progress: { wolvesKilled: 5, required: 10 }
   *   }
   * });
   */
  // Quest actions
  START_QUEST: 'START_QUEST',                   // Add quest to active quests
  COMPLETE_QUEST: 'COMPLETE_QUEST',             // Mark quest as completed
  FAIL_QUEST: 'FAIL_QUEST',                     // Mark quest as failed
  UPDATE_QUEST_PROGRESS: 'UPDATE_QUEST_PROGRESS', // Update quest objectives
  UPDATE_QUEST_OBJECTIVE: 'UPDATE_QUEST_OBJECTIVE',   // Update progress on a quest objective
  
  /**
   * Location actions
   * Handle player movement and location discovery
   * 
   * @example
   * // Discover a new location on the map
   * dispatch({
   *   type: ACTION_TYPES.DISCOVER_LOCATION,
   *   payload: { locationId: 'ancient_ruins' }
   * });
   * 
   * // Travel to a different area
   * dispatch({
   *   type: ACTION_TYPES.TRAVEL_TO_LOCATION,
   *   payload: { locationId: 'forest_clearing' }
   * });
   */
  // Location actions
  DISCOVER_LOCATION: 'DISCOVER_LOCATION',       // Add location to known locations
  TRAVEL_TO_LOCATION: 'TRAVEL_TO_LOCATION',     // Move player to location
  
  /**
   * Combat actions
   * Handle combat encounters and results
   * 
   * @example
   * // Begin combat with an enemy
   * dispatch({
   *   type: ACTION_TYPES.START_COMBAT,
   *   payload: {
   *     enemy: {
   *       id: 'goblin_warrior',
   *       name: 'Goblin Warrior',
   *       health: 30,
   *       damage: 5
   *     }
   *   }
   * });
   * 
   * // Perform a player attack
   * dispatch({
   *   type: ACTION_TYPES.PLAYER_ATTACK,
   *   payload: { attackType: 'heavy_swing' }
   * });
   * 
   * // End combat after victory
   * dispatch({
   *   type: ACTION_TYPES.END_COMBAT,
   *   payload: {
   *     result: 'victory',
   *     rewards: {
   *       experience: 50,
   *       gold: 15,
   *       items: [{ id: 'goblin_tooth', quantity: 2 }]
   *     }
   *   }
   * });
   */
  // Combat actions
  START_COMBAT: 'START_COMBAT',                 // Begin combat with enemy
  END_COMBAT: 'END_COMBAT',                     // Resolve end of combat
  PLAYER_ATTACK: 'PLAYER_ATTACK',               // Player attacks enemy
  ENEMY_ATTACK: 'ENEMY_ATTACK',                 // Enemy attacks player
  
  /**
   * Settings actions
   * Update game settings and preferences
   * 
   * @example
   * // Update audio settings
   * dispatch({
   *   type: ACTION_TYPES.UPDATE_SETTINGS,
   *   payload: {
   *     audio: {
   *       musicVolume: 0.7,
   *       soundEffectsVolume: 0.5
   *     }
   *   }
   * });
   * 
   * // Change game difficulty
   * dispatch({
   *   type: ACTION_TYPES.UPDATE_SETTINGS,
   *   payload: {
   *     gameplay: {
   *       difficultyLevel: 'hard'
   *     }
   *   }
   * });
   */
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',            // Change game settings

  // Character management actions
  SET_CHARACTER_TAB: 'SET_CHARACTER_TAB',
  ADD_CHARACTER: 'ADD_CHARACTER',                // Keep this one
  UPDATE_CHARACTER: 'UPDATE_CHARACTER',
  REMOVE_CHARACTER: 'REMOVE_CHARACTER',
  SET_ACTIVE_CHARACTER: 'SET_ACTIVE_CHARACTER',
  ALLOCATE_ATTRIBUTE_POINTS: 'ALLOCATE_ATTRIBUTE_POINTS',
  LEVEL_UP_CHARACTER_SKILL: 'LEVEL_UP_CHARACTER_SKILL',

  /**
   * Skill actions 
   * Manage player's skills and abilities
   */
  GAIN_SKILL_EXPERIENCE: 'GAIN_SKILL_EXPERIENCE', // Add experience to a specific skill
  LEVEL_UP_SKILL: 'LEVEL_UP_SKILL',             // Level up a specific skill

  /**
   * NPC relationship actions
   * Handle player relationships with NPCs
   */
  UPDATE_NPC_RELATIONSHIP: 'UPDATE_NPC_RELATIONSHIP', // Change relationship with an NPC
  DECAY_RELATIONSHIPS: 'DECAY_RELATIONSHIPS',         // Natural decay of relationships over time
  
  /**
   * Notification actions
   * Manage in-game notifications to the player
   */
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',               // Show a notification to the player
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',         // Remove a specific notification
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',         // Remove all notifications
  
  /**
   * Encounter actions
   * Handle random encounters in the game world
   */
  START_ENCOUNTER: 'START_ENCOUNTER',                 // Begin a random encounter
  END_ENCOUNTER: 'END_ENCOUNTER',                     // End a random encounter
  
  /**
   * World state actions
   * Manage dynamic world conditions
   */
  UPDATE_WEATHER: 'UPDATE_WEATHER',                   // Change weather conditions
  TRIGGER_WORLD_EVENT: 'TRIGGER_WORLD_EVENT',         // Start a global world event
};

/**
 * Helper function to create an action creator for a specific action type
 * 
 * @param {string} type - The action type from ACTION_TYPES
 * @returns {function} Action creator function that accepts a payload
 * 
 * @example
 * const gainExp = createAction(ACTION_TYPES.GAIN_EXPERIENCE);
 * dispatch(gainExp({ amount: 100 }));
 * 
 * // Equivalent to:
 * dispatch({
 *   type: ACTION_TYPES.GAIN_EXPERIENCE,
 *   payload: { amount: 100 }
 * });
 */
export function createAction<P = any>(type: string) {
  return (payload?: P) => ({
    type,
    payload
  });
}

/**
 * Get all action types as an array of strings
 * Useful for debugging or dynamic action handling
 * 
 * @returns {string[]} Array of all action type strings
 * 
 * @example
 * // Log all available action types
 * console.log(getAllActionTypes());
 * 
 * // Check if an action type is valid
 * const isValidAction = getAllActionTypes().includes(someActionType);
 */
export function getAllActionTypes(): string[] {
  return Object.values(ACTION_TYPES);
}
