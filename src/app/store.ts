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
import copyReducer from '../features/Copy/state/CopySlice'; // Corrected import path
import questReducer from '../features/Quest/state/QuestSlice';
import notificationsReducer from '../shared/state/NotificationSlice';
import { inventoryReducer } from '../features/Inventory/state/InventorySlice';
import { copyListeners } from '../features/Copy/state/CopyListeners';
import { gameEventListeners } from './listeners/GameEventListeners';

// Combine all feature reducers
const combinedReducer = combineReducers({
  gameLoop: gameLoopReducer,
  player: playerReducer,
  traits: traitsReducer,
  essence: essenceReducer,
  settings: settingsReducer,
  meta: metaReducer,
  npcs: npcsReducer,
  copy: copyReducer, // Corrected reducer name
  quest: questReducer,
  notifications: notificationsReducer,
  inventory: inventoryReducer,
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
 */
export const rootReducer = (state: RootState | undefined, action: PayloadAction<any>): RootState => {
  if (action.type === 'meta/replaceState') {
    const replaceAction = action as ReplaceStateAction;
    return replaceAction.payload;
  }
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
        ignoredActions: ['meta/replaceState'],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
      },
  }).prepend(copyListeners.middleware, gameEventListeners.middleware),
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