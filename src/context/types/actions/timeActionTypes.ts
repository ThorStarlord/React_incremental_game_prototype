/**
 * Time Action Types
 * ================
 * 
 * This file defines action types related to the game's time system,
 * including day/night cycles, calendar progress, and time-based events.
 * 
 * @module timeActionTypes
 */

/**
 * Action types for time-related operations
 */
export const TIME_ACTIONS = {
  /**
   * Advance the game time
   */
  ADVANCE_TIME: 'time/advanceTime',
  
  /**
   * Set the game time to a specific value
   */
  SET_TIME: 'time/setTime',
  
  /**
   * Pause the game time
   */
  PAUSE_TIME: 'time/pauseTime',
  
  /**
   * Resume the game time
   */
  RESUME_TIME: 'time/resumeTime'
};

/**
 * Time action payload interface
 */
export interface TimePayload {
  amount?: number;
  timestamp?: number;
}

/**
 * Time action interface
 */
export interface TimeAction {
  type: keyof typeof TIME_ACTIONS;
  payload: TimePayload;
}

/**
 * Time action type union
 */
export type TimeActionType = typeof TIME_ACTIONS[keyof typeof TIME_ACTIONS];
