/**
 * Utilities for game state management
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
