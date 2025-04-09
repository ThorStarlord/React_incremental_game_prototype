import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices with correct file paths
import playerReducer from '../features/Player/state/PlayerSlice';
import traitsReducer from '../features/Traits/state/TraitsSlice';
import essenceReducer from '../features/Essence/state/EssenceSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    player: playerReducer,
    traits: traitsReducer,
    essence: essenceReducer,
    // Add other reducers as they become available
    // world: worldReducer,
    // notifications: notificationsReducer,
    // skills: skillsReducer,
    // quests: questsReducer,
    // combat: combatReducer,
  },
  // Add middleware and other store enhancers here if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types that might include non-serializable data
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Enable refetchOnFocus and other optional features
setupListeners(store.dispatch);

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Useful type for thunks
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;