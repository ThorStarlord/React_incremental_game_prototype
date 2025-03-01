/**
 * State Management Utility Functions
 * 
 * This file contains utility functions for managing application state,
 * including persistence to localStorage, state manipulation, and state history.
 */

/**
 * Retrieves state from localStorage by key
 * 
 * @param {string} key - The localStorage key to retrieve state from
 * @returns {Object|null} The parsed state object or null if not found
 */
export const getStateFromLocalStorage = (key) => {
    try {
        const storedState = localStorage.getItem(key);
        return storedState ? JSON.parse(storedState) : null;
    } catch (error) {
        console.error(`Error retrieving state from localStorage: ${error}`);
        return null;
    }
};

/**
 * Saves state to localStorage by key
 * 
 * @param {string} key - The localStorage key to save state to
 * @param {Object} state - The state object to save
 * @returns {boolean} True if successful, false otherwise
 */
export const saveStateToLocalStorage = (key, state) => {
    try {
        localStorage.setItem(key, JSON.stringify(state));
        return true;
    } catch (error) {
        console.error(`Error saving state to localStorage: ${error}`);
        return false;
    }
};

/**
 * Removes state from localStorage by key
 * 
 * @param {string} key - The localStorage key to clear
 */
export const clearStateFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error clearing state from localStorage: ${error}`);
    }
};

/**
 * Merges new state with existing state
 * 
 * @param {Object} currentState - The current state object
 * @param {Object} newState - The new state to merge
 * @returns {Object} A new merged state object
 */
export const mergeState = (currentState, newState) => {
    return { ...currentState, ...newState };
};

/**
 * Updates a nested property in a state object using a path string
 * 
 * @param {Object} state - The state object to update
 * @param {string} path - Dot-notation path to the property (e.g., 'user.profile.name')
 * @param {*} value - The new value to set
 * @returns {Object} A new state object with the updated property
 */
export const updateNestedState = (state, path, value) => {
    // Create a copy of the state to maintain immutability
    const result = { ...state };
    
    // Split the path into parts
    const parts = path.split('.');
    
    // Navigate to the right level in the object
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        // Create the property if it doesn't exist
        if (!current[part]) {
            current[part] = {};
        }
        // Create a copy of this level to maintain immutability
        current[part] = { ...current[part] };
        // Move to the next level
        current = current[part];
    }
    
    // Set the value at the final level
    current[parts[parts.length - 1]] = value;
    
    return result;
};

/**
 * Toggles a boolean property in the state
 * 
 * @param {Object} state - The state object
 * @param {string} path - Path to the boolean property
 * @returns {Object} A new state object with the property toggled
 */
export const toggleStateProperty = (state, path) => {
    const currentValue = getNestedProperty(state, path);
    return updateNestedState(state, path, !currentValue);
};

/**
 * Gets a nested property from a state object using a path string
 * 
 * @param {Object} state - The state object
 * @param {string} path - Dot-notation path to the property
 * @returns {*} The value at the specified path or undefined if not found
 */
export const getNestedProperty = (state, path) => {
    const parts = path.split('.');
    let current = state;
    
    for (const part of parts) {
        if (current === undefined || current === null) {
            return undefined;
        }
        current = current[part];
    }
    
    return current;
};

/**
 * Creates a timestamped snapshot of the current state
 * 
 * @param {Object} state - The state to snapshot
 * @returns {Object} A snapshot object with timestamp and state data
 */
export const createStateSnapshot = (state) => {
    return {
        timestamp: Date.now(),
        data: JSON.parse(JSON.stringify(state)) // Deep clone
    };
};

/**
 * Saves a state history entry to localStorage
 * 
 * @param {string} key - Base key for the history entries
 * @param {Object} state - Current state to save
 * @param {number} maxEntries - Maximum number of history entries to keep
 */
export const saveStateHistory = (key, state, maxEntries = 10) => {
    try {
        const historyKey = `${key}_history`;
        const history = getStateFromLocalStorage(historyKey) || [];
        
        // Add new entry with timestamp
        const newEntry = createStateSnapshot(state);
        history.push(newEntry);
        
        // Keep only the most recent entries
        const trimmedHistory = history.slice(-maxEntries);
        
        // Save updated history
        localStorage.setItem(historyKey, JSON.stringify(trimmedHistory));
    } catch (error) {
        console.error(`Error saving state history: ${error}`);
    }
};

/**
 * Restores state from a specific history entry
 * 
 * @param {string} key - Base key for the history entries
 * @param {number} index - Index of the history entry to restore (-1 for most recent)
 * @returns {Object|null} The restored state or null if not found
 */
export const restoreStateFromHistory = (key, index = -1) => {
    try {
        const historyKey = `${key}_history`;
        const history = getStateFromLocalStorage(historyKey) || [];
        
        if (history.length === 0) {
            return null;
        }
        
        // Calculate the actual index
        const actualIndex = index < 0 ? history.length + index : index;
        
        // Check if index is valid
        if (actualIndex < 0 || actualIndex >= history.length) {
            return null;
        }
        
        return history[actualIndex].data;
    } catch (error) {
        console.error(`Error restoring state from history: ${error}`);
        return null;
    }
};