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
    meta: metaSlice.reducer,
    copy: copySlice.reducer,
    // Future: quests, inventory
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disabled for performance with complex state
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
  // Direct stat properties (flattened structure)
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  healthRegen: number;
  manaRegen: number;
  criticalChance: number;
  criticalDamage: number;
  
  // Attributes
  attributes: PlayerAttributes;
  availableAttributePoints: number;
  availableSkillPoints: number;
  
  // Progression
  resonanceLevel: number;
  maxTraitSlots: number;
  totalPlaytime: number;
  isAlive: boolean;
  
  // Traits and effects
  statusEffects: StatusEffect[];
  permanentTraits: string[]; // IDs of traits the player has permanently acquired
  traitSlots: TraitSlot[];   // Player's active trait slots, each can hold a traitId
}
```

**Key Features**:
- **Flattened State Structure**: Stats are stored directly in PlayerState rather than nested in a stats object
- **Stat Calculations**: Provides `recalculateStats` reducer for automatic recalculation of derived stats when attributes, traits, or status effects change
- **Attribute Management**: Handles attribute point allocation (`allocateAttributePoint`) with validation against available points
- **Status Effects**: Manages the list of active status effects (`addStatusEffect`, `removeStatusEffect`) with stat impact handled via `recalculateStats`
- **Trait Integration**: Manages player's active trait slots (`equipTrait`, `unequipTrait`) and list of player-specific permanent traits (`addPermanentTrait`)
- **Playtime Tracking**: Manages `totalPlaytime` (`updatePlaytime`)

### 4.2. Traits Slice ✅ COMPLETE
**Location**: `src/features/Traits/state/TraitsSlice.ts`

**State Structure**:
```typescript
interface TraitsState {
  traits: Record<string, Trait>; // All trait definitions loaded from data
  presets: TraitPreset[];        // Saved trait loadouts
  discoveredTraits: string[];    // IDs of traits the player has discovered (e.g., seen on an NPC)
  loading: boolean;
  error: string | null;
}
```

**Key Features**:
- **Trait Definitions & Discovery**: Manages all trait definitions (loaded via `fetchTraitsThunk`) and tracks discovered traits (`discoverTrait`, `discoveredTraits` state)
- **Streamlined Lifecycle**: Follows the simplified Discover -> Equip -> Resonate flow without intermediate acquisition states
- **Trait Permanence (Player-Specific)**: Player-specific permanent traits are managed in `PlayerSlice`. The "Resonance" mechanic (`acquireTraitWithEssenceThunk`) makes traits permanent for the player by updating `PlayerSlice.permanentTraits`
- **Codex Data**: Provides the necessary data (`traits`, `discoveredTraits`) for a Trait Codex UI displaying all discovered traits
- **Trait Presets**: Manages saving, loading, and deleting trait presets (`saveTraitPreset`, `loadTraitPreset`, `deleteTraitPreset`)

### 4.3. NPCs Slice ✅ COMPLETE
**Location**: `src/features/NPCs/state/NPCSlice.ts`

**State Structure**:
```typescript
interface NPCState {
  npcs: Record<string, NPC>;
  discoveredNPCs: string[];
  currentInteraction: NPCInteraction | null; 
  dialogueHistory: DialogueEntry[];
  relationshipChanges: RelationshipChangeEntry[]; 
  loading: boolean;
  error: string | null;
  selectedNPCId: string | null; // Added to track selected NPC for detail view
}
```

**Key Features**:
- **NPC Data Management**: Initializes and stores core NPC data
- **Discovery**: Tracks discovered NPCs
- **Relationship Tracking**: Manages NPC relationship values and logs changes
- **Interaction Management**: Handles current interaction sessions and logs dialogue history
- **Status & Availability**: Manages NPC status and availability
- **Trait System Integration**: 
    *   NPCs have `availableTraits` for player "Resonance" (leading to permanent player traits in `PlayerSlice`)
    *   NPCs have `innateTraits` that players can temporarily equip into their `PlayerSlice.t
- **Selected NPC Tracking**: `selectedNPCId` added to manage the currently viewed NPC in the detail panel.

### 4.4. Essence Slice ✅ COMPLETE
**Location**: `src/features/Essence/state/EssenceSlice.ts`

**State Structure**:
```typescript
interface EssenceState {
  currentEssence: number;
  totalCollected: number;
  generationRate: number;
  perClickValue: number;
  lastGenerationTime: number;
  currentResonanceLevel: number;
  isGenerating: boolean;
  loading: boolean;
  error: string | null;
}
```

**Key Features**:
- **Resource Management**: Tracks current and total collected essence
- **Generation System**: Passive and manual essence generation mechanics
- **Resonance Integration**: Resonance level tracking for trait slot unlocks
- **State Persistence**: Integration with game save/load functionality

### 4.5. GameLoop Slice ✅ COMPLETE
**Location**: `src/features/GameLoop/state/GameLoopSlice.ts`

