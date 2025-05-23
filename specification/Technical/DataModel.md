# Data Model Specification

This document defines the structure of key data objects used within the application state (`RootState`). These interfaces are defined in the `state/FeatureTypes.ts` file within each feature slice following Feature-Sliced Design principles.

**Implementation Status**: ✅ **IMPLEMENTED** - Core data models implemented with proper TypeScript definitions and Feature-Sliced organization.

## 1. `RootState` (Overall State Structure) ✅ IMPLEMENTED

```typescript
// Defined by combining reducers in app/store.ts
interface RootState {
  gameLoop: GameLoopState; // ✅ IMPLEMENTED - Game timing and state management
  player: PlayerState;     // ✅ IMPLEMENTED - Player character data
  traits: TraitsState;     // ✅ IMPLEMENTED - Trait system state
  essence: EssenceState;   // ✅ IMPLEMENTED - Core metaphysical resource
  settings: SettingsState; // ✅ IMPLEMENTED - User configuration
  meta: MetaState;         // ✅ IMPLEMENTED - Application metadata
  npcs: NpcsState;         // ✅ IMPLEMENTED - NPC relationship data
  // Future additions:
  copies?: CopiesState;    // 📋 PLANNED - Copy management
  quests?: QuestsState;    // 📋 PLANNED - Quest system
}
```

## 1.5. `GameLoopState` (`features/GameLoop/state/GameLoopTypes.ts`) ✅ IMPLEMENTED

```typescript
interface GameLoopState {
  isRunning: boolean;         // Is the game loop active
  isPaused: boolean;          // Is the game temporarily paused
  currentTick: number;        // Current tick number since start
  tickRate: number;           // Ticks per second (default 10)
  totalGameTime: number;      // Total elapsed time in milliseconds
  gameSpeed: number;          // Speed multiplier (0.1x to 5.0x)
  autoSaveInterval: number;   // Auto-save interval in seconds
  lastAutoSave: number;       // Timestamp of last auto-save
}
```

## 2. `PlayerState` (`features/Player/state/PlayerTypes.ts`) ✅ IMPLEMENTED

**Architecture Note**: PlayerState types are now properly organized following Feature-Sliced Design with no context dependencies.

```typescript
interface PlayerState {
  name: string;
  level: number;
  experience: number;
  stats: PlayerStats;                    // ✅ IMPLEMENTED - See below
  attributes: Record<string, Attribute>; // ✅ IMPLEMENTED - See below
  attributePoints: number;
  skillPoints: number;
  statusEffects: StatusEffect[];         // ✅ IMPLEMENTED - See below
  equipment: EquipmentState;             // ✅ IMPLEMENTED - See below
  gold: number;
  totalPlayTime: number;                 // In milliseconds
  isAlive: boolean;
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;        // Base physical attack
  defense: number;       // Base physical defense
  speed: number;         // Action speed/frequency
  healthRegen: number;   // Per second/tick
  manaRegen: number;     // Per second/tick
  critChance: number;    // 0.0 to 1.0
  critDamage: number;    // Multiplier (e.g., 1.5 for +50%)
  [key: string]: number; // Allow dynamic stats
}

interface Attribute {
  name: string;      // e.g., "Strength"
  value: number;     // Current value including bonuses
  baseValue: number; // Value from allocated points
}

interface StatusEffect {
  id: string;                    // Unique identifier for the effect instance
  name: string;                  // Display name (e.g., "Poisoned", "Regeneration")
  type: string;                  // e.g., 'buff', 'debuff'
  duration: number;              // Remaining duration in seconds or ticks
  magnitude?: number;            // Strength of the effect
  source?: string;               // Origin (e.g., 'item_id', 'skill_id', 'npc_id')
  timestampApplied: number;      // When the effect started
  effects: Partial<PlayerStats>; // Stat modifications
}

interface EquipmentItem {
  id: string;                    // Unique item instance ID or base item ID
  name: string;
  type: string;                  // e.g., 'weapon', 'armor', 'accessory'
  slot: string;                  // e.g., 'head', 'chest', 'mainHand'
  stats?: Partial<PlayerStats>;  // Stat bonuses
  rarity?: string;               // e.g., 'common', 'rare'
}

interface EquipmentState {
  head?: EquipmentItem | null;
  chest?: EquipmentItem | null;
  legs?: EquipmentItem | null;
  feet?: EquipmentItem | null;
  mainHand?: EquipmentItem | null;
  offHand?: EquipmentItem | null;
  accessory1?: EquipmentItem | null;
  accessory2?: EquipmentItem | null;
  [key: string]: EquipmentItem | null | undefined; // Allow dynamic access
}
```

