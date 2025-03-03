/**
 * Action type constants for game state management
 * These are used throughout the application to ensure consistency in reducer actions
 */
export const ACTION_TYPES = {
  // Player-related actions
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  UPDATE_PLAYER_STATS: 'UPDATE_PLAYER_STATS',
  UPDATE_PLAYER_INVENTORY: 'UPDATE_PLAYER_INVENTORY',
  
  // NPC-related actions
  UPDATE_NPC: 'UPDATE_NPC',
  UPDATE_NPC_RELATIONSHIP: 'UPDATE_NPC_RELATIONSHIP',
  UPDATE_NPC_DIALOGUE: 'UPDATE_NPC_DIALOGUE',
  
  // Game mechanics
  UPDATE_GAME_TIME: 'UPDATE_GAME_TIME',
  UPDATE_LOCATION: 'UPDATE_LOCATION',
  
  // Resource management
  UPDATE_ESSENCE: 'UPDATE_ESSENCE',
  UPDATE_CURRENCY: 'UPDATE_CURRENCY',
  
  // Character progression
  ADD_TRAIT: 'ADD_TRAIT',
  REMOVE_TRAIT: 'REMOVE_TRAIT',
  LEVEL_UP: 'LEVEL_UP',
  
  // Game state
  SAVE_GAME: 'SAVE_GAME',
  LOAD_GAME: 'LOAD_GAME',
  RESET_GAME: 'RESET_GAME'
};
