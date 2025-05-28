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
  healthRegeneration: number;
  manaRegeneration: number;
  
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

## 4. Trait Data Model ✅ IMPLEMENTED

### 4.1. Trait Definition
**Location**: `src/features/Traits/state/TraitTypes.ts`

```typescript
interface Trait {
  id: string;              // Unique trait identifier
  name: string;            // Display name
  description: string;     // Detailed description
  category: TraitCategory; // Grouping category
  rarity: TraitRarity;     // Trait rarity level
  effects: TraitEffect[];  // Stat modifications
  requirements?: TraitRequirement[]; // Acquisition requirements
  essenceCost: number;     // Acquisition cost
  permanenceCost: number;  // Cost to make permanent
  isDiscovered: boolean;   // Player knowledge state
  source?: string;         // Acquisition source (NPC ID, quest, etc.)
}
```

### 4.2. Trait Categories
```typescript
enum TraitCategory {
  COMBAT = 'combat',       // Combat effectiveness
  PHYSICAL = 'physical',   // Physical capabilities
  SOCIAL = 'social',       // Social interactions
  MENTAL = 'mental',       // Mental attributes
  MYSTICAL = 'mystical',   // Magical/essence abilities
  UTILITY = 'utility'      // General utility effects
}
```

### 4.3. Trait Rarity
```typescript
enum TraitRarity {
  COMMON = 'common',       // Basic traits, low cost
  UNCOMMON = 'uncommon',   // Moderate effects, moderate cost
  RARE = 'rare',           // Strong effects, high cost
  EPIC = 'epic',           // Very strong effects, very high cost
  LEGENDARY = 'legendary'  // Unique effects, extreme cost
}
```

### 4.4. Trait Effects
```typescript
interface TraitEffect {
  type: 'stat_modifier' | 'ability_grant' | 'passive_effect';
  target: string;          // Affected stat or system
  value: number;           // Effect magnitude
  duration?: number;       // Effect duration (permanent if omitted)
  conditions?: string[];   // Activation conditions
}
```

## 5. NPC Data Model ✅ IMPLEMENTED

### 5.1. NPC Definition
**Location**: `src/features/NPCs/state/NPCTypes.ts`

```typescript
interface NPC {
  id: string;              // Unique NPC identifier
  name: string;            // Display name
  description: string;     // Character description
  location: string;        // Current location
  avatar?: string;         // Character image/avatar
  personality: NPCPersonality; // Behavioral traits
  availableTraits: string[]; // Traits player can acquire
  sharedTraitSlots: number; // Slots for player trait sharing
  baseRelationship: number; // Starting relationship value
  maxRelationship: number;  // Maximum achievable relationship
  isOnline: boolean;       // Availability status
  lastInteraction?: number; // Last interaction timestamp
}
```

### 5.2. NPC Personality
```typescript
interface NPCPersonality {
  openness: number;        // 0-100, affects trait sharing willingness
  friendliness: number;    // 0-100, affects relationship gain rate
  trustfulness: number;    // 0-100, affects unlock thresholds
  interests: string[];     // Topics/traits of interest
  dislikes: string[];      // Topics/traits to avoid
}
```

### 5.3. Relationship Data
```typescript
interface NPCRelationship {
  npcId: string;           // Target NPC identifier
  currentValue: number;    // Current relationship level (0-100)
  maxValue: number;        // Maximum achievable relationship
  interactionCount: number; // Total interactions
  lastInteraction: number; // Last interaction timestamp
  relationshipHistory: RelationshipChangeEntry[]; // Change log
}
```

### 5.4. Interaction Data
```typescript
interface NPCInteraction {
  id: string;              // Unique interaction identifier
  npcId: string;           // Target NPC
  type: InteractionType;   // Interaction category
  timestamp: number;       // When interaction occurred
  outcome: InteractionOutcome; // Interaction result
  relationshipChange: number; // Relationship effect
  essenceGained: number;   // Essence reward
  itemsGained?: string[];  // Item rewards
  traitsUnlocked?: string[]; // Trait unlock rewards
}
```

### 5.5. Interaction Types
```typescript
enum InteractionType {
  DIALOGUE = 'dialogue',     // Conversation
  GIFT = 'gift',             // Item giving
  TRADE = 'trade',           // Commerce
  QUEST = 'quest',           // Quest completion
  TRAIT_SHARE = 'trait_share', // Trait sharing
  SEDUCTION = 'seduction'    // Copy creation attempt
}
```

## 6. Essence Data Model ✅ IMPLEMENTED

### 6.1. Essence State
**Location**: `src/features/Essence/state/EssenceTypes.ts`

```typescript
interface EssenceState {
  currentAmount: number;     // Current essence available
  totalCollected: number;   // Lifetime essence collection
  generationRate: number;   // Essence per second from connections
  perClickAmount: number;   // Manual generation amount
  lastGeneration: number;   // Last generation timestamp
  connections: EssenceConnection[]; // Active generation sources
}
```

### 6.2. Essence Connections
```typescript
interface EssenceConnection {
  id: string;                // Unique connection identifier
  sourceId: string;          // NPC or entity ID
  sourceType: 'npc' | 'copy' | 'location'; // Source category
  connectionDepth: number;   // Relationship strength (0-100)
  baseGenerationRate: number; // Base essence per second
  multipliers: number[];     // Active multiplier effects
  isActive: boolean;         // Whether currently generating
  establishedAt: number;     // Connection creation timestamp
}
```

## 7. Game Loop Data Model ✅ IMPLEMENTED

### 7.1. Game Loop State
**Location**: `src/features/GameLoop/state/GameLoopTypes.ts`

```typescript
interface GameLoopState {
  isRunning: boolean;        // Game loop active status
  isPaused: boolean;         // Temporary pause state
  gameSpeed: number;         // Speed multiplier (0.1x to 5.0x)
  currentTick: number;       // Current game tick
  totalGameTime: number;     // Total elapsed time (milliseconds)
  tickRate: number;          // Ticks per second (default: 10)
  autoSaveInterval: number;  // Auto-save frequency (seconds)
  lastAutoSave: number;      // Last auto-save timestamp
  deltaTime: number;         // Time since last tick
}
```

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
  muteWhenInactive: boolean;
}

interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  particleEffects: boolean;
  darkMode: boolean;
}

interface GameplaySettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  autosaveInterval: number;  // minutes (1-60)
  autosaveEnabled: boolean;
  showTutorials: boolean;
}

interface UISettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: string;
  showResourceNotifications: boolean;
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
