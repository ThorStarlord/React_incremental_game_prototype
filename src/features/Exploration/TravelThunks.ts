import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { setLocation } from '../Player/state/PlayerSlice';
import type { TravelResult } from './ExplorationTypes';
import {
  areLocationsDirectlyConnected,
  getLocationDefinition,
  resolveCanonicalLocationId,
} from './LocationDefinitions';

export const travelToLocationThunk = createAsyncThunk<
  TravelResult,
  string,
  { state: RootState; rejectValue: string }
>(
  'exploration/travelToLocation',
  async (destinationValue, { dispatch, getState, rejectWithValue }) => {
    const currentValue = getState().player.location;
    const fromLocationId = resolveCanonicalLocationId(currentValue);
    const toLocationId = resolveCanonicalLocationId(destinationValue);

    if (!fromLocationId) {
      return rejectWithValue(`Unknown current location: ${currentValue}`);
    }

    if (!toLocationId || !getLocationDefinition(toLocationId)) {
      return rejectWithValue(`Unknown destination: ${destinationValue}`);
    }

    if (!areLocationsDirectlyConnected(fromLocationId, toLocationId)) {
      return rejectWithValue(
        `No direct travel route from ${fromLocationId} to ${toLocationId}.`
      );
    }

    dispatch(setLocation(toLocationId));

    return {
      fromLocationId,
      toLocationId,
    };
  }
);
