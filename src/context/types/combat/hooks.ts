/**
 * React hooks interfaces for combat
 */

import { Dispatch, SetStateAction } from 'react';
import { SimpleLogEntry } from './logging';
import { StatusEffect } from './effects';
import { ActiveSkill } from './skills';

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
  log: SimpleLogEntry[];
  rewards?: {
    experience: number;
    gold: number;
    items: any[];
  };
}

/**
 * Extended combat state with additional properties needed for battle hooks
 */
export interface ExtendedCombatState extends HookCombatState {
  enemyId?: string;
  skills?: ActiveSkill[];
  items?: {
    id: string;
    name: string;
    effect: any;
    quantity: number;
  }[];
  effects?: StatusEffect[];
  turnHistory?: {
    actor: 'player' | 'enemy';
    action: any;
    result: any;
    timestamp: number;
  }[];
}

/**
 * Props for combat logic hook
 */
export interface UseCombatLogicProps {
  combatState: ExtendedCombatState;
  setCombatState: Dispatch<SetStateAction<ExtendedCombatState>>;
  player: any;
  dispatch: any;
  calculatedStats: any;
  modifiers: any;
  showTraitEffect: (traitId: string, x: number, y: number) => void;
  onVictory: () => void;
  onDefeat: () => void;
}
