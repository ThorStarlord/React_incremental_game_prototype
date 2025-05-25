// Player feature selectors using createSelector for memoization

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type {
  PlayerState,
  PlayerStats,
  PlayerHealthData,
  PlayerManaData,
  CombatStats,
  PerformanceStats,
  ArmorEquipment,
  WeaponEquipment,
  AccessoryEquipment,
  EquipmentState
} from './PlayerTypes';

// Base selectors
export const selectPlayer = (state: RootState): PlayerState => state.player;

export const selectPlayerName = createSelector(
  [selectPlayer],
  (player) => player.name
);

export const selectPlayerStats = createSelector(
  [selectPlayer],
  (player) => player.stats
);

export const selectPlayerAttributes = createSelector(
  [selectPlayer],
  (player) => player.attributes
);

export const selectPlayerEquipment = createSelector(
  [selectPlayer],
  (player) => player.equipment
);

export const selectPlayerStatusEffects = createSelector(
  [selectPlayer],
  (player) => player.statusEffects
);

// Enhanced health data with percentage calculation
export const selectPlayerHealth = createSelector(
  [selectPlayerStats],
  (stats): PlayerHealthData => ({
    current: stats.health,
    max: stats.maxHealth,
    percentage: (stats.health / stats.maxHealth) * 100
  })
);

// Enhanced mana data with percentage calculation
export const selectPlayerMana = createSelector(
  [selectPlayerStats],
  (stats): PlayerManaData => ({
    current: stats.mana,
    max: stats.maxMana,
    percentage: (stats.mana / stats.maxMana) * 100
  })
);

// Combat statistics grouping
export const selectCombatStats = createSelector(
  [selectPlayerStats],
  (stats): CombatStats => ({
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
    critChance: stats.critChance,
    critDamage: stats.critDamage
  })
);

// Performance and progression stats
export const selectPerformanceStats = createSelector(
  [selectPlayer],
  (player): PerformanceStats => {
    // Calculate power level as sum of key stats
    const powerLevel = player.stats.attack + player.stats.defense + 
                      player.stats.maxHealth / 10 + player.stats.maxMana / 5;
    
    return {
      totalPlayTime: player.totalPlayTime,
      powerLevel: Math.floor(powerLevel)
    };
  }
);

// Equipment category selectors
export const selectArmorEquipment = createSelector(
  [selectPlayerEquipment],
  (equipment): ArmorEquipment => ({
    head: equipment.head,
    chest: equipment.chest,
    legs: equipment.legs,
    feet: equipment.feet
  })
);

export const selectWeaponEquipment = createSelector(
  [selectPlayerEquipment],
  (equipment): WeaponEquipment => ({
    mainHand: equipment.mainHand,
    offHand: equipment.offHand
  })
);

export const selectAccessoryEquipment = createSelector(
  [selectPlayerEquipment],
  (equipment): AccessoryEquipment => ({
    accessory1: equipment.accessory1,
    accessory2: equipment.accessory2
  })
);

// Utility selectors
export const selectAttributePoints = createSelector(
  [selectPlayer],
  (player) => player.attributePoints
);

export const selectSkillPoints = createSelector(
  [selectPlayer],
  (player) => player.skillPoints
);

export const selectPlayerGold = createSelector(
  [selectPlayer],
  (player) => player.gold
);

export const selectIsPlayerAlive = createSelector(
  [selectPlayer],
  (player) => player.isAlive
);

// Equipment utility selectors
export const selectEquippedItemsCount = createSelector(
  [selectPlayerEquipment],
  (equipment) => {
    return Object.values(equipment).filter(item => item !== null).length;
  }
);

export const selectEquipmentBySlot = createSelector(
  [selectPlayerEquipment],
  (equipment) => (slot: string) => equipment[slot] || null
);

// Status effect utility selectors
export const selectActiveStatusEffects = createSelector(
  [selectPlayerStatusEffects],
  (effects) => effects.filter(effect => effect.duration > 0)
);

export const selectStatusEffectsByType = createSelector(
  [selectPlayerStatusEffects],
  (effects) => (type: string) => effects.filter(effect => effect.type === type)
);

// Formatted display selectors
export const selectFormattedPlayTime = createSelector(
  [selectPlayer],
  (player) => {
    const totalSeconds = Math.floor(player.totalPlayTime / 1000);
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

// Attribute by name selector factory
export const selectAttributeByName = createSelector(
  [selectPlayerAttributes],
  (attributes) => (attributeName: string) => attributes[attributeName] || null
);

// Health status selector (for UI coloring)
export const selectHealthStatus = createSelector(
  [selectPlayerHealth],
  (health): 'critical' | 'low' | 'medium' | 'high' => {
    if (health.percentage <= 25) return 'critical';
    if (health.percentage <= 50) return 'low';
    if (health.percentage <= 75) return 'medium';
    return 'high';
  }
);

// Mana status selector (for UI coloring)
export const selectManaStatus = createSelector(
  [selectPlayerMana],
  (mana): 'empty' | 'low' | 'medium' | 'full' => {
    if (mana.percentage <= 10) return 'empty';
    if (mana.percentage <= 30) return 'low';
    if (mana.percentage <= 70) return 'medium';
    return 'full';
  }
);