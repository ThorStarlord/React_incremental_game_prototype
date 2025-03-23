import { Dispatch, SetStateAction } from 'react';
import { 
  ExtendedCombatState, 
  BattleResult 
} from '../../../../../context/types/gameStates/BattleGameStateTypes';

/**
 * Props shared across all player action hooks
 */
export interface PlayerActionProps {
  combatState: ExtendedCombatState;
  setCombatState: Dispatch<SetStateAction<ExtendedCombatState>>;
  calculatedStats: any;
  onComplete: (result: BattleResult) => void;
  onVictory: () => void;
  processEndOfTurnEffects: () => void;
  addLogEntry: (message: string, type: string, importance?: 'normal' | 'high') => void;
}
