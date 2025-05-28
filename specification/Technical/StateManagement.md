# State Management Specification

This document outlines the state management architecture for the React Incremental RPG Prototype, detailing Redux Toolkit implementation, slice organization, and data flow patterns.

## 1. Overview

The application uses Redux Toolkit for centralized state management, following modern Redux patterns with feature-sliced organization. Each game system maintains its own slice while supporting cross-feature integration through well-defined interfaces.

### 1.1. Architecture Principles
- **Feature-Sliced Design**: State organized by domain/feature boundaries
- **Redux Toolkit**: Modern Redux with createSlice and createAsyncThunk
- **Type Safety**: Comprehensive TypeScript integration throughout
- **Performance**: Memoized selectors and optimized component subscriptions
- **Immutability**: Leveraging Immer for safe state mutations

## 2. Store Configuration

### 2.1. Root Store Setup
**Location**: `src/app/store.ts`

```typescript
// ✅ Implemented store configuration
export const store = configureStore({
  reducer: {
    player: playerSlice.reducer,
    traits: traitsSlice.reducer,
    npcs: npcsSlice.reducer,
    essence: essenceSlice.reducer,
    gameLoop: gameLoopSlice.reducer,
    settings: settingsSlice.reducer,
    saveLoad: saveLoadSlice.reducer,
    // Future: quests, copies, inventory
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
```

### 2.2. Type Definitions
**Location**: `src/app/store.ts`

```typescript
// ✅ Implemented type safety
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
```

### 2.3. Typed Hooks
**Location**: `src/app/hooks.ts`

```typescript
// ✅ Implemented typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 3. Slice Architecture

### 3.1. Standard Slice Structure

Each feature follows a consistent slice organization:

```
src/features/FeatureName/state/
├── FeatureSlice.ts        # Redux slice with actions and reducers
├── FeatureTypes.ts        # TypeScript interfaces and types
├── FeatureSelectors.ts    # Memoized selectors
├── FeatureThunks.ts       # Async thunk operations
└── index.ts               # Barrel export for state API
```

### 3.2. Slice Implementation Pattern

#### Basic Slice Structure
```typescript
// ✅ Standard slice pattern used throughout
const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Synchronous actions with Immer-enabled mutations
    updateData: (state, action: PayloadAction<UpdatePayload>) => {
      // Direct mutation - Immer handles immutability
      state.data = action.payload;
    },
    
    resetState: (state) => {
      return initialState; // Full state replacement
    },
  },
  extraReducers: (builder) => {
    // Async thunk handlers
    builder
      .addCase(fetchDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Operation failed';
      });
  },
});
```

## 4. Feature Slice Details

### 4.1. Player Slice ✅ COMPLETE
**Location**: `src/features/Player/state/PlayerSlice.ts`

**State Structure**:
```typescript
interface PlayerState {
  stats: PlayerStats;
  attributes: PlayerAttributes;
  availableAttributePoints: number;
  availableSkillPoints: number;
  statusEffects: StatusEffect[];
  equippedTraits: (string | null)[];
  permanentTraits: string[];
  traitSlots: TraitSlot[];
  totalPlaytime: number;
  isAlive: boolean;
}
```

**Key Features**:
- **Stat Calculations**: Automatic recalculation of derived stats
- **Attribute Management**: Point allocation with validation
- **Status Effects**: Time-based effect processing
- **Trait Integration**: Equipment and permanence mechanics
- **Playtime Tracking**: Session and total time management

### 4.2. Traits Slice ✅ COMPLETE
**Location**: `src/features/Traits/state/TraitsSlice.ts`

**State Structure**:
```typescript
interface TraitsState {
  availableTraits: Record<string, Trait>;
  acquiredTraits: string[];
  traitSlots: TraitSlot[];
  permanentTraits: string[];
  loading: boolean;
  error: string | null;
}
```

**Key Features**:
- **Trait Discovery**: Unlocking and categorizing traits
- **Acquisition System**: Essence-based trait acquisition
- **Slot Management**: Equipment and permanence mechanics
- **Codex Integration**: Trait information and filtering

### 4.3. NPCs Slice ✅ COMPLETE
**Location**: `src/features/NPCs/state/NPCSlice.ts`

**State Structure**:
```typescript
interface NPCState {
  npcs: Record<string, NPC>;
  relationships: Record<string, number>;
  interactions: NPCInteraction[];
  currentInteraction: string | null;
  loading: boolean;
  error: string | null;
}
```

**Key Features**:
- **Relationship Tracking**: Progressive relationship levels
- **Interaction Management**: Session-based interaction tracking
- **Trait Sharing**: NPC trait slot management
- **Commerce Integration**: Relationship-based pricing

### 4.4. Essence Slice ✅ COMPLETE
**Location**: `src/features/Essence/state/EssenceSlice.ts`

**State Structure**:
```typescript
interface EssenceState {
  currentAmount: number;
  totalCollected: number;
  generationRate: number;
  perClickAmount: number;
  lastGeneration: number;
}
```

**Key Features**:
- **Resource Management**: Current amount and accumulation
- **Generation Tracking**: Passive and manual generation
- **Statistics**: Total collected and generation metrics

### 4.5. GameLoop Slice ✅ COMPLETE
**Location**: `src/features/GameLoop/state/GameLoopSlice.ts`

**State Structure**:
```typescript
interface GameLoopState {
  isRunning: boolean;
  isPaused: boolean;
  gameSpeed: number;
  currentTick: number;
  totalGameTime: number;
  autoSaveInterval: number;
  lastAutoSave: number;
}
```

**Key Features**:
- **Time Management**: Game progression and timing
- **Speed Control**: Adjustable game speed multipliers
- **Auto-save**: Configurable automatic saving

### 4.6. Settings Slice ✅ COMPLETE
**Location**: `src/features/Settings/state/SettingsSlice.ts`

**State Structure**:
```typescript
interface SettingsState {
  audio: AudioSettings;
  graphics: GraphicsSettings;
  gameplay: GameplaySettings;
  ui: UISettings;
}
```

**Key Features**:
- **Category Organization**: Audio, graphics, gameplay, UI
- **Immediate Persistence**: Real-time settings application
- **Default Management**: Reset and validation capabilities

## 5. Selector Architecture

### 5.1. Selector Organization

Each feature maintains organized selectors with consistent patterns:

```typescript
// ✅ Standard selector pattern
// Basic selectors
export const selectFeature = (state: RootState) => state.feature;
export const selectFeatureData = (state: RootState) => state.feature.data;
export const selectFeatureLoading = (state: RootState) => state.feature.loading;

