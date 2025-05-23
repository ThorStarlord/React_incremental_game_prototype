# State Management Specification (Redux Toolkit)

This document details the structure and strategy for managing application state using Redux Toolkit (RTK).

## 1. Overview

Redux Toolkit is used as the **single source of truth** for the application's global state. It provides a predictable and maintainable way to manage complex state interactions inherent in an incremental RPG.

**Architecture Status**: ✅ **IMPLEMENTED** - Redux Toolkit serves as the exclusive state management system with no competing context-based approaches.

## 2. Core Principles

*   **Single Source of Truth:** The entire application state is stored in a single Redux store object.
*   **State is Read-Only:** The only way to change the state is by dispatching actions.
*   **Changes are Made with Pure Functions:** Reducers are pure functions that take the previous state and an action, and return the next state. Immutability is handled by Immer within RTK.
*   **Feature-Sliced Structure:** State logic is co-located with the feature it belongs to (`src/features/FeatureName/state/`).
*   **Type Safety**: ✅ **IMPLEMENTED** - Strong TypeScript integration throughout state management.

## 3. Redux Toolkit Features Used

*   **`configureStore`:** Sets up the Redux store with sensible defaults (like Redux DevTools Extension integration and default middleware).
*   **`createSlice`:** Generates slice reducers and action creators with less boilerplate. Uses Immer internally for immutable updates.
*   **`createAsyncThunk`:** Handles asynchronous logic (like API calls, `localStorage` interactions) and dispatches actions based on promise lifecycle (pending, fulfilled, rejected).
*   **`createSelector` (via Reselect):** Creates memoized selectors to efficiently compute derived data and optimize performance by preventing unnecessary re-renders.
*   **Typed Hooks (`useAppDispatch`, `useAppSelector`):** Provide type safety when dispatching actions and selecting state.

## 4. State Structure (Slices) ✅ IMPLEMENTED

The global state (`RootState`) is composed of multiple slices, each managing a specific domain:

*   **`gameLoop` (`GameLoopSlice.ts`):** ✅ **IMPLEMENTED**
    *   Manages core game timing and state: running status, pause state, tick count, game speed, total game time, auto-save configuration.
    *   *Key Actions:* `startGame`, `pauseGame`, `resumeGame`, `stopGame`, `setGameSpeed`, `incrementTick`, `updateGameTime`, `triggerAutoSave`.
    *   *Integration:* Provides tick-based updates to other systems via custom hooks and callbacks.

*   **`player` (`PlayerSlice.ts`):** ✅ **IMPLEMENTED**
    *   Manages player-specific data: name, level, XP, stats (HP, MP, attack, etc.), attributes (STR, DEX, etc.), skills, status effects, equipment.
    *   *Key Actions:* `updatePlayer`, `setName`, `resetPlayer`, `modifyHealth`, `allocateAttribute`, `updateSkill`, `equipItem`.
    *   *Types:* Comprehensive type definitions in `PlayerTypes.ts` with proper Feature-Sliced exports.
    *   *Selectors:* Memoized selectors in `PlayerSelectors.ts` for efficient state access.

*   **`traits` (`TraitsSlice.ts`):** ✅ **IMPLEMENTED**
    *   Manages all trait definitions, player's acquired traits, equipped traits, permanent traits, trait slots, and presets.
    *   *Key Actions:* `setTraits`, `acquireTrait`, `discoverTrait`, `equipTrait`, `unequipTrait`, `makePermanent`, `unlockTraitSlot`, `saveTraitPreset`.
    *   *Thunks:* `fetchTraitsThunk`, `makeTraitPermanentThunk`.

*   **`essence` (`EssenceSlice.ts`):** ✅ **IMPLEMENTED**
    *   Manages the core Essence resource: current amount, total collected, generation rate, per-click value, multipliers, generators, upgrades, NPC connections affecting generation.
    *   *Key Actions:* `gainEssence`, `spendEssence`, `setGenerationRate`, `addNpcConnection`, `addManualEssence`.

*   **`settings` (`SettingsSlice.ts`):** ✅ **IMPLEMENTED**
    *   Manages user-configurable settings: audio levels, graphics quality, gameplay difficulty, UI preferences (theme, font size), autosave configuration.
    *   *Key Actions:* `updateSetting`, `updateCategorySettings`, `resetSettings`, `loadSettings`.
    *   *Thunks:* `loadSettingsThunk`, `saveSettingsThunk`.

*   **`meta` (`MetaSlice.ts`):** ✅ **IMPLEMENTED**
    *   Manages application metadata: last save/load timestamps, game version, session start time, current save ID.
    *   *Key Actions:* `updateLastSaved`, `updateGameMetadata`, `setGameVersion`.
    *   *Thunks:* `saveGameThunk`, `loadGameThunk`, `importGameThunk`.

*   **`npcs` (`NpcSlice.ts`):** ✅ **IMPLEMENTED**
    *   Manages the state of Non-Player Characters: locations, relationship levels/connection depth with the player, current status, potentially traits.
    *   *Actions:* `updateNpcRelationship`, `setNpcStatus`, `addNpcTrait`.

