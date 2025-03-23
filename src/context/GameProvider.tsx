import React, { useReducer, useEffect, useCallback, ReactNode, Dispatch } from 'react';
import { rootReducer } from './reducers/rootReducer';
import { GAME_INIT_ACTIONS } from './types/ActionTypes';
import { GameAction } from './GameDispatchContext';
import GameStateContext, { EnhancedGameState } from './GameStateContext';
import GameDispatchContext from './GameDispatchContext';
import { GameState } from './types/gameStates/GameStateTypes';
import { InitialState } from './initialStates/InitialStateComposer';

// Constants
const GAME_VERSION = '0.1.0';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

/**
 * Custom hook for game persistence operations
 */
const useGamePersistence = (gameState: GameState, dispatch: Dispatch<GameAction>) => {
  /**
   * Save game to localStorage
   * @param slotId - Slot identifier (defaults to auto)
   * @returns Promise resolving to success status
   */
  const saveGame = useCallback(async (slotId = 'auto'): Promise<boolean> => {
    try {
      const saveData = {
        version: GAME_VERSION,
        timestamp: Date.now(),
        state: gameState
      };
      
      // Save the game state
      localStorage.setItem(`game_save_${slotId}`, JSON.stringify(saveData));
      
      // Update the save list if this is not an auto-save
      if (slotId !== 'auto') {
        const savedGames = JSON.parse(localStorage.getItem('saved_games') || '[]');
        
        const saveInfo = {
          id: slotId,
          name: gameState.player?.name || 'Unnamed Hero',
          timestamp: Date.now(),
          playtime: gameState.statistics?.current?.timeStatistics?.totalPlayTime || 0
        };
        
        // Update or add to saved games list
        const existingIndex = savedGames.findIndex((save: any) => save.id === slotId);
        if (existingIndex >= 0) {
          savedGames[existingIndex] = saveInfo;
        } else {
          savedGames.push(saveInfo);
        }
        
        localStorage.setItem('saved_games', JSON.stringify(savedGames));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }, [gameState]);

  /**
   * Load game from localStorage
   * @param slotId - Slot identifier to load
   * @returns Promise resolving to success status
   */
  const loadGame = useCallback(async (slotId: string): Promise<boolean> => {
    try {
      const savedGame = localStorage.getItem(`game_save_${slotId}`);
      if (!savedGame) {
        console.warn(`No save found with id: ${slotId}`);
        return false;
      }
      
      const saveData = JSON.parse(savedGame);
      
      // Version compatibility check could be added here
      // e.g., if (saveData.version !== GAME_VERSION) { ... }
      
      dispatch({
        type: GAME_INIT_ACTIONS.INITIALIZE_GAME_DATA,
        payload: saveData.state
      });
      
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }, [dispatch]);

  /**
   * Reset game state to initial values
   */
  const resetGame = useCallback(() => {
    dispatch({ type: GAME_INIT_ACTIONS.RESET_GAME, payload: {} });
  }, [dispatch]);

  /**
   * Export save as base64 string for backup
   */
  const exportSave = useCallback((): string => {
    try {
      return btoa(JSON.stringify({
        version: GAME_VERSION,
        timestamp: Date.now(),
        state: gameState
      }));
    } catch (error) {
      console.error('Failed to export save:', error);
      return '';
    }
  }, [gameState]);

  /**
   * Import save from base64 string backup
   */
  const importSave = useCallback(async (saveData: string): Promise<boolean> => {
    try {
      if (!saveData) {
        throw new Error("Empty save data");
      }
      
      const parsedData = JSON.parse(atob(saveData));
      
      // Validate the imported data structure
      if (!parsedData.version || !parsedData.state) {
        throw new Error("Invalid save data format");
      }
      
      dispatch({
        type: GAME_INIT_ACTIONS.INITIALIZE_GAME_DATA,
        payload: parsedData.state
      });
      
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  }, [dispatch]);

  // Setup auto-save mechanism
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame('auto').catch(error => {
        console.error('Auto-save failed:', error);
      });
    }, AUTO_SAVE_INTERVAL);
    
    return () => clearInterval(saveInterval);
  }, [saveGame]);

  // Load auto-save on initial mount
  useEffect(() => {
    // Only load if auto-save exists
    const autoSaveExists = localStorage.getItem('game_save_auto');
    if (autoSaveExists) {
      loadGame('auto').catch(error => {
        console.error('Failed to load auto-save:', error);
      });
    }
  }, [loadGame]);

  return {
    saveGame,
    loadGame,
    resetGame,
    exportSave,
    importSave
  };
};

/**
 * GameProvider component
 * 
 * Main context provider for the game state management system.
 * Provides game state and dispatch function to the application,
 * along with utility methods for managing game data.
 */
const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Initialize state with type casting
  const [gameState, dispatch] = useReducer(
    rootReducer, 
    InitialState as GameState
  );

  // Setup game persistence functionality
  const persistenceUtils = useGamePersistence(gameState, dispatch);

  // Create complete context value with enhanced game state
  const contextValue: EnhancedGameState = {
    ...gameState,
    ...persistenceUtils
  };

  // Properly type the dispatch function
  const typedDispatch = dispatch as Dispatch<GameAction>;

  return (
    <GameStateContext.Provider value={contextValue}>
      <GameDispatchContext.Provider value={typedDispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

export default GameProvider;
