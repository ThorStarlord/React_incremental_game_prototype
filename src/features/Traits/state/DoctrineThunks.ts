import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  clearDoctrineFocus,
  equipTrait,
  setDoctrineFocus,
} from '../../Player/state/PlayerSlice';
import {
  DOCTRINE_DEFINITIONS,
  DOCTRINE_FOCUS_CAPACITY,
  type DoctrineId,
} from './DoctrineDefinitions';

const normalizeFocus = (traitIds: readonly string[]): string[] =>
  Array.from(new Set(traitIds));

const validateFocus = (
  state: RootState,
  traitIds: readonly string[]
): string | null => {
  const uniqueTraitIds = normalizeFocus(traitIds);

  if (uniqueTraitIds.length > DOCTRINE_FOCUS_CAPACITY) {
    return `Doctrine focus supports at most ${DOCTRINE_FOCUS_CAPACITY} Traits.`;
  }

  const assimilated = new Set(state.player.permanentTraits);
  const missingAssimilated = uniqueTraitIds.filter(traitId => !assimilated.has(traitId));

  if (missingAssimilated.length > 0) {
    return `Cannot foreground unassimilated Traits: ${missingAssimilated.join(', ')}.`;
  }

  const expressed = new Set(
    state.player.traitSlots
      .map(slot => slot.traitId)
      .filter((traitId): traitId is string => Boolean(traitId))
  );
  const missingExpressed = uniqueTraitIds.filter(traitId => !expressed.has(traitId));
  if (missingExpressed.length > 0) {
    return `Cannot foreground suppressed Traits: ${missingExpressed.join(', ')}.`;
  }

  return null;
};

export const setDoctrineFocusThunk = createAsyncThunk<
  string[],
  string[],
  { state: RootState; rejectValue: string }
>(
  'traits/setDoctrineFocus',
  async (traitIds, { dispatch, getState, rejectWithValue }) => {
    const normalized = normalizeFocus(traitIds);
    const error = validateFocus(getState(), normalized);

    if (error) {
      return rejectWithValue(error);
    }

    dispatch(setDoctrineFocus(normalized));
    return normalized;
  }
);

export const activateDoctrineThunk = createAsyncThunk<
  DoctrineId,
  DoctrineId,
  { state: RootState; rejectValue: string }
>(
  'traits/activateDoctrine',
  async (doctrineId, { dispatch, getState, rejectWithValue }) => {
    const definition = DOCTRINE_DEFINITIONS[doctrineId];
    if (!definition) {
      return rejectWithValue(`Unknown doctrine: ${String(doctrineId)}.`);
    }

    const requiredTraits = [...definition.requiredPermanentTraitIds];
    let state = getState();

    const assimilated = new Set(state.player.permanentTraits);
    const missingAssimilated = requiredTraits.filter(traitId => !assimilated.has(traitId));
    if (missingAssimilated.length > 0) {
      return rejectWithValue(
        `Cannot adopt doctrine without assimilated Traits: ${missingAssimilated.join(', ')}.`
      );
    }

    const unlockedSlots = state.player.traitSlots.filter(slot => !slot.isLocked);
    if (requiredTraits.length > unlockedSlots.length) {
      return rejectWithValue(
        `This doctrine requires ${requiredTraits.length} expression slots, but only ${unlockedSlots.length} are unlocked.`
      );
    }

    // Adopting/switching doctrine is itself an explicit Player expression
    // decision. Deterministically place the doctrine pair into the first
    // unlocked slots; equipTrait handles duplicate removal and replacement.
    requiredTraits.forEach((traitId, index) => {
      dispatch(equipTrait({ traitId, slotIndex: unlockedSlots[index].slotIndex }));
    });

    state = getState();
    const error = validateFocus(state, requiredTraits);
    if (error) {
      return rejectWithValue(error);
    }

    dispatch(setDoctrineFocus(requiredTraits));
    return doctrineId;
  }
);

export const clearDoctrineFocusThunk = createAsyncThunk<void, void>(
  'traits/clearDoctrineFocus',
  async (_, { dispatch }) => {
    dispatch(clearDoctrineFocus());
  }
);
