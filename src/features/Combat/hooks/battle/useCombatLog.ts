import { useCallback } from 'react';
import { SimpleLogEntry } from '../../../../context/types/combat/logging';
import { createLogEntry } from './usePlayerActions/utils/logEntryFormatters';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { Dispatch, SetStateAction } from 'react';

/**
 * Hook for managing combat log entries
 */
export const useCombatLog = (
  setCombatState: Dispatch<SetStateAction<UnifiedCombatState>>
) => {
  /**
   * Add a log entry to the combat log
   */
  const addLogEntry = useCallback((
    message: string, 
    type: string = 'info', 
    importance: 'normal' | 'high' = 'normal'
  ) => {
    setCombatState(prev => {
      // Create a properly typed log entry
      const newEntry: SimpleLogEntry = createLogEntry(message, type, importance);
      
      return {
        ...prev,
        log: [...prev.log, newEntry]
      };
    });
  }, [setCombatState]);

  return { addLogEntry };
};
