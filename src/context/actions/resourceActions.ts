/**
 * Resource-related action types
 */

export const RESOURCE_ACTIONS = {
  ADD_RESOURCES: 'resources/add' as const,
  SET_RESOURCE: 'resources/set' as const,
  UPDATE_PRODUCTION_RATE: 'resources/updateRate' as const,
  APPLY_PRODUCTION: 'resources/applyProduction' as const,
  RESET_RESOURCES: 'resources/reset' as const,
  GAIN_RESOURCE: 'resources/gain' as const,
  SPEND_RESOURCE: 'resources/spend' as const,
  GAIN_GOLD: 'resources/gainGold' as const
};
