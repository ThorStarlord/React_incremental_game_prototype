/**
 * Type definitions for skills system
 */

// Import CombatSkills from the correct location
import { CombatSkills } from '../combat/skills';

/**
 * Magic skills
 */
export interface MagicSkills {
  fireMagic: number;
  iceMagic: number;
  lightningMagic: number;
  restoration: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * Crafting skills
 */
export interface CraftingSkills {
  alchemy: number;
  blacksmithing: number;
  leatherworking: number;
  enchanting: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * Gathering skills
 */
export interface GatheringSkills {
  mining: number;
  herbalism: number;
  woodcutting: number;
  fishing: number;
  [key: string]: number; // Allow for additional skills
}

/**
 * Complete skills state
 */
export interface SkillsState {
  combat: CombatSkills;
  magic: MagicSkills;
  crafting: CraftingSkills;
  gathering: GatheringSkills;
}

