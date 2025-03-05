/**
 * Utility functions for safely working with arrays that might be undefined or null
 */

/**
 * Safely access array length, returns 0 if array is undefined or null
 * @param {Array<T>|null|undefined} arr - The array to check
 * @returns {number} The length of the array or 0 if not an array
 */
export const safeArrayLength = <T>(arr: T[] | null | undefined): number => {
  return Array.isArray(arr) ? arr.length : 0;
};

/**
 * Safely filter an array, returns empty array if input is undefined or null
 * @param {Array<T>|null|undefined} arr - The array to filter
 * @param {(item: T, index: number, array: T[]) => boolean} predicate - The filter function
 * @returns {Array<T>} Filtered array or empty array if input is not an array
 */
export const safeArrayFilter = <T>(
  arr: T[] | null | undefined, 
  predicate: (item: T, index: number, array: T[]) => boolean
): T[] => {
  return Array.isArray(arr) ? arr.filter(predicate) : [];
};

/**
 * Safely map over an array, returns empty array if input is undefined or null
 * @param {Array<T>|null|undefined} arr - The array to map over
 * @param {(item: T, index: number, array: T[]) => U} mapper - The mapping function
 * @returns {Array<U>} Mapped array or empty array if input is not an array
 */
export const safeArrayMap = <T, U>(
  arr: T[] | null | undefined, 
  mapper: (item: T, index: number, array: T[]) => U
): U[] => {
  return Array.isArray(arr) ? arr.map(mapper) : [];
};

/**
 * Safely find an item in an array, returns undefined if array is undefined or null
 * @param {Array<T>|null|undefined} arr - The array to search
 * @param {(item: T, index: number, array: T[]) => boolean} predicate - The find predicate function
 * @returns {T|undefined} Found item or undefined
 */
export const safeArrayFind = <T>(
  arr: T[] | null | undefined, 
  predicate: (item: T, index: number, array: T[]) => boolean
): T | undefined => {
  return Array.isArray(arr) ? arr.find(predicate) : undefined;
};

/**
 * Check if an array includes a value, safely handling undefined/null arrays
 * @param {Array<T>|null|undefined} arr - The array to check
 * @param {T} value - The value to find
 * @returns {boolean} True if array includes the value, false otherwise
 */
export const safeArrayIncludes = <T>(arr: T[] | null | undefined, value: T): boolean => {
  return Array.isArray(arr) ? arr.includes(value) : false;
};

/**
 * Ensure array is actually an array, converting undefined/null to empty array
 * @param {Array<T>|null|undefined} arr - The input to ensure as array
 * @returns {Array<T>} Original array or new empty array
 */
export const ensureArray = <T>(arr: T[] | null | undefined): T[] => {
  return Array.isArray(arr) ? arr : [];
};

/**
 * Safely slice an array, returns empty array if input is undefined or null
 * @param {Array<T>|null|undefined} arr - The array to slice
 * @param {number} start - Start index
 * @param {number} [end] - End index
 * @returns {Array<T>} Sliced array or empty array if input is not an array
 */
export const safeArraySlice = <T>(
  arr: T[] | null | undefined, 
  start: number, 
  end?: number
): T[] => {
  return Array.isArray(arr) ? arr.slice(start, end) : [];
};
