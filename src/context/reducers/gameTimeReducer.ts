import { createReducer } from '../utils/reducerUtils';
import { 
  GameTimeState, 
  TimeCycle, 
  Season, 
  Weather, 
  TimeChangeEvent 
} from '../types/TimeGameStateTypes';
import { addNotification } from '../utils/notificationUtils';
import gameTimeInitialState from '../initialStates/GameTimeInitialState';

/**
 * Game time action types
 */
export const GAME_TIME_ACTIONS = {
  ADVANCE_TIME: 'gameTime/advance',
  SET_TIME: 'gameTime/set',
  SKIP_TO_PERIOD: 'gameTime/skipToPeriod',
  CHANGE_SEASON: 'gameTime/changeSeason',
  SET_WEATHER: 'gameTime/setWeather',
  PAUSE_TIME: 'gameTime/pause',
  RESUME_TIME: 'gameTime/resume',
  SET_TIME_SPEED: 'gameTime/setSpeed'
} as const;

/**
 * Game time action types with improved typing
 */
export type GameTimeAction = 
  | { type: typeof GAME_TIME_ACTIONS.ADVANCE_TIME; payload: { minutes: number } }
  | { type: typeof GAME_TIME_ACTIONS.SET_TIME; payload: { day: number; hour: number; minute: number } }
  | { type: typeof GAME_TIME_ACTIONS.SKIP_TO_PERIOD; payload: { timeCycle: TimeCycle } }
  | { type: typeof GAME_TIME_ACTIONS.CHANGE_SEASON; payload: { season: Season } }
  | { type: typeof GAME_TIME_ACTIONS.SET_WEATHER; payload: { weather: Weather; duration?: number } }
  | { type: typeof GAME_TIME_ACTIONS.PAUSE_TIME }
  | { type: typeof GAME_TIME_ACTIONS.RESUME_TIME }
  | { type: typeof GAME_TIME_ACTIONS.SET_TIME_SPEED; payload: { speed: number } };

// Helper functions from TimeReducer.ts
const getNextSeason = (currentSeason: Season): Season => {
  const seasons = [Season.Spring, Season.Summer, Season.Autumn, Season.Winter];
  const currentIndex = seasons.indexOf(currentSeason);
  return seasons[(currentIndex + 1) % seasons.length];
};

const getSeasonalWeather = (season: Season): Weather[] => {
  const baseWeather = [Weather.Clear, Weather.Cloudy, Weather.Rainy, Weather.Stormy, Weather.Foggy];
  if (season === Season.Winter) baseWeather.push(Weather.Snowy, Weather.Snowy);
  if (season === Season.Summer) baseWeather.push(Weather.Clear, Weather.Clear);
  return baseWeather;
};

/**
 * Helper function to narrow action types with improved type safety
 */
function isActionOfType<T extends typeof GAME_TIME_ACTIONS[keyof typeof GAME_TIME_ACTIONS]>(
  action: GameTimeAction,
  type: T
): action is Extract<GameTimeAction, { type: T }> {
  return action.type === type;
}

/**
 * Game time reducer implementation using the createReducer utility
 */
