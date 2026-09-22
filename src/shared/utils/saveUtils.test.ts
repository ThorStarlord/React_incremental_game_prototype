import { rootReducer, type RootState } from '../../app/store';
import { createPersistedGameState } from '../persistence/PersistedGameState';
import {
  createSave,
  createSaveFromPayload,
  decodeSavePayloadFromBase64,
  encodeSavePayloadToBase64,
  getSavedGames,
  loadSavedGameWithMigration,
  recoverSavedGameIndex,
  SaveStorageError,
} from './saveUtils';
import {
  CURRENT_SAVE_SCHEMA_VERSION,
  LEGACY_SAVE_SCHEMA_VERSION,
  SaveMigrationError,
  createCurrentSaveEnvelope,
} from './saveSchema';
import { APP_VERSION } from '../config/releaseVersion';

const makeState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT' } as any);

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe('M10 canonical save protocols', () => {
  test('createSave persists current schema identity in state and metadata', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    const state = makeState();

    const saveId = createSave(state, 'Current Save');
    expect(saveId).toBe('save_1000');

    const stored = JSON.parse(localStorage.getItem('game_save_save_1000') || '{}');
    expect(stored.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(stored.state).toEqual(createPersistedGameState(state));

    const metadata = getSavedGames();
    expect(metadata).toHaveLength(1);
    expect(metadata[0].schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(metadata[0].id).toBe(saveId);
    expect(metadata[0].version).toBe(APP_VERSION);
  });

  test('save-code base64 transport round-trips Unicode and ignores surrounding whitespace', () => {
    const payload = {
      message: 'Willow — memória 日本語 🌱',
      nested: { label: 'Elara: revisão de hipótese' },
    };

    const encoded = encodeSavePayloadToBase64(payload);
    const decoded = decodeSavePayloadFromBase64(`  ${encoded}\n`);

    expect(decoded).toEqual(payload);
  });

  test('local historical saves pass through the schema migration pipeline', async () => {
    const state = makeState();
    localStorage.setItem(
      'game_save_legacy',
      JSON.stringify({ version: '0.9.0', timestamp: 123, state })
    );

    const loaded = await loadSavedGameWithMigration('legacy');

    expect(loaded).not.toBeNull();
    expect(loaded!.migration.sourceVersion).toBe(LEGACY_SAVE_SCHEMA_VERSION);
    expect(loaded!.migration.targetVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(loaded!.migration.appliedMigrations).toEqual(['save-schema-v0-to-v1', 'save-schema-v1-to-v2-doctrine-focus']);
    expect(loaded!.state).toEqual(state);
  });

  test('imported historical raw RootState uses the same migration authority and is re-saved current', () => {
    jest.spyOn(Date, 'now').mockReturnValue(2000);
    const state = makeState();

    const imported = createSaveFromPayload(state, 'Imported Legacy');

    expect(imported).not.toBeNull();
    expect(imported!.migration.sourceVersion).toBe(LEGACY_SAVE_SCHEMA_VERSION);
    expect(imported!.migration.appliedMigrations).toEqual(['save-schema-v0-to-v1', 'save-schema-v1-to-v2-doctrine-focus']);

    const stored = JSON.parse(localStorage.getItem(`game_save_${imported!.saveId}`) || '{}');
    expect(stored.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(stored.state).toEqual(createPersistedGameState(state));

    const metadata = getSavedGames().find(save => save.id === imported!.saveId);
    expect(metadata?.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
  });

  test('import preserves legacy wrapper gameVersion when embedded state does not carry it', () => {
    jest.spyOn(Date, 'now').mockReturnValue(2500);
    const state = JSON.parse(JSON.stringify(makeState())) as RootState;
    delete (state.meta as any).gameVersion;

    const imported = createSaveFromPayload(
      { version: '0.9.0', timestamp: 123, state },
      'Imported Wrapper Version'
    );

    expect(imported).not.toBeNull();
    expect(imported!.migration.envelope.gameVersion).toBe('0.9.0');

    const stored = JSON.parse(localStorage.getItem(`game_save_${imported!.saveId}`) || '{}');
    expect(stored.gameVersion).toBe('0.9.0');

    const metadata = getSavedGames().find(save => save.id === imported!.saveId);
    expect(metadata?.version).toBe('0.9.0');
  });

  test('imported current envelopes do not receive a second semantic migration', () => {
    jest.spyOn(Date, 'now').mockReturnValue(3000);
    const state = makeState();
    const envelope = createCurrentSaveEnvelope(state, 77);

    const imported = createSaveFromPayload(envelope, 'Imported Current');

    expect(imported).not.toBeNull();
    expect(imported!.migration.sourceVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(imported!.migration.appliedMigrations).toEqual([]);
  });

  test('future local saves fail clearly at the strict load boundary', async () => {
    const future = {
      ...createCurrentSaveEnvelope(makeState(), 1),
      schemaVersion: CURRENT_SAVE_SCHEMA_VERSION + 1,
    };
    localStorage.setItem('game_save_future', JSON.stringify(future));

    await expect(loadSavedGameWithMigration('future')).rejects.toMatchObject({
      name: 'SaveMigrationError',
      code: 'FUTURE_SCHEMA',
    } as Partial<SaveMigrationError>);
  });

  test('rejects malformed save metadata instead of exposing it as a saved game', () => {
    localStorage.setItem('saved_games', JSON.stringify([
      { id: 'valid', name: 'Valid', timestamp: 1, playerLevel: 1 },
      { id: 'invalid', name: 'Missing timestamp' },
    ]));

    expect(getSavedGames()).toEqual([
      { id: 'valid', name: 'Valid', timestamp: 1, playerLevel: 1 },
    ]);
  });

  test('allocates a distinct save id when the clock repeats', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    const state = makeState();

    expect(createSave(state, 'First')).toBe('save_1000');
    expect(createSave(state, 'Second')).toBe('save_1000_1');
    expect(getSavedGames().map(save => save.id)).toEqual(['save_1000', 'save_1000_1']);
  });

  test('classifies malformed JSON as a corrupt save instead of a generic parse failure', async () => {
    localStorage.setItem('game_save_corrupt', '{not-json');

    await expect(loadSavedGameWithMigration('corrupt')).rejects.toMatchObject({
      name: 'SaveStorageError',
      code: 'CORRUPT_PAYLOAD',
      saveId: 'corrupt',
    } as Partial<SaveStorageError>);
  });

  test('recovers valid orphan payloads and removes metadata without payloads', () => {
    const state = makeState();
    const envelope = createCurrentSaveEnvelope(state, 1234);
    localStorage.setItem('game_save_orphan', JSON.stringify(envelope));
    localStorage.setItem('saved_games', JSON.stringify([
      { id: 'missing', name: 'Missing', timestamp: 1, playerLevel: 1 },
    ]));

    expect(recoverSavedGameIndex()).toEqual({
      adoptedSaveIds: ['orphan'],
      removedMetadataIds: ['missing'],
      invalidPayloadIds: [],
    });
    expect(getSavedGames().map(save => save.id)).toEqual(['orphan']);
  });
});
