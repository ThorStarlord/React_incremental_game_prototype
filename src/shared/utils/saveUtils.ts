/**
 * @file saveUtils.ts
 * @description Canonical save storage/import/export helpers.
 *
 * Persistent representation migration is owned by saveSchema.ts. Runtime
 * reconciliation (content registration, derived-rate refresh, etc.) happens
 * after migrated state is installed in Redux.
 */

import type { RootState } from '../../app/store';
import {
  CURRENT_SAVE_SCHEMA_VERSION,
  createCurrentSaveEnvelope,
  migrateSavePayload,
  type CurrentSaveEnvelope,
  type SaveMigrationResult,
} from './saveSchema';

/** Metadata used by the Main Menu. `version` remains the game/content version. */
export interface SavedGame {
  id: string;
  name: string;
  timestamp: number;
  playerLevel: number;
  screenshot?: string;
  playtime?: number;
  version?: string;
  schemaVersion?: number;
}

export interface LoadedSavedGame {
  state: RootState;
  envelope: CurrentSaveEnvelope;
  migration: SaveMigrationResult;
}

export interface ImportedSaveResult {
  saveId: string;
  migration: SaveMigrationResult;
}

/** Get all saved-game metadata from localStorage. */
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
 * Strict load boundary. The stored payload is decoded and migrated to the
 * current persistent schema before any Redux state replacement occurs.
 *
 * Migration errors intentionally propagate so callers that care about
 * compatibility diagnostics can distinguish unsupported/corrupt saves.
 */
export const loadSavedGameWithMigration = async (
  saveId: string
): Promise<LoadedSavedGame | null> => {
  const savedGameString = localStorage.getItem(`game_save_${saveId}`);
  if (!savedGameString) return null;

  const payload = JSON.parse(savedGameString) as unknown;
  const migration = migrateSavePayload(payload);

  return {
    state: migration.envelope.state,
    envelope: migration.envelope,
    migration,
  };
};

/**
 * Compatibility wrapper for older callers that only consume RootState.
 * New load surfaces should prefer loadSavedGameWithMigration so migration
 * diagnostics remain observable.
 */
export const loadSavedGame = async (saveId: string): Promise<RootState | null> => {
  try {
    const loaded = await loadSavedGameWithMigration(saveId);
    return loaded?.state ?? null;
  } catch (error) {
    console.error('Failed to load saved game:', error);
    return null;
  }
};

/** Delete a save and its metadata entry. */
export const deleteSavedGame = (saveId: string): boolean => {
  try {
    localStorage.removeItem(`game_save_${saveId}`);

    const savedGames = getSavedGames();
    const updatedSavedGames = savedGames.filter(save => save.id !== saveId);
    localStorage.setItem('saved_games', JSON.stringify(updatedSavedGames));

    return true;
  } catch (error) {
    console.error('Failed to delete saved game:', error);
    return false;
  }
};

/** Create a current-schema save from active RootState. */
export const createSave = (
  gameState: RootState,
  saveName?: string,
  screenshot?: string
): string | null => {
  try {
    const now = Date.now();
    const saveId = `save_${now}`;
    const defaultPlayerName = 'Player';
    const defaultPlayerLevel = 1;
    const playtime = gameState.player.totalPlaytime || 0;
    const envelope = createCurrentSaveEnvelope(gameState, now);

    const saveInfo: SavedGame = {
      id: saveId,
      name: saveName || `${defaultPlayerName} - Save ${new Date(now).toLocaleTimeString()}`,
      timestamp: now,
      playerLevel: defaultPlayerLevel,
      playtime,
      screenshot,
      version: envelope.gameVersion,
      schemaVersion: envelope.schemaVersion,
    };

    localStorage.setItem(`game_save_${saveId}`, JSON.stringify(envelope));

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
 * Import any supported historical/current payload through the same migration
 * authority used by local loads, then persist it as a current-schema save.
 */
export const createSaveFromPayload = (
  payload: unknown,
  saveName?: string,
  screenshot?: string
): ImportedSaveResult | null => {
  try {
    const migration = migrateSavePayload(payload);
    const saveId = createSave(migration.envelope.state, saveName, screenshot);
    return saveId ? { saveId, migration } : null;
  } catch (error) {
    console.error('Failed to import save payload:', error);
    return null;
  }
};

/** Export the canonical current-schema envelope as a file. */
export const exportSaveToFile = async (saveId: string): Promise<boolean> => {
  try {
    const loaded = await loadSavedGameWithMigration(saveId);
    if (!loaded) return false;

    const saveBlob = new Blob([JSON.stringify(loaded.envelope)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(saveBlob);

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
 * Read an imported file and migrate it through the canonical schema pipeline.
 * This returns current RootState for compatibility; callers that persist imports
 * should use createSaveFromPayload so metadata is also current-versioned.
 */
export const importSaveFromFile = async (file: File): Promise<RootState | null> =>
  new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = event => {
      try {
        if (!event.target?.result) {
          resolve(null);
          return;
        }

        const payload = JSON.parse(event.target.result as string) as unknown;
        const migration = migrateSavePayload(payload);
        resolve(migration.envelope.state);
      } catch (error) {
        console.error('Failed to parse or migrate save file:', error);
        resolve(null);
      }
    };

    reader.onerror = () => {
      console.error('Failed to read save file');
      resolve(null);
    };

    reader.readAsText(file);
  });

export { CURRENT_SAVE_SCHEMA_VERSION };