// Memoized selectors with createSelector
export const selectProcessedData = createSelector(
  [selectFeatureData, selectOtherRelevantData],
  (data, otherData) => {
    // Expensive computation here
    return processedResult;
  }
);
```

### 5.2. Cross-Feature Selectors

For data requiring multiple feature states:

```typescript
// ✅ Implemented in various features
export const selectPlayerWithTraits = createSelector(
  [selectPlayer, selectTraits],
  (player, traits) => ({
    ...player,
    equippedTraitDetails: player.equippedTraits
      .map(traitId => traitId ? traits[traitId] : null)
      .filter(Boolean)
  })
);
```

## 6. Async Operations (Thunks)

### 6.1. Thunk Architecture

Async operations follow consistent patterns with comprehensive error handling:

```typescript
// ✅ Standard thunk pattern used throughout
export const operationThunk = createAsyncThunk<
  ReturnType,           // Success payload type
  ParameterType,        // Input parameter type  
  { state: RootState; rejectValue: string }
>(
  'feature/operation',
  async (params, { getState, dispatch, rejectWithValue }) => {
    try {
      // Validation
      if (!isValidParams(params)) {
        return rejectWithValue('Invalid parameters');
      }

      // State access
      const currentState = getState();
      
      // Business logic
      const result = await performOperation(params, currentState);
      
      // Side effects
      dispatch(relatedAction(result));
      
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Operation failed'
      );
    }
  }
);
```

### 6.2. Implemented Thunk Operations

#### Player Thunks ✅ COMPLETE
- **regenerateResourcesThunk**: Health and mana regeneration
- **processStatusEffectsThunk**: Time-based effect processing
- **useConsumableThunk**: Item consumption with effects
- **restThunk**: Enhanced recovery mechanics
- **autoAllocateAttributesThunk**: Automated point distribution

#### NPC Thunks ✅ COMPLETE
- **initializeNPCsThunk**: NPC data loading and setup
- **updateNPCRelationshipThunk**: Relationship modification
- **processNPCInteractionThunk**: Complex interaction handling
- **shareTraitWithNPCThunk**: Trait sharing operations

#### Settings Thunks ✅ COMPLETE
- **saveSettingsThunk**: Immediate settings persistence
- **loadSettingsThunk**: Settings restoration with defaults

## 7. Performance Optimization

### 7.1. Memoization Strategy

**Selector Memoization**:
```typescript
// ✅ Applied throughout selectors
export const selectExpensiveComputation = createSelector(
  [selectInputData],
  (inputData) => {
    // Expensive computation only runs when inputData changes
    return computeResult(inputData);
  }
);
```

**Component Memoization**:
```typescript
// ✅ Applied to major components
export default React.memo(ComponentName, (prevProps, nextProps) => {
  // Custom comparison logic if needed
  return prevProps.data === nextProps.data;
});
```

### 7.2. State Subscription Optimization

**Targeted Subscriptions**:
```typescript
// ✅ Pattern used throughout components
const ComponentWithOptimizedSubscription: React.FC = () => {
  // Only subscribe to specific needed data
  const specificData = useAppSelector(selectSpecificData);
  
  // Memoized callbacks prevent unnecessary re-renders
  const handleAction = useCallback(() => {
    dispatch(actionCreator());
  }, [dispatch]);

  return <div>{/* Component content */}</div>;
};
```

## 8. Error Handling

### 8.1. Slice Error Management

Each slice maintains consistent error handling:

```typescript
// ✅ Standard error handling pattern
interface FeatureState {
  data: FeatureData;
  loading: boolean;
  error: string | null; // Consistent error storage
}

