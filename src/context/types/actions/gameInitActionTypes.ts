/**
 * Game Initialization Action Types
 * ===============================
 * 
 * This file defines action types related to game initialization,
 * loading saved games, and resetting game state.
 * 
 * @module gameInitActionTypes
 */

/**
 * Action types for game initialization operations
 */
export const GAME_INIT_ACTIONS = {
  /**
   * Initialize the game with saved data
   */
  INITIALIZE_GAME_DATA: 'game/initializeData',
  
  /**
   * Reset the game to its initial state
   */
  RESET_GAME: 'game/reset',
  
  /**
   * Import game data from an external source
   */
  IMPORT_GAME: 'game/import',
  
  /**
   * Start a new game
   */
  NEW_GAME: 'game/new'
};

/**
 * Game initialization action payload types
 */
export interface GameDataPayload {
  [key: string]: any;
}

/**
 * Game initialization action interface
 */
export interface GameInitAction {
  type: keyof typeof GAME_INIT_ACTIONS;
  payload: GameDataPayload;
}

/**
 * Game initialization action type union
 */
export type GameInitActionType = typeof GAME_INIT_ACTIONS[keyof typeof GAME_INIT_ACTIONS];