/**
 * Type definitions for the Settings slice
 */

export interface AudioSettings {
  masterVolume: number; // 0-100
  musicVolume: number; // 0-100
  effectsVolume: number; // 0-100
  ambientVolume: number; // 0-100
  dialogueVolume: number; // 0-100
  muteWhenInactive: boolean;
}

export interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  particleEffects: boolean;
  animations: boolean;
  showFPS: boolean;
  darkMode: boolean;
}

export interface GameplaySettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  autosaveInterval: number; // Interval in minutes
  autosaveEnabled: boolean; // Explicitly track if autosave is enabled
  showTutorials: boolean;
  combatSpeed: number;
  notificationDuration: number; // Duration in seconds
}

export interface UISettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: string; // Theme identifier (e.g., 'dark', 'light', 'blue')
  showResourceNotifications: boolean;
  showLevelUpAnimations: boolean;
  compactInventory: boolean;
}

// Main Settings State structure
export interface SettingsState {
  audio: AudioSettings;
  graphics: GraphicsSettings;
  gameplay: GameplaySettings;
  ui: UISettings;
}

// Payload for updating a specific setting
export interface UpdateSettingPayload<T = any> {
  category: keyof SettingsState;
  setting: string; // Key within the category
  value: T;
}

// Payload for updating multiple settings within a category
export interface UpdateCategorySettingsPayload<T> {
  category: keyof SettingsState;
  settings: Partial<T>;
}

export type SettingsCategory = keyof SettingsState;

export interface SettingsValidation {
  category: SettingsCategory;
  field: string;
  isValid: boolean;
  errorMessage?: string;
}
