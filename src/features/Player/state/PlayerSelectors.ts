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
 * FIXED: Changed player.stats.property to player.property
 */
export const selectCombatStats = createSelector(
  [selectPlayer],
  (player) => ({
    attack: player.attack,
    defense: player.defense,
    speed: player.speed,
    criticalChance: player.criticalChance,
    criticalDamage: player.criticalDamage
  })
);

/**
 * Performance stats selector for progression and advancement metrics
 * FIXED: Changed player.stats.property to player.property and added availableSkillPoints
 */
export const selectPerformanceStats = createSelector(
  [selectPlayer],
  (player) => ({
    totalPlaytime: player.totalPlaytime,
    availableAttributePoints: player.availableAttributePoints,
    availableSkillPoints: player.availableSkillPoints,
    isAlive: player.isAlive,
    powerLevel: Math.floor(
      player.attack +
      player.defense +
      player.maxHealth / 10 +
      player.maxMana / 5
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

// REMOVED DUPLICATE: A second selectPermanentTraits was here.

export const selectAvailableTraitSlots = createSelector(
  [selectPlayerTraitSlots],
  (traitSlots) => traitSlots.filter(slot => !slot.isLocked && slot.traitId === null).length
);

export const selectUsedTraitSlots = createSelector(
  [selectPlayerTraitSlots],
  (traitSlots) => traitSlots.filter(slot => slot.traitId !== null).length
);

// REMOVED DUPLICATE: A second selectMaxTraitSlots was here.

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