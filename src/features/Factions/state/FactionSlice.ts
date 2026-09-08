import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetPlayerState } from '../../Player/state/PlayerSlice';
import type { FactionReputationChange, FactionState } from './FactionTypes';

const initialState: FactionState = {
  reputationByFactionId: {},
};

const factionSlice = createSlice({
  name: 'factions',
  initialState,
  reducers: {
    adjustFactionReputation: (
      state,
      action: PayloadAction<FactionReputationChange>
    ) => {
      const { factionId, amount } = action.payload;
      if (!factionId || !Number.isFinite(amount) || amount === 0) return;
      state.reputationByFactionId[factionId] =
        (state.reputationByFactionId[factionId] ?? 0) + amount;
    },
    resetFactionReputation: state => {
      state.reputationByFactionId = {};
    },
  },
  extraReducers: builder => {
    builder.addCase(resetPlayerState, state => {
      state.reputationByFactionId = {};
    });
  },
});

export const { adjustFactionReputation, resetFactionReputation } = factionSlice.actions;
export default factionSlice.reducer;
