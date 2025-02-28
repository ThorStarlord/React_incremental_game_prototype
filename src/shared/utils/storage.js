/**
 * Save game state to local storage
 * @param {Object} gameState - The game state to save
 * @returns {boolean} - Whether the save was successful
 */
export const saveGame = (gameState) => {
  try {
    const serializedState = JSON.stringify(gameState);
    localStorage.setItem('incrementalRPG_saveData', serializedState);
    return true;
  } catch (err) {
    console.error('Could not save game:', err);
    return false;
  }
};

/**
 * Load game state from local storage
 * @returns {Object|null} - The loaded game state or null if not found
 */
export const loadGame = () => {
  try {
    const serializedState = localStorage.getItem('incrementalRPG_saveData');
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load game:', err);
    return null;
  }
};

export const saveLayout = (columnLayout) => {
  try {
    localStorage.setItem('incremental_rpg_layout', JSON.stringify(columnLayout));
    return true;
  } catch (err) {
    console.error('Failed to save layout:', err);
    return false;
  }
};

export const clearSave = () => {
  try {
    localStorage.removeItem('incremental_rpg_save');
    localStorage.removeItem('incremental_rpg_save_timestamp');
    localStorage.removeItem('incremental_rpg_save_backup');
    return true;
  } catch (err) {
    console.error('Failed to clear save:', err);
    return false;
  }
};