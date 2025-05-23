# Data Model Specification

This document defines the structure of key data objects used within the application state (`RootState`). These interfaces are typically defined in the `state/FeatureTypes.ts` file within each feature slice.

*(Note: This is not exhaustive but covers the primary data structures based on current features.)*

## 1. `RootState` (Overall State Structure)

```typescript
// Defined implicitly by combining reducers in app/store.ts
interface RootState {
  gameLoop: GameLoopState; // NEW: Game timing and state management
  player: PlayerState;
  traits: TraitsState;
  essence: EssenceState;
  settings: SettingsState;
  meta: MetaState;
  copies?: CopiesState; // Optional/New
  npcs?: NpcsState;     // Optional/New
  quests?: QuestsState;   // Optional/New
  // ... other slices
}
```

## 1.5. `GameLoopState` (`features/GameLoop/state/GameLoopTypes.ts`)

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

## 2. `PlayerState` (`features/Player/state/PlayerTypes.ts`)

```typescript
interface PlayerState {
  name: string;
  level: number;
  experience: number;
  stats: PlayerStats; // See below
  attributes: Record<string, Attribute>; // See below
  attributePoints: number;
  skillPoints: number;
  // skills: Skill[]; // If skill system is added
  statusEffects: StatusEffect[]; // See below
  equipment: EquipmentState; // See below
  // Trait-related fields managed by Traits slice might be redundant here
  // acquiredTraits: string[]; // IDs of acquired traits
  // permanentTraits: string[]; // IDs of permanent traits
  // traitSlots: number; // Max equippable slots (consider deriving from slots array in TraitsState)
  gold: number;
  totalPlayTime: number; // In seconds or milliseconds
  isAlive: boolean;
  // ... other player-specific fields
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number; // Base physical attack
  defense: number; // Base physical defense
  speed: number; // Action speed/frequency
  healthRegen: number; // Per second/tick
  manaRegen: number; // Per second/tick
  critChance: number; // 0.0 to 1.0
  critDamage: number; // Multiplier (e.g., 1.5 for +50%)
  // ... other stats (magic attack, magic defense, evasion, etc.)
  [key: string]: number; // Allow dynamic stats
}

interface Attribute {
  name: string; // e.g., "Strength"
  value: number; // Current value including bonuses
  baseValue: number; // Value from allocated points
}

interface StatusEffect {
  id: string; // Unique identifier for the effect instance
  name: string; // Display name (e.g., "Poisoned", "Regeneration")
  type: string; // e.g., 'buff', 'debuff'
  duration: number; // Remaining duration in seconds or ticks
  magnitude?: number; // Strength of the effect
  source?: string; // Origin (e.g., 'item_id', 'skill_id', 'npc_id')
  timestampApplied: number; // When the effect started
  effects: Partial<PlayerStats>; // Stat modifications
}

interface EquipmentItem {
  id: string; // Unique item instance ID or base item ID
  name: string;
  type: string; // e.g., 'weapon', 'armor', 'accessory'
  slot: string; // e.g., 'head', 'chest', 'mainHand'
  stats?: Partial<PlayerStats>; // Stat bonuses
  rarity?: string; // e.g., 'common', 'rare'
  // ... other item properties (description, value)
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

## 3. `TraitsState` (`features/Traits/state/TraitsTypes.ts`)

```typescript
interface TraitsState {
  traits: Record<string, Trait>; // All defined traits, keyed by ID
  acquiredTraits: string[]; // IDs player has learned/copied
  permanentTraits: string[]; // IDs player has made permanent
  equippedTraits: string[]; // IDs currently equipped in player slots
  slots: TraitSlot[]; // Player's equippable slots
  maxTraitSlots: number; // Max possible player slots (may be dynamic)
  discoveredTraits: string[]; // IDs player is aware of
  presets: TraitPreset[]; // Saved loadouts
  loading: boolean;
  error: string | null;
}

