/**
 * @fileoverview Defines the initial state for the player in the incremental RPG game.
 * This serves as the starting point for a new player or when resetting the game.
 */

import { PlayerState, PlayerAttributes } from '../types/GameStateTypes';

/**
 * Interface for the entire game state related to the player
 */
export interface PlayerStateContainer {
  player: PlayerState;
}

/**
 * Default set of player attributes for new characters
 */
export const DefaultPlayerAttributes: PlayerAttributes = {
  strength: 5,      // Basic physical power
  intelligence: 5,  // Magical aptitude
  dexterity: 5,     // Hand-eye coordination
  vitality: 5,      // Life force
  luck: 1,          // Fortune and chance
  constitution: 5,  // Physical toughness
  wisdom: 3,        // Mental fortitude
  charisma: 3,      // Social influence
  perception: 3,    // Awareness of surroundings
  agility: 3,       // Speed and reflexes
  endurance: 4      // Stamina and persistence
};

/**
 * The default initial state for a new player character
 */
export const PlayerInitialState: PlayerStateContainer = {
  player: {
    name: "Adventurer", // Default character name
    level: 1,           // Players start at level 1
    experience: 0,
    experienceToNextLevel: 100,
    attributes: DefaultPlayerAttributes,
    stats: {
      health: 100,
      maxHealth: 100,
      healthRegen: 1,
      mana: 50,         // Consistent naming
      maxMana: 50,      // Consistent naming
      manaRegen: 0.5,
      physicalDamage: 5,
      magicalDamage: 2,
      critChance: 5,
      critMultiplier: 1.5
    },
    totalPlayTime: 0,
    creationDate: null,
    traitSlots: 3,      // Default starting trait slots
    acquiredTraits: []  // Start with no acquired traits
  },
};

/**
 * Reset player to initial state but keep the creation date
 * @param creationDate - Optional ISO date string to preserve
 * @returns A fresh copy of the initial player state
 */
export const resetPlayerState = (creationDate: string | null = null): PlayerState => {
  const freshState = JSON.parse(JSON.stringify(PlayerInitialState.player)) as PlayerState;
  freshState.creationDate = creationDate || new Date().toISOString();
  return freshState;
};
