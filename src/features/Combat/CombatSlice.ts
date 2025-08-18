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
    // NOTE: This action is intentionally side-effect-only and does not update state.
    // It exists solely for listeners/middleware to react to target kills.
    targetKilled(state, action: PayloadAction<{ targetId: string }>) {
      // No state update required.
    },
  },
});

export const { targetKilled } = combatSlice.actions;
export default combatSlice.reducer;