interface Trait {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., 'Combat', 'Social'
  rarity: string; // e.g., 'common', 'rare'
  effects: TraitEffectValues | TraitEffect[]; // Stat modifications or complex effects
  requirements?: TraitRequirements; // Conditions to acquire/use
  essenceCost?: number; // Cost to acquire via resonance
  permanenceCost?: number; // Cost to make permanent
  source?: string; // Optional: where it was acquired from
  // ... other trait properties
}

// Example effect structures
interface TraitEffectValues {
  [statKey: string]: number; // e.g., { maxHealth: 10, attackPowerPercent: 0.05 }
}
interface TraitEffect { // For more complex/conditional effects
  type: string; // e.g., 'stat_modifier', 'conditional_buff'
  // ... specific properties based on type
}

interface TraitRequirements {
  level?: number;
  prerequisiteTrait?: string; // ID of another trait
  quest?: string; // ID of a completed quest
  relationshipLevel?: number; // Minimum level with a specific NPC
  npcId?: string; // NPC ID for relationship requirement
}

interface TraitSlot {
  id: string; // Unique ID for the slot instance
  index: number;
  isUnlocked: boolean;
  traitId?: string | null; // ID of the equipped trait
  unlockRequirements?: { type: string; value: any }; // e.g., { type: 'level', value: 5 }
}

interface TraitPreset {
  id: string;
  name: string;
  traits: string[]; // Array of trait IDs in this preset
  description?: string;
  created: number; // Timestamp
}
```

## 4. `EssenceState` (`features/Essence/state/EssenceTypes.ts`)

```typescript
interface EssenceState {
  amount: number; // Current essence
  totalCollected: number; // Lifetime essence collected (for unlocks)
  generationRate: number; // Passive generation per second/tick
  perClick: number; // Essence gained per manual click (if applicable)
  multiplier: number; // Global multiplier
  maxAmount?: number; // Optional cap
  npcConnections: number; // Number of active NPC connections contributing to generation
  // generators: Record<string, GeneratorState>; // If using generator upgrades
  // upgrades: Record<string, UpgradeState>; // If using upgrade system
  lastUpdated: number; // Timestamp
  // ... other essence-related fields
}
```

## 5. `SettingsState` (`features/Settings/state/SettingsTypes.ts`)

```typescript
interface SettingsState {
  audio: AudioSettings;
  graphics: GraphicsSettings;
  gameplay: GameplaySettings;
  ui: UISettings;
}

interface AudioSettings {
  masterVolume: number; // 0-100
  musicVolume: number;
  effectsVolume: number;
  // ... other audio settings
  muteWhenInactive: boolean;
}

interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  particleEffects: boolean;
  // ... other graphics settings
  darkMode: boolean;
}

interface GameplaySettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  autosaveInterval: number; // In minutes
  autosaveEnabled: boolean;
  showTutorials: boolean;
  // ... other gameplay settings
}

interface UISettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: string; // Theme identifier
  showResourceNotifications: boolean;
  // ... other UI settings
}
```

## 6. `MetaState` (`features/Meta/state/MetaTypes.ts`)

```typescript
interface MetaState {
  lastSavedTimestamp: number | null;
  lastLoadedTimestamp: number | null;
  currentSaveId: string | null; // ID of the currently loaded save
  isImported: boolean; // Flag if the current session started from an import
  gameVersion: string; // Version of the game when saved/loaded
  sessionStartTime: number; // Timestamp when the current game session started
}
```

## 7. `CopiesState` (`features/Copies/state/CopyTypes.ts` - *New/Proposed*)

```typescript
interface CopiesState {
  copies: Record<string, Copy>; // All player copies, keyed by unique ID
  maxCopies: number; // Current limit
  // ... other global copy management state
}

