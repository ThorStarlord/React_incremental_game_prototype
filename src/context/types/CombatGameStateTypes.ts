/**
 * @file CombatGameStateTypes.ts
 * @description Type definitions specifically related to the combat system
 * 
 * This file contains all the interfaces and types that define the combat system,
 * including combat state, skills, enemy data, and combat actions.
 */

/**
 * Type definitions for combat-related game state
 */

// Define structured types for skills, abilities, and effects
export interface Skill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  effect: Effect;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  effect: Effect;
}

export interface Effect {
  id: string;
  name: string;
  duration: number;
  strength: number;
  type: 'buff' | 'debuff';
}

// Unified enemy representation
export interface Enemy extends CombatActor {
  lootTable?: LootItem[];
  abilities?: Ability[];
  immunities?: string[];
  weaknesses?: string[];
}

// Structured type for loot items
export interface LootItem {
  id: string;
  name: string;
  quantity: number;
  dropChance: number;
}

// Combat actor with common properties
export interface CombatActor {
  id: string;
  name: string;
  currentHealth: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  skills?: Skill[];
}

// Combat log entry with structured data
export interface CombatLogEntry {
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  result: CombatActionResult;
  data?: CombatLogData;
}

// Structured type for combat log data
export interface CombatLogData {
  damage?: number;
  healing?: number;
  effectApplied?: Effect;
}

// Combat rewards with structured item type
export interface CombatRewards {
  experience: number;
  gold: number;
  items: LootItem[];
}

// Combat state with separate initial state interface
export interface CombatState {
  inCombat: boolean;
  playerTurn?: boolean;
  currentTurn: number;
  combatants: CombatActor[];
  combatLog: CombatLogEntry[];
  rewards?: CombatRewards;
  activeEffects?: ActiveEffects;
}

// Separate interface for initial combat state
export interface CombatInitialState extends CombatState {
  playerTurn: boolean;
}

// Structured type for active effects
export interface ActiveEffects {
  player: Effect[];
  enemy: Effect[];
}

// Combat action result type
export type CombatActionResult = 'hit' | 'miss' | 'critical' | 'block' | 'dodge';

// Combat state container for managing combat state
export interface CombatStateContainer {
  state: CombatState;
  initialState: CombatInitialState;
}
