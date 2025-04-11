/**
 * Redux Thunks for Meta-related async operations.
 * This could include actions like initializing metadata,
 * handling autosave timers that update metadata, etc.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { updateLastSaved, updateGameMetadata } from './MetaSlice'; // Example import
// Assuming saveUtils is correctly located and createSave exists
import { createSave, loadSavedGame } from '../../../shared/utils/saveUtils';
import { replaceState } from '../../../app/store';
// Assuming a NotificationsSlice exists for user feedback
// import { addNotification } from '../../Notifications/state/NotificationsSlice'; // Adjust path as needed

/**
 * Thunk to simulate updating the last saved timestamp after a save operation.
 */
export const recordSaveTimestampThunk = createAsyncThunk<
  number, // Return type on success (the timestamp)
  void,   // Argument type (none needed for this example)
  { state: RootState } // ThunkAPI config
>(
  'meta/recordSaveTimestamp',
  async (_, { dispatch }) => {
    const timestamp = Date.now();
    // Dispatch the action to update the timestamp in the MetaState
    dispatch(updateLastSaved(timestamp));
    // You might perform actual save operations here or in another thunk
    console.log(`Save timestamp recorded: ${timestamp}`);
    return timestamp;
  }
);

/**
 * Thunk to save the current game state.
 */
export const saveGameThunk = createAsyncThunk<
  // Return type on success
  { success: boolean; saveId: string | null },
  // Argument type: optional save name
  string | undefined,
  // ThunkAPI config
  { state: RootState; rejectValue: string }
>(
  'meta/saveGame',
  async (saveName, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      // Pass the entire state to createSave
      const saveId = createSave(state, saveName); // Pass optional saveName

      if (saveId) {
        const timestamp = Date.now();
        dispatch(updateLastSaved(timestamp));
        // Dispatch success notification (assuming addNotification exists)
        // dispatch(addNotification({ message: `Game saved successfully as "${saveName || saveId}"!`, type: 'success' }));
        console.log(`Game saved successfully with ID: ${saveId}`);
        return { success: true, saveId };
      } else {
        // Dispatch error notification
        // dispatch(addNotification({ message: 'Failed to save game.', type: 'error' }));
        console.error('Failed to save game.');
        // Use rejectWithValue for failure cases in async thunks
        return rejectWithValue('Failed to save game.');
      }
    } catch (error) {
      console.error('Error during save game thunk:', error);
      // Dispatch error notification
      // dispatch(addNotification({ message: 'An unexpected error occurred while saving.', type: 'error' }));
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  }
);

/**
 * Thunk to load a saved game state.
 */
export const loadGameThunk = createAsyncThunk<
  // Return type on success
  { success: boolean; saveId: string },
  // Argument type: save ID to load
  string,
  // ThunkAPI config
  { state: RootState; rejectValue: string }
>(
  'meta/loadGame',
  async (saveId, { dispatch, rejectWithValue }) => {
    try {
      console.log(`Attempting to load game with ID: ${saveId}`);
      // Await the result of the asynchronous loadSavedGame function
      const savedState = await loadSavedGame(saveId);

      if (!savedState) {
        console.error(`Failed to load game with ID: ${saveId}. Save not found or corrupted.`);
        // Dispatch error notification
        // dispatch(addNotification({ message: 'Failed to load game. Save not found or corrupted.', type: 'error' }));
        return rejectWithValue('Failed to load game. Save not found or corrupted.');
      }

      // Replace entire state with loaded state
      // savedState is now the actual state object, not a Promise
      dispatch(replaceState(savedState));

      // Update game metadata after loading and replacing state
      dispatch(updateGameMetadata({
        lastLoadedTimestamp: Date.now(),
        currentSaveId: saveId
      }));

      // Dispatch success notification
      // dispatch(addNotification({ message: 'Game loaded successfully!', type: 'success' }));
      console.log(`Game loaded successfully from save ID: ${saveId}`);

      return { success: true, saveId };
    } catch (error) {
      console.error('Error during load game thunk:', error);
      // Dispatch error notification
      // dispatch(addNotification({ message: 'An unexpected error occurred while loading the game.', type: 'error' }));
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred while loading the game.');
    }
  }
);

/**
 * Thunk to import a game from an external save code.
 */
export const importGameThunk = createAsyncThunk<
  // Return type on success
  { success: boolean; saveId: string },
  // Argument type: save code string
  string,
  // ThunkAPI config
  { state: RootState; rejectValue: string }
>(
  'meta/importGame',
  async (saveCode, { dispatch, rejectWithValue }) => {
    try {
      console.log('Attempting to import game from save code');
      let saveData: RootState | null = null; // Ensure saveData is typed correctly

      try {
        // Decode the save code (base64 decode and parse JSON)
        // Add type assertion for the parsed data
        saveData = JSON.parse(atob(saveCode)) as RootState;
      } catch (e) {
        console.error('Failed to parse import code:', e);
        return rejectWithValue('Invalid import code format. Please check your code and try again.');
      }

      // Perform more robust validation if necessary
      if (!saveData || typeof saveData !== 'object' || !saveData.player || !saveData.essence /* add other checks */) {
        return rejectWithValue('Invalid save data. Missing critical game state information.');
      }

      // Create a new save from the imported data and get its ID
      // Pass the validated saveData
      const saveId = createSave(saveData, `Imported_${Date.now()}`);

      if (!saveId) {
        return rejectWithValue('Failed to create save from imported data.');
      }

      // Replace entire state with imported state
      // Pass the validated saveData
      dispatch(replaceState(saveData));

      // Update game metadata after importing and replacing state
      dispatch(updateGameMetadata({
        lastLoadedTimestamp: Date.now(),
        currentSaveId: saveId,
        isImported: true
      }));

      // Dispatch success notification
      // dispatch(addNotification({ message: 'Game imported successfully!', type: 'success' }));
      console.log(`Game imported successfully and saved with ID: ${saveId}`);

      return { success: true, saveId };
    } catch (error) {
      console.error('Error during import game thunk:', error);
      // Dispatch error notification
      // dispatch(addNotification({ message: 'An unexpected error occurred during import.', type: 'error' }));
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred during import.');
    }
  }
);
