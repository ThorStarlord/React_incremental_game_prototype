import { useCallback } from 'react';
import { ExtendedCombatState } from '../../../../context/types/BattleGameStateTypes';

/**
 * Hook for managing combat log entries
 */
export const useCombatLog = (
  setCombatState: React.Dispatch<React.SetStateAction<ExtendedCombatState>>
) => {
  /**
   * Add an entry to the combat log
   * @param message The message to display in the log
   * @param type The type of log entry (damage, heal, etc.)
   * @param importance The importance level of the entry (normal or high)
   */
  const addLogEntry = useCallback((
    message: string, 
    type = 'normal', 
    importance: 'normal' | 'high' = 'normal'
  ) => {
    setCombatState(prev => ({
      ...prev,
      log: [
        ...prev.log,
        {
          timestamp: Date.now(),
          message,
          type,
          importance
        }
      ]
    }));
  }, [setCombatState]);

  return { addLogEntry };
};
