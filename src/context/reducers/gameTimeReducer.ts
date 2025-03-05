import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Game Time Reducer - Manages time progression in the game world
 */

// Define interfaces for state
interface GameState {
  gameTime: GameTimeState;
  [key: string]: any;
}

interface GameTimeState {
  day: number;
  period: TimePeriod;
  season: Season;
  weather?: Weather;
  timestamp: number;
  totalPeriodsPassed?: number;
  weatherStart?: number;
  weatherDuration?: number;
  lastSeasonChange?: SeasonChange;
}

type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Weather = 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'snowy';

interface SeasonChange {
  from: Season;
  to: Season;
  day: number;
  timestamp: number;
}

// Constants
const TIME_PERIODS: TimePeriod[] = ['morning', 'afternoon', 'evening', 'night'];
const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const WEATHER_TYPES: Weather[] = ['clear', 'cloudy', 'rainy', 'stormy', 'foggy'];

// Helper functions
const getNextPeriod = (currentPeriod: TimePeriod): TimePeriod => {
  const currentIndex = TIME_PERIODS.indexOf(currentPeriod);
  return TIME_PERIODS[(currentIndex + 1) % TIME_PERIODS.length];
};

const getNextSeason = (currentSeason: Season): Season => {
  const currentIndex = SEASONS.indexOf(currentSeason);
  return SEASONS[(currentIndex + 1) % SEASONS.length];
};

const getSeasonalWeather = (season: Season): Weather[] => {
  const baseWeather = [...WEATHER_TYPES];
  if (season === 'winter') baseWeather.push('snowy', 'snowy');
  if (season === 'summer') baseWeather.push('clear', 'clear');
  return baseWeather as Weather[];
};

export const gameTimeReducer = (
  state: GameState, 
  action: { type: string; payload: any }
): GameState => {
  switch (action.type) {
    case ACTION_TYPES.ADVANCE_TIME: {
      const { period, day, season } = state.gameTime;
      const currentPeriodIndex = TIME_PERIODS.indexOf(period);
      
      // Check if day changes (night -> morning transition)
      const isLastPeriod = currentPeriodIndex === TIME_PERIODS.length - 1;
      const nextPeriod = getNextPeriod(period);
      const nextDay = isLastPeriod ? day + 1 : day;
      
      // Check for season change every 28 days
      let nextSeason = season;
      let seasonChanged = false;
      
      if (isLastPeriod && nextDay > 0 && nextDay % 28 === 0) {
        nextSeason = getNextSeason(season);
        seasonChanged = true;
      }
      
      // Update game time state
      const newState: GameState = {
        ...state,
        gameTime: {
          ...state.gameTime,
          day: nextDay,
          period: nextPeriod,
          season: nextSeason,
          timestamp: Date.now(),
          totalPeriodsPassed: (state.gameTime.totalPeriodsPassed || 0) + 1
        }
      };
      
      // Record season change if it occurred
      if (seasonChanged) {
        newState.gameTime.lastSeasonChange = {
          from: season,
          to: nextSeason,
          day: nextDay,
          timestamp: Date.now()
        };
        
        return addNotification(newState, {
          message: `The season has changed to ${nextSeason}.`,
          type: "event"
        });
      }
      
      // Add notification for day change
      if (isLastPeriod) {
        return addNotification(newState, {
          message: `A new day (${nextDay}) dawns.`,
          type: "info"
        });
      }

      // Handle weather changes (20% chance per period)
      if (Math.random() < 0.2) {
        const weatherTypes = getSeasonalWeather(nextSeason);
        const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        if (newWeather !== newState.gameTime.weather) {
          newState.gameTime.weather = newWeather;
          newState.gameTime.weatherStart = newState.gameTime.totalPeriodsPassed;
          
          return addNotification(newState, {
            message: `The weather has changed to ${newWeather}.`,
            type: "info"
          });
        }
      }

      return newState;
    }
    
    case ACTION_TYPES.SET_TIME: {
      const { period, day } = action.payload;
      
      if (!TIME_PERIODS.includes(period)) return state;
      
      return {
        ...state,
        gameTime: {
          ...state.gameTime,
          day: day !== undefined ? day : state.gameTime.day,
          period,
          timestamp: Date.now()
        }
      };
    }
    
    case ACTION_TYPES.SKIP_TO_PERIOD: {
      const { targetPeriod } = action.payload;
      
      if (!TIME_PERIODS.includes(targetPeriod)) return state;
      
      // Calculate periods to advance
      const currentPeriodIndex = TIME_PERIODS.indexOf(state.gameTime.period);
      const targetPeriodIndex = TIME_PERIODS.indexOf(targetPeriod);
      const periodsToAdvance = targetPeriodIndex <= currentPeriodIndex 
        ? (TIME_PERIODS.length - currentPeriodIndex) + targetPeriodIndex
        : targetPeriodIndex - currentPeriodIndex;
      
      // Update days if needed
      const daysToAdd = Math.floor(periodsToAdvance / TIME_PERIODS.length);
      
      return {
        ...state,
        gameTime: {
          ...state.gameTime,
          day: state.gameTime.day + daysToAdd,
          period: targetPeriod,
          timestamp: Date.now(),
          totalPeriodsPassed: (state.gameTime.totalPeriodsPassed || 0) + periodsToAdvance
        }
      };
    }
    
    case ACTION_TYPES.CHANGE_SEASON: {
      const { season } = action.payload;
      
      if (!SEASONS.includes(season)) return state;
      
      return addNotification({
        ...state,
        gameTime: {
          ...state.gameTime,
          season,
          lastSeasonChange: {
            from: state.gameTime.season,
            to: season,
            day: state.gameTime.day,
            timestamp: Date.now()
          }
        }
      }, {
        message: `The season has changed to ${season}.`,
        type: "event"
      });
    }
    
    case ACTION_TYPES.SET_WEATHER: {
      const { weather, duration = 1 } = action.payload;
      const validWeatherTypes = [...WEATHER_TYPES, 'snowy'];
      
      if (!validWeatherTypes.includes(weather)) return state;
      
      return {
        ...state,
        gameTime: {
          ...state.gameTime,
          weather,
          weatherDuration: duration,
          weatherStart: state.gameTime.totalPeriodsPassed || 0
        }
      };
    }
    
    default:
      return state;
  }
};
