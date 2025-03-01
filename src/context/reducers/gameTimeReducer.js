import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Game Time Reducer
 * 
 * Purpose: Manages the progression of time within the game world
 * - Tracks day count and time periods (morning, afternoon, evening, night)
 * - Handles seasonal transitions and weather patterns
 * - Manages time-based events and triggers
 * - Maintains real-world timestamps for analytics
 * 
 * This reducer is essential for game mechanics that depend on the passage of time,
 * such as daily resets, character needs, and timed events.
 * 
 * Actions:
 * - ADVANCE_TIME: Progresses to the next time period
 * - SET_TIME: Manually sets a specific time period
 * - SKIP_TO_PERIOD: Advances time to a target period
 * - CHANGE_SEASON: Updates the current game season
 * - SET_WEATHER: Updates the current weather conditions
 */
export const gameTimeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADVANCE_TIME: {
      // Define the time periods in order
      const periods = ['morning', 'afternoon', 'evening', 'night'];
      const currentPeriodIndex = periods.indexOf(state.gameTime.period);
      
      // Determine if we need to advance to the next day
      // If we're at night, cycle back to morning and increment the day
      const isLastPeriod = currentPeriodIndex === periods.length - 1;
      const nextPeriod = isLastPeriod ? periods[0] : periods[currentPeriodIndex + 1];
      const nextDay = isLastPeriod ? state.gameTime.day + 1 : state.gameTime.day;
      
      // Check for season change (every 28 days)
      let season = state.gameTime.season || 'spring';
      if (isLastPeriod && nextDay > 0 && nextDay % 28 === 0) {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const currentSeasonIndex = seasons.indexOf(season);
        season = seasons[(currentSeasonIndex + 1) % seasons.length];
        
        // Create notification for season change
        const seasonChangeState = {
          ...state,
          gameTime: {
            ...state.gameTime,
            day: nextDay,
            period: nextPeriod,
            season,
            timestamp: Date.now(),
            totalPeriodsPassed: (state.gameTime.totalPeriodsPassed || 0) + 1,
            lastSeasonChange: {
              from: state.gameTime.season,
              to: season,
              day: nextDay,
              timestamp: Date.now()
            }
          }
        };
        
        return addNotification(seasonChangeState, {
          message: `The season has changed to ${season}.`,
          type: "event"
        });
      }
      
      // Regular time advance
      const newState = {
        ...state,
        gameTime: {
          ...state.gameTime,
          day: nextDay,
          period: nextPeriod,
          season: season || 'spring', // Ensure season exists
          timestamp: Date.now(),
          totalPeriodsPassed: (state.gameTime.totalPeriodsPassed || 0) + 1
        }
      };

      // Add notification for day change
      if (isLastPeriod) {
        return addNotification(newState, {
          message: `A new day (${nextDay}) dawns.`,
          type: "info"
        });
      }

      // Handle weather changes (simplified)
      if (Math.random() < 0.2) { // 20% chance of weather changing each period
        const weatherTypes = ['clear', 'cloudy', 'rainy', 'stormy', 'foggy'];
        // In winter, add snowy
        if (season === 'winter') weatherTypes.push('snowy', 'snowy');
        // In summer, more chance of clear
        if (season === 'summer') weatherTypes.push('clear', 'clear');
        
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
      
      // Validate the period is valid
      const periods = ['morning', 'afternoon', 'evening', 'night'];
      if (!periods.includes(period)) {
        return state;
      }
      
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
      
      // Validate the target period
      const periods = ['morning', 'afternoon', 'evening', 'night'];
      if (!periods.includes(targetPeriod)) {
        return state;
      }
      
      // Calculate how many periods to advance
      const currentPeriodIndex = periods.indexOf(state.gameTime.period);
      const targetPeriodIndex = periods.indexOf(targetPeriod);
      
      // Calculate if we need to move to the next day
      const periodsToAdvance = targetPeriodIndex <= currentPeriodIndex 
        ? (periods.length - currentPeriodIndex) + targetPeriodIndex
        : targetPeriodIndex - currentPeriodIndex;
      
      // Update days if needed
      const daysToAdd = Math.floor(periodsToAdvance / periods.length);
      
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
      
      // Validate season
      const seasons = ['spring', 'summer', 'autumn', 'winter'];
      if (!seasons.includes(season)) {
        return state;
      }
      
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
      
      // Valid weather conditions
      const validWeatherTypes = ['clear', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy'];
      if (!validWeatherTypes.includes(weather)) {
        return state;
      }
      
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