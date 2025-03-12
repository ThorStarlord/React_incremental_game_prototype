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
  resourceCollection: boolean; // Changed from resourceGain
  lowResources: boolean; // Added to match implementation
  newItems: boolean; // Added to match implementation
}

/**
 * Audio settings
 */
export interface AudioSettings {
  musicVolume: number;
  soundEffectsVolume: number;
  ambientVolume: number;
  uiSoundVolume: number; // Added to match implementation
  masterVolume: number; // Added to match implementation
  muteAll: boolean;
  combatSoundsEnabled: boolean; // Added to match type definition
}

/**
 * Gameplay settings
 */
export interface GameplaySettings {
  difficultyLevel: 'easy' | 'normal' | 'hard' | 'nightmare';
  autosaveInterval: number;
  relationshipDecayDisabled: boolean;
  autoResumeQuests: boolean; // Added to match implementation
  combatSpeed: number; // Added to match implementation
  confirmItemUse: boolean; // Added to match implementation
  confirmItemSell: boolean; // Added to match implementation
  autoEquipBetterItems: boolean; // Added to match type definition
  confirmBeforeSelling: boolean; // Added to match type definition
  showDamageNumbers: boolean; // Added to match type definition
}

/**
 * UI settings
 */
export interface UISettings {
  fontSize: 'small' | 'medium' | 'large';
  showToolTips: boolean; // Changed from showTooltips
  showTutorials: boolean; // Added to match implementation
  compactInventory: boolean;
  darkMode: boolean; // Changed from colorTheme
  showDamageNumbers: boolean; // Added to match implementation
  showCriticalHitEffects: boolean; // Added to match implementation
  simplifiedUI: boolean; // Added to match implementation
  minimapEnabled: boolean; // Added to match type definition
  hideCompletedQuests: boolean; // Added to match type definition
}

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  highContrastMode: boolean;
  reducedMotion: boolean; // Changed from reduceMotion
  largeText: boolean; // Added to match implementation
  screenReaderSupport: boolean; // Changed from screenReaderMode
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'; // Changed from colorBlindMode
  autoTargeting: boolean; // Added to match implementation
}

/**
 * Complete settings state
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