**State Structure**:
```typescript
interface GameLoopState {
  isRunning: boolean;
  isPaused: boolean;
  currentTick: number;
  tickRate: number;
  lastUpdateTime: number;
  totalGameTime: number;
  gameSpeed: number;
  autoSaveInterval: number;
  lastAutoSave: number;
}
```

**Key Features**:
- **Timing Control**: Game loop state management with start/pause/stop functionality
- **Speed Control**: Variable game speed with multipliers
- **Auto-save Integration**: Automatic saving coordination with save system
- **Performance Tracking**: Game time and tick counting

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
- **Configuration Management**: Comprehensive game settings across all categories
- **Immediate Persistence**: Settings changes persist immediately to localStorage
- **Validation**: Client-side validation for setting ranges and constraints
- **Theme Integration**: UI settings control application theme and styling

### 4.7. Meta Slice ✅ IMPLEMENTED
**Location**: `src/features/Meta/state/MetaSlice.ts`

**State Structure**:
```typescript
interface MetaState {
  saves: Record<string, SaveSlot>;
  autoSaves: Record<string, SaveSlot>;
  lastSaveTime: number;
  saveInProgress: boolean;
  loadInProgress: boolean;
  exportData: string | null;
  importError: string | null;
}
```

**Key Features**:
- **Save Management**: Manual and automatic save slot management
- **Import/Export**: Game state import/export functionality with validation
- **Persistence**: Integration with localStorage and save file management
- **Version Control**: Save format versioning for compatibility

## 5. Selector Architecture

### 5.1. Memoized Selectors ✅ IMPLEMENTED

Each feature provides memoized selectors using `createSelector`:

```typescript
// ✅ Standard selector pattern
export const selectFeatureData = createSelector(
  [(state: RootState) => state.feature],
  (feature) => feature.data
);

export const selectComputedValue = createSelector(
  [selectFeatureData, selectOtherData],
  (data, otherData) => {
    // Expensive computation here
    return computeValue(data, otherData);
  }
);
```

### 5.2. Cross-Feature Selectors ✅ IMPLEMENTED

Selectors that combine data from multiple slices:

```typescript
// ✅ Cross-feature integration pattern
export const selectPlayerWithTraits = createSelector(
  [selectPlayer, selectTraits],
  (player, traits) => ({
    ...player,
    equippedTraitDetails: player.traitSlots
      .filter(slot => slot.traitId)
      .map(slot => traits[slot.traitId!])
  })
);
```

## 6. Async Operations (Thunks)

### 6.1. Standard Thunk Pattern ✅ IMPLEMENTED

