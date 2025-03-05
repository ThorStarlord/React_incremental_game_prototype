import { GameState, PlayerState, PlayerStats } from '../context/initialState';

/**
 * This module adds combat-related type extensions to our base game state types
 * by properly augmenting the original interfaces without modifying existing properties.
 */
declare module '../context/initialState' {
  /**
   * Extends the existing PlayerStats interface to include combat-related stats
   * without redefining any existing properties
   */
  interface PlayerStats {
    // ONLY add new properties that don't exist in the original interface
    attack?: number;
    defense?: number;
    // DO NOT redefine health, maxHealth, mana, or maxMana here
    // as they already exist in the original interface with required modifiers
  }

  /**
   * Extends PlayerState to include additional properties
   * without redefining any existing properties
   */
  interface PlayerState {
    // ONLY add new properties that don't exist in the original interface
    gold?: number;
    traitSlots?: number;
    acquiredTraits?: string[];
    // DO NOT redefine experience or stats here
    // as they already exist in the original interface with required modifiers
  }

  /**
   * Extends GameState to include traits and other game subsystems
   */
  interface GameState {
    traits?: {
      copyableTraits: {
        [key: string]: {
          id: string;
          name: string;
          effects?: {
            attackBonus?: number;
            defenseBonus?: number;
            dodgeChance?: number;
            criticalChance?: number;
            criticalDamage?: number;
            essenceSiphonChance?: number;
            xpMultiplier?: number;
            goldMultiplier?: number;
            [key: string]: number | undefined;
          };
          [key: string]: any;
        };
      };
    };
    essence?: number;
  }
}

// Export an empty object to make this a module
export {};
