/**
 * @fileoverview Initial state configuration for the combat system.
 * This module defines the default state structure used when initializing or resetting combat.
 * 
 * @module features/Combat/combatInitialState
 */

/**
 * The initial state object for combat encounters.
 * @typedef {Object} CombatState
 */
const combatInitialState = {
  /** 
   * @property {boolean} active - Whether combat is currently in progress 
   * When false, the player is not engaged in combat
   */
  active: false,
  
  /**
   * @property {number} round - Current round number in the combat sequence
   * Increments with each complete player-enemy action cycle
   */
  round: 0,
  
  /**
   * @property {boolean} playerTurn - Indicates if it's currently the player's turn
   * True for player's turn, false for enemy's turn
   */
  playerTurn: true,
  
  /**
   * @property {Object} player - Player's combat-specific stats and conditions
   * These values are derived from the player's base stats but may be modified during combat
   */
  player: {
    /** @property {number} currentHealth - Player's current health points */
    currentHealth: 100,
    
    /** @property {number} maxHealth - Player's maximum health points during this combat */
    maxHealth: 100,
    
    /** @property {number} currentMana - Player's current mana/energy resource */
    currentMana: 50,
    
    /** @property {number} maxMana - Player's maximum mana/energy during this combat */
    maxMana: 50,
    
    /**
     * @property {Array<Object>} temporaryBuffs - Temporary buffs applied to the player
     * Each buff object contains effect type, magnitude, and duration
     */
    temporaryBuffs: [],
    
    /**
     * @property {Array<Object>} statusEffects - Status effects affecting the player
     * Includes effects like poison, stun, etc.
     */
    statusEffects: []
  },
  
  /**
   * @property {Object} enemy - Current enemy's stats and information
   * Complete description of the opponent the player is facing
   */
  enemy: {
    /** @property {string|null} id - Unique identifier for this enemy type */
    id: null,
    
    /** @property {string} name - Display name of the enemy */
    name: '',
    
    /** @property {number} level - Enemy's level, affects stat scaling */
    level: 1,
    
    /** @property {number} currentHealth - Enemy's current health points */
    currentHealth: 0,
    
    /** @property {number} maxHealth - Enemy's maximum health points */
    maxHealth: 0,
    
    /** @property {number} attack - Enemy's attack power */
    attack: 0,
    
    /** @property {number} defense - Enemy's defensive capability */
    defense: 0,
    
    /** @property {number} speed - Enemy's speed (affects turn order) */
    speed: 0,
    
    /** @property {number} experience - Experience points rewarded when defeated */
    experience: 0,
    
    /** @property {number} gold - Gold dropped when defeated */
    gold: 0,
    
    /**
     * @property {Array<Object>} loot - Items that may drop when enemy is defeated
     * Each item has id, name, dropChance properties
     */
    loot: [],
    
    /**
     * @property {Array<Object>} skills - Special abilities the enemy can use
     * Each skill contains id, name, damage, effects, cooldown properties
     */
    skills: [],
    
    /** @property {string} imageUrl - Path to enemy's image asset */
    imageUrl: '',
    
    /**
     * @property {Array<Object>} statusEffects - Status effects affecting the enemy
     * Includes effects like bleed, stun, etc.
     */
    statusEffects: []
  },
  
  /**
   * @property {Array<Object>} log - Combat event log for displaying battle history
   * Each entry contains timestamp, message, and importance level
   */
  log: [],
  
  /**
   * @property {Object} rewards - Rewards granted after successful combat
   * Calculated based on the defeated enemy
   */
  rewards: {
    /** @property {number} experience - Experience points earned */
    experience: 0,
    
    /** @property {number} gold - Gold earned */
    gold: 0,
    
    /**
     * @property {Array<Object>} items - Items obtained from the encounter
     * Each item has id, name, quantity, and rarity properties
     */
    items: []
  },
  
  /**
   * @property {Object} autoCombat - Settings for automated combat
   * Controls AI behavior when auto-combat is enabled
   */
  autoCombat: {
    /** @property {boolean} enabled - Whether auto-combat is currently active */
    enabled: false,
    
    /** @property {boolean} useSkills - Whether AI should use player skills */
    useSkills: false,
    
    /** @property {boolean} useItems - Whether AI should use consumable items */
    useItems: false,
    
    /** @property {boolean} retreatWhenLow - Whether to attempt retreat at low health */
    retreatWhenLow: false,
    
    /**
     * @property {number} healthThreshold - Health percentage at which to retreat
     * Value between 0 and 1, representing percentage of max health
     */
    healthThreshold: 0.2
  }
};

export default combatInitialState;
