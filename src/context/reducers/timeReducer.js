import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  day: 1,
  period: 'morning', // morning, afternoon, evening, night
  timestamp: Date.now()
};

const timeSlice = createSlice({
  name: 'gameTime',
  initialState,
  reducers: {
    advanceTime: (state, action) => {
      const { periods, days = 0 } = action.payload;
      const periodTypes = ['morning', 'afternoon', 'evening', 'night'];
      const currentPeriodIndex = periodTypes.indexOf(state.period);
      let newPeriodIndex = (currentPeriodIndex + periods) % 4;
      let dayAdvance = Math.floor((currentPeriodIndex + periods) / 4);
      dayAdvance += days;
      
      state.day += dayAdvance;
      state.period = periodTypes[newPeriodIndex];
      state.timestamp = Date.now();
    }
  }
});

export const { advanceTime } = timeSlice.actions;
export default timeSlice.reducer;