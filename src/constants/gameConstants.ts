/**
 * @file gameConstants.ts
 * @description Centralized constants for game mechanics.
 */

/**
 * The amount of Essence required to make a trait permanent.
 * This is now the cost for the "Resonance" mechanic.
 */
export const TRAIT_PERMANENT_ESSENCE_COST = 250;

/**
 * Constants for Essence Generation
 */
export const ESSENCE_GENERATION = {
  /** The base rate of essence generation per second, even with no connections. */
  BASE_RATE_PER_SECOND: 0.1,
  
  /** 
   * A global multiplier to scale the contribution from all NPC connections.
   * This is the primary balancing knob for NPC-based generation.
   */
  NPC_CONTRIBUTION_MULTIPLIER: 0.5,
};