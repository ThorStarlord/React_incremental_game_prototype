import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface EssenceState {
  amount: number;
  totalEarned: number;
  totalSpent: number;
  transactions: {
    timestamp: number;
    amount: number;
    reason: string;
    isSpending: boolean;
  }[];
}

const initialState: EssenceState = {
  amount: 0,
  totalEarned: 0,
  totalSpent: 0,
  transactions: []
};

interface EarnEssencePayload {
  amount: number;
  source?: string;
}

interface SpendEssencePayload {
  amount: number;
  reason: string;
}

const essenceSlice = createSlice({
  name: 'essence',
  initialState,
  reducers: {
    earnEssence: (state, action: PayloadAction<EarnEssencePayload>) => {
      const { amount, source = 'unknown' } = action.payload;
      
      if (amount <= 0) return;
      
      state.amount += amount;
      state.totalEarned += amount;
      
      // Record the transaction
      state.transactions.push({
        timestamp: Date.now(),
        amount,
        reason: `Earned from ${source}`,
        isSpending: false
      });
    },
    
    spendEssence: (state, action: PayloadAction<SpendEssencePayload>) => {
      const { amount, reason } = action.payload;
      
      if (amount <= 0) return;
      if (state.amount < amount) {
        throw new Error(`Not enough essence. Required: ${amount}, Available: ${state.amount}`);
      }
      
      state.amount -= amount;
      state.totalSpent += amount;
      
      // Record the transaction
      state.transactions.push({
        timestamp: Date.now(),
        amount,
        reason,
        isSpending: true
      });
    },
    
    // If you need to set the essence amount directly (e.g., loading from save)
    setEssenceAmount: (state, action: PayloadAction<number>) => {
      state.amount = Math.max(0, action.payload);
    }
  }
});

export const { earnEssence, spendEssence, setEssenceAmount } = essenceSlice.actions;

// Selectors
export const selectEssenceAmount = (state: RootState) => state.essence.amount;
export const selectTotalEarned = (state: RootState) => state.essence.totalEarned;
export const selectTotalSpent = (state: RootState) => state.essence.totalSpent;
export const selectEssenceTransactions = (state: RootState) => state.essence.transactions;

export default essenceSlice.reducer;
