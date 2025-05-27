/**
 * Redux Thunks for Essence-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gainEssence } from './EssenceSlice';
import { RootState } from '../../../app/store';

/**
 * Generate essence over time based on current generators and modifiers
 */
export const generateEssence = createAsyncThunk<number, void, { state: RootState }>(
  'essence/generate',
  async (_, { dispatch, getState }) => {
    const rate = getState().essence.generationRate ?? 0;
    const amount = Math.floor(rate);
    if (amount > 0) {
      dispatch(gainEssence(amount));
    }
    return amount;
  }
);
