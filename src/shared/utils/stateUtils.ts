/**
 * @file State Management Utility Functions
 * 
 * This module provides utility functions for managing application state,
 * including persistence to localStorage, state manipulation, and state history.
 * 
 * These utilities help with:
 * - Saving and loading state to/from localStorage
 * - Immutably updating nested state properties
 * - Managing state history for undo/redo functionality
 * - Creating snapshots of state for saving or comparison
 * 
 * All functions maintain immutability by returning new state objects rather
 * than modifying existing ones.
 * 
 * @example
 * // Save current state to localStorage
 * saveStateToLocalStorage('gameState', currentState);
 * 
 * // Retrieve state from localStorage
 * const savedState = getStateFromLocalStorage('gameState');
 * 
 * // Update a nested property
 * const newState = updateNestedState(currentState, 'player.stats.health', 100);
 */

/**
 * Type for any state object - can be extended by more specific interfaces
 */
export interface StateObject {
  [key: string]: any;
}

/**
 * State history snapshot with timestamp
 */
export interface StateSnapshot<T = StateObject> {
  timestamp: number;
  data: T;
}

/**
 * Retrieves state from localStorage by key
 * 
 * This function safely attempts to retrieve and parse JSON data
 * stored in localStorage under the specified key.
 * 
 * @param {string} key - The localStorage key to retrieve state from
 * @returns {T|null} The parsed state object or null if not found/invalid
 * 
 * @example
 * // Get saved game state
 * const gameState = getStateFromLocalStorage('gameState');
 * if (gameState) {
 *   // Initialize game with saved state
 *   initializeGame(gameState);
 * } else {
 *   // Start new game
 *   initializeGame(defaultState);
 * }
 * 
 * @template T The expected type of the stored state
 */