```typescript
// ✅ Standard async thunk implementation
export const fetchDataThunk = createAsyncThunk<
  DataType,           // Return type
  FetchParams,        // Argument type
  { state: RootState, rejectValue: string }
>(
  'feature/fetchData',
  async (params, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      // Async operation logic
      return await fetchData(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 6.2. Cross-System Thunks ✅ IMPLEMENTED

Thunks that coordinate between multiple systems:

```typescript
// ✅ Cross-system coordination pattern
export const acquireTraitWithEssenceThunk = createAsyncThunk(
  'traits/acquireWithEssence',
  async (payload, { dispatch, getState }) => {
    const state = getState();
    
    // Validate essence cost
    if (state.essence.currentEssence < payload.cost) {
      throw new Error('Insufficient essence');
    }
    
    // Coordinate updates across systems
    dispatch(spendEssence({ amount: payload.cost }));
    dispatch(acquireTrait(payload.traitId));
    dispatch(addPermanentTrait(payload.traitId));
    
    return payload;
  }
);
```

## 7. Integration Architecture

### 7.1. Redux Store Integration ✅ IMPLEMENTED
- **TraitsSlice**: Manages global trait definitions and discovered traits (`discoveredTraits`). No longer manages player-specific permanent traits or a general acquired traits list.
- **PlayerSlice**: Manages player's equipped trait slots (`traitSlots`) and list of player-specific permanent traits (`permanentTraits`). This is the authoritative source for traits the player has permanently acquired.
- **Selectors**:
    *   Memoized selectors provide efficient data access across both slices
    *   Player permanent trait selectors primarily sourced from `PlayerSelectors.ts`
    *   Composite selectors in `TraitsSelectors.ts` combine data from both slices
- **Thunks**: `discoverTraitThunk` adds to discovered traits. `acquireTraitWithEssenceThunk` handles Resonance, updating both `TraitsSlice` (discovery) and `PlayerSlice` (permanent traits).

### 7.2. Feature Interoperability ✅ DESIGNED
- **Essence System**: `acquireTraitWithEssenceThunk` (Resonance) integrates with Essence system for deducting `essenceCost`.
- **Player System**: Player's permanent traits and equipped traits affect player stats through `PlayerSlice.recalculateStats` reducer.
- **NPC System**:
    *   Player can discover traits by viewing NPCs with `availableTraits`
    *   Player can Resonate traits from NPCs to make them permanent (stored in `PlayerSlice.permanentTraits`)
    *   Player can temporarily equip NPC's `innateTraits` into their active slots (managed by `PlayerSlice.traitSlots`)
    *   Player can share equipped (non-permanent) traits with NPCs through `sharedTraitSlots`
- **Copy System**: Framework prepared for trait inheritance mechanics.

## 8. Performance Optimization

### 8.1. Selector Memoization ✅ IMPLEMENTED
- **createSelector**: Prevents unnecessary recalculations
- **Shallow Equality**: Efficient comparison for object selectors
- **Dependency Arrays**: Minimal selector dependencies

### 8.2. Component Integration ✅ IMPLEMENTED
- **useAppSelector**: Typed selector hook usage
- **Subscription Targeting**: Components subscribe only to relevant state slices
- **React.memo**: Component memoization for selector-dependent components

### 8.3. Thunk Optimization ✅ IMPLEMENTED
- **Error Boundaries**: Isolated error handling in thunks
- **State Validation**: Thunks validate prerequisites before mutations
- **Batched Updates**: Multiple related state updates in single thunks

## 9. Error Handling

### 9.1. Thunk Error Management ✅ IMPLEMENTED
```typescript
// ✅ Comprehensive error handling pattern
export const riskyOperationThunk = createAsyncThunk(
  'feature/riskyOperation',
  async (params, { rejectWithValue }) => {
    try {
      return await performOperation(params);
    } catch (error) {
      console.error('Operation failed:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);
```

### 9.2. State Error Recovery ✅ IMPLEMENTED
- **Error State**: Each slice includes error state for failed operations
- **Reset Actions**: Clear error states for retry mechanisms
- **Fallback Values**: Default states for corrupted or missing data

## 10. Testing Strategy

### 10.1. Slice Testing ✅ READY
```typescript
// ✅ Testing pattern for reducers
describe('featureSlice', () => {
  it('should handle data updates', () => {
    const initialState = { data: null };
    const action = updateData({ newData: 'test' });
    const result = featureSlice.reducer(initialState, action);
    
    expect(result.data).toBe('test');
  });
});
```

### 10.2. Selector Testing ✅ READY
```typescript
// ✅ Testing pattern for selectors
describe('feature selectors', () => {
  it('should select computed value correctly', () => {
    const mockState = { feature: { data: 'test' } };
    const result = selectComputedValue(mockState);
    
    expect(result).toBe(expectedValue);
  });
});
```

### 10.3. Thunk Testing ✅ READY
```typescript
// ✅ Testing pattern for thunks
describe('fetchDataThunk', () => {
  it('should handle successful fetch', async () => {
    const mockStore = configureMockStore([thunk])();
    mockApiCall.mockResolvedValue(mockData);
    
    await mockStore.dispatch(fetchDataThunk(params));
    
    const actions = mockStore.getActions();
    expect(actions[0].type).toBe('feature/fetchData/pending');
    expect(actions[1].type).toBe('feature/fetchData/fulfilled');
  });
});
```

## 11. Future Enhancements

### 11.1. Planned Slices 📋
- **Quest System**: Quest management and progression tracking
- **Copy System**: Player-created entity management (slice name: `copy`)
- **Inventory System**: Item storage and equipment management
- **Achievement System**: Player accomplishment tracking

### 11.2. Advanced Features 📋
- **Real-time Sync**: Multi-device state synchronization
- **Optimistic Updates**: Immediate UI updates with server reconciliation
- **State Persistence**: Enhanced save/load with compression and migration
- **Analytics Integration**: State change tracking for game balance

## 12. Best Practices Summary

### 12.1. State Organization ✅ IMPLEMENTED
- **Feature-Sliced**: Clear domain boundaries prevent coupling
- **Normalized Data**: Efficient data structures for complex relationships
- **Minimal State**: Only store what cannot be computed
- **Immutable Updates**: Immer-powered safe mutations

### 12.2. Performance Patterns ✅ IMPLEMENTED
- **Memoized Selectors**: Prevent unnecessary recalculations
- **Targeted Subscriptions**: Components subscribe to minimal state
- **Batched Operations**: Group related updates in thunks
- **Error Isolation**: Errors don't cascade across features

### 12.3. Developer Experience ✅ IMPLEMENTED
- **Type Safety**: Comprehensive TypeScript throughout
- **Dev Tools**: Redux DevTools integration for debugging
- **Consistent Patterns**: Standardized slice and thunk structure
- **Clear APIs**: Well-defined selector and action interfaces

The state management architecture provides a robust foundation for the React Incremental RPG Prototype, supporting complex game mechanics while maintaining performance, type safety, and developer experience excellence. The system demonstrates mature Redux Toolkit usage with comprehensive feature integration and cross-system coordination capabilities.
