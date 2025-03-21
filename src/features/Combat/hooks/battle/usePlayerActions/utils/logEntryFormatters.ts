/**
 * Create a log entry with the correct format
 */
export const createLogEntry = (
  message: string,
  type: string,
  importance: 'normal' | 'high' = 'normal'
) => {
  return {
    timestamp: Date.now(),
    message,
    type,
    importance
  };
};
