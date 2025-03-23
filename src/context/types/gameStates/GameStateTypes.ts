/**
 * Consolidated type definitions for the game state
 */

// Import game loop state types
import { 
  NPC, 
  GameArea, 
  GameTime, 
  // Import with aliases to avoid conflicts
  QuestObjective as GameLoopQuestObjective, 
  Quest as GameLoopQuest,
  ExtendedPlayerState,
  ExtendedGameState 
} from './gameLoopStateTypes';

// Import player-related types
import { 
  PlayerState, 
  PlayerAttributes, 
  PlayerStats
  // Remove StatusEffect from import since it's defined locally
} from './PlayerGameStateTypes';

// Import combat-related types
import {
  CombatSkills,
  Enemy,
  CombatActionType,
  CombatActionResult,
  CombatLogEntry,
  CombatStateContainer
} from './CombatGameStateTypes';

// Import inventory and item-related types
import {
  GameItem,
  ItemEffect,
  ItemStats,
  InventoryState,
  InventoryItem
} from './InventoryGameStateTypes';

// Import equipment-related types
import {
  EquipmentState,
  EquipmentBonuses,
  EquipmentRequirements,
  EquipmentSlot
} from './EquipmentGameStateTypes';

// Import progression-related types
import {
  ProgressionState,
  Quest as ProgressionQuest,
  QuestObjective as ProgressionQuestObjective,
  QuestReward,
  Achievement,
  GameLocation,
  GameFeature
} from './ProgressionGameStateTypes';

// Import settings-related types
import {
  SettingsState,
  NotificationSettings,
  AudioSettings,
  GameplaySettings,
  UISettings,
  AccessibilitySettings
} from './SettingsGameStateTypes';

// Import notifications-related types
import { NotificationsState } from './NotificationsGameStateTypes';

// Import statistics-related types
import {
  StatisticsState,
  StatisticsSystem
} from './StatisticsGameStateTypes';

// Import meta-related types
import {
  MetaState,
  SemanticVersion,
  SaveHistoryEntry,
  PlaySession,
  GameUpdate,
  FeatureFlags,
  DebugInfo,
  MigrationRecord
} from './MetaGameStateTypes';

// Import skills-related types
import {
  SkillsState,
  MagicSkills,
  CraftingSkills,
  GatheringSkills
} from './SkillsGameStateTypes';

// Import trait-related types
import {
  TraitSystem,
  ExtendedTrait,
  ActiveTrait,
  TieredTrait,
  TraitSlots,
  TraitInteractionResult
} from './TraitsGameStateTypes';

// Import quest-related types
import {
  QuestSystem,
  ExtendedQuest,
  ExtendedQuestObjective,
  QuestUpdateEvent
} from './QuestsGameStateTypes';

// Import world-related types
import {
  WorldState,
  ExtendedLocation,
  Region,
  WorldNPC,
  Faction,
  Shop,
  WorldEvent,
  WorldTime,
  BiomeType,
  WeatherType,
  TimeOfDay,
  Season
} from './WorldGameStateTypes';

// Import essence-related types
import { EssenceState } from './EssenceGameStateTypes';

// Import resource-related types
import { ResourceState } from './ResourceGameStateTypes';

// Import faction-related types
import { FactionSystem } from './FactionGameStateTypes';

/**
 * Complete game state
 */
export interface GameState {
  player: PlayerState;
  resources: ResourceState;
  skills: SkillsState;
  inventory: InventoryState;
  equipment: EquipmentState;
  progression: ProgressionState;
  combat: CombatState;
  settings: SettingsState;
  statistics: StatisticsSystem;
  meta: MetaState;
  essence: EssenceState;
  traits: TraitSystem;
  quests: QuestSystem;
  world: WorldState;
  notifications: NotificationsState;
  factions: FactionSystem; // Add this line to include the factions property
  minionsSystem?: {
    minions: Record<string, any>;
    tasks?: Record<string, any>;
    upgrades?: Record<string, any>;
    [key: string]: any;
  };

  /**
   * @deprecated Since v1.5.0. Use specific state properties instead.
   * Will be removed in v2.0.0
   */
  gameData?: Record<string, unknown>;
  /**
   * @deprecated Since v1.5.0. Use specific state properties instead.
   * Will be removed in v2.0.0
   */
  stats?: Record<string, unknown>;
}

/**
 * Specific action types for the game
 */
export type GameActionType = 
  | 'PLAYER_UPDATE' 
  | 'COMBAT_START' 
  | 'INVENTORY_ADD'
  | 'EQUIPMENT_UPDATE'
  | 'QUEST_UPDATE'
  | 'SKILL_UPDATE'
  | 'RESOURCE_UPDATE'
  | 'SETTINGS_UPDATE'
  | 'STATISTICS_UPDATE'
  | 'META_UPDATE'
  | 'NOTIFICATION_ADD'
  | 'NOTIFICATION_REMOVE';

/**
 * Action type for reducers
 */
export interface ActionType<T = unknown> {
  type: GameActionType;
  payload: T;
}

/**
 * Combat state interface
 */
export interface CombatState {
  active: boolean;
  playerTurn: boolean;
  round: number;
  log: {
    timestamp: number;  // Changed from string to number to match CombatGameStateTypes
    message: string;
    type: string;
    importance: 'normal' | 'high';
  }[];
  rewards?: {  // Optional, as it's only present after combat
    experience: number;
    gold: number;
    items: InventoryItem[];
  };
}

/**
 * Interface for status effects that can be applied to entities
 */
export interface StatusEffect {
  /** Unique identifier for the effect */
  id: string;
  /** Display name of the effect */
  name: string;
  /** How long the effect lasts (in turns, seconds, etc.) */
  duration: number;
  /** Type of effect (buff, debuff, etc.) */
  type?: string;
  /** Strength/magnitude of the effect */
  strength?: number;
  /** When the effect was applied */
  timestamp?: number;
  /** Additional metadata for the effect */
  [key: string]: any;
}

// Re-export types for convenience, fixing the duplicates
export type {
  PlayerState, PlayerAttributes, PlayerStats,
  CombatSkills, Enemy, CombatActionType, CombatActionResult, CombatLogEntry, CombatStateContainer,
  GameItem, ItemEffect, ItemStats, InventoryState, InventoryItem,
  EquipmentState, EquipmentBonuses, EquipmentRequirements, EquipmentSlot,
  ProgressionState, QuestReward, Achievement, GameLocation, GameFeature,
  SettingsState, NotificationSettings, AudioSettings, GameplaySettings, UISettings, AccessibilitySettings,
  StatisticsState, StatisticsSystem,
  MetaState, SemanticVersion, SaveHistoryEntry, PlaySession, GameUpdate, FeatureFlags, DebugInfo, MigrationRecord,
  SkillsState, MagicSkills, CraftingSkills, GatheringSkills,
  TraitSystem, ExtendedTrait, ActiveTrait, TieredTrait, TraitSlots, TraitInteractionResult,
  QuestSystem, ExtendedQuest, ExtendedQuestObjective, QuestUpdateEvent,
  WorldState, ExtendedLocation, Region, WorldNPC, Faction, Shop, WorldEvent, WorldTime,
  BiomeType, WeatherType, TimeOfDay, Season,
  EssenceState,
  NotificationsState,
  ResourceState,
  FactionSystem,
  
  // Re-export game loop types with aliases
  NPC,
  GameArea,
  GameTime,
  GameLoopQuestObjective,
  GameLoopQuest,
  ExtendedPlayerState,
  ExtendedGameState,
  
  // Export progression types with aliases
  ProgressionQuest as Quest,
  ProgressionQuestObjective as QuestObjective
};