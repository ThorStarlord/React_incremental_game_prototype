import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * Game Time Reducer
 * 
 * Purpose: Manages the progression of time within the game world
 * - Tracks day count
 * - Cycles through time periods (morning, afternoon, evening, night)
 * - Updates timestamp for real-world time tracking
 * 
 * This reducer is essential for game mechanics that depend on the passage of time,
 * such as daily resets, character needs, and timed events.
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

      return {
        ...state,
        gameTime: {
          ...state.gameTime,
          day: nextDay,
          period: nextPeriod,
          timestamp: Date.now()
        }
      };
    }
    default:
      return state;
  }
};