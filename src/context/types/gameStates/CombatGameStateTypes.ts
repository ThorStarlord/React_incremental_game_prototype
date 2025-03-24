/**
 * @file CombatGameStateTypes.ts
 * @description Type definitions specifically related to the combat system
 * 
 * This file serves as a compatibility layer for the modularized combat types.
 * It re-exports all types from the combat directory for backward compatibility.
 * 
 * New code should import directly from the modular structure:
 * import { CombatActor, Enemy } from '../types/combat/actors';
 */

// Re-export everything from the modular structure
export * from '../combat';

/**
 * Props interface for the useCombatLogic hook
 */
export interface UseCombatLogicProps {
  combatState: ExtendedCombatState;
  setCombatState: React.Dispatch<React.SetStateAction<ExtendedCombatState>>;
  player: any;
  dispatch: any;
  calculatedStats: any;
  modifiers: any;
  showTraitEffect: (traitId: string, x: number, y: number) => void;
  onVictory: () => void;
  onDefeat: () => void;
}

// Ensure ExtendedCombatState has a round property
export interface ExtendedCombatState {
  active: boolean;
  playerTurn: boolean;
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
    [key: string]: any;
  };
  round: number; // Add this property
  skills?: any[];
  items?: any[];
  effects?: any[];
  log: SimpleLogEntry[];
  turnHistory?: {
    actor: 'player' | 'enemy';
    action: string;
    result: string;
    timestamp: number;
  }[];
  rewards?: {
    experience: number;
    gold: number;
    items: any[];
  };
}
