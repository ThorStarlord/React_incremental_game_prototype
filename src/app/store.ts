import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Import default exports (reducers) from each slice
import gameLoopReducer from '../features/GameLoop/state/GameLoopSlice';
import playerReducer from '../features/Player/state/PlayerSlice';
import traitsReducer from '../features/Traits/state/TraitsSlice';
import essenceReducer from '../features/Essence/state/EssenceSlice';
import settingsReducer from '../features/Settings/state/SettingsSlice';
import metaReducer from '../features/Meta/state/MetaSlice';
import npcsReducer from '../features/NPCs/state/NPCSlice';

// Combine all feature reducers
const combinedReducer = combineReducers({
  gameLoop: gameLoopReducer,
  player: playerReducer,
  traits: traitsReducer,
  essence: essenceReducer,
  settings: settingsReducer,
  meta: metaReducer,
  npcs: npcsReducer,
});

// Root state type from combined reducers
export type RootState = ReturnType<typeof combinedReducer>;

// Special action for replacing entire state during save/load operations
interface ReplaceStateAction {
  type: 'meta/replaceState';
  payload: RootState;
}

/**
 * Root reducer that handles the combined reducers and special actions
 *
 * Handles the special 'meta/replaceState' action for save/load operations
 * by completely replacing the current state with the provided payload.
 * All other actions are delegated to the combined reducer.
 */
const rootReducer = (state: RootState | undefined, action: PayloadAction<any>): RootState => {
  // Handle the special replaceState action for save/load operations
  if (action.type === 'meta/replaceState') {
    const replaceAction = action as ReplaceStateAction;
    return replaceAction.payload;
  }

  // Otherwise, delegate to the combined reducer
  return combinedReducer(state, action);
};

/**
 * Configure the Redux store with proper middleware and dev tools
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the replaceState action as it contains the entire state tree
        ignoredActions: ['meta/replaceState'],
        // Allow functions in state for thunks and selectors
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export store types for use in components
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Export the replaceState action creator for save/load operations
export const replaceState = (newState: RootState): ReplaceStateAction => ({
  type: 'meta/replaceState',
  payload: newState,
});

export default store;