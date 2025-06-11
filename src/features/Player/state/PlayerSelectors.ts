// Player feature selectors using createSelector for memoization

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import {
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  StatusEffect,
  PlayerHealthData,
  PlayerManaData,
  CombatStats,
  PerformanceStats
} from './PlayerTypes';
import { selectAllTraits } from '../../Traits/state/TraitSelectors';

// Basic selectors
export const selectPlayer = (state: RootState): PlayerState => state.player;

export const selectPlayerStats = createSelector(
  [selectPlayer],
  (player) => player.stats
);

export const selectPlayerAttributes = createSelector(
  [selectPlayer],
  (player) => player.attributes
);

export const selectPlayerStatusEffects = createSelector(
  [selectPlayer],
  (player) => player.statusEffects || []
);

// Enhanced health data selector with percentage and status
export const selectHealthData = createSelector(
  [selectPlayerStats],
  (stats): PlayerHealthData => {
    const percentage = stats.maxHealth > 0 ? stats.health / stats.maxHealth : 0;
    
    const getHealthStatus = (percentage: number): 'critical' | 'low' | 'normal' | 'full' => {
      if (percentage <= 0.1) return 'critical';
      if (percentage <= 0.25) return 'low';
      if (percentage < 1.0) return 'normal';
      return 'full';
    };

    return {
      current: Math.max(0, stats.health),
      max: Math.max(1, stats.maxHealth),
      percentage: Math.min(1, Math.max(0, percentage)),
      status: getHealthStatus(percentage)
    };
  }
);

// Enhanced mana data selector with percentage and status
export const selectManaData = createSelector(
  [selectPlayerStats],
  (stats): PlayerManaData => {
    const percentage = stats.maxMana > 0 ? stats.mana / stats.maxMana : 0;
    
    const getManaStatus = (percentage: number): 'critical' | 'low' | 'normal' | 'full' => {
      if (percentage <= 0.1) return 'critical';
      if (percentage <= 0.25) return 'low';
      if (percentage < 1.0) return 'normal';
      return 'full';
    };

    return {
      current: Math.max(0, stats.mana),
      max: Math.max(1, stats.maxMana),
      percentage: Math.min(1, Math.max(0, percentage)),
      status: getManaStatus(percentage)
    };
  }
);

/**
 * Combat stats selector for grouped combat-related statistics
 */
export const selectCombatStats = createSelector(
  [selectPlayerStats],
  (stats): CombatStats => ({
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
    criticalChance: stats.criticalChance,
    criticalDamage: stats.criticalDamage
  })
);

/**
 * Performance stats selector for progression and advancement metrics
 */
export const selectPerformanceStats = createSelector(
  [selectPlayer],
  (player): PerformanceStats => {
    const formatPlaytime = (milliseconds: number): string => {
      const seconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      } else {
        return `${remainingSeconds}s`;
      }
    };

    return {
      totalPlaytime: player.totalPlaytime,
      formattedPlaytime: formatPlaytime(player.totalPlaytime),
      powerLevel: Math.floor(player.totalPlaytime / 3600000) + 1,
      availableAttributePoints: player.availableAttributePoints,
      availableSkillPoints: player.availableSkillPoints,
      resonanceLevel: player.resonanceLevel,
    };
  }
);

// Additional selectors for feature integration
export const selectAvailableAttributePoints = createSelector(
  [selectPlayer],
  (player) => player.availableAttributePoints
);

export const selectAvailableSkillPoints = createSelector(
  [selectPlayer],
  (player) => player.availableSkillPoints
);

// Keep permanent traits selector as this is still player-specific
export const selectPermanentTraits = (state: RootState): string[] => 
  state.player.permanentTraits;

export const selectIsPlayerAlive = createSelector(
  [selectPlayerStats],
  (stats) => stats.health > 0
);

export const selectTotalPlaytime = createSelector(
  [selectPlayer],
  (player) => player.totalPlaytime
);

/**
 * Select active trait effects applied to the player
 */
export const selectActiveTraitEffects = createSelector(
  [selectPlayer],
  (player) => player.activeTraitEffects || {}
);

/**
 * Select whether trait effects need recalculation
 * This can be used to trigger effect updates when traits change
 */
export const selectTraitEffectsNeedUpdate = createSelector(
  [selectPlayer, (state: RootState) => state.traits.lastModified],
  (player, traitsLastModified) => {
    // Simple heuristic: if traits were modified after player's last update
    return traitsLastModified > (player.lastStatsUpdate || 0);
  }
);

// Legacy selectors for backward compatibility
export const selectPlayerHealthData = selectHealthData;
export const selectPlayerManaData = selectManaData;

/**
 * Selects equipped trait objects by mapping IDs from player state to full trait objects.
 */
export const selectEquippedTraitObjects = createSelector(
  [selectPlayer, selectAllTraits],
  (player, allTraits) => {
    if (!player || !player.traitSlots || !allTraits) {
      return [];
    }
    return player.traitSlots
      .map(traitId => {
        if (traitId && allTraits[traitId]) {
          return allTraits[traitId];
        }
        return null;
      })
      .filter(trait => trait !== null) as Trait[]; // Type assertion after filtering nulls
  }
);

/**
 * Selects permanent trait objects by mapping IDs from player state to full trait objects.
 */
export const selectPermanentTraitObjects = createSelector(
  [selectPlayer, selectAllTraits],
  (player, allTraits) => {
    if (!player || !player.permanentTraits || !allTraits) {
      return [];
    }
    return player.permanentTraits
      .map(traitId => {
        if (allTraits[traitId]) {
          return allTraits[traitId];
        }
        return null;
      })
      .filter(trait => trait !== null) as Trait[]; // Type assertion after filtering nulls
  }
);
