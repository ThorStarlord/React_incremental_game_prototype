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
  // equippedTraits: (string | null)[]; // This was likely an old representation. Trait slots are now more structured.
  permanentTraits: string[]; // IDs of traits the player has permanently acquired
  traitSlots: TraitSlot[];   // Player's active trait slots, each can hold a traitId
  totalPlaytime: number;
  isAlive: boolean;
  resonanceLevel: number; 
  maxTraitSlots: number;
}
```

**Key Features**:
- **Stat Calculations**: Provides `recalculateStats` reducer for automatic recalculation of derived stats when attributes, traits, or status effects change.
- **Attribute Management**: Handles attribute point allocation (`allocateAttributePoint`) with validation against available points, and updates available points.
- **Status Effects**: Manages the list of active status effects (`addStatusEffect`, `removeStatusEffect`); their impact on stats is handled via `recalculateStats`. Time-based processing (e.g., duration countdown) is typically managed by thunks.
- **Trait Integration**: Manages player's active trait slots (`equipTrait`, `unequipTrait`) and the list of player-specific permanent traits (`addPermanentTrait`). The impact of these traits on stats is handled via `recalculateStats`.
- **Playtime Tracking**: Manages `totalPlaytime` (`updatePlaytime`).

### 4.2. Traits Slice ✅ COMPLETE
**Location**: `src/features/Traits/state/TraitsSlice.ts`

**State Structure**:
```typescript
interface TraitsState {
  traits: Record<string, Trait>; // All trait definitions
  acquiredTraits: string[];      // IDs of traits the player has generally acquired/learned
  // permanentTraits: string[];  // Removed: Player-specific permanent traits are in PlayerSlice
  // equippedTraits: string[];   // Removed: Player's equipped traits are managed by PlayerSlice.traitSlots
  // slots: TraitSlot[];         // Removed: Player's trait slots are managed by PlayerSlice
  // maxTraitSlots: number;      // Removed: Player's max trait slots are in PlayerSlice
  presets: TraitPreset[];        // Trait presets
  discoveredTraits: string[];    // IDs of traits the player has discovered
  loading: boolean;
  error: string | null;
}
```
*(Note: `TraitPreset` would also need to be defined in DataModel.md if it's a core, storable entity.)*

**Key Features**:
- **Trait Definitions & Discovery**: Manages all trait definitions (loaded via `fetchTraitsThunk`) and tracks discovered traits (`discoverTrait`, `discoveredTraits` state).
- **General Acquisition System**: Handles adding traits to the general "acquired" pool (`acquireTrait`). This signifies a trait is known to the player, but not necessarily active or permanent. *Note: The `acquireTrait` reducer does not directly manage Essence cost; this is handled by thunks like `acquireTraitWithEssenceThunk` which coordinates with the Essence slice and also updates `PlayerSlice` for permanent acquisition.*
- **Trait Permanence (Player-Specific):** Player-specific permanent traits are managed in `PlayerSlice`. The "Resonance" mechanic (`acquireTraitWithEssenceThunk`) makes traits permanent for the player by updating `PlayerSlice.permanentTraits`. The old `makePermanent` action and `makeTraitPermanentThunk` in `TraitsSlice` are deprecated.
- **Codex Data**: Provides the necessary data (`traits`, `discoveredTraits`, `acquiredTraits`) for a Trait Codex UI.
- **Trait Presets**: Manages saving, loading, and deleting trait presets (`saveTraitPreset`, `loadTraitPreset`, `deleteTraitPreset`).

### 4.3. NPCs Slice ✅ COMPLETE
**Location**: `src/features/NPCs/state/NPCSlice.ts`
(Content remains largely the same, ensuring consistency with previous updates)
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
  selectedNPCId: string | null;
}
```
**Key Features**:
- **NPC Data Management**: Initializes and stores core NPC data.
- **Discovery**: Tracks discovered NPCs.
- **Relationship Tracking**: Manages NPC relationship values and logs changes.
- **Interaction Management**: Handles current interaction sessions and logs dialogue history.
- **Status & Availability**: Manages NPC status and availability.
- **Trait System Integration**:
    *   NPCs have `availableTraits` for player "Resonance" (leading to permanent player traits in `PlayerSlice`).
    *   NPCs have `innateTraits` that players can temporarily equip into their `PlayerSlice.traitSlots`.
    *   NPCs have `sharedTraitSlots` for traits shared by the player.
- **Commerce Integration (Placeholder)**.

### 4.4. Essence Slice ✅ COMPLETE
**Location**: `src/features/Essence/state/EssenceSlice.ts`
(Content remains the same)

### 4.5. GameLoop Slice ✅ COMPLETE
**Location**: `src/features/GameLoop/state/GameLoopSlice.ts`
(Content remains the same)

### 4.6. Settings Slice ✅ COMPLETE
**Location**: `src/features/Settings/state/SettingsSlice.ts`
(Content remains the same)

## 5. Selector Architecture
(Content remains the same)

## 6. Async Operations (Thunks)
(Content remains the same)

## 7. Performance Optimization
(Content remains the same)

## 8. Error Handling
(Content remains the same)

## 9. Testing Strategy
(Content remains the same)

## 10. Future Enhancements
(Content remains the same)

## 11. Best Practices Summary
(Content remains the same)

The state management architecture provides a robust foundation for the React Incremental RPG Prototype, supporting complex game mechanics while maintaining performance, type safety, and developer experience excellence.
