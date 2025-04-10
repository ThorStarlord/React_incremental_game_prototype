/**
 * Type definitions for the Settings slice
 */

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  ambientVolume: number;
  dialogueVolume: number;
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
  // Add other categories as needed
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
