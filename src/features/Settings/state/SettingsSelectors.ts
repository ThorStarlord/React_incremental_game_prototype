import { RootState } from '../../../app/store';
import { SettingsState, AudioSettings, GraphicsSettings, GameplaySettings, UISettings } from './SettingsTypes';

// Selector for the entire settings state
export const selectSettings = (state: RootState): SettingsState => state.settings;

// Selectors for specific categories
export const selectAudioSettings = (state: RootState): AudioSettings => state.settings.audio;
export const selectGraphicsSettings = (state: RootState): GraphicsSettings => state.settings.graphics;
export const selectGameplaySettings = (state: RootState): GameplaySettings => state.settings.gameplay;
export const selectUISettings = (state: RootState): UISettings => state.settings.ui;

// --- Gameplay Selectors ---

/**
 * Selects the autosave interval in minutes from gameplay settings.
 * Provides a default value (5) if the setting is not found or invalid.
 */
export const selectAutosaveInterval = (state: RootState): number => {
  const interval = state.settings.gameplay?.autosaveInterval;
  // Ensure a valid number, default to 5 if undefined, null, or <= 0
  return (typeof interval === 'number' && interval > 0) ? interval : 5;
};

/**
 * Selects whether autosave is enabled from gameplay settings.
 * Provides a default value (true) if the setting is not found.
 */
export const selectAutosaveEnabled = (state: RootState): boolean => {
  // Default to true if not explicitly set to false
  return state.settings.gameplay?.autosaveEnabled !== false;
};

export const selectDifficulty = (state: RootState): GameplaySettings['difficulty'] => {
  return state.settings.gameplay?.difficulty ?? 'normal';
};

// --- Graphics Selectors ---

export const selectIsDarkMode = (state: RootState): boolean => {
  return state.settings.graphics?.darkMode ?? false;
};

export const selectGraphicsQuality = (state: RootState): GraphicsSettings['quality'] => {
  return state.settings.graphics?.quality ?? 'high';
};

// --- Audio Selectors ---

export const selectMasterVolume = (state: RootState): number => {
  return state.settings.audio?.masterVolume ?? 80;
};

// --- UI Selectors ---

export const selectTheme = (state: RootState): string => {
  return state.settings.ui?.theme ?? 'default';
};

export const selectFontSize = (state: RootState): UISettings['fontSize'] => {
  return state.settings.ui?.fontSize ?? 'medium';
};
