// Player feature selectors using createSelector for memoization

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { PlayerState } from './PlayerTypes';
import { selectTraits } from '../../Traits/index';

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
    percentage: stats.maxMana > 0 ? (stats.mana / stats.maxMana) * 100 : 0
  })
);

export const selectPlayerVitals = createSelector(
  [selectPlayerHealth, selectPlayerMana],
  (health, mana) => ({
    health,
    mana
  })
);

/**
 * Combat stats selector for grouped combat-related statistics
 */
export const selectCombatStats = createSelector(
  [selectPlayerStats],
  (stats) => ({
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
  (player) => ({
    totalPlaytime: player.totalPlaytime,
    availableAttributePoints: player.availableAttributePoints,
    availableSkillPoints: player.availableSkillPoints,
    isAlive: player.isAlive,
    powerLevel: Math.floor(
      player.stats.attack + 
      player.stats.defense + 
      player.stats.maxHealth / 10 + 
      player.stats.maxMana / 5
    )
  })
);

export const selectPlayerTraitSlots = createSelector(
  [selectPlayer],
  (player) => player.traitSlots
);

export const selectEquippedTraits = createSelector(
  [selectPlayerTraitSlots, selectTraits],
  (traitSlots, allTraits) => {
    return traitSlots
      .filter(slot => slot.traitId !== null)
      .map(slot => allTraits[slot.traitId!])
      .filter(Boolean); // Remove any undefined traits
  }
);

export const selectPermanentTraits = createSelector(
  [selectPlayer, selectTraits],
  (player, allTraits) => {
    return player.permanentTraits
      .map(traitId => allTraits[traitId])
      .filter(Boolean); // Remove any undefined traits
  }
);

export const selectAvailableTraitSlots = createSelector(
  [selectPlayerTraitSlots],
  (traitSlots) => traitSlots.filter(slot => !slot.isLocked && slot.traitId === null).length
);

export const selectUsedTraitSlots = createSelector(
  [selectPlayerTraitSlots],
  (traitSlots) => traitSlots.filter(slot => slot.traitId !== null).length
);

export const selectMaxTraitSlots = createSelector(
  [selectPlayer],
  (player) => player.maxTraitSlots
);

export const selectStatusEffects = createSelector(
  [selectPlayer],
  (player) => player.statusEffects
);

export const selectPlayerProgression = createSelector(
  [selectPlayer],
  (player) => ({
    resonanceLevel: player.resonanceLevel,
    totalPlaytime: player.totalPlaytime,
    availableAttributePoints: player.availableAttributePoints,
    availableSkillPoints: player.availableSkillPoints,
    isAlive: player.isAlive
  })
);

export const selectCanAllocateAttributes = createSelector(
  [selectPlayer],
  (player) => player.availableAttributePoints > 0
);

export const selectPlayerTraitInfo = createSelector(
  [selectEquippedTraits, selectPermanentTraits, selectAvailableTraitSlots, selectUsedTraitSlots, selectMaxTraitSlots],
  (equippedTraits, permanentTraits, availableSlots, usedSlots, maxSlots) => ({
    equipped: equippedTraits,
    permanent: permanentTraits,
    availableSlots,
    usedSlots,
    maxSlots,
    totalTraits: equippedTraits.length + permanentTraits.length
  })
);
