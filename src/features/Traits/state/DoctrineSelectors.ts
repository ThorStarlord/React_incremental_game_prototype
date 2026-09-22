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
    selectDoctrineFocusTraitIds,
  ],
  (permanentTraitIds, foregroundedTraitIds): DoctrineId[] => {
    const learned = new Set(permanentTraitIds);
    const foregrounded = new Set(foregroundedTraitIds);

    return (Object.keys(DOCTRINE_DEFINITIONS) as DoctrineId[]).filter(
      doctrineId =>
        DOCTRINE_DEFINITIONS[doctrineId].requiredPermanentTraitIds.every(
          traitId => learned.has(traitId) && foregrounded.has(traitId)
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

  const learned = new Set(state.player.permanentTraits);
  const foregrounded = new Set(
    state.player.doctrineFocus?.foregroundedPermanentTraitIds ?? []
  );

  return definition.requiredPermanentTraitIds.every(
    traitId => learned.has(traitId) && foregrounded.has(traitId)
  );
};
