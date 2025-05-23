import { configureStore, ThunkAction, Action, combineReducers, PayloadAction } from '@reduxjs/toolkit'; // Import combineReducers and PayloadAction
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices with correct file paths
import playerReducer from '../features/Player/state/PlayerSlice';
import traitsReducer from '../features/Traits/state/TraitsSlice';
import essenceReducer from '../features/Essence/state/EssenceSlice';
import metaReducer from '../features/Meta/state/MetaSlice';
// Import the settings reducer
import settingsReducer from '../features/Settings/state/SettingsSlice';
// Import the game loop reducer
import gameLoopReducer from '../features/GameLoop/state/GameLoopSlice';

// Combine the slice reducers into a single reducer function
const combinedReducer = combineReducers({
  player: playerReducer,
  traits: traitsReducer,
  essence: essenceReducer,
  meta: metaReducer,
  // Add the settings reducer
  settings: settingsReducer,
  // Add the game loop reducer
  gameLoop: gameLoopReducer,
  // Add other reducers here
});

// Define the action type for replacing the state
const REPLACE_STATE = 'root/REPLACE_STATE';

// Define the action creator for replacing the state
// The payload will be the entire new RootState
export const replaceState = (newState: RootState): PayloadAction<RootState> => ({
  type: REPLACE_STATE,
  payload: newState,
});

// Create a root reducer that handles the REPLACE_STATE action
const rootReducer = (state: RootState | undefined, action: PayloadAction<any>): RootState => {
  if (action.type === REPLACE_STATE) {
    // If the action is REPLACE_STATE, return the payload as the new state
    // Ensure the payload structure matches RootState
    return action.payload as RootState;
  }
  // Otherwise, delegate to the combined reducer
  return combinedReducer(state, action);
};

// Configure the Redux store using the rootReducer
export const store = configureStore({
  reducer: rootReducer, // Use the rootReducer wrapper
  // Add middleware and other store enhancers here if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types that might include non-serializable data
        ignoredActions: ['persist/PERSIST', REPLACE_STATE], // Ignore REPLACE_STATE for serializable check if needed
      },
    }),
});

// Enable refetchOnFocus and other optional features
setupListeners(store.dispatch);

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof combinedReducer>; // Infer RootState from the combined reducer
export type AppDispatch = typeof store.dispatch;

// Useful type for thunks
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;