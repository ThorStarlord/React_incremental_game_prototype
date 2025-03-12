/**
 * Consolidated type definitions for the game state
 */

// Import player-related types
import { 
  PlayerState, 
  PlayerAttributes, 
  PlayerStats, 
  Skill,
  StatusEffect,
  TraitEffect,
  Trait,
  InventoryItem as PlayerInventoryItem 
} from './PlayerGameStateTypes';

// Import combat-related types
import {
  CombatState,
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
  Materials,
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
  Quest,
  QuestObjective,
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

// Import statistics-related types
import {
  StatisticsState,
  CombatStatistics,
  ProgressionStatistics,
  EconomyStatistics,
  ProductionStatistics,
  ExplorationStatistics,
  TimeStatistics,
  SocialStatistics,
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
  MigrationHistory
} from './MetaGameStateTypes';

// Import skills-related types
import {
  SkillsState,
  MagicSkills,
  CraftingSkills,
  GatheringSkills,
  CombatSkills as SkillsCombatSkills
} from './SkillsGameStateTypes';

// Import trait-related types
import {
  TraitSystem as ExtendedTraitSystem,
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
  QuestDifficulty,
  QuestType,
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

// Re-export all types for backward compatibility
export type {
  // Player types
  PlayerState, PlayerAttributes, PlayerStats, Skill, StatusEffect, TraitEffect, Trait,
  
  // Combat types
  CombatState, CombatSkills, Enemy, CombatActionType, CombatActionResult, CombatLogEntry, CombatStateContainer,
  
  // Inventory and item types
  GameItem, ItemEffect, ItemStats, InventoryState, InventoryItem, Materials,
  
  // Equipment types
  EquipmentState, EquipmentBonuses, EquipmentRequirements, EquipmentSlot,
  
  // Progression types
  ProgressionState, Quest, QuestObjective, QuestReward, Achievement, GameLocation, GameFeature,
  
  // Settings types
  SettingsState, NotificationSettings, AudioSettings, GameplaySettings, UISettings, AccessibilitySettings,
  
  // Statistics types
  StatisticsState, CombatStatistics, ProgressionStatistics, EconomyStatistics, 
  ProductionStatistics, ExplorationStatistics, TimeStatistics, SocialStatistics, StatisticsSystem,
  
  // Meta types
  MetaState, SemanticVersion, SaveHistoryEntry, PlaySession, GameUpdate, FeatureFlags, DebugInfo, MigrationHistory,
  
  // Skills types
  SkillsState, MagicSkills, CraftingSkills, GatheringSkills,
  
  // Trait types
  ExtendedTraitSystem as TraitSystem, ExtendedTrait, ActiveTrait, TieredTrait, TraitSlots, TraitInteractionResult,
  
  // Quest types
  QuestSystem, ExtendedQuest, ExtendedQuestObjective, QuestDifficulty, QuestType, QuestUpdateEvent,
  
  // World types
  WorldState, ExtendedLocation, Region, WorldNPC, Faction, Shop, WorldEvent, WorldTime,
  BiomeType, WeatherType, TimeOfDay, Season,
  
  // Essence types
  EssenceState
};

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
  traits: ExtendedTraitSystem;
  quests: QuestSystem;
  world: WorldState;

  // For backward compatibility
  gameData?: {
    [key: string]: any;
  };
  stats?: {
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Game resources and currencies
 */
export interface ResourceState {
  gold: number;
  gems: number;
  materials: Materials;
}

/**
 * Action type for reducers
 */
export interface ActionType<T = any> {
  type: string;
  payload: T;
}