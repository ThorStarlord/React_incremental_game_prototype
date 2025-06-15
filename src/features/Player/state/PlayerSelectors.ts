/**
 * Memoized selectors for Player state (Corrected - with Trait integration)
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { PlayerState, PlayerStats } from './PlayerTypes'; // Import PlayerStats
import { selectTraits } from '../../Traits/state/TraitsSelectors';

// Base player state selector
export const selectPlayer = (state: RootState): PlayerState => state.player;

// NEW: Selector for the final, calculated stats object
export const selectFinalStats = createSelector(
  [selectPlayer],
  (player) => player.stats
);

// Basic Player Selectors
export const selectPlayerHealth = createSelector([selectFinalStats], (stats) => stats.health);
export const selectPlayerMaxHealth = createSelector([selectFinalStats], (stats) => stats.maxHealth);
export const selectPlayerMana = createSelector([selectFinalStats], (stats) => stats.mana);
export const selectPlayerMaxMana = createSelector([selectFinalStats], (stats) => stats.maxMana);

export const selectAvailableAttributePoints = createSelector([selectPlayer], (player) => player.availableAttributePoints);
export const selectIsPlayerAlive = createSelector([selectPlayer], (player) => player.isAlive);
export const selectResonanceLevel = createSelector([selectPlayer], (player) => player.resonanceLevel);
export const selectMaxTraitSlots = createSelector([selectPlayer], (player) => player.maxTraitSlots);
export const selectPermanentTraits = createSelector([selectPlayer], (player) => player.permanentTraits);
export const selectPlayerAttributes = createSelector([selectPlayer], (player) => player.attributes);
export const selectTotalPlaytime = createSelector([selectPlayer], (player) => player.totalPlaytime);
export const selectStatusEffects = createSelector([selectPlayer],(player) => player.statusEffects);
export const selectPlayerTraitSlots = createSelector([selectPlayer], (player) => player.traitSlots);

// --- MOVED AND FIXED SELECTORS (Cross-Feature Logic) ---

export const selectEquippedTraits = createSelector(
  [selectPlayerTraitSlots, selectTraits],
  (traitSlots, allTraits) => {
    return traitSlots
      .filter(slot => slot.traitId !== null)
      .map(slot => allTraits[slot.traitId!])
      .filter(Boolean);
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

// --- OTHER COMPUTED SELECTORS ---

export const selectCombatStats = createSelector(
  [selectFinalStats], // Use the final stats selector
  (stats) => ({
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
    criticalChance: stats.criticalChance,
    criticalDamage: stats.criticalDamage
  })
);

export const selectPerformanceStats = createSelector(
  [selectPlayer, selectFinalStats], // Depends on both player and final stats
  (player, stats) => ({
    totalPlaytime: player.totalPlaytime,
    availableAttributePoints: player.availableAttributePoints,
    availableSkillPoints: player.availableSkillPoints,
    isAlive: player.isAlive,
    powerLevel: Math.floor(stats.attack + stats.defense + stats.maxHealth / 10 + stats.maxMana / 5)
  })
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