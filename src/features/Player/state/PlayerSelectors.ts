// Player feature selectors using createSelector for memoization

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

// Basic selectors
export const selectPlayer = (state: RootState) => state.player;
export const selectPlayerStats = (state: RootState) => state.player.stats;
export const selectPlayerAttributes = (state: RootState) => state.player.attributes;
export const selectPlayerEquipment = (state: RootState) => state.player.equipment;
export const selectPlayerLevel = (state: RootState) => state.player.level;
export const selectPlayerExperience = (state: RootState) => state.player.experience;
export const selectPlayerName = (state: RootState) => state.player.name;
export const selectPlayerGold = (state: RootState) => state.player.gold;

// Computed selectors
export const selectPlayerHealth = createSelector(
  [selectPlayerStats],
  (stats) => ({
    current: stats.health,
    max: stats.maxHealth,
    percentage: stats.maxHealth > 0 ? (stats.health / stats.maxHealth) * 100 : 0
  })
);

export const selectPlayerMana = createSelector(
  [selectPlayerStats],
  (stats) => ({
    current: stats.mana,
    max: stats.maxMana,
    percentage: stats.maxMana > 0 ? (stats.mana / stats.maxMana) * 100 : 0
  })
);

export const selectPlayerIsAlive = createSelector(
  [selectPlayer],
  (player) => player.isAlive && player.stats.health > 0
);

export const selectPlayerCombatStats = createSelector(
  [selectPlayerStats],
  (stats) => ({
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
    critChance: stats.critChance,
    critDamage: stats.critDamage
  })
);

export const selectPlayerRegenStats = createSelector(
  [selectPlayerStats],
  (stats) => ({
    healthRegen: stats.healthRegen,
    manaRegen: stats.manaRegen
  })
);

// Equipment selectors
export const selectEquippedItemsCount = createSelector(
  [selectPlayerEquipment],
  (equipment) => {
    return Object.values(equipment).filter(item => item !== null && item !== undefined).length;
  }
);

export const selectEquipmentBySlot = createSelector(
  [selectPlayerEquipment, (_state: RootState, slot: string) => slot],
  (equipment, slot) => equipment[slot] || null
);

// Status selectors
export const selectPlayerStatusEffects = createSelector(
  [selectPlayer],
  (player) => player.statusEffects || []
);

export const selectPlayerProgression = createSelector(
  [selectPlayer],
  (player) => ({
    level: player.level,
    experience: player.experience,
    attributePoints: player.attributePoints,
    skillPoints: player.skillPoints,
    totalPlayTime: player.totalPlayTime
  })
);