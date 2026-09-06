import { useState, useEffect, useCallback } from 'react';
import {
  deleteSavedGame,
  getSavedGames,
  type SavedGame as SaveMetadata,
} from '../shared/utils/saveUtils';

/**
 * Main-menu view model for canonical saveUtils metadata.
 * `data.characterLevel` is retained only as a compatibility shape for the
 * existing LoadGameDialog; new code should prefer playerLevel directly.
 */
export interface SavedGame {
  id: string;
  name: string;
  timestamp: number;
  playtime: number;
  playerLevel?: number;
  version?: string;
  schemaVersion?: number;
  screenshot?: string;
  data?: {
    characterLevel?: number;
  };
}

const toMenuSave = (save: SaveMetadata): SavedGame => ({
  ...save,
  playtime: save.playtime ?? 0,
  data: {
    characterLevel: save.playerLevel,
  },
});

export function useSavedGames() {
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSavedGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const games = getSavedGames()
        .map(toMenuSave)
        .sort((a, b) => b.timestamp - a.timestamp);
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
      const success = deleteSavedGame(id);
      if (success) {
        setSavedGames(prevGames => prevGames.filter(game => game.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting save:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedGames();
  }, [loadSavedGames]);

  return {
    savedGames,
    isLoading,
    loadSavedGames,
    findMostRecentSave,
    deleteSave,
  };
}
