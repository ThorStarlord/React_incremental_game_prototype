/**
 * Game State Exports - Central hub for game state management
 * Provides unified access to all game state contexts, hooks, actions, and types
 */

// Import from the correct source files
import GameProvider from './GameProvider';
import GameStateContext, { useGameState, useGameStateSelector, EnhancedGameState } from './GameStateContext';
import GameDispatchContext, { useGameDispatch, GameAction } from './GameDispatchContext';
import { ACTION_TYPES } from './types/ActionTypes';
import { 
  GameState, 
  PlayerState, 
  PlayerStats,
  PlayerAttributes,
  ResourceState,
  InventoryState,
  EquipmentState,
  ProgressionState,
  CombatState,
  SettingsState,
  StatisticsState,
  MetaState
} from './types/gameStates/GameStateTypes';
import { PlayerInitialState, resetPlayerState } from './initialStates/PlayerInitialState';
import { ThemeContext, useTheme, ThemeProviderWrapper } from './ThemeContext';

// Import only the enum types that are successfully exported from combat
import { 
  DamageType, 
  ResourceType, 
  EnvironmentType, 
  CombatActionType, 
  CombatActionResult, 
  CombatStatus 
} from './types/combat/basic';

// Export everything explicitly
export { 
  GameStateContext, 
  useGameState,
  useGameStateSelector,
  GameDispatchContext,
  useGameDispatch, 
  GameProvider,
  ThemeContext, 
  useTheme, 
  ThemeProviderWrapper,
  ACTION_TYPES,
  PlayerInitialState,
  resetPlayerState
};

/**
 * Helper function to create consistent actions with proper typing
 * 
 * @param type - The action type identifier, typically from ACTION_TYPES enum
 * @param payload - Optional data to include with the action
 * @returns A properly formatted action object
 */
export const createAction = <T = any>(type: string, payload: T): GameAction => ({
  type,
  payload
});

// Re-export types (originally defined in GameStateTypes.ts)
export type {
  GameState,
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  ResourceState,
  InventoryState,
  EquipmentState,
  ProgressionState,
  CombatState,
  SettingsState,
  StatisticsState,
  MetaState,
  EnhancedGameState,
  GameAction
};

// Define combat types directly here since imports aren't working
/**
 * Base interface for enemy data
 */
export interface EnemyBase {
  id: string;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
  category?: string;
  enemyType?: string;
  imageUrl?: string;
}

/**
 * Interface for drops/loot from enemies
 */
export interface EnemyDrop {
  id: string;
  name: string;
  quantity: number;
  dropChance: number;
  quality?: string;
  type?: string;
  value?: number;
}

/**
 * Interface for enemy abilities/skills
 */
export interface EnemyAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  isAoE?: boolean;
  manaCost?: number;
  level?: number;
  effect?: any;
}

/**
 * Base interface for combat actors
 */
export interface CombatActor {
  id: string;
  name: string;
  type: 'player' | 'enemy' | 'ally';
  currentHealth: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  critChance?: number;
  dodgeChance?: number;
  resistances?: Record<string, number>;
  statusEffects?: any[];
  skills?: any[];
}

/**
 * Interface for player in combat
 */
export interface CombatPlayer extends CombatActor {
  type: 'player';
  mana: number;
  maxMana: number;
  characterClass: string;
  experience: number;
  experienceToNextLevel: number;
  inventory: any[];
  stats: Record<string, number>;
}

/**
 * Interface for enemy in combat
 */
export interface CombatEnemy extends CombatActor {
  type: 'enemy';
  enemyType: string;
  experience: number;
  gold: number;
  lootTable?: any[];
  abilities?: any[];
  immunities?: string[];
  weaknesses?: string[];
  baseHealth?: number;
  baseAttack?: number;
  baseDefense?: number;
  imageUrl?: string;
}

// Re-export basic types from combat/basic.ts
export {
  DamageType,
  ResourceType,
  EnvironmentType,
  CombatActionType,
  CombatActionResult,
  CombatStatus
};
