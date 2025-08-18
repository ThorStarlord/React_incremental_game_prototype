/**
 * @file CopySelectors.ts
 * @description Selectors for the Copies feature slice.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { CopiesState, Copy } from './CopyTypes';
import { COPY_SYSTEM } from '../../../constants/gameConstants';
import { isQualifyingForEssenceBonus } from '../utils/copyUtils';

/** Root selector for the Copy slice. */
const selectCopiesState = (state: RootState): CopiesState => state.copy;

/**
 * Select all Copy entities as an array (unordered).
 */
export const selectAllCopies = createSelector(
  [selectCopiesState],
  (copiesState) => Object.values(copiesState.copies)
);

/**
 * Select a Copy by ID or null if it doesn't exist.
 */
export const selectCopyById = createSelector(
  [
    selectCopiesState,
    (state: RootState, copyId: string) => copyId,
  ],
  (copiesState, copyId) => copiesState.copies[copyId] || null
);

/** Select loading flag for async Copy operations. */
export const selectCopiesLoading = createSelector(
    [selectCopiesState],
    (copiesState) => copiesState.isLoading
);

/** Select last error string for Copy operations (or null). */
export const selectCopiesError = createSelector(
    [selectCopiesState],
    (copiesState) => copiesState.error
);

/** Internal: all copies array (non-memoized helper). */
const _allCopies = (state: RootState) => Object.values(state.copy.copies);

/** Select number of copies that qualify for the essence bonus. */
export const selectQualifyingCopyCount = createSelector([_allCopies], (copies) =>
  copies.reduce((acc, c) => acc + (c.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD && c.loyalty > COPY_SYSTEM.LOYALTY_THRESHOLD ? 1 : 0), 0)
);

/** Segmented lists for UI tabs (mature, growing, low loyalty). */
export const selectCopySegments = createSelector([_allCopies], (copies) => {
  const mature: typeof copies = [];
  const growing: typeof copies = [];
  const lowLoyalty: typeof copies = [];
  for (const c of copies) {
    if (c.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD) mature.push(c); else growing.push(c);
    if (c.loyalty <= COPY_SYSTEM.LOYALTY_THRESHOLD) lowLoyalty.push(c);
  }
  return { mature, growing, lowLoyalty };
});

/** Select trait slots for a given Copy ID (or empty array). */
export const selectCopyTraitSlots = createSelector(
  [selectCopyById],
  (copy): NonNullable<Copy['traitSlots']> => copy?.traitSlots ?? []
);

/** Select shared trait IDs for a Copy (from slots). */
export const selectCopySharedTraitIds = createSelector([selectCopyTraitSlots], (slots) =>
  slots.map(s => s.traitId).filter((id): id is string => !!id)
);

/** All trait IDs affecting a Copy (inherited + shared). */
export const selectCopyAllTraitIds = createSelector(
  [selectCopyById, selectCopySharedTraitIds],
  (copy, shared) => ([...(copy?.inheritedTraits ?? []), ...shared])
);

/** Select all trait IDs affecting a Copy (inherited + shared). */
export const selectCopyTraitIds = createSelector(
  [
    (state: RootState, copyId: string) => state.copy.copies[copyId] || null,
  ],
  (copy) => {
    if (!copy) return [] as string[];
    const shared = (copy.traitSlots ?? [])
      .map(s => s.traitId)
      .filter((id): id is string => !!id);
    return [...copy.inheritedTraits, ...shared];
  }
);

/** Select Copy's trait slots with lock status for rendering. */
// Note: unified above as selectCopyTraitSlots(copyId) using selectCopyById

/**
 * Select effective trait objects for a Copy (resolved from global trait catalog).
 * Returns an array of trait definitions in the order of IDs from selectCopyAllTraitIds.
 */
