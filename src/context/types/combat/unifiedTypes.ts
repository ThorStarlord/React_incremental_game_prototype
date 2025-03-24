/**
 * Unified Combat Types
 * 
 * This file provides a standardized set of types for the combat system
 * to ensure consistency across different components and hooks.
 */

import { SimpleLogEntry } from './logging';
import { CombatActionType, CombatActionResult, CombatStatus } from './basic';
import { StatusEffect, ActiveSkill } from './index';

/**
 * Standardized ExtendedCombatState interface
 * This resolves conflicts between different versions in the combat system
 */
export interface UnifiedCombatState {
  active: boolean;
  playerTurn: boolean;
  round: number;
  status: CombatStatus;
  playerStats: {
    currentHealth: number;
    maxHealth: number;
    currentMana: number;
    maxMana: number;
    [key: string]: any;
  };
  enemyStats?: {
    id: string;
    name: string;
    currentHealth: number;
    maxHealth: number;
    attack: number;
    defense: number;
    level?: number;
    [key: string]: any;
  };
  skills?: ActiveSkill[];
  items?: {
    id: string;
    name: string;
    effect: any;
    quantity: number;
  }[];
  effects?: StatusEffect[];
  log: SimpleLogEntry[];
  turnHistory?: {
    actor: 'player' | 'enemy';
    action: CombatActionType;
    result: CombatActionResult;
    timestamp: number;
  }[];
  rewards?: {
    experience: number;
    gold: number;
    items: any[];
  };
}

/**
 * Convert any combat state object to the unified format
 * This helps overcome type compatibility issues
 */
export function toUnifiedCombatState(state: any): UnifiedCombatState {
  return {
    active: state.active ?? true,
    playerTurn: state.playerTurn ?? true,
    round: state.round ?? 1,
    status: state.status ?? 'IN_PROGRESS',
    playerStats: state.playerStats ?? {
      currentHealth: 100,
      maxHealth: 100,
      currentMana: 50,
      maxMana: 50
    },
    enemyStats: state.enemyStats,
    skills: state.skills ?? [],
    items: state.items ?? [],
    effects: state.effects ?? [],
    log: state.log ?? [],
    turnHistory: state.turnHistory ?? [],
    rewards: state.rewards
  };
}

/**
 * Type guard to check if an object is a valid combat state
 */
export function isValidCombatState(state: any): state is UnifiedCombatState {
  return (
    state &&
    typeof state.active === 'boolean' &&
    typeof state.playerTurn === 'boolean' &&
    Array.isArray(state.log)
  );
}
