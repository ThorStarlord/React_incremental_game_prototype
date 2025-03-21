import { CombatActionType, CombatActionResult } from '../../../../../../context/types/combat';

/**
 * Create a turn history entry with the correct format
 */
export const createTurnHistoryEntry = (
  actor: 'player' | 'enemy',
  action: CombatActionType,
  result: CombatActionResult
) => {
  return {
    actor, // The parameter is already of type 'player' | 'enemy', so no need for 'as const'
    action,
    result,
    timestamp: Date.now()
  };
};
