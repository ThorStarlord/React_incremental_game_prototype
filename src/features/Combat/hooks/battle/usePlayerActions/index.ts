import { useAttackAction } from './actions/useAttackAction';
import { useSkillAction } from './actions/useSkillAction';
import { useItemAction } from './actions/useItemAction';
import { useDefendAction } from './actions/useDefendAction';
import { useFleeAction } from './actions/useFleeAction';
import { PlayerActionProps } from './types';

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
