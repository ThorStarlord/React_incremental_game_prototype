/**
 * Trait-related action types
 */

export const TRAIT_ACTIONS = {
  DISCOVER_TRAIT: 'traits/discover' as const,
  UNLOCK_TRAIT: 'traits/unlock' as const,
  EQUIP_TRAIT: 'traits/equip' as const,
  UNEQUIP_TRAIT: 'traits/unequip' as const,
  EVOLVE_TRAIT: 'traits/evolve' as const,
  INCREASE_TRAIT_AFFINITY: 'traits/increaseAffinity' as const
};
