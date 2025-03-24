// filepath: src/features/Combat/hooks/types/battleTypes.ts
import { ExtendedCombatState } from '../../../context/types/gameStates/BattleGameStateTypes';

/**
 * Battle state extending the base combat state to include round tracking
 */
export interface BattleState extends ExtendedCombatState {
  round: number;
}

/**
 * Alternative name for the same concept, used in effects processing
 */
export interface CombatStateWithRound extends ExtendedCombatState {
  round: number;
}