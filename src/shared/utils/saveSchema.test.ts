import { rootReducer, type RootState } from '../../app/store';
import {
  CURRENT_SAVE_SCHEMA_VERSION,
  LEGACY_SAVE_SCHEMA_VERSION,
  SaveMigrationError,
  createCurrentSaveEnvelope,
  detectSaveSchemaVersion,
  migrateSavePayload,
  runSaveMigrationChain,
  type SaveMigrationRegistry,
} from './saveSchema';

const makeState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT' } as any);

const makeLegacyPayload = (state: RootState) => ({
  version: '0.9.0',
  timestamp: 123,
  state,
});

describe('M10 save schema migration pipeline', () => {
  test('new envelopes carry one authoritative current schema version', () => {
    const envelope = createCurrentSaveEnvelope(makeState(), 456);

    expect(envelope.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(envelope.timestamp).toBe(456);
    expect(detectSaveSchemaVersion(envelope)).toBe(CURRENT_SAVE_SCHEMA_VERSION);
  });

  test('current-version saves require no migration and preserve authoritative state', () => {
    const state = makeState();
    const envelope = createCurrentSaveEnvelope(state, 456);
    const result = migrateSavePayload(envelope);

    expect(result.sourceVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(result.targetVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(result.appliedMigrations).toEqual([]);
    expect(result.envelope.state).toEqual(state);
    expect(result.envelope).not.toBe(envelope);
  });

  test('missing schemaVersion is the single documented legacy v0 representation', () => {
    const state = makeState();
    const legacy = makeLegacyPayload(state);
    const before = JSON.parse(JSON.stringify(legacy));

    expect(detectSaveSchemaVersion(legacy)).toBe(LEGACY_SAVE_SCHEMA_VERSION);

    const result = migrateSavePayload(legacy);

    expect(result.sourceVersion).toBe(LEGACY_SAVE_SCHEMA_VERSION);
    expect(result.targetVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(result.appliedMigrations).toEqual(['save-schema-v0-to-v1']);
    expect(result.envelope.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(result.envelope.state).toEqual(state);
    expect(legacy).toEqual(before);
  });

  test('historical raw RootState exports are also interpreted as legacy v0', () => {
    const state = makeState();
    const result = migrateSavePayload(state);

    expect(result.sourceVersion).toBe(LEGACY_SAVE_SCHEMA_VERSION);
    expect(result.appliedMigrations).toEqual(['save-schema-v0-to-v1']);
    expect(result.envelope.state).toEqual(state);
    expect(result.envelope.timestamp).toBe(0);
  });

  test('future schema versions are rejected rather than downgraded implicitly', () => {
    const future = {
      ...createCurrentSaveEnvelope(makeState(), 1),
      schemaVersion: CURRENT_SAVE_SCHEMA_VERSION + 1,
    };

    expect(() => migrateSavePayload(future)).toThrow(SaveMigrationError);
    expect(() => migrateSavePayload(future)).toThrow(/newer than supported schema/i);
  });

  test('generic migration registry applies every step in deterministic ascending order', () => {
    const order: string[] = [];
    const registry: SaveMigrationRegistry = {
      0: {
        id: 'test-v0-to-v1',
        fromVersion: 0,
        toVersion: 1,
        migrate: envelope => {
          order.push('0->1');
          return { ...envelope, schemaVersion: 1 };
        },
      },
      1: {
        id: 'test-v1-to-v2',
        fromVersion: 1,
        toVersion: 2,
        migrate: envelope => {
          order.push('1->2');
          return { ...envelope, schemaVersion: 2 };
        },
      },
    };

    const result = runSaveMigrationChain(makeLegacyPayload(makeState()), 2, registry);

    expect(order).toEqual(['0->1', '1->2']);
    expect(result.appliedMigrations).toEqual(['test-v0-to-v1', 'test-v1-to-v2']);
    expect(result.envelope.schemaVersion).toBe(2);
  });

  test('missing migration steps fail at the exact version boundary', () => {
    const registry: SaveMigrationRegistry = {
      0: {
        id: 'test-v0-to-v1',
        fromVersion: 0,
        toVersion: 1,
        migrate: envelope => ({ ...envelope, schemaVersion: 1 }),
      },
    };

    expect(() =>
      runSaveMigrationChain(makeLegacyPayload(makeState()), 2, registry)
    ).toThrow(/Missing save migration v1 -> v2/);
  });

  test('invalid migration registrations cannot skip a schema boundary', () => {
    const registry: SaveMigrationRegistry = {
      0: {
        id: 'bad-v0-to-v2',
        fromVersion: 0,
        toVersion: 2,
        migrate: envelope => ({ ...envelope, schemaVersion: 2 }),
      },
    };

    expect(() =>
      runSaveMigrationChain(makeLegacyPayload(makeState()), 2, registry)
    ).toThrow(/expected v0 -> v1/i);
  });

  test('migration is idempotent at the persistent boundary', () => {
    const first = migrateSavePayload(makeLegacyPayload(makeState()));
    const second = migrateSavePayload(first.envelope);

    expect(first.appliedMigrations).toEqual(['save-schema-v0-to-v1']);
    expect(second.appliedMigrations).toEqual([]);
    expect(second.envelope).toEqual(first.envelope);
  });
});
