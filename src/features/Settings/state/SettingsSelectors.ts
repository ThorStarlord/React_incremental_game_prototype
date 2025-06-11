import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { SettingsState, AudioSettings, GraphicsSettings, GameplaySettings, UISettings } from './SettingsTypes';

// Selector for the entire settings state
export const selectSettingsState = (state: RootState): SettingsState => state.settings;

export const selectSettings = selectSettingsState;

export const selectAudioSettings = createSelector(
  [selectSettingsState],
  (settings) => settings.audio
);

export const selectGraphicsSettings = createSelector(
  [selectSettingsState],
  (settings) => settings.graphics
);

export const selectGameplaySettings = createSelector(
  [selectSettingsState],
  (settings) => settings.gameplay
);

export const selectUISettings = createSelector(
  [selectSettingsState],
  (settings) => settings.ui
);

export const selectMasterVolume = createSelector(
  [selectAudioSettings],
  (audio) => audio.masterVolume
);

export const selectMusicVolume = createSelector(
  [selectAudioSettings],
  (audio) => audio.musicVolume
);

export const selectEffectsVolume = createSelector(
  [selectAudioSettings],
  (audio) => audio.effectsVolume
);

export const selectDarkMode = createSelector(
  [selectGraphicsSettings],
  (graphics) => graphics.darkMode
);

export const selectTheme = createSelector(
  [selectUISettings],
  (ui) => ui.theme
);

export const selectAutosaveEnabled = createSelector(
  [selectGameplaySettings],
  (gameplay) => gameplay.autosaveEnabled
);

export const selectAutosaveInterval = createSelector(
  [selectGameplaySettings],
  (gameplay) => gameplay.autosaveInterval
);

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
