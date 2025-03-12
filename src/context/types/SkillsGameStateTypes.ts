/**
 * Type definitions for skill-related game state
 */

/**
 * Combat skills and levels
 */

export interface CombatSkills {
    swordplay: number;
    archery: number;
    defense: number;
    dualWielding: number;
    [key: string]: number; // Allow for additional skills
  }

/**
 * Magic skills and levels
 */
export interface MagicSkills {
  fireMagic: number;
  iceMagic: number;
  lightningMagic: number;
  restoration: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * Crafting skills and levels
 */
export interface CraftingSkills {
  alchemy: number;
  blacksmithing: number;
  leatherworking: number;
  enchanting: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * Gathering skills and levels
 */
export interface GatheringSkills {
  mining: number;
  herbalism: number;
  woodcutting: number;
  fishing: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * All player skills categorized by type
 */
export interface SkillsState {
  combat: CombatSkills;
  magic: MagicSkills;
  crafting: CraftingSkills;
  gathering: GatheringSkills;
}