*   **Future Slices (Planned):**
    *   `copies` (`CopySlice.ts` - *Planned*): For player-created Copies management
    *   `quests` (`QuestSlice.ts` - *Planned*): For quest state management
    *   `notifications` (`NotificationsSlice.ts` - *Planned*): For transient UI notifications

## 5. Type Safety Implementation ✅ COMPLETED

### 5.1. Feature-Level Type Organization
```typescript
// ✅ Implemented pattern
src/features/Player/
├── state/
│   ├── PlayerTypes.ts      // Primary type definitions
│   ├── PlayerSlice.ts      // Slice implementation  
│   └── PlayerSelectors.ts  // Memoized selectors
└── index.ts               // Barrel exports with types
```

### 5.2. Import Patterns ✅ STANDARDIZED
```typescript
// ✅ Feature-internal imports
import type { PlayerState } from '../state/PlayerTypes';

// ✅ Cross-feature imports via barrel
import type { PlayerState } from '../../Player';

// ✅ Store-level imports
import type { RootState } from '../../../app/store';
```

### 5.3. Context System Resolution ✅ COMPLETED
**Problem Resolved**: Eliminated competing context-based state management
- **Removed**: `context/GameStateExports` dependencies
- **Implemented**: Direct feature-based type imports
- **Result**: Single source of truth maintained through Redux only

## 6. Handling Asynchronous Operations ✅ IMPLEMENTED

*   **Thunks (`createAsyncThunk`):** Used for:
    *   Saving/Loading game state to/from `localStorage` via `MetaThunks.ts`
    *   Importing/Exporting save data  
    *   Fetching initial game data (e.g., trait definitions from static files)
    *   Complex actions requiring access to `getState` or dispatching multiple actions
*   **Lifecycle Actions:** Thunks automatically dispatch `pending`, `fulfilled`, and `rejected` actions, allowing slices to update loading and error states accordingly in their `extraReducers`.

## 7. Selectors ✅ IMPLEMENTED

*   **Purpose:** Decouple components from the specific shape of the state tree and optimize performance.
*   **Implementation:** Defined alongside their respective slices (e.g., `PlayerSelectors.ts`).
*   **Memoization:** `createSelector` is used for derived data or computations to avoid recalculating on every state change if the input state parts haven't changed.
*   **Usage:** Components use `useAppSelector` with these selectors to subscribe to state updates.
*   **Tab State Management:** Use shared `useTabs` hook for consistent tab state management across features rather than individual component state.

### 7.1. Example Selector Implementation
```typescript
// ✅ Implemented in PlayerSelectors.ts
export const selectPlayerHealth = createSelector(
  [selectPlayerStats],
  (stats) => ({
    current: stats.health,
    max: stats.maxHealth,
    percentage: (stats.health / stats.maxHealth) * 100
  })
);
```

## 8. State Persistence ✅ IMPLEMENTED

*   **Mechanism:** Using `localStorage` via utility functions in `shared/utils/saveUtils.ts`
*   **Triggers:** Saving is triggered manually by the player or automatically via the autosave system (`saveGameThunk`). Settings are saved when changed (`saveSettingsThunk`).
*   **Loading:** The initial state can be hydrated from `localStorage` on application startup (`loadGameThunk`, `loadSettingsThunk`). The `replaceState` action is used to overwrite the entire store state when loading a save file.

## 9. Root Reducer (`app/store.ts`) ✅ IMPLEMENTED

*   A `combinedReducer` merges all slice reducers.
*   A `rootReducer` wraps the `combinedReducer` to handle the special `replaceState` action, allowing the entire state to be overwritten during game load operations.

```typescript
// ✅ Implemented store structure
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['meta/replaceState'],
      },
    }),
});
```

## 10. Performance Optimizations ✅ IMPLEMENTED

### 10.1. Selector Memoization
- **createSelector**: Used throughout for derived state calculations
- **Component Optimization**: React.memo applied where beneficial
- **Callback Memoization**: useCallback for event handlers

### 10.2. Efficient Updates
- **Targeted Updates**: Slices update only relevant state portions
- **Immutable Updates**: Immer handles immutability transparently
- **Minimal Re-renders**: Memoized selectors prevent unnecessary component updates

## 11. Integration with UI Components ✅ IMPLEMENTED

### 11.1. Typed Hooks Usage
```typescript
// ✅ Standard pattern across codebase
const dispatch = useAppDispatch();
const playerState = useAppSelector(selectPlayer);
const playerHealth = useAppSelector(selectPlayerHealth);
```

### 11.2. Tab State Management
```typescript
// ✅ Implemented with useTabs hook
const { activeTab, setActiveTab } = useTabs({
  defaultTab: 'slots',
  tabs: traitTabs,
  persistKey: 'trait_system_tabs'
});
```

## 12. Architecture Compliance ✅ VERIFIED

The current implementation fully adheres to:
- **Feature-Sliced Design**: All state logic properly organized by feature
- **Single Source of Truth**: Redux as the exclusive state management system
- **Type Safety**: Comprehensive TypeScript integration
- **Performance**: Optimized with memoization and efficient updates
- **Maintainability**: Clear patterns and consistent structure

**Migration Complete**: All context-based state management has been successfully eliminated and replaced with proper Redux Toolkit patterns.
