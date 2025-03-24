import { SimpleLogEntry } from '../../../../../../context/types/combat/logging';

/**
 * Create a log entry with the correct format
 */
export const createLogEntry = (
  message: string,
  type: string,
  importance: 'normal' | 'high' = 'normal'
): SimpleLogEntry => {
  return {
    timestamp: Date.now(),
    message,
    type,
    importance
  };
};

/**
 * Create a battle log entry
 */
export const createBattleLogEntry = (
  message: string, 
  type: string = 'info', 
  importance: 'normal' | 'high' = 'normal'
): SimpleLogEntry => {
  return createLogEntry(message, type, importance);
};
