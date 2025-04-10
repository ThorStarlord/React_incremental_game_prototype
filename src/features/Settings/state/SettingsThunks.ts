import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
// Import SettingsState from SettingsTypes, not SettingsSlice
import { loadSettings } from './SettingsSlice';
import { SettingsState } from './SettingsTypes';
// Assuming you have storage utility functions
import { saveSettings as saveToStorage, loadSettings as loadFromStorage } from '../../../shared/utils/storage';

/**
 * Thunk to load settings from persistent storage (e.g., localStorage).
 */
export const loadSettingsThunk = createAsyncThunk<
  Partial<SettingsState> | null, // Return type on success
  void,                          // Argument type
  { state: RootState }           // ThunkAPI config
>(
  'settings/loadFromStorage',
  async (_, { dispatch }) => {
    try {
      const loaded = loadFromStorage(); // Use your storage utility
      if (loaded) {
        dispatch(loadSettings(loaded)); // Dispatch action to update state
        return loaded;
      }
      return null; // No settings found in storage
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Optionally dispatch an error notification
      return null; // Indicate failure or return default
    }
  }
);

/**
 * Thunk to save the current settings state to persistent storage.
 */
export const saveSettingsThunk = createAsyncThunk<
  boolean, // Return type on success (true if saved)
  void,    // Argument type
  { state: RootState } // ThunkAPI config
>(
  'settings/saveToStorage',
  async (_, { getState }) => {
    try {
      const currentSettings = getState().settings;
      const success = saveToStorage(currentSettings); // Use your storage utility
      if (success) {
        console.log('Settings saved successfully.');
        // Optionally dispatch a success notification
      } else {
        console.warn('Failed to save settings to storage.');
      }
      return success;
    } catch (error) {
      console.error('Error saving settings:', error);
      // Optionally dispatch an error notification
      return false; // Indicate failure
    }
  }
);
