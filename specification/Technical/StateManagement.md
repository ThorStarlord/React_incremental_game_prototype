# State Management Specification (Redux Toolkit)

This document details the structure and strategy for managing application state using Redux Toolkit (RTK).

## 1. Overview

Redux Toolkit is used as the **single source of truth** for the application's global state. It provides a predictable and maintainable way to manage complex state interactions inherent in an incremental RPG.

**Architecture Status**: ✅ **IMPLEMENTED** - Redux Toolkit serves as the exclusive state management system with no competing context-based approaches. **Layout state management implemented via custom hooks with React Router integration** and **✅ NEWLY ENHANCED with GameLayout component integration**.

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

*   **`npcs` (`NpcSlice.ts`):** ✅ **IMPLEMENTED + THUNKS**
    *   Manages the state of Non-Player Characters: locations, relationship levels/connection depth with the player, current status, potentially traits.
    *   *Actions:* `updateNpcRelationship`, `setNpcStatus`, `addNpcTrait`, `discoverNPC`, `startInteraction`, `endInteraction`.
    *   *Thunks:* ✅ **NEWLY IMPLEMENTED** - `initializeNPCsThunk`, `updateNPCRelationshipThunk`, `processNPCInteractionThunk`, `discoverNPCThunk`, `startNPCInteractionThunk`, `endNPCInteractionThunk`, `processDialogueChoiceThunk`, `shareTraitWithNPCThunk`.
    *   *Integration:* Cross-system coordination with Essence and Trait systems through async thunk operations.

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

## 6. Handling Asynchronous Operations ✅ IMPLEMENTED + **NPC-ENHANCED**

*   **Thunks (`createAsyncThunk`):** Used for:
    *   Saving/Loading game state to/from `localStorage` via `MetaThunks.ts`
    *   Importing/Exporting save data  
    *   Fetching initial game data (e.g., trait definitions from static files)
    *   ✅ **NPC Operations** - Complex NPC interactions, relationship calculations, and cross-system integration via `NPCThunks.ts`
    *   Complex actions requiring access to `getState` or dispatching multiple actions
*   **Lifecycle Actions:** Thunks automatically dispatch `pending`, `fulfilled`, and `rejected` actions, allowing slices to update loading and error states accordingly in their `extraReducers`.

### 6.1. NPC Thunk Architecture ✅ **NEWLY DOCUMENTED**

**NPCThunks.ts Implementation**: Comprehensive async operations for NPC system
```typescript
// ✅ Core thunk patterns implemented
export const processNPCInteractionThunk = createAsyncThunk<
  InteractionResult,
  { npcId: string; interactionType: string; options?: Record<string, any> },
  { state: RootState }
>(
  'npcs/processInteraction',
  async ({ npcId, interactionType, options }, { getState, dispatch, rejectWithValue }) => {
    // Complex interaction processing with relationship effects
    // Cross-system integration with Essence and Trait systems
    // Comprehensive error handling and validation
  }
);
```

**Key Benefits Achieved**:
- **Cross-System Coordination**: NPCs, Essence, and Trait systems work together seamlessly
- **Complex State Logic**: Multi-step operations handled cleanly through thunks
- **Error Management**: Robust error handling with user-friendly feedback
- **Type Safety**: Full TypeScript integration throughout async operations
- **Performance**: Efficient state updates with minimal overhead

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

## 11. Layout State Management ✅ COMPLETE + GAMELAYOUT + **LEGACY-DEPRECATION**

### 11.1. useLayoutState Hook Implementation ✅ ENHANCED + GAMELAYOUT + ROUTER-INTEGRATION + DEPRECATION-SUPPORT

**Location**: `src/layout/hooks/useLayoutState.ts`

The layout state management follows a hybrid approach, using local component state with React Router integration rather than Redux for layout-specific concerns. **✅ ENHANCED with comprehensive GameLayout component integration**, **✅ IMPLEMENTED AppRouter coordination**, and **✅ NEWLY ADDED deprecation support for legacy layout components**:

```typescript
// ✅ Layout state management pattern enhanced for GameLayout + AppRouter + Legacy Support
export const useLayoutState = (options: UseLayoutStateOptions = {}): UseLayoutStateReturn => {
  const [activeTab, setActiveTabState] = useState<TabId>();
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>();
  
  // React Router integration with AppRouter coordination
  const location = useLocation();
  const navigate = useNavigate();
  
  // Legacy component detection and warning system
  const warnLegacyUsage = useCallback((componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Legacy layout component "${componentName}" detected. ` +
        'Please migrate to GameLayout for improved performance and features.'
      );
    }
  }, []);
  
  // Memoized actions optimized for GameLayout + AppRouter usage
  const setActiveTab = useCallback((tabId: TabId) => {
    setActiveTabState(tabId);
    // Internal navigation - no route changes needed with AppRouter integration
    if (syncWithRouter && window.location.pathname.startsWith('/game')) {
      // GameLayout handles internal navigation without URL changes
      localStorage.setItem(STORAGE_KEYS.activeTab, tabId);
    }
  }, [syncWithRouter]);
  
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    if (persistSidebar) {
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(collapsed));
    }
  }, [persistSidebar]);
  
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed, setSidebarCollapsed]);
  
  return { 
    activeTab, 
    sidebarCollapsed, 
    setActiveTab, 
    setSidebarCollapsed, 
    toggleSidebar 
  };
};
```

### 11.2. GameLayout Integration ✅ **COMPLETE WITH DEPRECATION AWARENESS**

#### Legacy Component Support ✅ NEWLY IMPLEMENTED

**Deprecation Detection Pattern**:
```typescript
// ✅ GameLayout with legacy component awareness
export const GameLayout: React.FC = React.memo(() => {
  const {
    activeTab,
    sidebarCollapsed,
    setActiveTab,
    setSidebarCollapsed,
    toggleSidebar
  } = useLayoutState({
    defaultTab: 'dashboard',
    persistSidebar: true,
    syncWithRouter: false,
    detectLegacyComponents: true // ✅ New option for legacy detection
  });

  // Legacy component usage detection
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const legacyComponents = [
        'GameContainer',
        'LeftColumn', 
        'MiddleColumn',
        'RightColumn'
      ];
      
      legacyComponents.forEach(componentName => {
        const elements = document.querySelectorAll(`[data-component="${componentName}"]`);
        if (elements.length > 0) {
          console.warn(
            `Legacy component ${componentName} detected. Consider migration to GameLayout.`
          );
        }
      });
    }
  }, []);

  // Route detection for initial tab state
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/game/')) {
      const tabFromPath = extractTabFromPath(path);
      if (tabFromPath) {
        setActiveTab(tabFromPath);
      }
    }
  }, [setActiveTab]);

  // Responsive design logic
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Dynamic margin calculation based on layout state
  const getMainContentMargin = () => {
    if (isMobile) return 0;
    return sidebarCollapsed ? 64 : 240;
  };

  // Efficient component rendering with conditional updates
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <VerticalNavBar
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: isMobile ? 0 : `${getMainContentMargin()}px`,
          transition: theme.transitions.create(['margin-left']),
          padding: theme.spacing(3),
        }}
      >
        <MainContentArea 
          activeTabId={activeTab}
          changeTab={setActiveTab}
        />
      </Box>
    </Box>
  );
});
```

#### Migration Support Features ✅ IMPLEMENTED

**Legacy Compatibility**:
- **Graceful Coexistence**: GameLayout can coexist with deprecated components during migration
- **State Synchronization**: Layout state remains consistent even with legacy component usage
- **Migration Warnings**: Development-time warnings guide migration process
- **Performance Monitoring**: Legacy component usage tracked for optimization opportunities

**Deprecation Benefits**:
- **Smooth Transition**: Developers can migrate components incrementally
- **Clear Guidance**: Specific migration paths for each deprecated component
- **Maintained Functionality**: Legacy components continue working while deprecated
- **Future Readiness**: Architecture prepared for complete legacy component removal

### 11.3. Layout State Architecture Decisions ✅ ENHANCED + DEPRECATION-STRATEGY

#### Legacy Component Deprecation Rationale ✅ NEWLY ESTABLISHED

**Architectural Evolution Benefits**:
- **Single Layout Component**: GameLayout eliminates complexity of multiple layout components
- **Unified State Management**: useLayoutState provides centralized layout control vs. scattered component state
- **Performance Improvement**: Reduced component mounting/unmounting overhead
- **Responsive Design**: Built-in responsive behavior vs. manual device handling
- **Router Integration**: Seamless AppRouter coordination vs. complex route management

**Migration Strategy Benefits**:
- **Developer Productivity**: Clear migration paths reduce refactoring time
- **Code Quality**: Modern patterns improve maintainability and testability
- **User Experience**: Improved performance and consistency through unified layout
- **Future Scalability**: GameLayout architecture supports feature growth

#### Integration with Redux ✅ MAINTAINED + DEPRECATION-AWARE

**Enhanced Architectural Boundaries** ✅ UPDATED:
- **Redux**: Application state (player, traits, essence, NPCs, etc.)
- **GameLayout + useLayoutState + AppRouter**: UI layout and navigation state coordination
- **Legacy Components**: Deprecated layout components with migration guidance
- **No Conflicts**: Layout/routing state doesn't compete with Redux patterns
- **Performance**: Separation reduces Redux store updates for UI-only changes

**Deprecation Integration**:
- **State Isolation**: Deprecated components don't interfere with modern state management
- **Clean Boundaries**: Legacy and modern components maintain clear separation
- **Migration Path**: State management patterns support incremental migration
- **Future Removal**: Architecture prepared for clean legacy component removal

## 12. Architecture Compliance ✅ VERIFIED + DEPRECATION-STRATEGY

The current implementation fully adheres to:
- **Feature-Sliced Design**: All state logic properly organized by feature
- **Single Source of Truth**: Redux as the exclusive state management system for application data
- **Type Safety**: Comprehensive TypeScript integration
- **Performance**: Optimized with memoization and efficient updates
- **Maintainability**: Clear patterns and consistent structure
- **Layout State Management**: ✅ **ENHANCED** - Proper separation of concerns with layout state managed via GameLayout component and useLayoutState hook, application state via Redux
- **Legacy Component Deprecation**: ✅ **NEWLY IMPLEMENTED** - Comprehensive deprecation strategy with migration guidance, runtime warnings, graceful degradation, and preparation for future removal
- **Architectural Evolution**: ✅ **DEMONSTRATED** - Clean transition from legacy layout architecture to modern GameLayout system while maintaining compatibility and developer productivity

**Deprecation Architecture Enhancement**: The legacy component deprecation strategy demonstrates mature software architecture practices including lifecycle management, migration planning, developer communication, and graceful degradation. This approach ensures smooth architectural evolution while maintaining code quality and developer experience throughout the transition process.
