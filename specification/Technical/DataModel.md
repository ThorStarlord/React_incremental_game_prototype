# Data Model Specification

This document defines the core data structures, relationships, and schema for the React Incremental RPG Prototype. The data model supports complex game mechanics while maintaining performance and type safety.

## 1. Overview

The data model follows a normalized approach where possible while balancing performance requirements for a client-side game. All data structures are defined with TypeScript interfaces and support serialization for save/load functionality.

### 1.1. Design Principles
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Normalization**: Efficient data organization with minimal duplication
- **Immutability**: Redux-compatible immutable data patterns
- **Serializability**: All data structures support JSON serialization
- **Performance**: Optimized for frequent access and updates

## 2. Core Entity Relationships

```
Player 1:M StatusEffects
Player 1:M TraitSlots
Player M:M Traits (equipped/permanent)
Player 1:M NPCRelationships

NPC 1:M TraitSlots
NPC M:M Traits (available/shared)
NPC 1:M Interactions

Trait 1:M TraitEffects
Trait M:M NPCs (acquisition sources)

Copy 1:1 NPC (parent)
Copy M:M Traits (inherited)
Copy 1:M Tasks
```

## 3. Player Data Model ✅ IMPLEMENTED

### 3.1. Player State
**Location**: `src/features/Player/state/PlayerTypes.ts`

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

### 3.2. Player Statistics
```typescript
interface PlayerStats {
  // Core vitals
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  
  // Combat attributes
  attack: number;
  defense: number;
  speed: number;
  
  // Regeneration rates (per second)
  healthRegen: number;        // Consistent with PlayerStats in code
  manaRegen: number;          // Consistent with PlayerStats in code
  
  // Advanced combat
  criticalChance: number;  // 0.0 to 1.0
  criticalDamage: number;  // multiplier (1.5 = 150%)
}
```

### 3.3. Player Attributes
```typescript
interface PlayerAttributes {
  strength: number;      // Influences attack, carrying capacity
  dexterity: number;     // Affects speed, critical chance
  intelligence: number;  // Determines mana, magical effectiveness
  constitution: number;  // Governs health, defense
  wisdom: number;        // Affects mana regeneration, perception
  charisma: number;      // Influences social interactions, relationships
}
```

### 3.4. Status Effects
```typescript
interface StatusEffect {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Effect description
  duration: number;              // Duration in milliseconds (-1 = permanent)
  effects: Partial<PlayerStats>; // Stat modifications
  startTime: number;             // Application timestamp
  type?: string;                 // New in code: optional effect type (buff, debuff, neutral)
  category?: string;             // New in code: optional effect category (combat, social, magical, etc.)
}
```

### 3.5. Trait Slots
```typescript
interface TraitSlot {
  id: string;                // Unique slot identifier
  slotIndex: number;         // Position in trait array
  traitId: string | null;    // Equipped trait ID (null = empty)
  isLocked: boolean;         // Whether slot is accessible
  unlockRequirement?: string; // Condition to unlock slot
}
```