### 2.1. Player State Architecture ✅ RESOLVED
**Previous Issue**: Import from `context/GameStateExports` violated Feature-Sliced Design
**Resolution**: 
- ✅ Created `src/features/Player/state/PlayerTypes.ts` with comprehensive type definitions
- ✅ Added `src/features/Player/state/PlayerSelectors.ts` with memoized selectors
- ✅ Implemented `src/features/Player/index.ts` with proper barrel exports
- ✅ Updated `src/features/player/utils/getPlayerStats.ts` to use feature imports

### 2.2. Action Payload Types ✅ IMPLEMENTED
```typescript
// Additional types for Redux actions
export interface UpdatePlayerPayload {
  updates: Partial<PlayerState>;
}

export interface ModifyHealthPayload {
  amount: number;
  type: 'damage' | 'heal';
}

export interface AllocateAttributePayload {
  attributeName: string;
  points: number;
}

export interface EquipItemPayload {
  slot: string;
  item: EquipmentItem | null;
}
```

## 3. `TraitsState` (`features/Traits/state/TraitsTypes.ts`) ✅ IMPLEMENTED

```typescript
interface TraitsState {
  traits: Record<string, Trait>;          // All defined traits, keyed by ID
  acquiredTraits: string[];               // IDs player has learned/copied
  permanentTraits: string[];              // IDs player has made permanent
  equippedTraits: string[];               // IDs currently equipped in player slots
  slots: TraitSlot[];                     // Player's equippable slots
  maxTraitSlots: number;                  // Max possible player slots
  discoveredTraits: string[];             // IDs player is aware of
  presets: TraitPreset[];                 // Saved loadouts
  loading: boolean;
  error: string | null;
}

interface Trait {
  id: string;
  name: string;
  description: string;
  category: string;                       // e.g., 'Combat', 'Social'
  rarity: string;                         // e.g., 'common', 'rare'
  effects: TraitEffectValues | TraitEffect[]; // Stat modifications or complex effects
  requirements?: TraitRequirements;       // Conditions to acquire/use
  essenceCost?: number;                   // Cost to acquire via resonance
  permanenceCost?: number;                // Cost to make permanent
  source?: string;                        // Optional: where it was acquired from
}

interface TraitSlot {
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId?: string | null;                // ID of the equipped trait
  unlockRequirements?: { type: string; value: any };
}
```

## 4. `EssenceState` (`features/Essence/state/EssenceTypes.ts`) ✅ IMPLEMENTED

```typescript
interface EssenceState {
  amount: number;                         // Current essence
  totalCollected: number;                 // Lifetime essence collected
  generationRate: number;                 // Passive generation per second/tick
  perClick: number;                       // Essence gained per manual click
  multiplier: number;                     // Global multiplier
  maxAmount?: number;                     // Optional cap
  npcConnections: number;                 // Number of active NPC connections
  lastUpdated: number;                    // Timestamp
}
```

## 5. `SettingsState` (`features/Settings/state/SettingsTypes.ts`) ✅ IMPLEMENTED

```typescript
interface SettingsState {
  audio: AudioSettings;
  graphics: GraphicsSettings;
  gameplay: GameplaySettings;
  ui: UISettings;
}

interface AudioSettings {
  masterVolume: number;                   // 0-100
  musicVolume: number;
  effectsVolume: number;
  muteWhenInactive: boolean;
}

interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  particleEffects: boolean;
  darkMode: boolean;
}

interface GameplaySettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  autosaveInterval: number;               // In minutes
  autosaveEnabled: boolean;
  showTutorials: boolean;
}

interface UISettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: string;                          // Theme identifier
  showResourceNotifications: boolean;
}
```

## 6. `MetaState` (`features/Meta/state/MetaTypes.ts`) ✅ IMPLEMENTED

