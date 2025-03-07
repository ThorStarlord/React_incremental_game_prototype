/**
 * Consolidated type definitions for the game state
 */

// Import EssenceState interface from the feature directory
import { EssenceState } from './EssenceGameStateTypes';

// Import player-related types from PlayerGameStateTypes
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

// Re-export player types for backward compatibility
export type {
  PlayerState,
  PlayerAttributes,
  PlayerStats,
  Skill,
  StatusEffect,
  TraitEffect,
  Trait
};

// Re-export essence types for backward compatibility
export type { EssenceState };

// Use the imported InventoryItem type to maintain compatibility
export type InventoryItem = PlayerInventoryItem;

/**
 * Game materials used for crafting and upgrades
 */
export interface Materials {
  wood: number;
  stone: number;
  leather: number;
  metal: number;
  cloth: number;
  herbs: number;
  [key: string]: number; // Allow for additional materials
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
 * Combat skills and levels
 */
export interface CombatSkills {
  swordplay: number;
  archery: number;
  defense: number;
  dualWielding: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * Magic skills and levels
 */
export interface MagicSkills {
  fireMagic: number;
  iceMagic: number;
  lightningMagic: number;
  restoration: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * Crafting skills and levels
 */
export interface CraftingSkills {
  alchemy: number;
  blacksmithing: number;
  leatherworking: number;
  enchanting: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * Gathering skills and levels
 */
export interface GatheringSkills {
  mining: number;
  herbalism: number;
  woodcutting: number;
  fishing: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * All player skills categorized by type
 */
export interface SkillsState {
  combat: CombatSkills;
  magic: MagicSkills;
  crafting: CraftingSkills;
  gathering: GatheringSkills;
}

/**
 * Effect that can be applied by consumables or equipment
 */
export interface ItemEffect {
  health?: number;
  mana?: number;
  strength?: number;
  intelligence?: number;
  dexterity?: number;
  vitality?: number;
  luck?: number;
  [key: string]: number | undefined; // Allow for additional effects
}

/**
 * Item statistics for weapons and armor
 */
export interface ItemStats {
  physicalDamage?: number;
  magicalDamage?: number;
  armor?: number;
  healthBonus?: number;
  manaBonus?: number;
  [key: string]: number | undefined; // Allow for additional stats
}

/**
 * Game item structure
 */
export interface GameItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'quest' | 'accessory';
  effect?: ItemEffect;
  stats?: ItemStats;
  quantity: number;
  value: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description?: string;
}

/**
 * Player inventory
 */
export interface InventoryState {
  capacity: number;
  items: GameItem[];
}

/**
 * Equipment slots for the player
 */
export interface EquipmentState {
  weapon: GameItem | null;
  offhand: GameItem | null;
  head: GameItem | null;
  body: GameItem | null;
  hands: GameItem | null;
  legs: GameItem | null;
  feet: GameItem | null;
  accessory1: GameItem | null;
  accessory2: GameItem | null;
  [key: string]: GameItem | null; // Allow for additional equipment slots
}

/**
 * Game progression tracking
 */
export interface ProgressionState {
  currentLocation: string;
  unlockedLocations: string[];
  completedQuests: string[];
  activeQuests: string[];
  achievements: string[];
  unlockedFeatures: string[];
}

/**
 * Combat state
 */
export interface CombatState {
  inCombat: boolean;
  currentEnemy: any | null; // We could define an Enemy interface later
  autoAttack: boolean;
  lastCombatResult: 'victory' | 'defeat' | 'escape' | null;
  combatLog: string[];
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  combatResults: boolean;
  levelUp: boolean;
  questUpdates: boolean;
  lootDrops: boolean;
}

/**
 * Audio settings
 */
export interface AudioSettings {
  musicVolume: number;
  soundEffectsVolume: number;
  ambientVolume: number;
}

/**
 * Gameplay settings
 */
export interface GameplaySettings {
  difficultyLevel: 'easy' | 'normal' | 'hard' | 'nightmare';
  autosaveInterval: number; // in seconds
  relationshipDecayDisabled?: boolean; // Whether NPC relationships should decay over time
}

/**
 * All game settings
 */
export interface SettingsState {
  notifications: NotificationSettings;
  audio: AudioSettings;
  gameplay: GameplaySettings;
}

/**
 * Game statistics and metrics
 */
export interface StatisticsState {
  enemiesDefeated: number;
  questsCompleted: number;
  itemsCrafted: number;
  resourcesGathered: number;
  goldEarned: number;
  distanceTraveled: number;
  totalPlayTime?: number;
  [key: string]: number | undefined; // Allow for additional statistics
}

/**
 * Meta information about the game state
 */
export interface MetaState {
  version: string;
  lastSaved: string | null; // ISO date string or null
  playingSince: string | null; // ISO date string or null
}

export interface TraitSystem {
  copyableTraits: Record<string, Trait>;
}

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
  statistics: StatisticsState;
  meta: MetaState;
  essence: EssenceState;
  traits?: TraitSystem;

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
 * Action type for reducers
 */
export interface ActionType<T = any> {
  type: string;
  payload: T;
}