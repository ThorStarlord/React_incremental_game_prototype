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
 * Initial game state for a new player
 * @type {Object}
 */
export const initialState = {
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
 * @returns {Object} A fresh copy of the initial state
 */
export const resetGameState = () => {
  const freshState = JSON.parse(JSON.stringify(initialState));
  freshState.player.creationDate = new Date().toISOString();
  freshState.meta.playingSince = new Date().toISOString();
  return freshState;
};

/**
 * Calculate experience required for a specific level
 * @param {number} level - The level to calculate for
 * @returns {number} Experience points required
 */
export const calculateExperienceForLevel = (level) => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * Helper function to recalculate derived stats based on attributes and equipment
 * @param {Object} playerState - Current player state
 * @param {Object} equipment - Currently equipped items
 * @returns {Object} Updated player stats
 */
export const recalculatePlayerStats = (playerState, equipment) => {
  const { attributes } = playerState;
  
  // Base stats from attributes
  const stats = {
    maxHealth: 50 + (attributes.vitality * 10),
    maxMana: 25 + (attributes.intelligence * 5),
    healthRegen: 0.5 + (attributes.vitality * 0.1),
    manaRegen: 0.25 + (attributes.intelligence * 0.05),
    physicalDamage: attributes.strength,
    magicalDamage: attributes.intelligence * 0.8,
    critChance: attributes.luck + (attributes.dexterity * 0.2),
    critMultiplier: 1.5 + (attributes.luck * 0.05)
  };
  
  // Add equipment bonuses (would be implemented based on equipped items)
  
  // Ensure health and mana don't exceed maximums
  stats.health = Math.min(playerState.stats.health || stats.maxHealth, stats.maxHealth);
  stats.mana = Math.min(playerState.stats.mana || stats.maxMana, stats.maxMana);
  
  return stats;
};

export default initialState;