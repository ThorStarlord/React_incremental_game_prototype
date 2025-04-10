/**
 * Redux Thunks for Meta-related async operations.
 * This could include actions like initializing metadata,
 * handling autosave timers that update metadata, etc.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { updateLastSaved } from './MetaSlice'; // Example import
// Assuming saveUtils is correctly located and createSave exists
import { createSave } from '../../../shared/utils/saveUtils';
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
