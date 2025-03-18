import { useState, useEffect, useCallback } from 'react';

export interface SavedGame {
  id: string;
  name: string;
  timestamp: number;
  playtime: number;
  data: any; // The actual game state data
}

export function useSavedGames() {
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSavedGames = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get saved games from localStorage
      const games: SavedGame[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('savegame_')) {
          try {
            const saveData = JSON.parse(localStorage.getItem(key) || '');
            if (saveData) {
              games.push({
                id: key.replace('savegame_', ''),
                ...saveData
              });
            }
          } catch (e) {
            console.error('Error parsing saved game:', e);
          }
        }
      }
      
      // Sort by timestamp (newest first)
      games.sort((a, b) => b.timestamp - a.timestamp);
      setSavedGames(games);
    } catch (error) {
      console.error('Error loading saved games:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const findMostRecentSave = useCallback(() => {
    return savedGames.length > 0 ? savedGames[0] : null;
  }, [savedGames]);

  const deleteSave = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      localStorage.removeItem(`savegame_${id}`);
      setSavedGames(prevGames => prevGames.filter(game => game.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting save:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load saved games on initial mount
  useEffect(() => {
    loadSavedGames();
  }, [loadSavedGames]);

  return {
    savedGames,
    isLoading,
    loadSavedGames,
    findMostRecentSave,
    deleteSave
  };
}
