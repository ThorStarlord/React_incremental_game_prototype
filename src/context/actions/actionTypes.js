/**
 * @constant ACTION_TYPES
 * @description Defines all action types used throughout the application
 * for state management. Using constants prevents typos and makes debugging easier.
 * 
 * Action types are categorized by domain for better organization.
 */
export const ACTION_TYPES = {
  // Resource actions
  GAIN_ESSENCE: 'GAIN_ESSENCE',
  SPEND_ESSENCE: 'SPEND_ESSENCE',
  
  // Character actions
  ADD_CHARACTER: 'ADD_CHARACTER',
  REMOVE_CHARACTER: 'REMOVE_CHARACTER',
  UPDATE_CHARACTER: 'UPDATE_CHARACTER',
  
  // Trait actions
  ACQUIRE_TRAIT: 'ACQUIRE_TRAIT',
  EQUIP_TRAIT: 'EQUIP_TRAIT',
  UNEQUIP_TRAIT: 'UNEQUIP_TRAIT',
  
  // NPC actions
  DISCOVER_NPC: 'DISCOVER_NPC',
  UPDATE_NPC_RELATION: 'UPDATE_NPC_RELATION',
  
  // UI actions
  OPEN_DIALOG: 'OPEN_DIALOG',
  CLOSE_DIALOG: 'CLOSE_DIALOG',
  SET_TOOLTIP_SEEN: 'SET_TOOLTIP_SEEN',
  SET_CHARACTER_TAB: 'SET_CHARACTER_TAB',
  
  // Game actions
  SAVE_GAME: 'SAVE_GAME',
  LOAD_GAME: 'LOAD_GAME',
  RESET_GAME: 'RESET_GAME',
  
  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS'
};