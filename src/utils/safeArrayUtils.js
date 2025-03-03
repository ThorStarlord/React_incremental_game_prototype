/**
 * Utility functions for safely working with arrays that might be undefined or null
 */

/**
 * Safely access array length, returns 0 if array is undefined or null
 * @param {Array|null|undefined} arr - The array to check
 * @returns {number} The length of the array or 0 if not an array
 */
export const safeArrayLength = (arr) => {
  return Array.isArray(arr) ? arr.length : 0;
};

/**
 * Safely filter an array, returns empty array if input is undefined or null
 * @param {Array|null|undefined} arr - The array to filter
 * @param {Function} predicate - The filter function
 * @returns {Array} Filtered array or empty array if input is not an array
 */
export const safeArrayFilter = (arr, predicate) => {
  return Array.isArray(arr) ? arr.filter(predicate) : [];
};

/**
 * Safely map over an array, returns empty array if input is undefined or null
 * @param {Array|null|undefined} arr - The array to map over
 * @param {Function} mapper - The mapping function
 * @returns {Array} Mapped array or empty array if input is not an array
 */
export const safeArrayMap = (arr, mapper) => {
  return Array.isArray(arr) ? arr.map(mapper) : [];
};

/**
 * Safely find an item in an array, returns undefined if array is undefined or null
 * @param {Array|null|undefined} arr - The array to search
 * @param {Function} predicate - The find predicate function
 * @returns {*|undefined} Found item or undefined
 */
export const safeArrayFind = (arr, predicate) => {
  return Array.isArray(arr) ? arr.find(predicate) : undefined;
};

/**
 * Check if an array includes a value, safely handling undefined/null arrays
 * @param {Array|null|undefined} arr - The array to check
 * @param {*} value - The value to find
 * @returns {boolean} True if array includes the value, false otherwise
 */
export const safeArrayIncludes = (arr, value) => {
  return Array.isArray(arr) ? arr.includes(value) : false;
};

/**
 * Ensure array is actually an array, converting undefined/null to empty array
 * @param {Array|null|undefined} arr - The input to ensure as array
 * @returns {Array} Original array or new empty array
 */
export const ensureArray = (arr) => {
  return Array.isArray(arr) ? arr : [];
};

/**
 * Safely slice an array, returns empty array if input is undefined or null
 * @param {Array|null|undefined} arr - The array to slice
 * @param {number} start - Start index
 * @param {number} [end] - End index
 * @returns {Array} Sliced array or empty array if input is not an array
 */
export const safeArraySlice = (arr, start, end) => {
  return Array.isArray(arr) ? arr.slice(start, end) : [];
};
