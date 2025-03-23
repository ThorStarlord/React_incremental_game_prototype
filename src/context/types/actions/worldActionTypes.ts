/**
 * World-related action type definitions
 * 
 * This module defines the types and interfaces for world actions
 * in the game.
 * 
 * @module worldActionTypes
 */

/**
 * World action type constants
 */
export const WORLD_ACTIONS = {
  DISCOVER_LOCATION: 'world/discoverLocation' as const,
  UNLOCK_REGION: 'world/unlockRegion' as const,
  TRIGGER_WORLD_EVENT: 'world/triggerEvent' as const,
  UPDATE_TIME_CYCLE: 'world/updateTime' as const,
  CHANGE_ENVIRONMENT: 'world/changeEnvironment' as const,
  ESTABLISH_SETTLEMENT: 'world/establishSettlement' as const,
  DEPLETE_RESOURCE: 'world/depleteResource' as const,
  REGENERATE_RESOURCE: 'world/regenerateResource' as const,
  TRAVEL_TO_LOCATION: 'world/travelToLocation' as const,
  
  // Location actions moved from locationActions.ts
  MOVE_TO_LOCATION: 'world/moveToLocation' as const,
  UPDATE_LOCATION: 'world/updateLocation' as const,
  LOCK_LOCATION: 'world/lockLocation' as const,
  UNLOCK_LOCATION: 'world/unlockLocation' as const
};

// Create a union type of all world action types
export type WorldActionType = typeof WORLD_ACTIONS[keyof typeof WORLD_ACTIONS];

/**
 * Base world action interface
 */
export interface WorldAction {
  type: WorldActionType;
  payload?: any;
}

/**
 * Discover location payload
 */
export interface DiscoverLocationPayload {
  locationId: string;
  autoUnlock?: boolean;
}

/**
 * Unlock region payload
 */
export interface UnlockRegionPayload {
  regionId: string;
  reason?: string;
}

/**
 * Trigger world event payload
 */
export interface TriggerWorldEventPayload {
  eventId: string;
  locationId?: string;
  intensity?: number;
  options?: Record<string, any>;
}

/**
 * Update time cycle payload
 */
export interface UpdateTimeCyclePayload {
  hours: number;
  updateWeather?: boolean;
}

/**
 * Change environment payload
 */
export interface ChangeEnvironmentPayload {
  weather?: string;
  temperature?: number;
  timeOfDay?: string;
  season?: string;
}

/**
 * Location meta information
 */
export interface LocationMeta {
  timestamp: number;
  [key: string]: any;
}

/**
 * Location update payload
 */
export interface LocationUpdatePayload {
  locationId: string;
  updates: Record<string, any>;
}

/**
 * Move meta information
 */
export interface MoveMeta extends LocationMeta {
  [key: string]: any;
}

/**
 * Discovery meta information
 */
export interface DiscoverMeta extends LocationMeta {
  autoUnlock: boolean;
}

/**
 * Lock meta information
 */
export interface LockMeta extends LocationMeta {
  reason: string;
}

/**
 * Unlock meta information
 */
export interface UnlockMeta extends LocationMeta {
  method: string;
}
