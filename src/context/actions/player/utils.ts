/**
 * Shared utility functions for player actions
 */

// Validation functions
export const validateNonNegative = (value: number, name: string): void => {
  if (value < 0) {
    console.warn(`Warning: ${name} should not be negative. Got ${value}`);
  }
};

export const validatePositive = (value: number, name: string): void => {
  if (value <= 0) {
    console.warn(`Warning: ${name} should be positive. Got ${value}`);
  }
};

export const validateString = (value: string | undefined, name: string): void => {
  if (!value || value.trim() === '') {
    console.warn(`Warning: ${name} should be a non-empty string.`);
  }
};

// Generic action creator factory
export function createActionWithTimestamp<T, P extends { timestamp?: number }>(
  type: T, 
  payloadFn: (args: any[]) => Omit<P, 'timestamp'>
): (...args: any[]) => { type: T, payload: P } {
  return (...args: any[]) => ({
    type,
    payload: {
      ...payloadFn(args),
      timestamp: Date.now()
    } as P
  });
}

// Bundle validation functions for export
export const playerActionValidation = {
  validateNonNegative,
  validatePositive,
  validateString
};
