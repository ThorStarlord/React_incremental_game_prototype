/**
 * Initial state configuration for game settings
 */

import { 
  SettingsState, 
  NotificationSettings, 
  AudioSettings, 
  GameplaySettings,
  UISettings,
  AccessibilitySettings
} from '../types/SettingsGameStateTypes';

/**
 * Default notification settings
 */
const notificationSettings: NotificationSettings = {
  combatResults: true,
  levelUp: true,
  questUpdates: true,
  lootDrops: true,
  achievements: true,
  resourceCollection: true,
  lowResources: true,
  newItems: true
};

/**
 * Default audio settings
 */
const audioSettings: AudioSettings = {
  musicVolume: 0.5,
  soundEffectsVolume: 0.7,
  ambientVolume: 0.3,
  uiSoundVolume: 0.5,
  masterVolume: 0.8,
  muteAll: false
};

/**
 * Default gameplay settings
 */
const gameplaySettings: GameplaySettings = {
  difficultyLevel: 'normal',
  autosaveInterval: 60, // in seconds
  relationshipDecayDisabled: false,
  autoResumeQuests: true,
  combatSpeed: 1.0,
  confirmItemUse: true,
  confirmItemSell: true
};

/**
 * Default UI settings
 */
const uiSettings: UISettings = {
  fontSize: 'medium',
  showToolTips: true,
  showTutorials: true,
  compactInventory: false,
  darkMode: false,
  showDamageNumbers: true,
  showCriticalHitEffects: true,
  simplifiedUI: false
};

/**
 * Default accessibility settings
 */
const accessibilitySettings: AccessibilitySettings = {
  highContrastMode: false,
  reducedMotion: false,
  largeText: false,
  screenReaderSupport: false,
  colorblindMode: 'none',
  autoTargeting: false
};

/**
 * Initial state for game settings
 */
const settingsInitialState: SettingsState = {
  notifications: notificationSettings,
  audio: audioSettings,
  gameplay: gameplaySettings,
  ui: uiSettings,
  accessibility: accessibilitySettings
};

export default settingsInitialState;
