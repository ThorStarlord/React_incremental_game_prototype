import React, { useReducer, useEffect, useCallback, ReactNode, Dispatch } from 'react';
import { rootReducer } from './reducers/rootReducer';
import { ACTION_TYPES } from './actions/actionTypes';
import { GameAction } from './GameDispatchContext';
import GameStateContext, { EnhancedGameState } from './GameStateContext';
import GameDispatchContext from './GameDispatchContext';
import { GameState, InitialState } from './InitialState.ts';

// Game version for save compatibility
const GAME_VERSION = '0.1.0';

// Main provider component
const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Use InitialState with the correct type casting
  const [gameState, dispatch] = useReducer(
    rootReducer, 
    InitialState as GameState
  );

  // Save game to specific slot (or default)
  const saveGame = useCallback(async (slotId = 'auto'): Promise<boolean> => {
    try {
      const saveData = {
        version: GAME_VERSION,
        timestamp: Date.now(),
        state: gameState
      };
      
      localStorage.setItem(`game_save_${slotId}`, JSON.stringify(saveData));
      
      // If this is not an auto-save, also update the save list
      if (slotId !== 'auto') {
        const savedGames = JSON.parse(localStorage.getItem('saved_games') || '[]');
        const saveInfo = {
          id: slotId,
          name: gameState.player?.name || 'Unnamed Hero',
          timestamp: Date.now(),
          playerLevel: gameState.player?.level || 1,
          playtime: gameState.statistics?.totalPlayTime || 0
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

  // Load game from specific slot
  const loadGame = useCallback(async (slotId: string): Promise<boolean> => {
    try {
      const savedGame = localStorage.getItem(`game_save_${slotId}`);
      if (savedGame) {
        const saveData = JSON.parse(savedGame);
        
        // Version check and potential migration logic could go here
        
        dispatch({
          type: ACTION_TYPES.INITIALIZE_GAME_DATA,
          payload: saveData.state
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }, []);

  // Reset game state to initial values
  const resetGame = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET_GAME, payload: {} });
  }, []);

  // Export save as string for backup
  const exportSave = useCallback((): string => {
    return btoa(JSON.stringify({
      version: GAME_VERSION,
      timestamp: Date.now(),
      state: gameState
    }));
  }, [gameState]);

  // Import save from string backup
  const importSave = useCallback(async (saveData: string): Promise<boolean> => {
    try {
      const parsedData = JSON.parse(atob(saveData));
      
      // Validate the imported data structure
      if (!parsedData.version || !parsedData.state) {
        throw new Error("Invalid save data format");
      }
      
      dispatch({
        type: ACTION_TYPES.INITIALIZE_GAME_DATA,
        payload: parsedData.state
      });
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  }, []);

  // Handle auto-saving
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame('auto').catch(error => {
        console.error('Auto-save failed:', error);
      });
    }, 30000);
    
    return () => clearInterval(saveInterval);
  }, [saveGame]);

  // Load last auto-save on mount
  useEffect(() => {
    loadGame('auto').catch(error => {
      console.error('Failed to load auto-save:', error);
    });
  }, [loadGame]);

  // Create the context value with game state and utility functions
  const contextValue: EnhancedGameState = {
    ...gameState,
    saveGame,
    loadGame,
    resetGame,
    exportSave,
    importSave
  };

  // Cast the dispatch function to match the expected type in GameDispatchContext
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