export const getStateFromLocalStorage = <T = StateObject>(key: string): T | null => {
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
 * Serializes the state object to JSON and stores it in localStorage.
 * 
 * @param {string} key - The localStorage key to save state to
 * @param {T} state - The state object to save
 * @returns {boolean} True if successful, false otherwise
 * 
 * @example
 * // Save game state before quitting
 * const saved = saveStateToLocalStorage('gameState', currentGameState);
 * if (saved) {
 *   showMessage('Game saved successfully');
 * } else {
 *   showMessage('Failed to save game');
 * }
 * 
 * @template T The type of the state being stored
 */
export const saveStateToLocalStorage = <T = StateObject>(key: string, state: T): boolean => {
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
 * 
 * @example
 * // Clear saved game state when starting a new game
 * clearStateFromLocalStorage('gameState');
 */
export const clearStateFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing state from localStorage: ${error}`);
  }
};

/**
 * Merges new state with existing state
 * 
 * Creates a new object that combines properties from both state objects.
 * Note: This is a shallow merge and doesn't deeply merge nested objects.
 * 
 * @param {T} currentState - The current state object
 * @param {Partial<T>} newState - The new state to merge
 * @returns {T} A new merged state object
 * 
 * @example
 * // Merge partial game settings with current settings
 * const updatedSettings = mergeState(currentSettings, {
 *   soundEnabled: false,
 *   difficulty: 'hard'
 * });
 * 
 * @template T The type of the state object
 */
export const mergeState = <T extends StateObject>(currentState: T, newState: Partial<T>): T => {
  return { ...currentState, ...newState };
};

/**
 * Updates a nested property in a state object using a path string
 * 
 * This function creates a new state with the value at the specified
 * path updated, maintaining immutability throughout the object tree.
 * 
 * @param {T} state - The state object to update
 * @param {string} path - Dot-notation path to the property (e.g., 'user.profile.name')
 * @param {U} value - The new value to set
 * @returns {T} A new state object with the updated property
 * 
 * @example
 * // Update player health
 * const newState = updateNestedState(gameState, 'player.stats.health', 100);
 * 
 * // Update nested array item
 * const newState = updateNestedState(gameState, 'inventory.items.0.quantity', 5);
 * 
 * @template T The type of the state object
 * @template U The type of the value being set
 */
export const updateNestedState = <T extends StateObject, U = any>(state: T, path: string, value: U): T => {
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
 * This function creates a new state with the specified boolean value toggled.
 * 
 * @param {T} state - The state object
 * @param {string} path - Path to the boolean property
 * @returns {T} A new state object with the property toggled
 * 
 * @example
 * // Toggle sound setting
 * const newState = toggleStateProperty(settings, 'audio.soundEnabled');
 * 
 * // Toggle inventory item selected status
 * const newState = toggleStateProperty(gameState, 'inventory.items.0.selected');
 * 
 * @template T The type of the state object
 */
export const toggleStateProperty = <T extends StateObject>(state: T, path: string): T => {
  const currentValue = getNestedProperty<boolean>(state, path);
  return updateNestedState(state, path, !currentValue);
};

/**
 * Gets a nested property from a state object using a path string
 * 
 * @param {T} state - The state object
 * @param {string} path - Dot-notation path to the property
 * @returns {U|undefined} The value at the specified path or undefined if not found
 * 
 * @example
 * // Get player health
 * const health = getNestedProperty(gameState, 'player.stats.health');
 * 
 * // Safely access potentially undefined properties
 * const itemName = getNestedProperty(gameState, 'inventory.activeItem.name') || 'No item';
 * 
 * @template T The type of the state object
 * @template U The expected type of the retrieved value
 */
export const getNestedProperty = <U = any, T extends StateObject = StateObject>(state: T, path: string): U | undefined => {
  const parts = path.split('.');
  let current: any = state;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  
  return current as U;
};

/**
 * Creates a timestamped snapshot of the current state
 * 
 * This function creates a deep clone of the state and adds a timestamp.
 * 
 * @param {T} state - The state to snapshot
 * @returns {StateSnapshot<T>} A snapshot object with timestamp and state data
 * 
 * @example
 * // Create a snapshot before a risky operation
 * const snapshot = createStateSnapshot(gameState);
 * saveStateHistory('backup', snapshot);
 * 
 * @template T The type of the state object
 */
export const createStateSnapshot = <T extends StateObject>(state: T): StateSnapshot<T> => {
  return {
    timestamp: Date.now(),
    data: JSON.parse(JSON.stringify(state)) // Deep clone
  };
};

/**
 * Saves a state history entry to localStorage
 * 
 * This function manages a history of state snapshots in localStorage,
 * limiting the number of entries to the specified maximum.
 * 
 * @param {string} key - Base key for the history entries
 * @param {T} state - Current state to save
 * @param {number} maxEntries - Maximum number of history entries to keep
 * 
 * @example
 * // Save state after each major action for undo functionality
 * saveStateHistory('gameState', newGameState, 10);
 * 
 * @template T The type of the state object
 */
export const saveStateHistory = <T extends StateObject>(key: string, state: T, maxEntries = 10): void => {
  try {
    const historyKey = `${key}_history`;
    const history = getStateFromLocalStorage<StateSnapshot<T>[]>(historyKey) || [];
    
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
 * This function retrieves a specific state snapshot from the history.
 * Use negative indices to get recent entries (-1 for most recent).
 * 
 * @param {string} key - Base key for the history entries
 * @param {number} index - Index of the history entry to restore (-1 for most recent)
 * @returns {T|null} The restored state or null if not found
 * 
 * @example
 * // Restore the most recent state (undo last action)
 * const previousState = restoreStateFromHistory('gameState');
 * if (previousState) {
 *   loadGameState(previousState);
 * }
 * 
 * // Restore a specific history entry
 * const olderState = restoreStateFromHistory('gameState', 2); // Third most recent
 * 
 * @template T The expected type of the stored state
 */
export const restoreStateFromHistory = <T extends StateObject>(key: string, index = -1): T | null => {
  try {
    const historyKey = `${key}_history`;
    const history = getStateFromLocalStorage<StateSnapshot<T>[]>(historyKey) || [];
    
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

/**
 * Gets the complete history of state snapshots
 * 
 * @param {string} key - Base key for the history entries
 * @returns {StateSnapshot<T>[]} Array of state snapshots or empty array if none found
 * 
 * @example
 * // Show history of game states with timestamps
 * const gameHistory = getStateHistory('gameState');
 * gameHistory.forEach((snapshot, index) => {
 *   console.log(`State ${index}: ${new Date(snapshot.timestamp).toLocaleString()}`);
 * });
 * 
 * @template T The expected type of the stored state
 */
export const getStateHistory = <T extends StateObject>(key: string): StateSnapshot<T>[] => {
  const historyKey = `${key}_history`;
  return getStateFromLocalStorage<StateSnapshot<T>[]>(historyKey) || [];
};

/**
 * Compares two states and returns an object describing their differences
 * 
 * @param {T} prevState - Previous state object
 * @param {T} nextState - New state object
 * @returns {Object} Object describing changes between states
 * 
 * @example
 * // Log changes between states
 * const changes = compareStates(oldState, newState);
 * console.log('State changes:', changes);
 * 
 * @template T The type of the state object
 */
export const compareStates = <T extends StateObject>(prevState: T, nextState: T): Record<string, { previous: any, current: any }> => {
  const changes: Record<string, { previous: any, current: any }> = {};
  
  // Check for changes in root-level properties
  Object.keys({ ...prevState, ...nextState }).forEach(key => {
    if (prevState[key] !== nextState[key]) {
      changes[key] = {
        previous: prevState[key],
        current: nextState[key]
      };
    }
  });
  
  return changes;
};

/**
 * Deeply freezes an object to prevent modifications
 * 
 * This is useful for development to enforce immutability.
 * 
 * @param {T} state - The state object to freeze
 * @returns {Readonly<T>} A deeply frozen version of the state
 * 
 * @example
 * // Create an immutable state object
 * const frozenState = deepFreeze(gameState);
 * 
 * @template T The type of the state object
 */
export const deepFreeze = <T extends StateObject>(state: T): Readonly<T> => {
  // Freeze the properties first
  Object.freeze(state);
  
  // Recursively freeze all property values that are objects
  Object.getOwnPropertyNames(state).forEach(prop => {
    const value = state[prop];
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });
  
  return state;
};