// Error handling in extraReducers
.addCase(operationThunk.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || 'Operation failed';
})
```

### 8.2. Thunk Error Patterns

```typescript
// ✅ Comprehensive error handling in thunks
export const operationThunk = createAsyncThunk(
  'feature/operation',
  async (params, { rejectWithValue }) => {
    try {
      // Validation errors
      if (!isValid(params)) {
        return rejectWithValue('Invalid input parameters');
      }

      // Business logic
      const result = await performOperation(params);
      return result;
      
    } catch (error) {
      // Network/API errors
      if (error instanceof NetworkError) {
        return rejectWithValue('Network connection failed');
      }
      
      // Generic error fallback
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
);
```

## 9. Testing Strategy

### 9.1. Reducer Testing

```typescript
// ✅ Testing pattern for reducers
describe('featureSlice reducers', () => {
  it('should handle action correctly', () => {
    const initialState = getInitialState();
    const action = actionCreator(payload);
    const newState = featureSlice.reducer(initialState, action);
    
    expect(newState.data).toEqual(expectedData);
  });
});
```

### 9.2. Selector Testing

```typescript
// ✅ Testing pattern for selectors
describe('feature selectors', () => {
  it('should select correct data', () => {
    const mockState = createMockState();
    const result = selectFeatureData(mockState);
    
    expect(result).toEqual(expectedResult);
  });
});
```

### 9.3. Thunk Testing

```typescript
// ✅ Testing pattern for thunks
describe('operationThunk', () => {
  it('should handle successful operation', async () => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore(initialState);
    
    await store.dispatch(operationThunk(params));
    
    const actions = store.getActions();
    expect(actions[0].type).toBe(operationThunk.pending.type);
    expect(actions[1].type).toBe(operationThunk.fulfilled.type);
  });
});
```

## 10. Future Enhancements

### 10.1. Planned Slice Extensions
- **Quest Slice**: Quest management and progression tracking
- **Copy Slice**: Character copy creation and management
- **Inventory Slice**: Item management and equipment
- **Achievement Slice**: Player achievement tracking

### 10.2. Advanced Features
- **Middleware**: Custom middleware for complex cross-slice operations
- **Persistence**: Enhanced save/load with selective state persistence
- **Real-time Updates**: WebSocket integration for multiplayer features
- **Offline Support**: Service worker integration for offline gameplay

## 11. Best Practices Summary

### 11.1. Development Guidelines
1. **Consistent Structure**: Follow established slice organization patterns
2. **Type Safety**: Maintain comprehensive TypeScript coverage
3. **Performance**: Use memoization and targeted subscriptions
4. **Error Handling**: Implement consistent error management
5. **Testing**: Write tests for critical state operations

### 11.2. Code Quality Standards
- **Immutability**: Leverage Immer for safe state mutations
- **Predictability**: Pure reducers and deterministic state changes
- **Debuggability**: Clear action names and payload structures
- **Documentation**: Comprehensive JSDoc comments for complex operations
- **Validation**: Input validation in thunks and reducers

The state management architecture provides a robust foundation for the React Incremental RPG Prototype, supporting complex game mechanics while maintaining performance, type safety, and developer experience excellence.
