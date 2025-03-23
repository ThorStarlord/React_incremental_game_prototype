/**
 * Player Action Utilities
 * =======================
 * 
 * Shared utility functions for creating and validating player actions
 */

/**
 * Validation functions for action payloads
 */

/**
 * Validates that a number is not negative
 * 
 * @param value - Number to validate
 * @param name - Name of the field (for error messages)
 * @throws Warning if validation fails
 */
export const validateNonNegative = (value: number, name: string): void => {
  if (value < 0) {
    console.warn(`Warning: ${name} should not be negative. Got ${value}`);
  }
};

/**
 * Validates that a number is positive (greater than zero)
 * 
 * @param value - Number to validate
 * @param name - Name of the field (for error messages)
 * @throws Warning if validation fails
 */
export const validatePositive = (value: number, name: string): void => {
  if (value <= 0) {
    console.warn(`Warning: ${name} should be positive. Got ${value}`);
  }
};

/**
 * Validates that a string is non-empty
 * 
 * @param value - String to validate
 * @param name - Name of the field (for error messages)
 * @throws Warning if validation fails
 */
export const validateString = (value: string | undefined, name: string): void => {
  if (!value || value.trim() === '') {
    console.warn(`Warning: ${name} should be a non-empty string.`);
  }
};

/**
 * Validates an ID string format
 * 
 * @param id - ID to validate
 * @param name - Name of the ID field (for error messages)
 * @throws Warning if validation fails
 */
export const validateId = (id: string | undefined, name: string): void => {
  if (!id) {
    console.warn(`Warning: ${name} is required.`);
    return;
  }
  
  if (typeof id !== 'string') {
    console.warn(`Warning: ${name} should be a string.`);
    return;
  }
  
  if (id.trim() === '') {
    console.warn(`Warning: ${name} should not be empty.`);
  }
};

/**
 * Safely gets or generates a timestamp
 * 
 * @param timestamp - Optional existing timestamp
 * @returns Current timestamp if none provided
 */
export const getTimestamp = (timestamp?: number): number => {
  return timestamp ?? Date.now();
};

// Bundle validation functions for export
export const playerActionValidation = {
  validateNonNegative,
  validatePositive,
  validateString,
  validateId,
  getTimestamp
};
