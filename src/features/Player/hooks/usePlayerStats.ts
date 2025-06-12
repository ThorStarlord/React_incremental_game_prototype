/**
 * Custom hooks for player statistics management
 */

import { useAppSelector } from '../../../app/hooks';
import {
  selectPlayer,
  selectPlayerHealth,
  selectPlayerMaxHealth,
  selectPlayerMana,
  selectPlayerMaxMana,
  selectPlayerAttributes,
  selectCombatStats
} from '../state/PlayerSelectors';

/**
 * Hook to get the entire player state object.
 * Useful for components that need multiple pieces of player data.
 */
export const usePlayer = () => {
  return useAppSelector(selectPlayer);
};

/**
 * FIXED: This hook is now a combination of several specific hooks
 * that correctly select data from the flattened PlayerState.
 * It's renamed to usePlayerVitals for clarity.
 */
export const usePlayerVitals = () => {
  const health = useAppSelector(selectPlayerHealth);
  const maxHealth = useAppSelector(selectPlayerMaxHealth);
  const mana = useAppSelector(selectPlayerMana);
  const maxMana = useAppSelector(selectPlayerMaxMana);

  return {
    health,
    maxHealth,
    mana,
    maxMana,
    healthPercentage: maxHealth > 0 ? (health / maxHealth) * 100 : 0,
    manaPercentage: maxMana > 0 ? (mana / maxMana) * 100 : 0,
  };
};

/**
 * Hook to get player attributes.
 */
export const usePlayerAttributes = () => {
  return useAppSelector(selectPlayerAttributes);
};

/**
 * Hook to get player combat stats.
 */
export const usePlayerCombatStats = () => {
  return useAppSelector(selectCombatStats);
};

// The old usePlayerStats, usePlayerHealth, and usePlayerMana hooks are now
// replaced by the more specific and correct hooks above.