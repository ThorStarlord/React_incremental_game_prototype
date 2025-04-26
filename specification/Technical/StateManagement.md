# State Management Specification (Redux Toolkit)

This document details the structure and strategy for managing application state using Redux Toolkit (RTK).

## 1. Overview

Redux Toolkit is used as the single source of truth for the application's global state. It provides a predictable and maintainable way to manage complex state interactions inherent in an incremental RPG.

## 2. Core Principles

*   **Single Source of Truth:** The entire application state is stored in a single Redux store object.
*   **State is Read-Only:** The only way to change the state is by dispatching actions.
*   **Changes are Made with Pure Functions:** Reducers are pure functions that take the previous state and an action, and return the next state. Immutability is handled by Immer within RTK.
*   **Feature-Sliced Structure:** State logic is co-located with the feature it belongs to (`src/features/FeatureName/state/`).

## 3. Redux Toolkit Features Used

*   **`configureStore`:** Sets up the Redux store with sensible defaults (like Redux DevTools Extension integration and default middleware).
*   **`createSlice`:** Generates slice reducers and action creators with less boilerplate. Uses Immer internally for immutable updates.
*   **`createAsyncThunk`:** Handles asynchronous logic (like API calls, `localStorage` interactions) and dispatches actions based on promise lifecycle (pending, fulfilled, rejected).
*   **`createSelector` (via Reselect):** Creates memoized selectors to efficiently compute derived data and optimize performance by preventing unnecessary re-renders.
*   **Typed Hooks (`useAppDispatch`, `useAppSelector`):** Provide type safety when dispatching actions and selecting state.

## 4. State Structure (Slices)

The global state (`RootState`) is composed of multiple slices, each managing a specific domain:

*   **`player` (`PlayerSlice.ts`):**
    *   Manages player-specific data: name, level, XP, stats (HP, MP, attack, etc.), attributes (STR, DEX, etc.), skills, status effects, equipment.
    *   *Key Actions:* `updatePlayer`, `setName`, `resetPlayer`, `modifyHealth`, `allocateAttribute`, `updateSkill`, `equipItem`.
*   **`traits` (`TraitsSlice.ts`):**
    *   Manages all trait definitions, player's acquired traits, equipped traits, permanent traits, trait slots, and presets.
    *   *Key Actions:* `setTraits`, `acquireTrait`, `discoverTrait`, `equipTrait`, `unequipTrait`, `makePermanent`, `unlockTraitSlot`, `saveTraitPreset`.
    *   *Thunks:* `fetchTraitsThunk`, `makeTraitPermanentThunk`.
*   **`essence` (`EssenceSlice.ts`):**
    *   Manages the core Essence resource: current amount, total collected, generation rate, per-click value, multipliers, generators, upgrades, NPC connections affecting generation.
    *   *Key Actions:* `gainEssence`, `spendEssence`, `setGenerationRate`, `addNpcConnection`, `addManualEssence`.
*   **`settings` (`SettingsSlice.ts`):**
    *   Manages user-configurable settings: audio levels, graphics quality, gameplay difficulty, UI preferences (theme, font size), autosave configuration.
    *   *Key Actions:* `updateSetting`, `updateCategorySettings`, `resetSettings`, `loadSettings`.
    *   *Thunks:* `loadSettingsThunk`, `saveSettingsThunk`.
*   **`meta` (`MetaSlice.ts`):**
    *   Manages application metadata: last save/load timestamps, game version, session start time, current save ID.
    *   *Key Actions:* `updateLastSaved`, `updateGameMetadata`, `setGameVersion`.
    *   *Thunks:* `saveGameThunk`, `loadGameThunk`, `importGameThunk`.
*   **`copies` (`CopySlice.ts` - *New/Proposed*):**
    *   Manages the state of player-created Copies: list of copies, individual copy stats, loyalty, assigned tasks, growth progress, shared traits.
    *   *Potential Actions:* `createCopy`, `updateCopy`, `assignTaskToCopy`, `shareTraitWithCopy`, `removeCopy`.
*   **`npcs` (`NpcSlice.ts` - *New/Proposed*):**
    *   Manages the state of Non-Player Characters: locations, relationship levels/connection depth with the player, current status, potentially traits.
    *   *Potential Actions:* `updateNpcRelationship`, `setNpcStatus`, `addNpcTrait`.
*   **`quests` (`QuestSlice.ts` - *New/Proposed*):**
    *   Manages quest state: available quests, accepted quests, objective progress, completed quests.
    *   *Potential Actions:* `acceptQuest`, `updateQuestProgress`, `completeQuest`, `failQuest`.
*   **`notifications` (`NotificationsSlice.ts` - *New/Proposed*):**
    *   Manages transient UI notifications (e.g., "Game Saved", "Trait Acquired", error messages).
    *   *Potential Actions:* `addNotification`, `removeNotification`.

## 5. Handling Asynchronous Operations

*   **Thunks (`createAsyncThunk`):** Used for:
    *   Saving/Loading game state to/from `localStorage`.
    *   Importing/Exporting save data.
    *   Fetching initial game data (e.g., trait definitions from a static file).
    *   Complex actions requiring access to `getState` or dispatching multiple actions (e.g., `makeTraitPermanentThunk` which checks Essence, spends it, and updates trait state).
*   **Lifecycle Actions:** Thunks automatically dispatch `pending`, `fulfilled`, and `rejected` actions, allowing slices to update loading and error states accordingly in their `extraReducers`.

## 6. Selectors

*   **Purpose:** Decouple components from the specific shape of the state tree and optimize performance.
*   **Implementation:** Defined alongside their respective slices (`FeatureSelectors.ts` or within the slice file).
*   **Memoization:** `createSelector` is used for derived data or computations to avoid recalculating on every state change if the input state parts haven't changed.
*   **Usage:** Components use `useAppSelector` with these selectors to subscribe to state updates.

## 7. State Persistence

*   **Mechanism:** Primarily using `localStorage` via utility functions (`shared/utils/storage.ts` or `shared/utils/saveUtils.ts`).
*   **Triggers:** Saving is triggered manually by the player or automatically via the autosave system (`saveGameThunk`). Settings are saved when changed (`saveSettingsThunk`).
*   **Loading:** The initial state can be hydrated from `localStorage` on application startup (`loadGameThunk`, `loadSettingsThunk`). The `replaceState` action is used to overwrite the entire store state when loading a save file.

## 8. Root Reducer (`app/store.ts`)

*   A `combinedReducer` merges all slice reducers.
*   A `rootReducer` wraps the `combinedReducer` to handle the special `replaceState` action, allowing the entire state to be overwritten during game load operations.