```typescript
interface MetaState {
  lastSavedTimestamp: number | null;
  lastLoadedTimestamp: number | null;
  currentSaveId: string | null;          // ID of the currently loaded save
  isImported: boolean;                   // Flag if session started from import
  gameVersion: string;                   // Version when saved/loaded
  sessionStartTime: number;              // Current session start timestamp
}
```

## 7. `NpcsState` (`features/Npcs/state/NpcTypes.ts`) ✅ IMPLEMENTED

```typescript
interface NpcsState {
  npcs: Record<string, NpcState>;        // All relevant NPCs, keyed by ID
}

interface NpcState {
  id: string;
  name: string;
  location: string;
  relationshipValue: number;             // Player's relationship score
  connectionDepth?: number;              // For Essence generation/Trait sharing
  loyalty?: number;                      // Distinct from relationship
  status?: string;                       // e.g., 'idle', 'hostile', 'quest_available'
  traits?: Record<string, NpcTraitInfo>; // Traits the NPC possesses
  sharedTraitSlots?: NpcSharedTraitSlot[]; // Slots player has granted
}

interface NpcTraitInfo {
  id: string;                            // Trait ID
  isVisible: boolean;                    // Can player perceive this trait?
  relationshipRequirement?: number;     // Min relationship to acquire
}

interface NpcSharedTraitSlot {
  id: string;
  index: number;
  traitId?: string | null;               // ID of player trait shared here
}
```

## 8. Planned Data Models 📋 FUTURE

### 8.1. `CopiesState` (Planned)

```typescript
interface CopiesState {
  copies: Record<string, Copy>;          // All player copies, keyed by ID
  maxCopies: number;                     // Current limit
}

interface Copy {
  id: string;
  name: string;
  parentTargetId?: string;               // NPC involved in creation
  creationTimestamp: number;
  growthMethod: 'normal' | 'accelerated';
  growthProgress?: number;               // 0-1 for normal growth
  isMature: boolean;
  stats: PlayerStats;
  loyalty: number;                       // 0-100
  currentTask?: CopyTask;
  location?: string;
  inheritedTraits: string[];
  sharedTraitSlots: CopyTraitSlot[];
}
```

### 8.2. `QuestsState` (Planned)

```typescript
interface QuestsState {
  availableQuests: string[];             // IDs of quests player can accept
  acceptedQuests: Record<string, QuestProgress>; // Active quests
  completedQuests: string[];             // Completed quest IDs
  failedQuests: string[];                // Failed quest IDs
  allQuestDefinitions: Record<string, QuestDefinition>; // Loaded definitions
}
```

## 9. Type Management Architecture ✅ IMPLEMENTED

### 9.1. Feature-Sliced Type Organization
```typescript
// ✅ Current implementation follows this pattern
src/features/Player/
├── state/
│   ├── PlayerTypes.ts      // ✅ Primary type definitions
│   ├── PlayerSlice.ts      // ✅ Redux slice implementation
│   └── PlayerSelectors.ts  // ✅ Memoized selectors
├── utils/
│   └── getPlayerStats.ts   // ✅ Uses local type imports
└── index.ts               // ✅ Barrel exports including types
```

### 9.2. Import Patterns ✅ STANDARDIZED
```typescript
// ✅ Feature-internal imports
import type { PlayerState } from '../state/PlayerTypes';

// ✅ Cross-feature imports via barrel
import type { PlayerState } from '../../Player';

// ✅ Store-level imports
import type { RootState } from '../../../app/store';
```

### 9.3. Context System Elimination ✅ COMPLETED
**Previous Architecture Issue**: Types were imported from `context/GameStateExports`
**Resolution**: 
- ✅ All context-based type imports eliminated
- ✅ Feature-based type organization implemented
- ✅ Single source of truth maintained through Redux types only
- ✅ No duplicate type definitions

## 10. Performance Considerations ✅ IMPLEMENTED

### 10.1. Selector Optimization
- **Memoized Selectors**: Using `createSelector` for derived data
- **Efficient Updates**: Targeted state updates to minimize re-renders
- **Type Safety**: Full TypeScript integration without performance penalties

### 10.2. State Normalization
- **Entity Organization**: Records keyed by ID for efficient lookups
- **Minimal Duplication**: Single source definitions prevent inconsistencies
- **Scalable Structure**: Ready for large collections of entities

This data model specification reflects the current implementation state with proper Feature-Sliced Design architecture and eliminates the previous context-based architectural issues.
