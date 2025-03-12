/**
 * @file CombatGameStateTypes.ts
 * @description Type definitions specifically related to the combat system
 * 
 * This file contains all the interfaces and types that define the combat system,
 * including combat state, skills, enemy data, and combat actions.
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
 * Enemy data structure
 */
export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  damage: number;
  defense: number;
  experience: number;
  gold: number;
  lootTable?: string[];
  abilities?: string[];
  immunities?: string[];
  weaknesses?: string[];
}

/**
 * Combat action types
 */
export type CombatActionType = 'attack' | 'skill' | 'item' | 'flee';

/**
 * Combat action result data
 */
export interface CombatActionResult {
  success: boolean;
  damage?: number;
  critical?: boolean;
  effectsApplied?: string[];
  message?: string;
}

/**
 * Combat log entry
 */
export interface CombatLogEntry {
  timestamp: number;
  source: 'player' | 'enemy' | 'system';
  message: string;
  type?: 'damage' | 'heal' | 'effect' | 'info' | 'critical';
  data?: any;
}

/**
 * Combat actor base type shared by player and enemies during combat
 */
export interface CombatActor {
  currentHealth: number;
  maxHealth: number;
  currentMana: number;
  maxMana: number;
  attack: number;
  defense: number;
}

/**
 * Extended enemy information for combat
 */
export interface CombatEnemy extends CombatActor {
  name: string;
  level: number;
  imageUrl: string;
  experience: number;
  gold: number;
}

/**
 * Combat rewards structure
 */
export interface CombatRewards {
  experience: number;
  gold: number;
  items: any[]; // Replace with proper item type
}

/**
 * Combat state
 */
export interface CombatState {
  inCombat: boolean;
  currentEnemy: Enemy | null;
  autoAttack: boolean;
  lastCombatResult: 'victory' | 'defeat' | 'escape' | null;
  combatLog: CombatLogEntry[];
  turnCounter?: number;
  playerInitiative?: number;
  enemyInitiative?: number;
  activeEffects?: {
    player: string[];
    enemy: string[];
  };
  
  // Additional properties used in CombatInitialState
  playerTurn?: boolean;
  round?: number;
  player?: CombatActor;
  enemy?: CombatEnemy;
  rewards?: CombatRewards;
}

/**
 * Container for combat state within game state
 */
export interface CombatStateContainer {
  combat: CombatState;
}
