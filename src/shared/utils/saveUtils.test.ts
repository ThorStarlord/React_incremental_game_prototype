import { rootReducer, type RootState } from '../../app/store';
import {
  createSave,
  createSaveFromPayload,
  getSavedGames,
  loadSavedGameWithMigration,
} from './saveUtils';
import {
  CURRENT_SAVE_SCHEMA_VERSION,
  LEGACY_SAVE_SCHEMA_VERSION,
  SaveMigrationError,
  createCurrentSaveEnvelope,
} from './saveSchema';

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
    expect(stored.state).toEqual(state);

    const metadata = getSavedGames();
    expect(metadata).toHaveLength(1);
    expect(metadata[0].schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(metadata[0].id).toBe(saveId);
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
    expect(loaded!.migration.appliedMigrations).toEqual(['save-schema-v0-to-v1']);
    expect(loaded!.state).toEqual(state);
  });

  test('imported historical raw RootState uses the same migration authority and is re-saved current', () => {
    jest.spyOn(Date, 'now').mockReturnValue(2000);
    const state = makeState();

    const imported = createSaveFromPayload(state, 'Imported Legacy');

    expect(imported).not.toBeNull();
    expect(imported!.migration.sourceVersion).toBe(LEGACY_SAVE_SCHEMA_VERSION);
    expect(imported!.migration.appliedMigrations).toEqual(['save-schema-v0-to-v1']);

    const stored = JSON.parse(localStorage.getItem(`game_save_${imported!.saveId}`) || '{}');
    expect(stored.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(stored.state).toEqual(state);

    const metadata = getSavedGames().find(save => save.id === imported!.saveId);
    expect(metadata?.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
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
});
