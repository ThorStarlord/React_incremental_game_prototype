import { useCallback } from 'react';
import { 
  StatusEffect, 
  CombatActionType,
  CombatActionResult
} from '../../../../context/types/combat';
import { 
  ExtendedCombatState, 
  BattleResult 
} from '../../../../context/types/gameStates/BattleGameStateTypes';
import { useAttackAction } from './usePlayerActions/actions/useAttackAction';
import { useSkillAction } from './usePlayerActions/actions/useSkillAction';
import { useItemAction } from './usePlayerActions/actions/useItemAction';
import { useDefendAction } from './usePlayerActions/actions/useDefendAction';
import { useFleeAction } from './usePlayerActions/actions/useFleeAction';
import { PlayerActionProps } from './usePlayerActions/types';

/**
 * Composed hook for all player combat actions
 */
export const usePlayerActions = (props: PlayerActionProps) => {
  // Compose individual action hooks
  const { handlePlayerAttack } = useAttackAction(props);
  const { handleUseSkill } = useSkillAction(props);
  const { handleUseItem } = useItemAction(props);
  const { handleDefend } = useDefendAction(props);
  const { handleFlee, handlePlayerTurnEnd } = useFleeAction(props);

  // Return all actions as a unified API
  return {
    handlePlayerAttack,
    handleUseSkill,
    handleUseItem,
    handleDefend,
    handleFlee,
    handlePlayerTurnEnd
  };
};
