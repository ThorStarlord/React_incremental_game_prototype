/**
 * @file saveUtils.ts
 * @description Canonical save storage/import/export helpers.
 *
 * Persistent representation migration is owned by saveSchema.ts. Runtime
 * reconciliation (content registration, derived-rate refresh, etc.) happens
 * after migrated state is installed in Redux.
 */

import { rootReducer, type RootState } from '../../app/store';
import { rehydratePersistedGameState } from '../persistence/PersistedGameState';
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

export type SaveStorageErrorCode =
  | 'STORAGE_UNAVAILABLE'
  | 'CORRUPT_PAYLOAD';

/** Stable failure category for persistence failures outside schema migration. */
export class SaveStorageError extends Error {
  constructor(
    message: string,
    public readonly code: SaveStorageErrorCode,
    public readonly saveId?: string,
    options?: { cause?: unknown }
  ) {
    super(message);
    this.name = 'SaveStorageError';
    if (options?.cause !== undefined) {
      Object.defineProperty(this, 'cause', {
        configurable: true,
        enumerable: false,
        value: options.cause,
      });
    }
  }
}

export interface SaveRecoveryResult {
  adoptedSaveIds: string[];
  removedMetadataIds: string[];
  invalidPayloadIds: string[];
}

const isSavedGame = (value: unknown): value is SavedGame => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const candidate = value as Partial<SavedGame>;
  return typeof candidate.id === 'string' && candidate.id.length > 0 &&
    typeof candidate.name === 'string' &&
    typeof candidate.timestamp === 'number' && Number.isFinite(candidate.timestamp) &&
    typeof candidate.playerLevel === 'number' && Number.isFinite(candidate.playerLevel) &&
    (candidate.screenshot === undefined || typeof candidate.screenshot === 'string') &&
    (candidate.playtime === undefined || typeof candidate.playtime === 'number') &&
    (candidate.version === undefined || typeof candidate.version === 'string') &&
    (candidate.schemaVersion === undefined || typeof candidate.schemaVersion === 'number');
};

/**
 * Convert a JavaScript string to the binary-byte string expected by btoa.
 * encodeURIComponent gives us deterministic UTF-8 bytes without relying on
 * TextEncoder, which is not present in every supported CRA/Jest environment.
 */
