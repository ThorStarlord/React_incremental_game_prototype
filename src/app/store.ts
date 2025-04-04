import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/state/PlayerSlice';
import traitsReducer from '../features/Traits/state/TraitsSlice';
import essenceReducer from '../features/Essence/state/EssenceSlice';
import worldReducer from '../features/World/state/worldSlice';
import notificationsReducer from '../features/Notifications/state/NotificationsSlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    player: playerReducer,
    traits: traitsReducer,
    notifications: notificationsReducer,
    world: worldReducer,
    essence: essenceReducer,
    // Add other reducers here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;