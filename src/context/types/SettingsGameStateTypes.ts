/**
 * Type definitions for game settings
 */

/**
 * Notification settings
 */
export interface NotificationSettings {
  combatResults: boolean;
  levelUp: boolean;
  questUpdates: boolean;
  lootDrops: boolean;
  achievements: boolean;
  resourceGain: boolean;
}

/**
 * Audio settings
 */
export interface AudioSettings {
  musicVolume: number;
  soundEffectsVolume: number;
  ambientVolume: number;
  muteAll: boolean;
  combatSoundsEnabled: boolean;
}

/**
 * Gameplay settings
 */
export interface GameplaySettings {
  difficultyLevel: 'easy' | 'normal' | 'hard' | 'nightmare';
  autosaveInterval: number; // in seconds
  relationshipDecayDisabled?: boolean; // Whether NPC relationships should decay over time
  autoEquipBetterItems?: boolean;
  confirmBeforeSelling?: boolean;
  showDamageNumbers?: boolean;
}

/**
 * User interface settings
 */
export interface UISettings {
  fontSize: 'small' | 'medium' | 'large';
  colorTheme: 'light' | 'dark' | 'system';
  compactInventory: boolean;
  showTooltips: boolean;
  minimapEnabled: boolean;
  hideCompletedQuests: boolean;
}

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  highContrastMode: boolean;
  reduceMotion: boolean;
  screenReaderMode: boolean;
  textToSpeech: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

/**
 * All game settings
 */
export interface SettingsState {
  notifications: NotificationSettings;
  audio: AudioSettings;
  gameplay: GameplaySettings;
  ui: UISettings;
  accessibility: AccessibilitySettings;
}

/**
 * Setting change event structure
 */
export interface SettingChangeEvent {
  category: keyof SettingsState;
  setting: string;
  value: any;
  previousValue: any;
}

/**
 * Settings profile for saving/loading different configurations
 */
export interface SettingsProfile {
  id: string;
  name: string;
  settings: SettingsState;
  createdAt: string; // ISO date string
  lastModified: string; // ISO date string
}