export const selectCopyEffectiveTraits = createSelector(
  [
    (state: RootState) => state.traits.traits as Record<string, any>,
    selectCopyAllTraitIds,
  ],
  (traitsById, ids) => ids.map((id) => traitsById[id]).filter((t) => !!t)
);

/** Effective trait metadata including source (inherited/shared) and optional slotIndex for shared. */
export const selectCopyEffectiveTraitsWithSource = createSelector(
  [
    (state: RootState) => state.traits.traits as Record<string, any>,
    selectCopyById,
  ],
  (traitsById, copy) => {
    if (!copy) return [] as Array<{ trait: any; source: 'inherited' | 'shared'; slotIndex?: number }>;
    const results: Array<{ trait: any; source: 'inherited' | 'shared'; slotIndex?: number }> = [];
    const inheritedSet = new Set(copy.inheritedTraits ?? []);
    for (const id of copy.inheritedTraits ?? []) {
      const trait = traitsById[id];
      if (trait) results.push({ trait, source: 'inherited' });
    }
    for (const slot of copy.traitSlots ?? []) {
      if (!slot.traitId) continue;
      if (inheritedSet.has(slot.traitId)) continue; // avoid duplicates
      const trait = traitsById[slot.traitId];
      if (trait) results.push({ trait, source: 'shared', slotIndex: slot.slotIndex });
    }
    return results;
  }
);

/** Number of unlocked empty trait slots available on a Copy. */
export const selectCopyUnlockedEmptySlotCount = createSelector([selectCopyById], (copy) => {
  if (!copy) return 0;
  return (copy.traitSlots ?? []).filter((s) => !s.isLocked && !s.traitId).length;
});

/**
 * Eligible player trait IDs that could be shared to this Copy now.
 * Rules: player has it equipped (non-permanent) and Copy doesn't already have it (inherited/shared).
 */
export const selectCopyEligibleShareTraitIds = createSelector(
  [
    (state: RootState, copyId: string) => state.copy.copies[copyId] || null,
    (state: RootState) => state.player.traitSlots,
    (state: RootState) => state.player.permanentTraits,
  ],
  (copy, playerSlots, permanent) => {
    if (!copy) return [] as string[];
    const equipped = playerSlots.map(s => s.traitId).filter((id): id is string => !!id);
    const already = new Set([...(copy.inheritedTraits ?? []), ...((copy.traitSlots ?? []).map(s => s.traitId).filter(Boolean) as string[])]);
    return equipped.filter(id => !permanent.includes(id) && !already.has(id));
  }
);

/** Aggregate context to compute per-trait share eligibility reasons in UI. */
export const selectCopyShareEligibilityContext = createSelector(
  [
    (state: RootState, copyId: string) => state.copy.copies[copyId] || null,
    (state: RootState) => state.player.traitSlots,
    (state: RootState) => state.player.permanentTraits,
  ],
  (copy, playerSlots, permanent) => {
    const equipped = playerSlots.map(s => s.traitId).filter((id): id is string => !!id);
    const already = new Set<string>([
      ...((copy?.inheritedTraits ?? []) as string[]),
      ...(((copy?.traitSlots ?? []).map(s => s.traitId).filter(Boolean) as string[])),
    ]);
    const emptySlots = (copy?.traitSlots ?? []).filter(s => !s.isLocked && !s.traitId).length;
    return { equipped, permanent, already, emptySlots };
  }
);

/** Copy share preferences map (default empty object). */
export const selectCopySharePreferences = createSelector(
  [selectCopyById],
  (copy) => copy?.sharePreferences ?? {}
);

/** Progress summary for a Copy. */
export const selectCopyProgress = createSelector(
  [selectCopyById],
  (copy) => copy ? { maturity: copy.maturity, loyalty: copy.loyalty } : { maturity: 0, loyalty: 0 }
);

/** All qualifying copies as an array. */
export const selectQualifyingCopies = createSelector([_allCopies], (copies) => copies.filter(isQualifyingForEssenceBonus));