interface Copy {
  id: string; // Unique ID for this copy
  name: string; // Can be assigned by player?
  parentTargetId?: string; // ID of the NPC involved in creation
  creationTimestamp: number;
  growthMethod: 'normal' | 'accelerated';
  growthProgress?: number; // 0-1, relevant for normal growth
  isMature: boolean; // Has completed growth phase
  stats: PlayerStats; // Copies have their own stats
  // attributes: Record<string, Attribute>; // Do they have attributes? TBD
  loyalty: number; // 0-100
  currentTask?: CopyTask;
  location?: string; // Current location ID
  inheritedTraits: string[]; // Traits inherited at creation
  sharedTraitSlots: CopyTraitSlot[]; // Slots for player to share traits into
  // ... other copy-specific state
}

interface CopyTask {
  id: string; // Unique task instance ID
  type: string; // e.g., 'gather', 'scout', 'influence', 'combat_assist'
  targetId?: string; // Target of the task (resource node, location, NPC)
  startTime: number;
  duration?: number; // Optional duration
  // ... task-specific parameters
}

interface CopyTraitSlot {
  id: string;
  index: number;
  isUnlocked: boolean; // Unlocked based on Copy age/loyalty?
  traitId?: string | null; // ID of the player trait shared in this slot
}
```

## 8. `NpcsState` (`features/Npcs/state/NpcTypes.ts` - ✅ Implemented)

```typescript
interface NpcsState {
  npcs: Record<string, NpcState>; // All relevant NPCs, keyed by ID
}

interface NpcState {
  id: string;
  name: string;
  location: string;
  // Relationship managed here or separate RelationshipSlice?
  relationshipValue: number; // Player's relationship score with this NPC
  connectionDepth?: number; // Specific measure for Essence generation/Trait sharing
  loyalty?: number; // If NPCs can have loyalty distinct from relationship
  status?: string; // e.g., 'idle', 'hostile', 'quest_available'
  traits?: Record<string, NpcTraitInfo>; // Traits the NPC possesses
  sharedTraitSlots?: NpcSharedTraitSlot[]; // Slots player has granted
  // ... other NPC-specific state
}

interface NpcTraitInfo {
  id: string; // Trait ID
  isVisible: boolean; // Can the player perceive this trait?
  relationshipRequirement?: number; // Min relationship to acquire via resonance
}

interface NpcSharedTraitSlot {
  id: string;
  index: number;
  traitId?: string | null; // ID of the player trait shared here
}
```

## 9. `QuestsState` (`features/Quests/state/QuestTypes.ts` - *New/Proposed*)

```typescript
interface QuestsState {
  availableQuests: string[]; // IDs of quests player can accept
  acceptedQuests: Record<string, QuestProgress>; // Quests currently active, keyed by ID
  completedQuests: string[]; // IDs of completed quests
  failedQuests: string[]; // IDs of failed quests
  allQuestDefinitions: Record<string, QuestDefinition>; // Loaded definitions
}

interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  giver?: string;
  type: 'main' | 'side' | 'repeatable' | 'tutorial';
  objectives: QuestObjectiveDefinition[];
  prerequisites?: QuestPrerequisites;
  rewards?: QuestRewards;
  isAutoComplete?: boolean;
}

interface QuestObjectiveDefinition {
  id: string;
  description: string;
  type: 'gather' | 'kill' | 'talk' | 'reachLocation' | 'useItem' | 'custom';
  target?: string; // Item ID, NPC ID, Enemy Type, Location ID
  requiredCount?: number;
  isHidden?: boolean;
}

interface QuestPrerequisites {
  level?: number;
  questCompleted?: string; // Another quest ID
  relationship?: { npcId: string; level: number };
  trait?: string; // Player must have trait ID
}

interface QuestRewards {
  xp?: number;
  gold?: number;
  essence?: number;
  items?: { itemId: string; quantity: number }[];
  reputation?: { factionId: string; amount: number }[];
  traitId?: string; // Grant a specific trait
}

interface QuestProgress {
  questId: string;
  status: 'accepted' | 'inProgress' | 'readyToComplete';
  objectiveProgress: Record<string, number>; // Keyed by objectiveId, stores currentCount
  startTime: number;
}
```
