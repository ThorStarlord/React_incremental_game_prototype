import { CombatActionType, CombatActionResult } from '../../../../../../context/types/combat/basic';

/**
 * Create a standardized turn history entry
 */
export const createTurnHistoryEntry = (
  actor: 'player' | 'enemy',
  action: CombatActionType,
  result: CombatActionResult
) => {
  return {
    actor,
    action,
    result,
    timestamp: Date.now()
  };
};
