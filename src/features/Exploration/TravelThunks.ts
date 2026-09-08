import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { gainGold, markRoutineFamiliarity, setLocation } from '../Player/state/PlayerSlice';
import { addNotification } from '../../shared/state/NotificationSlice';
import type { TravelResult } from './ExplorationTypes';
import {
  areLocationsDirectlyConnected,
  CITY_CENTER_LOCATION_ID,
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

/**
 * One-time active player experience that establishes Forge Assistance familiarity.
 * This is intentionally not an idle/manual farm: direct repeats reject after learning.
 */
export const practiceForgeAssistanceThunk = createAsyncThunk<
  { success: true; goldGained: number },
  void,
  { state: RootState; rejectValue: string }
>(
  'exploration/practiceForgeAssistance',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const currentLocationId = resolveCanonicalLocationId(state.player.location);

    if (currentLocationId !== CITY_CENTER_LOCATION_ID) {
      return rejectWithValue('Forge Assistance can only be practiced in the City Center.');
    }

    if (state.player.routineFamiliarity?.forge_assistance) {
      return rejectWithValue('Forge Assistance is already familiar.');
    }

    const goldGained = 5;
    dispatch(gainGold(goldGained));
    dispatch(markRoutineFamiliarity({
      routineId: 'forge_assistance',
      source: 'city_center_forge_assistance',
      learnedAt: Date.now(),
    }));
    dispatch(addNotification({
      type: 'success',
      message: `You practiced Forge Assistance in the City Center (+${goldGained} Gold). Copy delegation for this routine is now understood.`,
    }));

    return { success: true, goldGained };
  }
);
