/**
 * World-related action types
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
  TRAVEL_TO_LOCATION: 'world/travelToLocation' as const
};
