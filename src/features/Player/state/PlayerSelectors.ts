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
      formattedPlaytime: formatPlaytime(player.totalPlaytime), // Added missing property
      powerLevel: Math.floor(player.totalPlaytime / 3600000) + 1, // Basic power level calculation
      availableAttributePoints: player.availableAttributePoints,
      availableSkillPoints: player.availableSkillPoints,
      resonanceLevel: player.resonanceLevel, // Include resonanceLevel
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

// Selects the IDs of currently equipped traits from traitSlots
export const selectEquippedTraitIds = createSelector(
  [selectPlayer],
  (player) => player.traitSlots.filter(slot => slot.traitId !== null).map(slot => slot.traitId as string)
);

export const selectPermanentTraits = createSelector(
  [selectPlayer],
  (player) => player.permanentTraits
);

export const selectTraitSlots = createSelector(
  [selectPlayer],
  (player) => player.traitSlots
);

export const selectIsPlayerAlive = createSelector(
  [selectPlayerStats],
  (stats) => stats.health > 0
);

export const selectTotalPlaytime = createSelector(
  [selectPlayer],
  (player) => player.totalPlaytime
);

export const selectMaxTraitSlots = createSelector(
  [selectPlayer],
  (player) => player.maxTraitSlots
);

export const selectPlayerResonanceLevel = createSelector(
  [selectPlayer],
  (player) => player.resonanceLevel
);

// Legacy selectors for backward compatibility
export const selectPlayerHealthData = selectHealthData;
export const selectPlayerManaData = selectManaData;
