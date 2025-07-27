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
/**
 * Constants for the Copy System
 */
export const COPY_SYSTEM = {
  /** Growth rate for a Copy's maturity per second. */
  GROWTH_RATE_PER_SECOND: 0.1,
  /** Loyalty decay rate for a Copy per second. */
  DECAY_RATE_PER_SECOND: 0.05,
  /** Essence cost to use the 'Bolster Loyalty' action. */
  BOLSTER_LOYALTY_COST: 25,
  /** Amount of loyalty gained from the 'Bolster Loyalty' action. */
  BOLSTER_LOYALTY_GAIN: 10,
  /** Flat bonus to Essence generation per second from a mature, loyal Copy. */
  ESSENCE_GENERATION_BONUS: 0.2,
};