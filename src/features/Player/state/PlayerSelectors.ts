// Player feature selectors using createSelector for memoization

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import {
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  StatusEffect
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

// Health and mana data selectors with safe calculations
export const selectPlayerHealthData = createSelector(
  [selectPlayerStats],
  (stats) => {
    const healthPercentage = stats.maxHealth > 0 
      ? Math.min(100, Math.max(0, (stats.health / stats.maxHealth) * 100))
      : 0;
    
    const getHealthStatus = (percentage: number): 'critical' | 'low' | 'normal' | 'full' => {
      if (percentage <= 25) return 'critical';
      if (percentage <= 50) return 'low';
      if (percentage < 100) return 'normal';
      return 'full';
    };

    return {
      current: Math.max(0, stats.health),
      max: Math.max(1, stats.maxHealth),
      percentage: healthPercentage,
      status: getHealthStatus(healthPercentage)
    };
  }
);

export const selectPlayerManaData = createSelector(
  [selectPlayerStats],
  (stats) => {
    const manaPercentage = stats.maxMana > 0
      ? Math.min(100, Math.max(0, (stats.mana / stats.maxMana) * 100))
      : 0;
    
    const getManaStatus = (percentage: number): 'critical' | 'low' | 'normal' | 'full' => {
      if (percentage <= 15) return 'critical';
      if (percentage <= 35) return 'low';
      if (percentage < 100) return 'normal';
      return 'full';
    };

    return {
      current: Math.max(0, stats.mana),
      max: Math.max(1, stats.maxMana),
      percentage: manaPercentage,
      status: getManaStatus(manaPercentage)
    };
  }
);

// Combat stats selector
export const selectPlayerCombatStats = createSelector(
  [selectPlayerStats],
  (stats) => ({
    attack: Math.max(0, stats.attack),
    defense: Math.max(0, stats.defense),
    speed: Math.max(0, stats.speed),
    criticalChance: Math.min(1, Math.max(0, stats.criticalChance)),
    criticalDamage: Math.max(1, stats.criticalDamage)
  })
);

// Performance stats selector
export const selectPlayerPerformanceStats = createSelector(
  [selectPlayer],
  (player) => {
    // Calculate power level from attributes and stats
    const attributeSum = Object.values(player.attributes || {}).reduce((sum, val) => sum + val, 0);
    const powerLevel = attributeSum + (player.stats?.attack || 0) + (player.stats?.defense || 0);
    
    return {
      totalPlaytime: player.totalPlaytime || 0,
      powerLevel: Math.floor(powerLevel),
      availableAttributePoints: player.availableAttributePoints || 0,
      availableSkillPoints: player.availableSkillPoints || 0
    };
  }
);

// Point allocation selectors
export const selectAvailableAttributePoints = createSelector(
  [selectPlayer],
  (player) => player.availableAttributePoints || 0
);

export const selectAvailableSkillPoints = createSelector(
  [selectPlayer],
  (player) => player.availableSkillPoints || 0
);

// Player status selectors
export const selectIsPlayerAlive = createSelector(
  [selectPlayer],
  (player) => player.isAlive !== false // Default to true if undefined
);

// Status effects by type (commented out until StatusEffect type is properly defined)
// export const selectStatusEffectsByType = createSelector(
//   [selectPlayerStatusEffects],
//   (effects) => (type: string) => effects.filter(effect => effect.type === type)
// );

// Formatted display selectors
export const selectFormattedPlaytime = createSelector(
  [selectPlayer],
  (player) => {
    const totalSeconds = Math.floor((player.totalPlaytime || 0) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
);

// Attribute by name selector with proper typing
export const selectAttributeByName = createSelector(
  [selectPlayerAttributes],
  (attributes) => (attributeName: keyof PlayerAttributes) => attributes[attributeName] || 0
);

// Health status for UI coloring
export const selectHealthStatus = createSelector(
  [selectPlayerHealthData],
  (healthData) => healthData.status
);

// Mana status for UI coloring
export const selectManaStatus = createSelector(
  [selectPlayerManaData],
  (manaData) => manaData.status
);

// Computed stats selector (comprehensive stats for display)
export const selectPlayerStatsData = createSelector(
  [selectPlayerHealthData, selectPlayerManaData],
  (healthData, manaData) => ({
    healthPercentage: healthData.percentage,
    manaPercentage: manaData.percentage,
    healthStatus: healthData.status,
    manaStatus: manaData.status
  })
);