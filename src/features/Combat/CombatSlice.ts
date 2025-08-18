import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CombatState {
  // Add any combat-related state here in the future
}

const initialState: CombatState = {};

const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    targetKilled(state, action: PayloadAction<{ targetId: string }>) {
      // This action is just for the listener to pick up.
      // We can add state changes here later if needed.
    },
  },
});

export const { targetKilled } = combatSlice.actions;
export default combatSlice.reducer;
