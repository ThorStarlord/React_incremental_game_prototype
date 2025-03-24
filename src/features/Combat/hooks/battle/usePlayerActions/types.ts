import { BattleResult } from '../../../../../context/types/gameStates/BattleGameStateTypes';
import { UnifiedCombatState } from '../../../../../context/types/combat/unifiedTypes';
import { Dispatch, SetStateAction } from 'react';

/**
 * Properties for player actions hook
 */
export interface PlayerActionProps {
  combatState: UnifiedCombatState;
  setCombatState: Dispatch<SetStateAction<UnifiedCombatState>>;
  calculatedStats: any;
  onComplete: (result: BattleResult) => void;
  onVictory?: () => void;
  onDefeat?: () => void;
  processEndOfTurnEffects: () => void;
  addLogEntry: (message: string, type: string, importance?: 'normal' | 'high') => void;
}
