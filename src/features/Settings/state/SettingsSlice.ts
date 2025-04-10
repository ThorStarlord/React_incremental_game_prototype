import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SettingsState,
  AudioSettings,
  GraphicsSettings,
  GameplaySettings,
  UISettings,
  UpdateSettingPayload,
  UpdateCategorySettingsPayload
} from './SettingsTypes';

// Define the initial state for settings
const initialState: SettingsState = {
  audio: {
    masterVolume: 80,
    musicVolume: 70,
    effectsVolume: 80,
    ambientVolume: 60,
    dialogueVolume: 100,
    muteWhenInactive: true,
  },
  graphics: {
    quality: 'high',
    particleEffects: true,
    animations: true,
    showFPS: false,
    darkMode: false, // Default to light mode
  },
  gameplay: {
    difficulty: 'normal',
    autosaveInterval: 5, // Default 5 minutes
    autosaveEnabled: true, // Default enabled
    showTutorials: true,
    combatSpeed: 1,
    notificationDuration: 3, // Default 3 seconds
  },
  ui: {
    fontSize: 'medium',
    theme: 'default', // Default theme identifier
    showResourceNotifications: true,
    showLevelUpAnimations: true,
    compactInventory: false,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    /**
     * Updates a single setting within a specific category.
     */
    updateSetting: (state, action: PayloadAction<UpdateSettingPayload>) => {
      const { category, setting, value } = action.payload;
      if (state[category] && setting in state[category]) {
        // Type assertion to allow dynamic assignment
        (state[category] as any)[setting] = value;
      } else {
        console.warn(`Setting ${setting} not found in category ${category}`);
      }
    },

    /**
     * Updates multiple settings within a specific category.
     */
    updateCategorySettings: (state, action: PayloadAction<UpdateCategorySettingsPayload<any>>) => {
      const { category, settings } = action.payload;
      // Ensure the category exists before proceeding
      if (!state[category]) {
        console.warn(`Category ${category} not found in settings`);
        return;
      }

      // Use a switch statement for type safety
      switch (category) {
        case 'audio':
          // Ensure settings is compatible with Partial<AudioSettings>
          state.audio = { ...state.audio, ...(settings as Partial<AudioSettings>) };
          break;
        case 'graphics':
          state.graphics = { ...state.graphics, ...(settings as Partial<GraphicsSettings>) };
          break;
        case 'gameplay':
          state.gameplay = { ...state.gameplay, ...(settings as Partial<GameplaySettings>) };
          break;
        case 'ui':
          state.ui = { ...state.ui, ...(settings as Partial<UISettings>) };
          break;
        default:
          // This case should ideally not be reached if category keys are handled correctly
          console.warn(`Unhandled category update: ${category}`);
      }
    },

    /**
     * Resets all settings to their initial default values.
     */
    resetSettings: (state) => {
      // Re-assign the initial state to reset
      Object.assign(state, initialState);
    },

    /**
     * Loads settings, merging with initial state to ensure all keys exist.
     */
    loadSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      const loaded = action.payload;
      // Iterate over the keys of the initial state to ensure all categories are handled
      (Object.keys(initialState) as Array<keyof SettingsState>).forEach((category) => {
        const loadedCategory = loaded[category];
        const initialCategory = initialState[category];

        // Use type assertions within each case for the specific category type
        switch (category) {
          case 'audio':
            // Explicitly type initialCategory and loadedCategory before spreading
            state.audio = {
              ...(initialCategory as AudioSettings),
              ...(loadedCategory as Partial<AudioSettings> ?? {})
            };
            break;
          case 'graphics':
            state.graphics = {
              ...(initialCategory as GraphicsSettings),
              ...(loadedCategory as Partial<GraphicsSettings> ?? {})
            };
            break;
          case 'gameplay':
            state.gameplay = {
              ...(initialCategory as GameplaySettings),
              ...(loadedCategory as Partial<GameplaySettings> ?? {})
            };
            break;
          case 'ui':
            state.ui = {
              ...(initialCategory as UISettings),
              ...(loadedCategory as Partial<UISettings> ?? {})
            };
            break;
          default:
            // If new categories are added, they need to be handled here
            console.warn(`Unhandled category during load: ${category}`);
            // Assign initial state if no loaded data exists for safety
            if (!loadedCategory) {
               (state as any)[category] = { ...initialCategory };
            } else {
               // This fallback is less type-safe, avoid if possible
               (state as any)[category] = { ...initialCategory, ...loadedCategory };
            }
        }
      });
    },
  },
  // Add extraReducers here if needed for thunks (e.g., loading settings)
});

export const {
  updateSetting,
  updateCategorySettings,
  resetSettings,
  loadSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