export const gameTimeReducer = createReducer<GameTimeState, GameTimeAction>(
  gameTimeInitialState,
  {
    [GAME_TIME_ACTIONS.ADVANCE_TIME]: (state, action) => {
      // Type guard for ADVANCE_TIME action
      if (!isActionOfType(action, GAME_TIME_ACTIONS.ADVANCE_TIME)) {
        return state;
      }
      
      const { minutes } = action.payload;
      const totalMinutes = state.currentMinute + minutes;
      const newHour = state.currentHour + Math.floor(totalMinutes / 60);
      const newDay = state.currentDay + Math.floor(newHour / 24);
      
      // Check for season change every 28 days (from TimeReducer.ts)
      let seasonChanged = false;
      let nextSeason = state.currentSeason;
      
      if (newDay > state.currentDay && newDay % 28 === 0) {
        nextSeason = getNextSeason(state.currentSeason);
        seasonChanged = true;
      }
      
      // Create new state with updated time values
      const newState = {
        ...state,
        currentMinute: totalMinutes % 60,
        currentHour: newHour % 24,
        currentDay: newDay,
        currentSeason: nextSeason,
        totalPeriodsPassed: (state.totalPeriodsPassed || 0) + 1
      };
      
      // Record season change if it occurred
      if (seasonChanged) {
        newState.lastSeasonChange = {
          from: state.currentSeason,
          to: nextSeason,
          day: newDay,
          timestamp: Date.now()
        };
        
        return addNotification(newState, {
          message: `The season has changed to ${nextSeason}.`,
          type: "info"  // Using valid NotificationType
        });
      }
      
      // Add notification for day change
      if (newDay > state.currentDay) {
        // Create notification for new day
        const dayState = addNotification(newState, {
          message: `A new day (${newDay}) dawns.`,
          type: "info"
        });
        
        // Handle random weather changes (20% chance per day)
        if (Math.random() < 0.2) {
          const weatherTypes = getSeasonalWeather(nextSeason);
          const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
          
          if (newWeather !== dayState.currentWeather) {
            return {
              ...dayState,
              currentWeather: newWeather,
              lastWeatherChange: {
                from: dayState.currentWeather,
                to: newWeather,
                day: newDay,
                timestamp: Date.now()
              }
            };
          }
        }
        
        return dayState;
      }
      
      return newState;
    },
    
    [GAME_TIME_ACTIONS.SET_TIME]: (state, action) => {
      // Type guard for SET_TIME action
      if (!isActionOfType(action, GAME_TIME_ACTIONS.SET_TIME)) {
        return state;
      }
      
      const { day, hour, minute } = action.payload;
      
      return {
        ...state,
        currentDay: day,
        currentHour: hour,
        currentMinute: minute
      };
    },
    
    [GAME_TIME_ACTIONS.SKIP_TO_PERIOD]: (state, action) => {
      // Type guard for SKIP_TO_PERIOD action
      if (!isActionOfType(action, GAME_TIME_ACTIONS.SKIP_TO_PERIOD)) {
        return state;
      }
      
      const { timeCycle } = action.payload;
      
      let newHour = state.currentHour;
      switch (timeCycle) {
        case TimeCycle.Day:
          newHour = 6;
          break;
        case TimeCycle.Night:
          newHour = 18;
          break;
        case TimeCycle.Morning:
          newHour = 6;
          break;
        case TimeCycle.Afternoon:
          newHour = 12;
          break;
        case TimeCycle.Evening:
          newHour = 18;
          break;
        case TimeCycle.Midnight:
          newHour = 0;
          break;
      }
      
      return {
        ...state,
        currentHour: newHour,
        currentMinute: 0,
        timeCycle
      };
    },
    
    [GAME_TIME_ACTIONS.CHANGE_SEASON]: (state, action) => {
      // Type guard for CHANGE_SEASON action
      if (!isActionOfType(action, GAME_TIME_ACTIONS.CHANGE_SEASON)) {
        return state;
      }
      
      const { season } = action.payload;
      
      const updatedState = {
        ...state,
        currentSeason: season,
        lastSeasonChange: {
          from: state.currentSeason,
          to: season,
          day: state.currentDay,
          timestamp: Date.now()
        }
      };
      
      // Add notification about season change (from TimeReducer.ts)
      return addNotification(updatedState, {
        message: `The season has changed to ${season}.`,
        type: "info" // Using valid NotificationType
      });
    },
    
    [GAME_TIME_ACTIONS.SET_WEATHER]: (state, action) => {
      // Type guard for SET_WEATHER action
      if (!isActionOfType(action, GAME_TIME_ACTIONS.SET_WEATHER)) {
        return state;
      }
      
      const { weather, duration = 1 } = action.payload;
      
      return {
        ...state,
        currentWeather: weather,
        lastWeatherChange: {
          from: state.currentWeather,
          to: weather,
          day: state.currentDay,
          timestamp: Date.now()
        },
        weatherDuration: duration,
        weatherStart: state.totalPeriodsPassed || 0
      };
    },
    
    [GAME_TIME_ACTIONS.PAUSE_TIME]: (state) => {
      return {
        ...state,
        paused: true
      };
    },
    
    [GAME_TIME_ACTIONS.RESUME_TIME]: (state) => {
      return {
        ...state,
        paused: false
      };
    },
    
    [GAME_TIME_ACTIONS.SET_TIME_SPEED]: (state, action) => {
      // Type guard for SET_TIME_SPEED action
      if (!isActionOfType(action, GAME_TIME_ACTIONS.SET_TIME_SPEED)) {
        return state;
      }
      
      const { speed } = action.payload;
      
      return {
        ...state,
        timeSpeed: speed
      };
    }
  }
);

export default gameTimeReducer;
