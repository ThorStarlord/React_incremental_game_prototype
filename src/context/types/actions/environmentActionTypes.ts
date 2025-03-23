/**
 * Environment Action Types
 * =======================
 * 
 * This file defines action types related to the game's environment,
 * including weather, day/night cycles, and environmental effects.
 * 
 * @module environmentActionTypes
 */

/**
 * Action types for environment-related operations
 */
export const ENVIRONMENT_ACTIONS = {
  /**
   * Set the current weather condition
   */
  SET_WEATHER: 'environment/setWeather',
  
  /**
   * Change the time of day
   */
  SET_TIME_OF_DAY: 'environment/setTimeOfDay',
  
  /**
   * Apply environmental effect to an area
   */
  APPLY_ENVIRONMENTAL_EFFECT: 'environment/applyEffect',
  
  /**
   * Change seasons
   */
  CHANGE_SEASON: 'environment/changeSeason'
};

/**
 * Weather payload interface
 */
export interface WeatherPayload {
  weather: string;
  intensity?: number;
  duration?: number;
}

/**
 * Environment action interface
 */
export interface EnvironmentAction {
  type: keyof typeof ENVIRONMENT_ACTIONS;
  payload: any;
}

/**
 * Environment action type union
 */
export type EnvironmentActionType = typeof ENVIRONMENT_ACTIONS[keyof typeof ENVIRONMENT_ACTIONS];
