import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { createLogEntry } from './usePlayerActions/utils/logEntryFormatters';

/**
 * Hook for managing combat log entries
 * 
 * @param setCombatState - The state setter function for combat state
 */
export const useCombatLog = (
  setCombatState: Dispatch<SetStateAction<UnifiedCombatState>>
) => {
  /**
   * Add a new entry to the combat log
   */
  const addLogEntry = useCallback(
    (message: string, type: string = 'info', importance: 'normal' | 'high' = 'normal') => {
      setCombatState(prevState => ({
        ...prevState,
        log: [
          ...(prevState.log || []),
          createLogEntry(message, type, importance)
        ]
      }));
    },
    [setCombatState]
  );

  /**
   * Add multiple entries to the combat log
   */
  const addMultipleLogEntries = useCallback(
    (entries: Array<{ message: string; type?: string; importance?: 'normal' | 'high' }>) => {
      setCombatState(prevState => ({
        ...prevState,
        log: [
          ...(prevState.log || []),
          ...entries.map(entry => 
            createLogEntry(
              entry.message,
              entry.type || 'info',
              entry.importance || 'normal'
            )
          )
        ]
      }));
    },
    [setCombatState]
  );

  /**
   * Clear the combat log
   */
  const clearLog = useCallback(() => {
    setCombatState(prevState => ({
      ...prevState,
      log: []
    }));
  }, [setCombatState]);

  return {
    addLogEntry,
    addMultipleLogEntries,
    clearLog
  };
};
