import { ExtendedCombatState } from './CombatGameStateTypes';
import { SimpleLogEntry } from '../combat/logging';

/**
 * Extended combat state with round counter
 */
export interface CombatStateWithRound extends ExtendedCombatState {
  round: number;
  log: SimpleLogEntry[];
}

/**
 * Type guard to check if a combat state includes round information
 */
export function hasCombatRound(state: any): state is CombatStateWithRound {
  return state && typeof state.round === 'number';
}
