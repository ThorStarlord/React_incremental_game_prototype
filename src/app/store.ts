import { configureStore } from '@reduxjs/toolkit';
// Use consistent casing for imports (lowercase feature folders)
import playerReducer from '../features/player/state/PlayerSlice';
import traitsReducer from '../features/traits/state/TraitsSlice';
import essenceReducer from '../features/essence/state/EssenceSlice';
import worldReducer from '../features/world/state/worldSlice';
import notificationsReducer from '../features/notifications/state/NotificationsSlice';
import skillsReducer from '../features/skills/state/SkillsSlice';
import questsReducer from '../features/quests/state/QuestsSlice';
import combatReducer from '../features/combat/state/CombatSlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    player: playerReducer,
    traits: traitsReducer,
    notifications: notificationsReducer,
    world: worldReducer,
    essence: essenceReducer,
    skills: skillsReducer,
    quests: questsReducer,
    combat: combatReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['combat/startCombat/fulfilled'],
        // Ignore these field paths in state
        ignoredPaths: ['combat.log'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;