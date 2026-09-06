/**
 * Redux Thunks for Meta-related async operations.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { updateLastSaved, updateGameMetadata } from './MetaSlice';
import {
  createSave,
  createSaveFromPayload,
  decodeSavePayloadFromBase64,
  loadSavedGameWithMigration,
} from '../../../shared/utils/saveUtils';

export const recordSaveTimestampThunk = createAsyncThunk<
  number,
  void,
  { state: RootState }
>(
  'meta/recordSaveTimestamp',
  async (_, { dispatch }) => {
    const timestamp = Date.now();
    dispatch(updateLastSaved(timestamp));
    console.log(`Save timestamp recorded: ${timestamp}`);
    return timestamp;
  }
);

export const saveGameThunk = createAsyncThunk<
  { success: boolean; saveId: string | null },
  string | undefined,
  { state: RootState; rejectValue: string }
>(
  'meta/saveGame',
  async (saveName, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const saveId = createSave(state, saveName);

      if (saveId) {
        const timestamp = Date.now();
        dispatch(updateLastSaved(timestamp));
        console.log(`Game saved successfully with ID: ${saveId}`);
        return { success: true, saveId };
      }

      console.error('Failed to save game.');
      return rejectWithValue('Failed to save game.');
    } catch (error) {
      console.error('Error during save game thunk:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  }
);

export const loadGameThunk = createAsyncThunk<
  { success: boolean; saveId: string },
  string,
  { state: RootState; rejectValue: string }
>(
  'meta/loadGame',
  async (saveId, { dispatch, rejectWithValue }) => {
    try {
      console.log(`Attempting to load game with ID: ${saveId}`);
      const loaded = await loadSavedGameWithMigration(saveId);

      if (!loaded) {
        console.error(`Failed to load game with ID: ${saveId}. Save not found or corrupted.`);
        return rejectWithValue('Failed to load game. Save not found or corrupted.');
      }

      if (loaded.migration.appliedMigrations.length > 0) {
        console.info(
          `Save schema migrated v${loaded.migration.sourceVersion} -> v${loaded.migration.targetVersion}:`,
          loaded.migration.appliedMigrations.join(', ')
        );
      }

      // State replacement remains the responsibility of the calling surface.
      dispatch(updateGameMetadata({
        lastLoadedTimestamp: Date.now(),
        currentSaveId: saveId
      }));

      return { success: true, saveId };
    } catch (error) {
      console.error('Error during load game thunk:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred while loading the game.');
    }
  }
);

export const importGameThunk = createAsyncThunk<
  { success: boolean; saveId: string; importedState?: RootState },
  string,
  { state: RootState; rejectValue: string }
>(
  'meta/importGame',
  async (saveCode, { dispatch, rejectWithValue }) => {
    try {
      console.log('Attempting to import game from save code');
      let payload: unknown;

      try {
        payload = decodeSavePayloadFromBase64(saveCode);
      } catch (error) {
        console.error('Failed to parse import code:', error);
        return rejectWithValue('Invalid import code format. Please check your code and try again.');
      }

      const imported = createSaveFromPayload(payload, `Imported_${Date.now()}`);
      if (!imported) {
        return rejectWithValue('Invalid or unsupported save data.');
      }

      dispatch(updateGameMetadata({
        lastLoadedTimestamp: Date.now(),
        currentSaveId: imported.saveId,
        isImported: true
      }));

      console.log(`Game imported successfully and saved with ID: ${imported.saveId}`);

      return {
        success: true,
        saveId: imported.saveId,
        importedState: imported.migration.envelope.state,
      };
    } catch (error) {
      console.error('Error during import game thunk:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred during import.');
    }
  }
);
