import type { SettingsState } from '../../features/Settings/state/SettingsTypes';
import { APP_VERSION } from '../config/releaseVersion';

export interface StorageKeys {
  LAYOUT: string;
  SETTINGS: string;
  CURRENT_VERSION: string;
}

/**
 * Constants for storage keys to ensure consistency
 */
export const STORAGE_KEYS: StorageKeys = {
  LAYOUT: 'incrementalRPG_layout',
  SETTINGS: 'incrementalRPG_settings',
  CURRENT_VERSION: APP_VERSION
};
/**
 * Save UI layout configuration to local storage
 * @param {any} columnLayout - The layout configuration to save
 * @returns {boolean} - Whether the save was successful
 */
export type LayoutPersistence = Record<string, boolean | number | string>;

export const saveLayout = (columnLayout: LayoutPersistence): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAYOUT, JSON.stringify(columnLayout));
    return true;
  } catch (err) {
    console.error('Failed to save layout:', err);
    return false;
  }
};
/**
 * Load UI layout configuration from local storage
 * @returns {any|null} - The layout configuration or null if not found
 */
export const loadLayout = (): LayoutPersistence | null => {
  try {
    const serializedLayout = localStorage.getItem(STORAGE_KEYS.LAYOUT);
    if (!serializedLayout) {
      return null;
    }
    const parsed = JSON.parse(serializedLayout) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as LayoutPersistence;
  } catch (err) {
    console.error('Failed to load layout:', err);
    return null;
  }
};

/**
 * Save user settings to local storage
 * @param {any} settings - User settings to save
 * @returns {boolean} - Whether the save was successful
 */
export const saveSettings = (settings: Partial<SettingsState>): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error('Failed to save settings:', err);
    return false;
  }
};

/**
 * Load user settings from local storage
 * @returns {any|null} - User settings or null if not found
 */
export const loadSettings = (): Partial<SettingsState> | null => {
  try {
    const serializedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!serializedSettings) {
      return null;
    }
    const parsed = JSON.parse(serializedSettings) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as Partial<SettingsState>;
  } catch (err) {
    console.error('Failed to load settings:', err);
    return null;
  }
};
