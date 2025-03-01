/**
 * @fileoverview Defines the initial state for the player in the incremental RPG game.
 * This serves as the starting point for a new player or when resetting the game.
 */

/**
 * Initial state object for the player
 * @typedef {Object} PlayerState
 * @property {string} name - The player's character name
 * @property {number} level - Current character level
 * @property {number} health - Current health points
 * @property {number} maxHealth - Maximum possible health points
 * @property {number} energy - Current energy/mana points for special abilities
 * @property {number} maxEnergy - Maximum possible energy/mana points
 */

/**
 * The default initial state for a new player character
 * @type {Object}
 */
export const playerInitialState = {
  player: {
    name: "Adventurer", // Default character name
    level: 1,           // Players start at level 1
    health: 100,        // Starting health points
    maxHealth: 100,     // Starting maximum health capacity
    energy: 50,         // Starting energy/mana points
    maxEnergy: 50,      // Starting maximum energy capacity
  },
};


