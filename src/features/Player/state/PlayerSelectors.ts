// Player feature selectors using createSelector for memoization

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { PlayerState, PlayerStats } from './PlayerTypes';

// Base selector
export const selectPlayer = (state: RootState): PlayerState => state.player;

// Memoized selectors for specific player data
export const selectPlayerName = createSelector(
  [selectPlayer],
  (player) => player.name
);

export const selectPlayerLevel = createSelector(
  [selectPlayer],
  (player) => player.level
);

export const selectPlayerStats = createSelector(
  [selectPlayer],
  (player) => player.stats
);

export const selectPlayerHealth = createSelector(
  [selectPlayerStats],
  (stats) => ({
    current: stats.health,
    max: stats.maxHealth,
    percentage: (stats.health / stats.maxHealth) * 100
  })
);

export const selectPlayerMana = createSelector(
  [selectPlayerStats],
  (stats) => ({
    current: stats.mana,
    max: stats.maxMana,
    percentage: (stats.mana / stats.maxMana) * 100
  })
);

export const selectPlayerAttributes = createSelector(
  [selectPlayer],
  (player) => player.attributes
);

export const selectPlayerEquipment = createSelector(
  [selectPlayer],
  (player) => player.equipment
);

export const selectPlayerAttributePoints = createSelector(
  [selectPlayer],
  (player) => player.attributePoints
);

export const selectIsPlayerAlive = createSelector(
  [selectPlayer],
  (player) => player.isAlive
);

// Computed selectors
export const selectPlayerPowerLevel = createSelector(
  [selectPlayerStats, selectPlayerLevel],
  (stats, level) => {
    // Calculate overall power level based on stats and level
    const statSum = stats.attack + stats.defense + stats.maxHealth + stats.maxMana;
    return Math.floor((statSum * level) / 100);
  }
);