/**
 * @file PlayerGameStateTypes.ts
 * @description Type definitions specifically related to the player character
 * 
 * This file contains all the interfaces and types that define the player's
 * attributes, stats, state, skills, effects, and traits. These types are used
 * across the player-related features of the game.
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
  constitution: number;  // Affects total health and physical resistance
  wisdom: number;        // Affects mana regeneration and spell effectiveness
  charisma: number;      // Affects NPC interactions and prices
  perception: number;    // Affects ability to find hidden objects and traps
  agility: number;       // Affects movement speed and evasion
  endurance: number;     // Affects stamina and resistance to fatigue
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
  
  // Extended combat stats
  attack?: number;
  defense?: number;
}

/**
 * Simplified inventory item for player inventory
 */
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  quality?: string;
  acquired?: {
    timestamp: number;
    source: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Skill definition for player skills
 */
export interface Skill {
  id: string;
  level: number;
  experience: number;
  [key: string]: any;
}

/**
 * Status Effect applied to the player
 */
export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  strength?: number;
  [key: string]: any;
}

/**
 * Traits system effects
 */
export interface TraitEffect {
  attackBonus?: number;
  defenseBonus?: number;
  dodgeChance?: number;
  criticalChance?: number;
  criticalDamage?: number;
  essenceSiphonChance?: number;
  xpMultiplier?: number;
  goldMultiplier?: number;
  [key: string]: number | undefined;
}

/**
 * Player trait definition
 */
export interface Trait {
  id: string;
  name: string;
  effects?: TraitEffect;
  [key: string]: any;
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
  
  // Extended trait system
  equippedTraits?: string[];    // Array of equipped trait IDs
  permanentTraits?: string[];   // Array of permanent trait IDs
  acquiredTraits?: string[];    // Array of all acquired trait IDs
  traitSlots?: number;          // Number of available trait slots
  
  // Optional - for backward compatibility
  gold?: number;
  energy?: number;
  maxEnergy?: number;
  inventory?: InventoryItem[];
  equippedItems?: Record<string, string>;
  attributePoints?: number;
  skills?: Skill[];
  activeEffects?: StatusEffect[];
}

/**
 * Container for the player state within the game state
 */
export interface PlayerStateContainer {
  player: PlayerState;
}
