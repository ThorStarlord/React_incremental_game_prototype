import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetPlayerState } from '../../Player/state/PlayerSlice';
import type { WorldState, WorldStateMutation } from './WorldStateTypes';

const initialState: WorldState = {
  regions: {},
};

const isValidMutation = (mutation: WorldStateMutation): boolean => {
  if (!mutation.regionId) return false;
  if (mutation.field === 'watchPresence') {
    return mutation.value === 'normal' || mutation.value === 'heavy';
  }
  if (mutation.field === 'tradeFlow') {
    return mutation.value === 'normal' || mutation.value === 'strong';
  }
  return false;
};

const worldStateSlice = createSlice({
  name: 'worldState',
  initialState,
  reducers: {
    setWorldStateCondition: (state, action: PayloadAction<WorldStateMutation>) => {
      const mutation = action.payload;
      if (!isValidMutation(mutation)) return;

      const region = state.regions[mutation.regionId] ?? {};
      if (mutation.field === 'watchPresence') {
        region.watchPresence = mutation.value;
      } else if (mutation.field === 'tradeFlow') {
        region.tradeFlow = mutation.value;
      }
      state.regions[mutation.regionId] = region;
    },
    resetWorldState: state => {
      state.regions = {};
    },
  },
  extraReducers: builder => {
    builder.addCase(resetPlayerState, state => {
      state.regions = {};
    });
  },
});

export const { setWorldStateCondition, resetWorldState } = worldStateSlice.actions;
export default worldStateSlice.reducer;
