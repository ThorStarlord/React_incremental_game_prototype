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
  /** Multiplier applied to base growth rate when growthType === 'accelerated'.  */
  ACCELERATED_GROWTH_MULTIPLIER: 2,
  /** Loyalty decay rate for a Copy per second. */
  DECAY_RATE_PER_SECOND: 0.05,
  /** Essence cost to use the 'Bolster Loyalty' action. */
  BOLSTER_LOYALTY_COST: 25,
  /** Amount of loyalty gained from the 'Bolster Loyalty' action. */
  BOLSTER_LOYALTY_GAIN: 10,
  /** The upfront Essence cost to choose accelerated growth for a new Copy. */
  ACCELERATED_GROWTH_COST: 50,
  /** Flat bonus to Essence generation per second from a mature, loyal Copy. */
  ESSENCE_GENERATION_BONUS: 0.2,
  /** Maturity threshold (inclusive) at which a Copy is considered fully mature. */
  MATURITY_THRESHOLD: 100,
  /** Loyalty threshold (strictly greater than) required to qualify for essence bonus. */
  LOYALTY_THRESHOLD: 50,
  /** Hard clamps for percentage-like stats. */
  MATURITY_MAX: 100,
  LOYALTY_MAX: 100,
  MATURITY_MIN: 0,
  LOYALTY_MIN: 0,
  /** Essence cost to promote a Copy to accelerated growth (placeholder). */
  PROMOTE_ACCELERATED_COST: 150,
};