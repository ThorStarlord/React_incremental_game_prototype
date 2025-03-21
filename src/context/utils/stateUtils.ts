/**
 * Utility functions for game state management
 * 
 * These functions help manage, validate, and manipulate game state
 * in a safe and consistent way.
 */

/**
 * Creates a deep immutable copy of an object
 * @param {T} state - The state object to freeze
 * @returns {Readonly<T>} Immutable version of the state
 */
export function createImmutableState<T>(state: T): Readonly<T> {
  return Object.freeze(structuredClone(state));
}

/**
 * Creates a deep clone of an object using structuredClone
 * Abstracted to allow for potential future changes in implementation
 * 
 * @param {T} obj - Object to clone
 * @returns {T} Deep copy of the object
 */
export function deepClone<T>(obj: T): T {
  return structuredClone(obj);
}

/**
 * Creates a new state by merging multiple state parts
 * @param {Record<string, any>[]} stateParts - State parts to merge
 * @returns {Record<string, any>} Combined state
 */
export function mergeStateParts(...stateParts: Record<string, any>[]): Record<string, any> {
  return stateParts.reduce((merged, part) => {
    return { ...merged, ...part };
  }, {});
}

/**
 * Validates that a state object matches a required schema
 * @param {Record<string, any>} state - State object to validate
 * @param {string[]} requiredKeys - Required keys that must be present
 * @returns {boolean} True if valid, throws an error if invalid
 */
export function validateStateStructure(
  state: Record<string, any>,
  requiredKeys: string[]
): boolean {
  const missingKeys = requiredKeys.filter(key => !(key in state));
  
  if (missingKeys.length > 0) {
    throw new Error(`Invalid state structure. Missing keys: ${missingKeys.join(', ')}`);
  }
  
  return true;
}

/**
 * Validates that an initial state module exists and is not empty
 * 
 * @param initialState The initial state module to validate
 * @param name The name of the module for error reporting
 * @throws Error if the state is missing or invalid
 */
export function validateInitialState(initialState: any, name: string): void {
  if (!initialState) {
    throw new Error(`Initial state for ${name} is missing`);
  }
  
  if (typeof initialState !== 'object' || Array.isArray(initialState)) {
    throw new Error(`Initial state for ${name} must be an object`);
  }
  
  if (Object.keys(initialState).length === 0) {
    throw new Error(`Initial state for ${name} is empty`);
  }
}
