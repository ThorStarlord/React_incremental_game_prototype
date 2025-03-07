/**
 * @file EssenceInitialState.ts
 * @description Defines the initial state for the Essence feature in the game.
 * Essence is a core resource that players collect and use for progression.
 */

/**
 * Interface for a generator in the essence system
 */
interface EssenceGenerator {
  level: number;
  baseCost: number;
  costMultiplier: number;
  baseProduction: number;
  owned: number;
  unlocked: boolean;
  name: string;
  description: string;
}

/**
 * Interface for an upgrade in the essence system
 */
interface EssenceUpgrade {
  level: number;
  baseCost: number;
  costMultiplier: number;
  effect: number;
  maxLevel: number;
  unlocked: boolean;
  name: string;
  description: string;
}

/**
 * Interface for the essence system mechanics
 */
interface EssenceMechanics {
  autoCollectUnlocked: boolean;
  resonanceUnlocked: boolean;
}

/**
 * Interface for the complete essence state
 */
export interface EssenceState {
  amount: number;
  totalCollected: number;
  perSecond: number;
  perClick: number;
  multiplier: number;
  unlocked: boolean;
  generators: {
    basic: EssenceGenerator;
    advanced: EssenceGenerator;
    [key: string]: EssenceGenerator;
  };
  upgrades: {
    clickPower: EssenceUpgrade;
    autoGeneration: EssenceUpgrade;
    [key: string]: EssenceUpgrade;
  };
  mechanics: EssenceMechanics;
}

/**
 * Initial state structure for the Essence feature
 */
const EssenceInitialState: EssenceState = {
  // Core essence values
  amount: 0,
  totalCollected: 0,
  
  // Generation rates
  perSecond: 0,
  perClick: 1,
  multiplier: 1,
  
  // Unlock status - essence starts available to the player
  unlocked: true,
  
  // Automatic generators
  generators: {
    basic: {
      level: 0,
      baseCost: 10,
      costMultiplier: 1.15,
      baseProduction: 0.1,
      owned: 0,
      unlocked: true,
      name: "Minor Essence Crystal",
      description: "A small crystal that slowly generates essence over time."
    },
    advanced: {
      level: 0,
      baseCost: 100,
      costMultiplier: 1.2,
      baseProduction: 1,
      owned: 0,
      unlocked: false,
      name: "Greater Essence Crystal",
      description: "A refined crystal with improved essence generation capabilities."
    }
  },
  
  // Upgrades
  upgrades: {
    clickPower: {
      level: 0,
      baseCost: 25,
      costMultiplier: 2,
      effect: 1,
      maxLevel: 10,
      unlocked: true,
      name: "Enhanced Focus",
      description: "Increases essence gained from manual collection."
    },
    autoGeneration: {
      level: 0,
      baseCost: 50,
      costMultiplier: 2.5,
      effect: 0.2,
      maxLevel: 5,
      unlocked: false,
      name: "Essence Attunement",
      description: "Passively increases essence generation from all sources."
    }
  },
  
  // Game mechanics flags
  mechanics: {
    autoCollectUnlocked: false,
    resonanceUnlocked: false
  }
};

export default EssenceInitialState;
