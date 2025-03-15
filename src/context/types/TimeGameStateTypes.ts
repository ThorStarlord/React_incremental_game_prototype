/**
 * Type definitions for game time system
 */

/**
 * Time cycles representing different periods of the day
 */
export enum TimeCycle {
  Day = 'day',
  Night = 'night',
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
  Midnight = 'midnight'
}

/**
 * Seasons in the game world
 */
export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
  Winter = 'winter'
}

/**
 * Weather conditions
 */
export enum Weather {
  Clear = 'clear',
  Cloudy = 'cloudy',
  Rainy = 'rainy',
  Stormy = 'stormy',
  Foggy = 'foggy',
  Snowy = 'snowy'
}

/**
 * Event recording changes in time-related elements
 */
export interface TimeChangeEvent {
  from: Season | Weather;
  to: Season | Weather;
  day: number;
  timestamp: number;
}

/**
 * Game time state
 */
export interface GameTimeState {
  currentDay: number;
  currentHour: number;
  currentMinute: number;
  currentSeason: Season;
  currentWeather: Weather;
  timeCycle: TimeCycle;
  lastSeasonChange: TimeChangeEvent | null;
  lastWeatherChange: TimeChangeEvent | null;
  timeSpeed: number; // Multiplier for time progression speed
  paused: boolean;
  totalPeriodsPassed?: number; // Track total time periods that have passed
  weatherDuration?: number; // How long current weather will last
  weatherStart?: number; // When current weather started (in periods)
}
