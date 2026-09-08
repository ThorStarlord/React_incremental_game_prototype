import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetPlayerState } from '../../Player/state/PlayerSlice';
import type { KnowledgeState } from './KnowledgeTypes';

const initialState: KnowledgeState = {
  factIdsByNpcId: {},
};

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    learnNpcFact: (
      state,
      action: PayloadAction<{ npcId: string; factId: string }>
    ) => {
      const { npcId, factId } = action.payload;
      if (!npcId || !factId) return;
      const existing = state.factIdsByNpcId[npcId] ?? [];
      if (!existing.includes(factId)) {
        state.factIdsByNpcId[npcId] = [...existing, factId];
      }
    },
    resetKnowledge: (state) => {
      state.factIdsByNpcId = {};
    },
  },
  extraReducers: builder => {
    builder.addCase(resetPlayerState, state => {
      state.factIdsByNpcId = {};
    });
  },
});

export const { learnNpcFact, resetKnowledge } = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
