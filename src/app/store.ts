import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/Player/state/PlayerSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    // Add other reducers here as your application grows
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type for dispatch
export type AppDispatch = typeof store.dispatch;