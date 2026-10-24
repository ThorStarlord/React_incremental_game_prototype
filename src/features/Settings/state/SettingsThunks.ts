import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
// Import SettingsState from SettingsTypes, not SettingsSlice
import { loadSettings } from './SettingsSlice';
import { SettingsState } from './SettingsTypes';
import { updateSetting } from './SettingsSlice';
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
  async (_, { dispatch, getState }) => {
    try {
      const loaded = loadFromStorage(); // Use your storage utility
      if (loaded) {
        dispatch(loadSettings(loaded)); // Dispatch action to update state
        return loaded;
      }
      // Migrate legacy standalone theme keys only when modern Settings were not
      // persisted. Once migrated, Redux Settings is the sole appearance authority.
      const legacyDark = localStorage.getItem('darkMode');
      const legacyFont = localStorage.getItem('fontSize');
      const legacyPrimary = localStorage.getItem('primaryColor');
      const legacySecondary = localStorage.getItem('secondaryColor');
      if (legacyDark !== null || legacyFont !== null || legacyPrimary || legacySecondary) {
        if (legacyDark !== null) {
          dispatch(updateSetting({ category: 'graphics', setting: 'darkMode', value: legacyDark === 'true' }));
        }
        if (legacyFont !== null && Number.isFinite(Number(legacyFont))) {
          const size = Number(legacyFont);
          dispatch(updateSetting({ category: 'ui', setting: 'fontSize', value: size > 1.05 ? 'large' : size < 0.95 ? 'small' : 'medium' }));
        }
        if (legacyPrimary && /^#[0-9a-fA-F]{6}$/.test(legacyPrimary)) {
          dispatch(updateSetting({ category: 'ui', setting: 'primaryColor', value: legacyPrimary }));
        }
        if (legacySecondary && /^#[0-9a-fA-F]{6}$/.test(legacySecondary)) {
          dispatch(updateSetting({ category: 'ui', setting: 'secondaryColor', value: legacySecondary }));
        }
        saveToStorage((getState() as RootState).settings);
      }
      return null; // No modern settings found in storage
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
