/**
 * Location Actions
 * ===============
 * 
 * This file contains all action creators related to locations in the
 * incremental RPG. These actions handle player movement between locations,
 * discovering new areas, and managing location properties like locked status.
 * 
 * @module locationActions
 */

// Import action types from the reducer
import {
  MOVE_TO_LOCATION,
  DISCOVER_LOCATION,
  UPDATE_LOCATION,
  LOCK_LOCATION,
  UNLOCK_LOCATION
} from '../reducers/locationReducer';

/**
 * Move the player to a different location
 * 
 * @param {string} locationId - ID of the location to move to
 * @param {Object} options - Additional movement options
 * @returns {Object} The MOVE_TO_LOCATION action
 */
export const moveToLocation = (locationId, options = {}) => ({
  type: MOVE_TO_LOCATION,
  payload: locationId,
  meta: {
    ...options,
    timestamp: Date.now()
  }
});

/**
 * Discover a new location on the map
 * 
 * @param {string} locationId - ID of the location to discover
 * @param {boolean} autoUnlock - Whether to automatically unlock the location
 * @returns {Object} The DISCOVER_LOCATION action
 */
export const discoverLocation = (locationId, autoUnlock = false) => ({
  type: DISCOVER_LOCATION,
  payload: locationId,
  meta: {
    autoUnlock,
    timestamp: Date.now()
  }
});

/**
 * Update a location's properties
 * 
 * @param {string} locationId - ID of the location to update
 * @param {Object} updates - Object containing the properties to update
 * @returns {Object} The UPDATE_LOCATION action
 */
export const updateLocation = (locationId, updates = {}) => ({
  type: UPDATE_LOCATION,
  payload: {
    locationId,
    updates
  },
  meta: {
    timestamp: Date.now()
  }
});

/**
 * Lock a location to prevent player access
 * 
 * @param {string} locationId - ID of the location to lock
 * @param {string} reason - Reason why the location is being locked
 * @returns {Object} The LOCK_LOCATION action
 */
export const lockLocation = (locationId, reason = '') => ({
  type: LOCK_LOCATION,
  payload: locationId,
  meta: {
    reason,
    timestamp: Date.now()
  }
});

/**
 * Unlock a location to allow player access
 * 
 * @param {string} locationId - ID of the location to unlock
 * @param {string} method - Method used to unlock the location (quest, key, etc.)
 * @returns {Object} The UNLOCK_LOCATION action
 */
export const unlockLocation = (locationId, method = '') => ({
  type: UNLOCK_LOCATION,
  payload: locationId,
  meta: {
    method,
    timestamp: Date.now()
  }
});

/**
 * Add a new resource gathering bonus to a location
 * 
 * @param {string} locationId - ID of the location to update
 * @param {string} resourceType - Type of resource to add bonus for
 * @param {number} multiplier - The resource gathering multiplier
 * @returns {Object} The UPDATE_LOCATION action with resource updates
 */
export const addResourceBonus = (locationId, resourceType, multiplier) => {
  return updateLocation(locationId, {
    resources: {
      [resourceType]: multiplier
    }
  });
};

/**
 * Add a new connected location to an existing location
 * 
 * @param {string} locationId - ID of the base location
 * @param {string} connectedLocationId - ID of the location to connect
 * @param {boolean} bidirectional - Whether to create connection in both directions
 * @returns {Object} The UPDATE_LOCATION action with connection updates
 */
export const addConnectedLocation = (locationId, connectedLocationId, bidirectional = true) => {
  // Actions to dispatch
  const actions = [
    updateLocation(locationId, {
      connectedLocations: [connectedLocationId]
    })
  ];
  
  // If bidirectional, add the reverse connection too
  if (bidirectional) {
    actions.push(
      updateLocation(connectedLocationId, {
        connectedLocations: [locationId]
      })
    );
  }
  
  // Return the first action (the caller will need to handle multiple dispatches if bidirectional)
  return actions[0];
};

/**
 * Change the enemy spawn rate at a location
 * 
 * @param {string} locationId - ID of the location to update
 * @param {number} spawnRate - New enemy spawn rate (0.0 to 1.0)
 * @returns {Object} The UPDATE_LOCATION action with spawn rate update
 */
export const updateEnemySpawnRate = (locationId, spawnRate) => {
  return updateLocation(locationId, {
    enemySpawnRate: Math.max(0, Math.min(1, spawnRate)) // Clamp between 0 and 1
  });
};
