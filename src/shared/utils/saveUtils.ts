/**
 * @file saveUtils.ts
 * @description Utilities for saving and loading game data
 * 
 * This module provides functions for managing save game data:
 * - Loading saved games
 * - Creating new saves
 * - Deleting saved games
 * - Importing/exporting save files
 */

import { GameState } from '../../context/GameStateExports';

/**
 * Interface for saved game metadata
 */
export interface SavedGame {
  id: string;
  name: string;
  timestamp: number;
  playerLevel: number;
  screenshot?: string;
  playtime?: number;
  version?: string;
}

/**
 * Get all saved games from localStorage
 * @returns Array of saved game metadata
 */
export const getSavedGames = (): SavedGame[] => {
  try {
    const savedGamesString = localStorage.getItem('saved_games');
    return savedGamesString ? JSON.parse(savedGamesString) : [];
  } catch (error) {
    console.error('Failed to get saved games:', error);
    return [];
  }
};

/**
 * Load a specific saved game by ID
 * @param saveId The ID of the save to load
 * @returns The loaded game state or null if loading failed
 */
export const loadSavedGame = async (saveId: string): Promise<GameState | null> => {
  try {
    const savedGameString = localStorage.getItem(`game_save_${saveId}`);
    if (!savedGameString) return null;
    
    const saveData = JSON.parse(savedGameString);
    return saveData.state;
  } catch (error) {
    console.error('Failed to load saved game:', error);
    return null;
  }
};

/**
 * Delete a specific saved game
 * @param saveId The ID of the save to delete
 * @returns True if deletion was successful
 */
export const deleteSavedGame = (saveId: string): boolean => {
  try {
    // Remove the save data
    localStorage.removeItem(`game_save_${saveId}`);
    
    // Update the saved games list
    const savedGames = getSavedGames();
    const updatedSavedGames = savedGames.filter(save => save.id !== saveId);
    localStorage.setItem('saved_games', JSON.stringify(updatedSavedGames));
    
    return true;
  } catch (error) {
    console.error('Failed to delete saved game:', error);
    return false;
  }
};

/**
 * Create a new save from the current game state
 * @param gameState The current game state
 * @param saveName Optional name for the save
 * @param screenshot Optional screenshot data URL
 * @returns The ID of the new save or null if saving failed
 */
export const createSave = (
  gameState: GameState, 
  saveName?: string, 
  screenshot?: string
): string | null => {
  try {
    const saveId = `save_${Date.now()}`;
    const playerName = gameState.player?.name || 'Unnamed Hero';
    const playerLevel = gameState.player?.level || 1;
    const playtime = gameState.statistics?.current?.timeStatistics?.totalPlayTime || 0;
    
    // Create save metadata
    const saveInfo: SavedGame = {
      id: saveId,
      name: saveName || `${playerName} - Level ${playerLevel}`,
      timestamp: Date.now(),
      playerLevel,
      playtime,
      screenshot
    };
    
    // Store the actual save data
    const saveData = {
      version: gameState.meta?.version || '1.0.0',
      timestamp: Date.now(),
      state: gameState
    };
    
    localStorage.setItem(`game_save_${saveId}`, JSON.stringify(saveData));
    
    // Update the saved games list
    const savedGames = getSavedGames();
    savedGames.push(saveInfo);
    localStorage.setItem('saved_games', JSON.stringify(savedGames));
    
    return saveId;
  } catch (error) {
    console.error('Failed to create save:', error);
    return null;
  }
};

/**
 * Export a save to a downloadable file
 * @param saveId The ID of the save to export
 * @returns True if the export was successful
 */
export const exportSaveToFile = async (saveId: string): Promise<boolean> => {
  try {
    const saveData = await loadSavedGame(saveId);
    if (!saveData) return false;
    
    const saveBlob = new Blob([JSON.stringify(saveData)], { type: 'application/json' });
    const url = URL.createObjectURL(saveBlob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `incremental-rpg-save-${saveId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Failed to export save:', error);
    return false;
  }
};

/**
 * Import a save from a file
 * @param file The file containing the save data
 * @returns The imported game state or null if import failed
 */
export const importSaveFromFile = async (file: File): Promise<GameState | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          resolve(null);
          return;
        }
        
        const saveData = JSON.parse(event.target.result as string);
        resolve(saveData);
      } catch (error) {
        console.error('Failed to parse save file:', error);
        resolve(null);
      }
    };
    
    reader.onerror = () => {
      console.error('Failed to read save file');
      resolve(null);
    };
    
    reader.readAsText(file);
  });
};
