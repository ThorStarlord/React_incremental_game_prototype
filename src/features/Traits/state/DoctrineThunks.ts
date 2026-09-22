import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  clearDoctrineFocus,
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
    return `Doctrine focus supports at most ${DOCTRINE_FOCUS_CAPACITY} permanent Traits.`;
  }

  const permanent = new Set(state.player.permanentTraits);
  const missing = uniqueTraitIds.filter(traitId => !permanent.has(traitId));

  if (missing.length > 0) {
    return `Cannot foreground unlearned Traits: ${missing.join(', ')}.`;
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
    const error = validateFocus(getState(), requiredTraits);

    if (error) {
      return rejectWithValue(error);
    }

    dispatch(setDoctrineFocus(requiredTraits));
    return doctrineId;
  }
);

export const clearDoctrineFocusThunk = createAsyncThunk(
  'traits/clearDoctrineFocus',
  async (_, { dispatch }) => {
    dispatch(clearDoctrineFocus());
  }
);