const utf8ToBinary = (value: string): string => {
  const encoded = encodeURIComponent(value);
  let binary = '';

  for (let index = 0; index < encoded.length; index += 1) {
    if (encoded[index] === '%') {
      binary += String.fromCharCode(parseInt(encoded.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      binary += encoded[index];
    }
  }

  return binary;
};

/** Convert an atob binary-byte string back into a JavaScript UTF-8 string. */
const binaryToUtf8 = (binary: string): string => {
  let encoded = '';

  for (let index = 0; index < binary.length; index += 1) {
    encoded += `%${binary.charCodeAt(index).toString(16).padStart(2, '0')}`;
  }

  return decodeURIComponent(encoded);
};

/**
 * Encode arbitrary JSON save payloads as base64 without assuming ASCII-only
 * content. This keeps authored/player Unicode text intact across copy/paste.
 */
export const encodeSavePayloadToBase64 = (payload: unknown): string =>
  btoa(utf8ToBinary(JSON.stringify(payload)));

/** Decode a UTF-8 save-code payload. Surrounding copy/paste whitespace is ignored. */
export const decodeSavePayloadFromBase64 = (encoded: string): unknown => {
  const json = binaryToUtf8(atob(encoded.trim()));
  return JSON.parse(json) as unknown;
};

/** Get all saved-game metadata from localStorage. */
export const getSavedGames = (): SavedGame[] => {
  try {
    const savedGamesString = localStorage.getItem('saved_games');
    if (!savedGamesString) return [];
    const parsed = JSON.parse(savedGamesString) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isSavedGame) : [];
  } catch (error) {
    console.error('Failed to get saved games:', error);
    return [];
  }
};

const metadataForEnvelope = (
  saveId: string,
  envelope: CurrentSaveEnvelope
): SavedGame => ({
  id: saveId,
  name: `Recovered Save ${new Date(envelope.timestamp).toLocaleTimeString()}`,
  timestamp: envelope.timestamp,
  playerLevel: 1,
  playtime: envelope.state.player.totalPlaytime || 0,
  version: envelope.gameVersion,
  schemaVersion: envelope.schemaVersion,
});

/**
 * Reconcile the two-key localStorage representation after an interrupted save.
 * Valid payloads missing from the metadata index are adopted; metadata entries
 * without a payload are removed. Invalid payloads are left untouched so the
 * user can export or inspect them before deciding to delete them.
 */
export const recoverSavedGameIndex = (): SaveRecoveryResult => {
  const existingMetadata = getSavedGames();
  const metadataById = new Map(existingMetadata.map(save => [save.id, save]));
  const payloadIds: string[] = [];
  const invalidPayloadIds: string[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !key.startsWith('game_save_')) continue;

    const saveId = key.slice('game_save_'.length);
    payloadIds.push(saveId);
    if (metadataById.has(saveId)) continue;

    try {
      const rawPayload = localStorage.getItem(key);
      const migration = migrateSavePayload(JSON.parse(rawPayload || ''));
      metadataById.set(saveId, metadataForEnvelope(saveId, migration.envelope));
    } catch {
      invalidPayloadIds.push(saveId);
    }
  }

  const payloadIdSet = new Set(payloadIds);
  const removedMetadataIds = existingMetadata
    .filter(save => !payloadIdSet.has(save.id))
    .map(save => save.id);
  removedMetadataIds.forEach(saveId => metadataById.delete(saveId));

  const recoveredMetadata = Array.from(metadataById.values())
    .sort((left, right) => right.timestamp - left.timestamp);
  localStorage.setItem('saved_games', JSON.stringify(recoveredMetadata));

  return {
    adoptedSaveIds: recoveredMetadata
      .filter(save => !existingMetadata.some(existing => existing.id === save.id))
      .map(save => save.id),
    removedMetadataIds,
    invalidPayloadIds,
  };
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
  let savedGameString: string | null;
  try {
    savedGameString = localStorage.getItem(`game_save_${saveId}`);
  } catch (error) {
    throw new SaveStorageError(
      `Unable to access saved game ${saveId}.`,
      'STORAGE_UNAVAILABLE',
      saveId,
      { cause: error }
    );
  }
  if (!savedGameString) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(savedGameString) as unknown;
  } catch (error) {
    throw new SaveStorageError(
      `Saved game ${saveId} contains invalid JSON.`,
      'CORRUPT_PAYLOAD',
      saveId,
      { cause: error }
    );
  }
  const migration = migrateSavePayload(payload);

  return {
    state: rehydratePersistedGameState(
      migration.envelope.state,
      rootReducer(undefined, { type: '@@INIT', payload: undefined })
    ),
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

const persistCurrentSaveEnvelope = (
  envelope: CurrentSaveEnvelope,
  saveName: string | undefined,
  screenshot: string | undefined,
  now: number
): string => {
  const baseSaveId = `save_${now}`;
  let saveId = baseSaveId;
  let suffix = 0;
  while (localStorage.getItem(`game_save_${saveId}`) !== null) {
    suffix += 1;
    saveId = `${baseSaveId}_${suffix}`;
  }
  const defaultPlayerName = 'Player';
  const defaultPlayerLevel = 1;
  const playtime = envelope.state.player.totalPlaytime || 0;
  const persistedEnvelope: CurrentSaveEnvelope = {
    ...envelope,
    timestamp: now,
  };

  const saveInfo: SavedGame = {
    id: saveId,
    name: saveName || `${defaultPlayerName} - Save ${new Date(now).toLocaleTimeString()}`,
    timestamp: now,
    playerLevel: defaultPlayerLevel,
    playtime,
    screenshot,
    version: persistedEnvelope.gameVersion,
    schemaVersion: persistedEnvelope.schemaVersion,
  };

  const payloadKey = `game_save_${saveId}`;
  const previousPayload = localStorage.getItem(payloadKey);
  const previousMetadata = localStorage.getItem('saved_games');
  try {
    localStorage.setItem(payloadKey, JSON.stringify(persistedEnvelope));

    const savedGames = getSavedGames();
    savedGames.push(saveInfo);
    localStorage.setItem('saved_games', JSON.stringify(savedGames));
  } catch (error) {
    // Best-effort rollback keeps a failed save from leaving an orphaned payload
    // or metadata entry. The original error remains visible to createSave.
    if (previousPayload === null) localStorage.removeItem(payloadKey);
    else localStorage.setItem(payloadKey, previousPayload);
    if (previousMetadata === null) localStorage.removeItem('saved_games');
    else localStorage.setItem('saved_games', previousMetadata);
    throw error;
  }

  return saveId;
};

/** Create a current-schema save from active RootState. */
export const createSave = (
  gameState: RootState,
  saveName?: string,
  screenshot?: string
): string | null => {
  try {
    const now = Date.now();
    const envelope = createCurrentSaveEnvelope(gameState, now);
    return persistCurrentSaveEnvelope(envelope, saveName, screenshot, now);
  } catch (error) {
    console.error('Failed to create save:', error);
    return null;
  }
};

/**
 * Import any supported historical/current payload through the same migration
 * authority used by local loads, then persist that migrated envelope as a
 * current-schema save. Envelope-level historical metadata such as gameVersion is
 * preserved even when the embedded RootState did not carry the same field.
 */
export const createSaveFromPayload = (
  payload: unknown,
  saveName?: string,
  screenshot?: string
): ImportedSaveResult | null => {
  try {
    const migration = migrateSavePayload(payload);
    const now = Date.now();
    const saveId = persistCurrentSaveEnvelope(
      migration.envelope,
      saveName,
      screenshot,
      now
    );
    return { saveId, migration };
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
        resolve(rehydratePersistedGameState(
          migration.envelope.state,
          rootReducer(undefined, { type: '@@INIT', payload: undefined })
        ));
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
