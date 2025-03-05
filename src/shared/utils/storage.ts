/**
 * Type definition for storage keys
 */
export interface StorageKeys {
  SAVE_DATA: string;
  SAVE_BACKUP: string;
  SAVE_TIMESTAMP: string;
  LAYOUT: string;
  SETTINGS: string;
  CURRENT_VERSION: string;
}

/**
 * Interface for save data structure
 */
interface SaveData {
  version: string;
  timestamp: number;
  data: any; // Game state - could be more specifically typed if structure is known
}

/**
 * Interface for save information
 */
interface SaveInfo {
  timestamp: number | null;
  version: string;
  hasBackup: boolean;
}

/**
 * Constants for storage keys to ensure consistency
 */
export const STORAGE_KEYS: StorageKeys = {
  SAVE_DATA: 'incrementalRPG_saveData',
  SAVE_BACKUP: 'incrementalRPG_saveBackup',
  SAVE_TIMESTAMP: 'incrementalRPG_timestamp',
  LAYOUT: 'incrementalRPG_layout',
  SETTINGS: 'incrementalRPG_settings',
  CURRENT_VERSION: '1.0.0'
};

/**
 * Save game state to local storage
 * @param {any} gameState - The game state to save
 * @param {boolean} [createBackup=true] - Whether to create a backup of previous save
 * @returns {boolean} - Whether the save was successful
 */
export const saveGame = (gameState: any, createBackup: boolean = true): boolean => {
  try {
    // Add version and timestamp to the save
    const saveData: SaveData = {
      version: STORAGE_KEYS.CURRENT_VERSION,
      timestamp: Date.now(),
      data: gameState
    };
    
    // Create backup if enabled
    if (createBackup) {
      const previousSave = localStorage.getItem(STORAGE_KEYS.SAVE_DATA);
      if (previousSave) {
        localStorage.setItem(STORAGE_KEYS.SAVE_BACKUP, previousSave);
      }
    }
    
    const serializedState = JSON.stringify(saveData);
    localStorage.setItem(STORAGE_KEYS.SAVE_DATA, serializedState);
    localStorage.setItem(STORAGE_KEYS.SAVE_TIMESTAMP, saveData.timestamp.toString());
    
    return true;
  } catch (err) {
    console.error('Could not save game:', err);
    return false;
  }
};

/**
 * Load game state from local storage
 * @param {boolean} [useBackup=false] - Whether to load from backup instead
 * @returns {any|null} - The loaded game state or null if not found
 */
export const loadGame = (useBackup: boolean = false): any | null => {
  try {
    const key = useBackup ? STORAGE_KEYS.SAVE_BACKUP : STORAGE_KEYS.SAVE_DATA;
    const serializedState = localStorage.getItem(key);
    
    if (!serializedState) {
      return null;
    }
    
    const saveData = JSON.parse(serializedState) as SaveData | any;
    
    // Version compatibility check
    if (saveData.version && saveData.version !== STORAGE_KEYS.CURRENT_VERSION) {
      console.warn(`Loading save from different version (${saveData.version})`);
      // Could implement migration logic here if needed
    }
    
    return saveData.data || saveData; // Handle legacy saves that might not have data property
  } catch (err) {
    console.error('Could not load game:', err);
    return null;
  }
};

/**
 * Save UI layout configuration to local storage
 * @param {any} columnLayout - The layout configuration to save
 * @returns {boolean} - Whether the save was successful
 */
export const saveLayout = (columnLayout: any): boolean => {
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
export const loadLayout = (): any | null => {
  try {
    const serializedLayout = localStorage.getItem(STORAGE_KEYS.LAYOUT);
    if (!serializedLayout) {
      return null;
    }
    return JSON.parse(serializedLayout);
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
export const saveSettings = (settings: any): boolean => {
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
export const loadSettings = (): any | null => {
  try {
    const serializedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!serializedSettings) {
      return null;
    }
    return JSON.parse(serializedSettings);
  } catch (err) {
    console.error('Failed to load settings:', err);
    return null;
  }
};

/**
 * Clear all save data from local storage
 * @param {boolean} [keepSettings=false] - Whether to keep user settings
 * @returns {boolean} - Whether the clear was successful
 */
export const clearSave = (keepSettings: boolean = false): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVE_DATA);
    localStorage.removeItem(STORAGE_KEYS.SAVE_BACKUP);
    localStorage.removeItem(STORAGE_KEYS.SAVE_TIMESTAMP);
    localStorage.removeItem(STORAGE_KEYS.LAYOUT);
    
    if (!keepSettings) {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    }
    
    return true;
  } catch (err) {
    console.error('Failed to clear save:', err);
    return false;
  }
};

/**
 * Export save data as a downloadable JSON file
 * @returns {boolean} - Whether the export was successful
 */
export const exportSave = (): boolean => {
  try {
    const saveData = localStorage.getItem(STORAGE_KEYS.SAVE_DATA);
    if (!saveData) {
      console.error('No save data to export');
      return false;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(saveData);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "incremental_rpg_save.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    return true;
  } catch (err) {
    console.error('Failed to export save:', err);
    return false;
  }
};

/**
 * Import save data from a JSON file
 * @param {File} file - The file to import
 * @returns {Promise<boolean>} - Whether the import was successful
 */
export const importSave = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        if (!event.target || typeof event.target.result !== 'string') {
          throw new Error('Failed to read file');
        }

        const saveData = JSON.parse(event.target.result);
        // Validate save data structure
        if (!saveData || (!saveData.data && !saveData.version)) {
          throw new Error('Invalid save file format');
        }
        
        localStorage.setItem(STORAGE_KEYS.SAVE_DATA, JSON.stringify(saveData));
        resolve(true);
      } catch (err) {
        console.error('Failed to import save:', err);
        reject(err);
      }
    };
    
    reader.onerror = (err) => {
      console.error('Failed to read file:', err);
      reject(err);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Get save information without loading the full save
 * @returns {SaveInfo|null} - Basic save info like timestamp and version
 */
export const getSaveInfo = (): SaveInfo | null => {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.SAVE_TIMESTAMP);
    const serializedState = localStorage.getItem(STORAGE_KEYS.SAVE_DATA);
    
    if (!serializedState) {
      return null;
    }
    
    const saveData = JSON.parse(serializedState);
    return {
      timestamp: timestamp ? parseInt(timestamp, 10) : null,
      version: saveData.version || 'unknown',
      hasBackup: !!localStorage.getItem(STORAGE_KEYS.SAVE_BACKUP)
    };
  } catch (err) {
    console.error('Could not get save info:', err);
    return null;
  }
};
