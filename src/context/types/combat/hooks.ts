/**
 * React hooks interfaces for combat
 */

import { Dispatch, SetStateAction } from 'react';
import { SimpleLogEntry } from './logging';
import { StatusEffect } from './effects';
import { ActiveSkill } from './skills';
import { CombatLogEntry } from './logging';
import { CombatRewards } from './rewards';
import { CombatActionType, CombatActionResult, CombatStatus } from './basic';
import { CombatState } from './state';

/**
 * Interface for basic combat state in hooks
 */
export interface HookCombatState {
  active: boolean;
  playerTurn: boolean;
  round: number;
  playerStats: {
    currentHealth: number;
    maxHealth: number;
    currentMana: number;
    maxMana: number;
  };
  enemyStats?: {
    id?: string;
    name?: string;
    currentHealth: number;
    maxHealth: number;
    attack?: number;
    defense?: number;
    level?: number;
  };
  log: SimpleLogEntry[] | CombatLogEntry[];
  rewards?: CombatRewards;
}

/**
 * Extended combat state used in battle system
 */
export interface ExtendedCombatState {
  active: boolean;
  playerTurn: boolean;
  round: number;
  playerStats: {
    currentHealth: number;
    maxHealth: number;
    currentMana: number;
    maxMana: number;
  };
  enemyStats?: {
    currentHealth: number;
    maxHealth: number;
    [key: string]: any;
  };
  // Fix the log typing to be explicitly SimpleLogEntry[]
  log: SimpleLogEntry[];
  turnHistory?: Array<{
    actor: 'player' | 'enemy';
    action: any;
    result: any;
    timestamp: number;
  }>;
  rewards?: {
    experience: number;
    gold: number;
    items: any[];
  };
  status: CombatStatus;
  effects?: Array<StatusEffect>;
  skills?: Array<any>;
  items?: Array<any>;
  [key: string]: any;
}

/**
 * Props for combat logic hook - simplified now that we have better types
 */
export interface UseCombatLogicProps {
  combatState: CombatState;
  setCombatState: Dispatch<SetStateAction<CombatState>>;
  player: Record<string, any>; // Consider using a more specific type
  dispatch: Dispatch<any>; // Consider using a more specific action type
  calculatedStats: Record<string, number>;
  showTraitEffect: (traitId: string, x: number, y: number) => void;
  onVictory: () => void;
  onDefeat: () => void;
}
