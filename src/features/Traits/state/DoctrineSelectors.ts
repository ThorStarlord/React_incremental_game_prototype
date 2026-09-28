import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  DOCTRINE_DEFINITIONS,
  type DoctrineId,
} from './DoctrineDefinitions';

const EMPTY_DOCTRINE_FOCUS: readonly string[] = [];

export const selectDoctrineFocusTraitIds = (
  state: RootState
): readonly string[] =>
  state.player.doctrineFocus?.foregroundedPermanentTraitIds ??
  EMPTY_DOCTRINE_FOCUS;

export const selectActiveDoctrineIds = createSelector(
  [
    (state: RootState) => state.player.permanentTraits,
    (state: RootState) => state.player.traitSlots
      .map(slot => slot.traitId)
      .filter((traitId): traitId is string => Boolean(traitId)),
    selectDoctrineFocusTraitIds,
  ],
  (assimilatedTraitIds, expressedTraitIds, foregroundedTraitIds): DoctrineId[] => {
    const assimilated = new Set(assimilatedTraitIds);
    const expressed = new Set(expressedTraitIds);
    const foregrounded = new Set(foregroundedTraitIds);

    return (Object.keys(DOCTRINE_DEFINITIONS) as DoctrineId[]).filter(
      doctrineId =>
        DOCTRINE_DEFINITIONS[doctrineId].requiredPermanentTraitIds.every(
          traitId =>
            assimilated.has(traitId) &&
            expressed.has(traitId) &&
            foregrounded.has(traitId)
        )
    );
  }
);

export const selectIsDoctrineActive = (
  state: RootState,
  doctrineId: DoctrineId
): boolean => {
  const definition = DOCTRINE_DEFINITIONS[doctrineId];
  if (!definition) return false;

  const assimilated = new Set(state.player.permanentTraits);
  const expressed = new Set(
    state.player.traitSlots
      .map(slot => slot.traitId)
      .filter((traitId): traitId is string => Boolean(traitId))
  );
  const foregrounded = new Set(
    state.player.doctrineFocus?.foregroundedPermanentTraitIds ?? []
  );

  return definition.requiredPermanentTraitIds.every(
    traitId =>
      assimilated.has(traitId) &&
      expressed.has(traitId) &&
      foregrounded.has(traitId)
  );
};
