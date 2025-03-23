/**
 * Resource Action Types
 * ====================
 * 
 * This file defines action types related to resource management,
 * including adding, updating, and consuming various game resources.
 * 
 * @module resourceActionTypes
 */

/**
 * Action types for resource operations
 */
export const RESOURCE_ACTIONS = {
  /**
   * Add resources to the player's inventory
   */
  ADD_RESOURCES: 'resources/add',

  /**
   * Set a resource to a specific value
   */
  SET_RESOURCE: 'resources/set',

  /**
   * Update production rate for a resource
   */
  UPDATE_PRODUCTION_RATE: 'resources/updateProduction',

  /**
   * Apply resource production (generate resources based on rates)
   */
  APPLY_PRODUCTION: 'resources/applyProduction',

  /**
   * Reset resources to initial values
   */
  RESET_RESOURCES: 'resources/reset',

  /**
   * Consume resources (used in crafting, building, etc.)
   */
  CONSUME_RESOURCES: 'resources/consume',

  /**
   * Discover a new resource type
   */
  DISCOVER_RESOURCE: 'resources/discover',

  /**
   * Update resource capacity
   */
  UPDATE_CAPACITY: 'resources/updateCapacity',

  /**
   * Gain gold currency
   */
  GAIN_GOLD: 'resources/gainGold'
};

/**
 * Resource action payload interfaces
 */
export interface AddResourcesPayload {
  [key: string]: number | Record<string, number> | string | undefined;
  source?: string;
}

export interface SetResourcePayload {
  resource: string;
  amount: number;
}

export interface UpdateProductionRatePayload {
  resource: string;
  rate: number;
}

export interface ApplyProductionPayload {
  timeElapsed?: number;
}

export interface ConsumeResourcesPayload {
  resources: Record<string, number>;
  reason?: string;
}

export interface DiscoverResourcePayload {
  resourceId: string;
}

export interface UpdateCapacityPayload {
  resource: string;
  capacity: number;
}

/**
 * Resource action interface
 */
export interface ResourceAction {
  type: keyof typeof RESOURCE_ACTIONS;
  payload: AddResourcesPayload | SetResourcePayload | UpdateProductionRatePayload | 
    ApplyProductionPayload | ConsumeResourcesPayload | DiscoverResourcePayload | 
    UpdateCapacityPayload | undefined;
}

/**
 * Resource action type union
 */
export type ResourceActionType = typeof RESOURCE_ACTIONS[keyof typeof RESOURCE_ACTIONS];