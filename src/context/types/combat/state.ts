/**
 * Combat state management
 */

import { EnvironmentType, CombatStatus } from './basic';
import { CombatActor, Enemy } from './actors';
import { StatusEffect, CombatEffect } from './effects';
import { CombatLogEntry } from './logging';
import { CombatRewards } from './rewards';

/**
 * Combat state object
 */
export interface CombatState {
  active: boolean;           // Whether combat is active (for UI compatibility)
  inCombat: boolean;         // Whether combat is active
  playerTurn: boolean;       // Whether it's the player's turn
  round: number;             // Current combat round
  combatants: CombatActor[]; // All actors in combat
  combatLog: CombatLogEntry[]; // History of combat actions
  rewards?: CombatRewards;   // Rewards for victory
  activeEffects: Record<'player' | 'enemy', StatusEffect[]>; // Active effects
  lastUpdated: number;       // Timestamp of last update
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  environment: EnvironmentType; // Combat location
  isAutoMode: boolean;       // Whether auto-combat is enabled
  
  // Legacy support properties
  status: CombatStatus;      // Combat status
  activeEnemy: Enemy | null; // Currently active enemy
  playerEffects: CombatEffect[]; // Player-specific effects
  enemyEffects: CombatEffect[]; // Enemy-specific effects
  turnQueue: CombatActor[];  // Turn order queue
  log: CombatLogEntry[];     // Simplified log for backward compatibility
}

/**
 * Combat state container interface
 */
export interface CombatStateContainer {
  player: CombatActor;
  enemies: Enemy[];
  environment: EnvironmentType;
  rewards: CombatRewards;
  state: CombatState;
}
