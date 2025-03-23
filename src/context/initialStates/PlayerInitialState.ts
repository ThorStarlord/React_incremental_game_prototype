/**
 * @fileoverview Defines the initial state for the player in the incremental RPG game.
 * This serves as the starting point for a new player or when resetting the game.
 */

import { PlayerState, PlayerAttributes, PlayerStats } from '../types/gameStates/PlayerGameStateTypes';

/**
 * Default player attributes for new characters
 */
export const DefaultPlayerAttributes: PlayerAttributes = {
  strength: 5,      // Physical power - affects damage and carrying capacity
  dexterity: 5,     // Agility and reflexes - affects accuracy and dodge
  intelligence: 5,  // Mental acuity - affects magic power and learning
  vitality: 5,      // Physical resilience - affects health and stamina
  wisdom: 5,        // Mental resilience - affects mana and resistance
  charisma: 5,      // Social influence - affects interactions and bargaining
  luck: 5,          // Fortune - affects random events and critical hits
  perception: 5,    // Awareness - affects detection and precision
};

/**
 * Default player stats derived from attributes
 */
export const DefaultPlayerStats: PlayerStats = {
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  healthRegen: 1.0,
  manaRegen: 0.5,
  physicalDamage: 10,
  magicalDamage: 5,
  armor: 0,
  magicResistance: 0,
  critChance: 5,
  critMultiplier: 1.5,
  evasion: 5,
  accuracy: 90,
  speed: 10,
  // Previously optional properties now initialized
  attack: 10,
  defense: 10,
};

/**
 * Player initial state for new game start
 */
export const PlayerInitialState = {
  player: {
    name: "Adventurer",
    attributes: { ...DefaultPlayerAttributes },
    stats: { ...DefaultPlayerStats },
    // Added additional fields to match PlayerState interface
    gold: 0,
    energy: 100,
    maxEnergy: 100,
    inventory: [],
    attributePoints: 0,
    skills: [],
    activeEffects: [],
    // Trait system initialization
    equippedTraits: [],
    permanentTraits: [], 
    traitSlots: 1,       // Start with one trait slot
    acquiredTraits: [],   // Start with no acquired traits
    // Time tracking
    creationDate: new Date().toISOString(),
    lastSaved: new Date().toISOString(),
    totalPlayTime: 0,
  }
};

/**
 * Reset player state to initial values but keep name if specified
 * @param keepName Whether to keep the player's current name
 * @returns A fresh player state
 */
export function resetPlayerState(keepName: boolean = false): PlayerState {
  const newState = structuredClone(PlayerInitialState.player);
  
  // Update timestamps
  newState.creationDate = new Date().toISOString();
  newState.lastSaved = new Date().toISOString();
  
  return newState;
}

export default PlayerInitialState;
