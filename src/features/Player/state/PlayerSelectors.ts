/**
 * Memoized selectors for Player state
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { PlayerState } from './PlayerTypes';
import { selectTraits } from '../../Traits/index';

/**
 * Base player state selector
 */
export const selectPlayer = (state: RootState): PlayerState => state.player;

/**
 * Player health selector
 */
export const selectPlayerHealth = createSelector(
  [selectPlayer],
  (player) => player.health
);

/**
 * Player max health selector
 */
export const selectPlayerMaxHealth = createSelector(
  [selectPlayer],
  (player) => player.maxHealth
);

/**
 * Player mana selector
 */
export const selectPlayerMana = createSelector(
  [selectPlayer],
  (player) => player.mana
);

/**
 * Player max mana selector
 */
export const selectPlayerMaxMana = createSelector(
  [selectPlayer],
  (player) => player.maxMana
);

/**
 * Available attribute points selector
 */
export const selectAvailableAttributePoints = createSelector(
  [selectPlayer],
  (player) => player.availableAttributePoints
);

/**
 * Player alive status selector
 */
export const selectIsPlayerAlive = createSelector(
  [selectPlayer],
  (player) => player.isAlive
);

/**
 * Player resonance level selector
 */
export const selectResonanceLevel = createSelector(
  [selectPlayer],
  (player) => player.resonanceLevel
);

/**
 * Max trait slots selector
 */
export const selectMaxTraitSlots = createSelector(
  [selectPlayer],
  (player) => player.maxTraitSlots
);

/**
 * Permanent traits selector
 */
export const selectPermanentTraits = createSelector(
  [selectPlayer],
  (player) => player.permanentTraits
);

/**
 * Player attributes selector
 */
export const selectPlayerAttributes = createSelector(
  [selectPlayer],
  (player) => player.attributes
);

/**
 * Player total playtime selector
 */
export const selectTotalPlaytime = createSelector(
  [selectPlayer],
  (player) => player.totalPlaytime
);

/**
 * Combat stats selector for grouped combat-related statistics
 */
export const selectCombatStats = createSelector(
  [selectPlayer],
  (player) => ({
    attack: player.stats.attack,
    defense: player.stats.defense,
    speed: player.stats.speed,
    criticalChance: player.stats.criticalChance,
    criticalDamage: player.stats.criticalDamage
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
