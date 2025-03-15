/**
 * @file GameTimeInitialState.ts
 * @description Defines the initial state for the game time system.
 */

import { 
  GameTimeState, 
  TimeCycle, 
  Season, 
  Weather 
} from '../types/TimeGameStateTypes';

/**
 * Initial state for game time
 */
const gameTimeInitialState: GameTimeState = {
  currentDay: 1,
  currentHour: 0,
  currentMinute: 0,
  currentSeason: Season.Spring,
  currentWeather: Weather.Clear,
  timeCycle: TimeCycle.Day,
  lastSeasonChange: null,
  lastWeatherChange: null,
  timeSpeed: 1, // 1x speed by default
  paused: false,
  totalPeriodsPassed: 0 // Track total time periods that have passed
};

/**
 * Constants for time-related calculations
 */
export const TIME_CONSTANTS = {
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  DAYS_PER_SEASON: 28,
  SEASONS_PER_YEAR: 4,
  MINUTES_PER_DAY: 24 * 60
};

/**
 * Get the current period of day based on hour
 */
export const getTimeCycleFromHour = (hour: number): TimeCycle => {
  if (hour >= 5 && hour < 12) return TimeCycle.Morning;
  if (hour >= 12 && hour < 17) return TimeCycle.Afternoon;
  if (hour >= 17 && hour < 21) return TimeCycle.Evening;
  return TimeCycle.Night;
};

/**
 * Convert minutes to a formatted time string
 */
export const formatTimeString = (hour: number, minute: number): string => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  const paddedMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${paddedMinute} ${ampm}`;
};

export default gameTimeInitialState;
