/**
 * @fileoverview Defines the initial state for the player in the incremental RPG game.
 * This serves as the starting point for a new player or when resetting the game.
 */

import { PlayerState } from '../../context/types/GameStateTypes';

/**
 * Interface for the entire game state related to the player
 */
export interface PlayerStateContainer {
  player: PlayerState;
}

/**
 * The default initial state for a new player character
 */
export const PlayerInitialState: PlayerStateContainer = {
  player: {
    name: "Adventurer", // Default character name
    level: 1,           // Players start at level 1
    experience: 0,
    experienceToNextLevel: 100,
    attributes: {
      strength: 5,
      intelligence: 5,
      dexterity: 5,
      vitality: 5,
      luck: 1
    },
    stats: {
      health: 100,
      maxHealth: 100,
      healthRegen: 1,
      mana: 50,         // Previously "energy"
      maxMana: 50,      // Previously "maxEnergy"
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
