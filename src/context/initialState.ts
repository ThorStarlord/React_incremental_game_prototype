/**
 * @file Initial state configuration for the incremental RPG game
 * 
 * This file defines the starting state for a new game including:
 * - Player statistics and attributes
 * - Resources and currencies
 * - Unlocked features and progression
 * - Skills, abilities and their levels
 * - Equipment slots and initial items
 * - Game settings and configuration
 */

/**
 * Player attributes that affect game mechanics
 */
export interface PlayerAttributes {
  strength: number;      // Affects physical damage and carrying capacity
  intelligence: number;  // Affects magical abilities and mana pool
  dexterity: number;     // Affects attack speed and dodge chance
  vitality: number;      // Affects health points and regeneration
  luck: number;          // Affects critical hit chance and item discovery
}

/**
 * Player's derived statistics from attributes and equipment
 */
export interface PlayerStats {
  health: number;
  maxHealth: number;
  healthRegen: number;
  mana: number;
  maxMana: number;
  manaRegen: number;
  physicalDamage: number;
  magicalDamage: number;
  critChance: number;    // As percentage
  critMultiplier: number;
}

/**
 * Player information and core statistics
 */
export interface PlayerState {
  name: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  attributes: PlayerAttributes;
  stats: PlayerStats;
  totalPlayTime: number;
  creationDate: string | null;  // ISO date string or null
}

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
  [key: string]: number; // Allow for additional statistics
}

/**
 * Meta information about the game state
 */
export interface MetaState {
  version: string;
  lastSaved: string | null; // ISO date string or null
  playingSince: string | null; // ISO date string or null
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
}

/**
 * Initial game state for a new player
 * @type {GameState}
 */
export const initialState: GameState = {
  /**
   * Player information and core statistics
   */
  player: {
    name: 'Hero',
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    // Core attributes that affect various gameplay mechanics
    attributes: {
      strength: 5,      // Affects physical damage and carrying capacity
      intelligence: 5,  // Affects magical abilities and mana pool
      dexterity: 5,     // Affects attack speed and dodge chance
      vitality: 5,      // Affects health points and regeneration
      luck: 1           // Affects critical hit chance and item discovery
    },
    // Derived statistics based on attributes and equipment
    stats: {
      health: 100,
      maxHealth: 100,
      healthRegen: 1,
      mana: 50,
      maxMana: 50,
      manaRegen: 0.5,
      physicalDamage: 5,
      magicalDamage: 2,
      critChance: 5,    // As percentage
      critMultiplier: 1.5
    },
    // Progression tracking
    totalPlayTime: 0,
    creationDate: null  // Will be set when the game starts
  },
  
  /**
   * Game resources and currencies
   */
  resources: {
    gold: 50,
    gems: 0,
    materials: {
      wood: 10,
      stone: 5,
      leather: 3,
      metal: 0,
      cloth: 5,
      herbs: 2
    }
  },
  
  /**
   * Available skills and their levels
   */
  skills: {
    combat: {
      swordplay: 1,
      archery: 0,
      defense: 1,
      dualWielding: 0
    },
    magic: {
      fireMagic: 0,
      iceMagic: 0,
      lightningMagic: 0,
      restoration: 1
    },
    crafting: {
      alchemy: 0,
      blacksmithing: 0,
      leatherworking: 0,
      enchanting: 0
    },
    gathering: {
      mining: 0,
      herbalism: 1,
      woodcutting: 1,
      fishing: 0
    }
  },
  
  /**
   * Inventory and equipment
   */
  inventory: {
    capacity: 20,
    items: [
      {
        id: 'health_potion_1',
        name: 'Minor Health Potion',
        type: 'consumable',
        effect: { health: 25 },
        quantity: 3,
        value: 10
      },
      {
        id: 'wooden_sword_1',
        name: 'Wooden Sword',
        type: 'weapon',
        stats: { physicalDamage: 3 },
        quantity: 1,
        value: 15
      }
    ]
  },
  
  /**
   * Currently equipped items
   */
  equipment: {
    weapon: null,
    offhand: null,
    head: null,
    body: null,
    hands: null,
    legs: null,
    feet: null,
    accessory1: null,
    accessory2: null
  },
  
  /**
   * Game progression tracking
   */
  progression: {
    currentLocation: 'village',
    unlockedLocations: ['village', 'forest_edge'],
    completedQuests: [],
    activeQuests: [],
    achievements: [],
    unlockedFeatures: ['combat', 'inventory']
  },
  
  /**
   * Combat-related state
   */
  combat: {
    inCombat: false,
    currentEnemy: null,
    autoAttack: false,
    lastCombatResult: null,
    combatLog: []
  },
  
  /**
   * Game settings
   */
  settings: {
    notifications: {
      combatResults: true,
      levelUp: true,
      questUpdates: true,
      lootDrops: true
    },
    audio: {
      musicVolume: 0.5,
      soundEffectsVolume: 0.7,
      ambientVolume: 0.3
    },
    gameplay: {
      difficultyLevel: 'normal',
      autosaveInterval: 60 // in seconds
    }
  },
  
  /**
   * Game statistics and metrics
   */
  statistics: {
    enemiesDefeated: 0,
    questsCompleted: 0,
    itemsCrafted: 0,
    resourcesGathered: 0,
    goldEarned: 0,
    distanceTraveled: 0
  },
  
  /**
   * Meta information about the game state
   */
  meta: {
    version: '1.0.0',
    lastSaved: null,
    playingSince: null
  }
};

/**
 * Reset the game state to initial values
 * @returns {GameState} A fresh copy of the initial state
 */
export const resetGameState = (): GameState => {
  const freshState = JSON.parse(JSON.stringify(initialState)) as GameState;
  freshState.player.creationDate = new Date().toISOString();
  freshState.meta.playingSince = new Date().toISOString();
  return freshState;
};

/**
 * Calculate experience required for a specific level
 * @param {number} level - The level to calculate for
 * @returns {number} Experience points required
 */
export const calculateExperienceForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * Helper function to recalculate derived stats based on attributes and equipment
 * @param {PlayerState} playerState - Current player state
 * @param {EquipmentState} equipment - Currently equipped items
 * @returns {PlayerStats} Updated player stats
 */
export const recalculatePlayerStats = (
  playerState: PlayerState, 
  equipment: EquipmentState
): PlayerStats => {
  const { attributes } = playerState;
  
  // Base stats from attributes
  const stats: PlayerStats = {
    health: playerState.stats.health,
    maxHealth: 50 + (attributes.vitality * 10),
    healthRegen: 0.5 + (attributes.vitality * 0.1),
    mana: playerState.stats.mana,
    maxMana: 25 + (attributes.intelligence * 5),
    manaRegen: 0.25 + (attributes.intelligence * 0.05),
    physicalDamage: attributes.strength,
    magicalDamage: attributes.intelligence * 0.8,
    critChance: attributes.luck + (attributes.dexterity * 0.2),
    critMultiplier: 1.5 + (attributes.luck * 0.05)
  };
  
  // Add equipment bonuses (would be implemented based on equipped items)
  // This would loop through equipment and add all stats bonuses
  
  // Ensure health and mana don't exceed maximums
  stats.health = Math.min(playerState.stats.health || stats.maxHealth, stats.maxHealth);
  stats.mana = Math.min(playerState.stats.mana || stats.maxMana, stats.maxMana);
  
  return stats;
};

export default initialState;
