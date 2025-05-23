import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { updateAutoSave } from './GameLoopSlice';

/**
 * Initialize the game loop with saved state or defaults
 */
export const initializeGameLoopThunk = createAsyncThunk(
  'gameLoop/initialize',
  async (_, { getState, rejectWithValue }) => {
    try {
      const savedState = localStorage.getItem('gameLoopState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Validate saved state structure
        if (typeof parsedState.totalGameTime === 'number') {
          return {
            totalGameTime: parsedState.totalGameTime,
            lastAutoSave: parsedState.lastAutoSave || 0,
            gameSpeed: parsedState.gameSpeed || 1.0,
            tickRate: parsedState.tickRate || 10,
          };
        }
      }
      return null; // No saved state found
    } catch (error) {
      return rejectWithValue('Failed to load saved game loop state');
    }
  }
);

/**
 * Auto-save the current game state
 */
export const autoSaveGameThunk = createAsyncThunk(
  'gameLoop/autoSave',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const gameState = {
        gameLoop: state.gameLoop,
        // Add other feature states here as they're implemented
        // player: state.player,
        // essence: state.essence,
        // traits: state.traits,
      };

      localStorage.setItem('gameState', JSON.stringify(gameState));
      localStorage.setItem('lastSaveTime', new Date().toISOString());
      
      // Update auto-save timestamp
      dispatch(updateAutoSave(state.gameLoop.totalGameTime));
      
      return {
        timestamp: Date.now(),
        success: true,
      };
    } catch (error) {
      return rejectWithValue('Failed to auto-save game state');
    }
  }
);

/**
 * Load complete game state
 */
export const loadGameStateThunk = createAsyncThunk(
  'gameLoop/loadGame',
  async (_, { rejectWithValue }) => {
    try {
      const savedState = localStorage.getItem('gameState');
      if (!savedState) {
        return rejectWithValue('No saved game found');
      }

      const gameState = JSON.parse(savedState);
      
      // Validate the loaded state
      if (!gameState.gameLoop) {
        return rejectWithValue('Invalid save file: missing game loop data');
      }

      return gameState;
    } catch (error) {
      return rejectWithValue('Failed to load game state: corrupted save file');
    }
  }
);

/**
 * Reset game state to defaults
 */
export const resetGameStateThunk = createAsyncThunk(
  'gameLoop/resetGame',
  async (_, { rejectWithValue }) => {
    try {
      // Clear all saved data
      localStorage.removeItem('gameState');
      localStorage.removeItem('gameLoopState');
      localStorage.removeItem('lastSaveTime');
      
      return { success: true };
    } catch (error) {
      return rejectWithValue('Failed to reset game state');
    }
  }
);

/**
 * Export game state for sharing/backup
 */
export const exportGameStateThunk = createAsyncThunk(
  'gameLoop/exportGame',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        gameState: {
          gameLoop: state.gameLoop,
          // Add other features as implemented
        },
      };

      const exportString = btoa(JSON.stringify(exportData));
      return {
        exportString,
        timestamp: Date.now(),
      };
    } catch (error) {
      return rejectWithValue('Failed to export game state');
    }
  }
);

/**
 * Import game state from export string
 */
export const importGameStateThunk = createAsyncThunk(
  'gameLoop/importGame',
  async (importString: string, { rejectWithValue }) => {
    try {
      const decodedData = JSON.parse(atob(importString));
      
      // Validate import data
      if (!decodedData.gameState || !decodedData.version) {
        return rejectWithValue('Invalid import data format');
      }

      // Version compatibility check
      if (decodedData.version !== '1.0.0') {
        return rejectWithValue('Incompatible save file version');
      }

      return decodedData.gameState;
    } catch (error) {
      return rejectWithValue('Failed to import game state: invalid format');
    }
  }
);
