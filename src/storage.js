// Enhanced storage management for game state
export const saveGame = (gameState) => {
  try {
    // Validate gameState before saving
    if (!gameState || typeof gameState !== 'object') {
      throw new Error('Invalid game state');
    }

    const serializedState = JSON.stringify(gameState);
    if (serializedState.length > 5242880) { // 5MB localStorage limit
      console.warn('Warning: Save file is getting large, may hit storage limits soon');
    }

    localStorage.setItem('incremental_rpg_save', serializedState);
    localStorage.setItem('incremental_rpg_save_timestamp', Date.now().toString());
    return true;
  } catch (err) {
    console.error('Failed to save game:', err);
    // Try to save a backup if main save fails
    try {
      localStorage.setItem('incremental_rpg_save_backup', JSON.stringify(gameState));
    } catch (backupErr) {
      console.error('Backup save also failed:', backupErr);
    }
    return false;
  }
};

export const loadGame = () => {
  try {
    const serializedState = localStorage.getItem('incremental_rpg_save');
    if (serializedState === null) {
      return null;
    }

    const state = JSON.parse(serializedState);
    
    // Enhanced state validation
    const requiredProperties = ['player', 'essence', 'factions', 'npcs', 'traits', 'skills'];
    const missingProperties = requiredProperties.filter(prop => !(prop in state));
    
    if (missingProperties.length > 0) {
      console.error(`Corrupted save file detected. Missing properties: ${missingProperties.join(', ')}`);
      throw new Error('Corrupted save file');
    }

    // Validate save file timestamp
    const saveTimestamp = localStorage.getItem('incremental_rpg_save_timestamp');
    if (saveTimestamp) {
      const timeSinceSave = Date.now() - parseInt(saveTimestamp);
      console.log(`Loading save file from ${Math.round(timeSinceSave / 1000 / 60)} minutes ago`);
    }

    return state;
  } catch (err) {
    console.error('Failed to load game:', err);
    
    // Try to load backup if main save is corrupted
    try {
      const backupState = localStorage.getItem('incremental_rpg_save_backup');
      if (backupState) {
        console.log('Attempting to restore from backup save...');
        const state = JSON.parse(backupState);
        
        // Validate backup state as well
        if (!state.player || !state.essence || !state.factions) {
          throw new Error('Backup save is also corrupted');
        }
        
        // If backup is valid, restore it as main save
        localStorage.setItem('incremental_rpg_save', backupState);
        localStorage.setItem('incremental_rpg_save_timestamp', Date.now().toString());
        
        return state;
      }
    } catch (backupErr) {
      console.error('Backup restore also failed:', backupErr);
    }
    return null;
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