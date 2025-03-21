/**
 * @file Initial state for player skills
 * 
 * This file defines the initial skills available to the player and their starting levels.
 * Skills affect gameplay mechanics like combat effectiveness, crafting capabilities,
 * and resource collection efficiency.
 */

// Skill level constants for better code readability
export const SKILL_LEVELS = {
  /** Skill is locked/unavailable */
  LOCKED: 0,
  /** Skill is available at beginner level */
  BEGINNER: 1,
  /** Skill is at intermediate level */
  INTERMEDIATE: 2,
  /** Skill is at advanced level */
  ADVANCED: 3,
  /** Skill is at master level */
  MASTER: 5
};

/**
 * Interface for the skills state structure
 */
export interface SkillsState {
  /** Combat skills used in battle calculations */
  combat: {
    swordplay: number;
    archery: number;
    defense: number;
    dualWielding: number;
  };
  /** Magic skills for spellcasting and enchantment */
  magic: {
    fireMagic: number;
    iceMagic: number;
    lightningMagic: number;
    restoration: number;
  };
  /** Crafting skills for item creation */
  crafting: {
    alchemy: number;
    blacksmithing: number;
    leatherworking: number;
    enchanting: number;
  };
  /** Resource gathering skills */
  gathering: {
    mining: number;
    herbalism: number;
    woodcutting: number;
    fishing: number;
  };
}

/**
 * Initial skills state with starting values
 * 
 * The player begins with basic proficiency in some fundamental skills
 * (swordplay, defense, restoration, herbalism, woodcutting) while
 * other skills start locked and must be learned through gameplay.
 */
const skillsInitialState: SkillsState = {
  combat: {
    swordplay: SKILL_LEVELS.BEGINNER,    // Basic weapon training
    archery: SKILL_LEVELS.LOCKED,        // Must be learned
    defense: SKILL_LEVELS.BEGINNER,      // Basic defensive techniques
    dualWielding: SKILL_LEVELS.LOCKED    // Advanced technique, must be learned
  },
  magic: {
    fireMagic: SKILL_LEVELS.LOCKED,      // Elemental magic must be learned
    iceMagic: SKILL_LEVELS.LOCKED,       // Elemental magic must be learned
    lightningMagic: SKILL_LEVELS.LOCKED, // Elemental magic must be learned
    restoration: SKILL_LEVELS.BEGINNER   // Basic healing abilities
  },
  crafting: {
    alchemy: SKILL_LEVELS.LOCKED,        // Must be learned
    blacksmithing: SKILL_LEVELS.LOCKED,  // Must be learned
    leatherworking: SKILL_LEVELS.LOCKED, // Must be learned
    enchanting: SKILL_LEVELS.LOCKED      // Advanced skill, must be learned
  },
  gathering: {
    mining: SKILL_LEVELS.LOCKED,         // Must be learned
    herbalism: SKILL_LEVELS.BEGINNER,    // Basic plant identification
    woodcutting: SKILL_LEVELS.BEGINNER,  // Basic resource gathering
    fishing: SKILL_LEVELS.LOCKED         // Must be learned
  }
};

export default skillsInitialState;
