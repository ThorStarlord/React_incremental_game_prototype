/**
 * @fileoverview Defines the initial state for the player in the incremental RPG game.
 * This serves as the starting point for a new player or when resetting the game.
 */

/**
 * Interface defining the structure of the player state
 * Contains all properties that track the player's progress and attributes
 */
export interface PlayerState {
  name: string;            // The player's character name
  level: number;           // Current character level
  health: number;          // Current health points
  maxHealth: number;       // Maximum possible health points
  energy: number;          // Current energy/mana points for special abilities
  maxEnergy: number;       // Maximum possible energy/mana points
  totalEssenceEarned: number; // Total essence earned throughout the game
  traitSlots: number;      // Number of trait slots currently unlocked
}

/**
 * Interface for the entire game state related to the player
 */
export interface PlayerStateContainer {
  player: PlayerState;
}

/**
 * The default initial state for a new player character
 */
export const playerInitialState: PlayerStateContainer = {
  player: {
    name: "Adventurer", // Default character name
    level: 1,           // Players start at level 1
    health: 100,        // Starting health points
    maxHealth: 100,     // Starting maximum health capacity
    energy: 50,         // Starting energy/mana points
    maxEnergy: 50,      // Starting maximum energy capacity
    totalEssenceEarned: 0, // Initial essence earned
    traitSlots: 3,      // Default starting trait slots
  },
};