### 3.6. Player Base Statistics
This interface represents the raw base statistics for the player, before any modifiers from attributes, traits, or status effects are applied. These are typically the values stored directly in the Redux state.
**Location**: `src/features/Player/state/PlayerTypes.ts` (implicitly, as it's defined there)

```typescript
interface PlayerBaseStats {
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
}
```

## 4. Trait Data Model ✅ IMPLEMENTED

### 4.1. Trait Definition
**Location**: `src/features/Traits/state/TraitTypes.ts`

```typescript
interface Trait {
  id: string;              // Unique trait identifier
  name: string;            // Display name
  description: string;     // Detailed description
  category: string;        // Grouping category (code uses string)
  rarity: string;          // Trait rarity level (code uses string)
  effects: TraitEffect[] | TraitEffectValues;  // Stat modifications (updated type)
  requirements?: Record<string, any>; // Acquisition requirements (simplified to match general object structure)
  essenceCost?: number;    // Acquisition cost (optional in code)
  permanenceCost?: number; // Cost to make permanent (optional in code)
  // isDiscovered is handled in TraitsState.discoveredTraits in code
  source?: string;         // Acquisition source (NPC ID, quest, etc.)
  tier?: number;           // New optional in code
  iconPath?: string;       // New optional in code
  level?: number;          // New optional in code
}
```

### 4.2. Trait Categories and Rarity
In the codebase (`TraitsTypes.ts`), `category` and `rarity` are represented as `string` types on the `Trait` interface, rather than enums. The specific string values (e.g., 'combat', 'common') would be defined by convention or loaded data.

### 4.3. Trait Effects
```typescript
interface TraitEffect {
  type: string;            // Type of effect (e.g., "STAT_MODIFIER", "ABILITY_GRANT")
  magnitude: number;       // Effect magnitude
  duration?: number;       // Effect duration (permanent if omitted)
  description?: string;    // Optional description of the specific effect instance
}
```

### 4.4. Trait Effect Values
This interface is used when trait effects are stored as a simple key-value map of effect names to their magnitudes, as an alternative to an array of `TraitEffect` objects.
```typescript
interface TraitEffectValues {
  [effectName: string]: number;
}
```

### 4.5. Trait Preset
Defines a saved loadout or configuration of traits.
**Location**: `src/features/Traits/state/TraitsTypes.ts`
```typescript
interface TraitPreset {
  id: string;                // Unique identifier for this preset
  name: string;              // Name of this preset
  traits: string[];          // Array of trait IDs in this preset
  description?: string;    // Optional description
  created: number;           // Created timestamp
}
```

## 5. NPC Data Model ✅ IMPLEMENTED

### 5.1. NPC Definition
**Location**: `src/features/NPCs/state/NPCTypes.ts`

```typescript
interface NPC {
  // Basic identification and presentation
  id: string;
  name: string;
  description?: string; // Optional in code
  location: string;
  avatar?: string;
  faction?: string;     // New optional in code
  
  // Relationship and connection data
  relationshipValue: number; // New in code
  connectionDepth: number;   // New in code
  loyalty: number;           // New in code
  
  // Interaction tracking
  availableDialogues: string[]; // New in code
  completedDialogues: string[]; // New in code
  availableQuests: string[];    // New in code
  completedQuests: string[];    // New in code
  
  // Trait system integration
  traits?: Record<string, NPCTraitInfo>; // New optional in code, uses NPCTraitInfo
  availableTraits: string[];            // Renamed from teachableTraits to align with NPCTypes.ts
  sharedTraitSlots?: NPCSharedTraitSlot[]; // New optional in code, array of NPCSharedTraitSlot
  
  // Commerce and services (placeholders in code)
  inventory?: NPCInventory;   // New optional in code
  services?: NPCService[];    // New optional in code
  
  // Behavioral characteristics (placeholders in code)
  personality?: NPCPersonality; // Optional in code
  schedule?: NPCSchedule;     // New optional in code
  
  // State management
  status: NPCStatus;            // New in code, uses NPCStatus type
  lastInteraction?: number;     // Matches
  isDiscovered?: boolean;       // New optional in code
  isAvailable?: boolean;        // New optional in code
  discoveredAt: number;         // New in code: Timestamp when NPC was first discovered
}
```

### 5.2. NPC Status
This type defines the possible statuses for an NPC.
**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
type NPCStatus = 
  | 'available'
  | 'busy' 
  | 'traveling'
  | 'sleeping'
  | 'hostile'
  | 'dead'
  | 'unknown';
```

### 5.3. NPC Trait Information
Trait information specific to NPCs, including acquisition requirements.
**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
interface NPCTraitInfo {
  id: string;
  name?: string;
  description?: string;
  category: 'physical' | 'combat' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  effects: Record<string, number>;
  requirements: {
    relationshipLevel: number;
  };
  essenceCost?: number;
  prerequisites?: string[];
  isVisible?: boolean;
  discovered: boolean;
  cost: number;
  relationshipRequirement?: number;
}
```

### 5.4. NPC Shared Trait Slot
Defines a slot where the player can share traits with an NPC.
**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
interface NPCSharedTraitSlot {
  id: string;
  index: number;
  traitId?: string | null;
  isUnlocked: boolean;
  unlockRequirement?: number;
}
```

### 5.5. NPC Personality (Placeholder in Code)
The current `NPCPersonality` in `NPCTypes.ts` is a placeholder. The specification's original version was more detailed. For now, reflecting the code:
**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
interface NPCPersonality { // Placeholder structure from code
  traits: string[];
  preferences: Record<string, number>;
  dislikes: Record<string, number>;
}
```
*(Note: The original DataModel.md had a more detailed NPCPersonality. This will need to be reconciled during feature development.)*

### 5.6. Relationship Data
In the codebase, direct relationship metrics like `relationshipValue` are stored on the `NPC` object itself. A history of changes is maintained via `RelationshipChangeEntry`. The `NPCRelationship` object from the original spec is not directly used.

**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
interface RelationshipChangeEntry {
  id: string;
  npcId: string;
  timestamp: number;
  oldValue: number;
  newValue: number;
  reason: string;
}
```

### 5.7. Interaction System
The interaction system in code has several parts:
- `InteractionType`: Defines types of interactions.
- `NPCInteraction`: Represents the current, active interaction session.
- `InteractionResult`: The outcome of an interaction.
- `DialogueEntry`: For logging dialogue.

**InteractionType (Code uses a type alias)**
**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
type InteractionType = 
  | 'dialogue'
  | 'trade'
  | 'quest'
  | 'trait_sharing'
  | 'gift'
  | 'challenge';
```

**Current Interaction Session (NPCInteraction in code)**
**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
interface NPCInteraction { // Represents current interaction session
  npcId: string;
  startTime: number;
  type: InteractionType;
  context?: Record<string, any>;
}
```

**Interaction Result**
**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
interface InteractionResult {
  success: boolean;
  relationshipChange?: number;
  essenceGained?: number;
  unlockRewards?: string[];
  message?: string;
  rewards?: string[];
}
```

**Dialogue Entry**
**Location**: `src/features/NPCs/state/NPCTypes.ts`
```typescript
interface DialogueEntry {
  id: string;
  npcId: string;
  timestamp: number;
  playerText: string;
  npcResponse: string;
  relationshipChange?: number;
}
```

### 5.8. Placeholder NPC Data Structures (from NPCTypes.ts)
The following are defined in code, often as placeholders for future systems.
```typescript
interface NPCInventory {
  items: any[]; // Placeholder
  currency: number;
}

interface NPCService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  isAvailable: boolean;
}

interface NPCSchedule {
  [timeSlot: string]: {
    location: string;
    availability: boolean;
    activities: string[];
  };
}
```

## 6. Essence Data Model ✅ IMPLEMENTED

### 6.1. Essence State
**Location**: `src/features/Essence/state/EssenceTypes.ts`

```typescript
interface EssenceState {
  currentEssence: number;     // Current essence available (renamed from currentAmount)
  totalCollected: number;   // Lifetime essence collection
  generationRate: number;   // Essence per second
  perClickValue: number;    // Manual generation amount (renamed from perClickAmount)
  lastGenerationTime: number; // Last generation timestamp (renamed from lastGeneration)
  isGenerating: boolean;    // New in code: Tracks if passive generation is active
  loading: boolean;         // New in code: Loading state for async operations
  error: string | null;     // New in code: Error message if any
  // 'connections: EssenceConnection[]' was removed as it's not in the code's EssenceState
}
```
*(Note: The `EssenceConnection` interface and its usage within `EssenceState` have been removed from this section of the DataModel.md as they are not present in the current `EssenceTypes.ts`. If connection-specific data is managed elsewhere, that should be documented in the relevant section, e.g., NPC or a dedicated Connection/Relationship model.)*

## 7. Game Loop Data Model ✅ IMPLEMENTED

### 7.1. Game Loop State
**Location**: `src/features/GameLoop/state/GameLoopTypes.ts`

```typescript
interface GameLoopState {
  isRunning: boolean;        // Game loop active status
  isPaused: boolean;         // Temporary pause state
  currentTick: number;       // Current game tick
  tickRate: number;          // Ticks per second (default: 10)
  lastUpdateTime: number;    // New in code: Timestamp of the last update
  totalGameTime: number;     // Total elapsed time (milliseconds)
  gameSpeed: number;         // Speed multiplier (0.1x to 5.0x)
  autoSaveInterval: number;  // Auto-save frequency (in milliseconds in code)
  lastAutoSave: number;      // Last auto-save timestamp
  // deltaTime is part of tick processing data, not stored state.
}
```
*(Note: `deltaTime` was removed from `GameLoopState` as it's typically calculated per tick and not stored state. The code defines a separate `TickData` interface for such transient data.)*

## 8. Settings Data Model ✅ IMPLEMENTED

### 8.1. Settings State
**Location**: `src/features/Settings/state/SettingsTypes.ts`

```typescript
interface SettingsState {
  audio: AudioSettings;
  graphics: GraphicsSettings;
  gameplay: GameplaySettings;
  ui: UISettings;
}
```

### 8.2. Settings Categories
```typescript
interface AudioSettings {
  masterVolume: number;      // 0-100
  musicVolume: number;       // 0-100
  effectsVolume: number;     // 0-100
  ambientVolume: number;     // New in code
  dialogueVolume: number;    // New in code
  muteWhenInactive: boolean;
}

interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  particleEffects: boolean;
  animations: boolean;       // New in code
  showFPS: boolean;          // New in code
  darkMode: boolean;
}

interface GameplaySettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  autosaveInterval: number;  // Interval in minutes (code comment)
  autosaveEnabled: boolean;
  showTutorials: boolean;
  combatSpeed: number;       // New in code
  notificationDuration: number; // Duration in seconds (code comment)
}

interface UISettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: string;             // Theme identifier (e.g., 'dark', 'light', 'blue')
  showResourceNotifications: boolean;
  showLevelUpAnimations: boolean; // New in code
  compactInventory: boolean;    // New in code
}
```

## 9. Quest Data Model 📋 PLANNED

### 9.1. Quest Structure
```typescript
interface Quest {
  id: string;                // Unique quest identifier
  title: string;             // Quest name
  description: string;       // Quest narrative
  giver: string;             // NPC or source ID
  type: QuestType;           // Quest category
  objectives: QuestObjective[]; // Tasks to complete
  prerequisites: QuestRequirement[]; // Start conditions
  rewards: QuestReward[];    // Completion rewards
  status: QuestStatus;       // Current state
  isAutoComplete: boolean;   // Auto-complete when objectives met
  timeLimit?: number;        // Optional time constraint
}
```

### 9.2. Quest Objectives
```typescript
interface QuestObjective {
  objectiveId: string;       // Unique within quest
  description: string;       // Task description
  type: ObjectiveType;       // Task category
  target: string;            // Target entity/item
  requiredCount: number;     // Amount needed
  currentCount: number;      // Current progress
  isHidden: boolean;         // Initially hidden objective
  isComplete: boolean;       // Completion status
}
```

## 10. Copy Data Model 📋 PLANNED

### 10.1. Copy Structure
```typescript
interface Copy {
  id: string;                // Unique copy identifier
  name: string;              // Copy name/designation
  parentNPCId: string;       // Source NPC for creation
  createdAt: number;         // Creation timestamp
  growthType: 'normal' | 'accelerated'; // Growth method
  maturityLevel: number;     // Development progress (0-100)
  loyalty: number;           // Loyalty to player (0-100)
  stats: CopyStats;          // Individual statistics
  inheritedTraits: string[]; // Traits from creation
  sharedTraits: string[];    // Traits shared by player
  currentTask?: CopyTask;    // Active assignment
  location: string;          // Current location
  isActive: boolean;         // Operational status
}
```

### 10.2. Copy Tasks
```typescript
interface CopyTask {
  id: string;                // Unique task identifier
  type: TaskType;            // Task category
  description: string;       // Task details
  assignedAt: number;        // Assignment timestamp
  estimatedDuration: number; // Expected completion time
  progress: number;          // Completion progress (0-100)
  requirements: TaskRequirement[]; // Task prerequisites
  rewards: TaskReward[];     // Completion benefits
}
```

## 11. Data Validation

### 11.1. Runtime Validation
```typescript
// ✅ Validation patterns used throughout
function validatePlayerStats(stats: PlayerStats): boolean {
  return (
    stats.health >= 0 &&
    stats.maxHealth > 0 &&
    stats.health <= stats.maxHealth &&
    stats.mana >= 0 &&
    stats.maxMana >= 0 &&
    stats.mana <= stats.maxMana &&
    stats.criticalChance >= 0 &&
    stats.criticalChance <= 1
  );
}
```

### 11.2. Schema Evolution
```typescript
// ✅ Version management for save data
interface SaveDataVersion {
  version: string;           // Data format version
  timestamp: number;         // Save creation time
  gameVersion: string;       // Game version compatibility
  migrationPath?: string[];  // Required migrations
}
```

## 12. Performance Considerations

### 12.1. Data Normalization
- **Traits**: Stored by ID in Record<string, Trait> for O(1) access
- **NPCs**: Normalized storage with relationship data separated
- **Status Effects**: Array storage with periodic cleanup
- **Interactions**: Ring buffer for recent interactions

### 12.2. Memory Management
- **Lazy Loading**: Large datasets loaded on demand
- **Cleanup**: Automatic removal of expired/irrelevant data
- **Compression**: Save data compression for storage efficiency
- **Caching**: Memoized computed values for expensive calculations

## 13. Serialization

### 13.1. Save Format
```typescript
interface SaveData {
  version: SaveDataVersion;
  timestamp: number;
  player: PlayerState;
  traits: TraitsState;
  npcs: NPCState;
  essence: EssenceState;
  gameLoop: Omit<GameLoopState, 'isRunning' | 'isPaused'>;
  settings?: SettingsState; // Optional settings inclusion
  metadata: SaveMetadata;
}
```

### 13.2. Import/Export
- **JSON Format**: Human-readable save data
- **Compression**: Optional gzip compression for large saves
- **Validation**: Schema validation on import
- **Migration**: Automatic format version migration

## 14. Future Enhancements

### 14.1. Planned Extensions
- **Inventory System**: Item storage and management
- **Achievement System**: Player accomplishment tracking  
- **Guild System**: Player organization mechanics
- **Market System**: Player-to-player trading

### 14.2. Advanced Features
- **Real-time Sync**: Multi-device synchronization
- **Cloud Storage**: Remote save data backup
- **Analytics**: Player behavior data collection
- **Modding Support**: User-generated content structure

The data model provides a comprehensive foundation for the React Incremental RPG Prototype while maintaining flexibility for future expansions and optimizations. The structure supports complex game mechanics while ensuring type safety, performance, and maintainability.
