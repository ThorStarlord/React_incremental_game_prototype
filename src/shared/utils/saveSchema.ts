import type { RootState } from '../../app/store';

export const LEGACY_SAVE_SCHEMA_VERSION = 0;
export const CURRENT_SAVE_SCHEMA_VERSION = 1;

export type SaveMigrationErrorCode =
  | 'INVALID_SAVE'
  | 'FUTURE_SCHEMA'
  | 'MISSING_MIGRATION'
  | 'INVALID_MIGRATION_RESULT';

export class SaveMigrationError extends Error {
  constructor(
    message: string,
    public readonly code: SaveMigrationErrorCode,
    public readonly sourceVersion?: number,
    public readonly targetVersion?: number
  ) {
    super(message);
    this.name = 'SaveMigrationError';
  }
}

export interface VersionedSaveEnvelope {
  schemaVersion: number;
  gameVersion: string;
  timestamp: number;
  state: RootState;
}

export interface CurrentSaveEnvelope extends VersionedSaveEnvelope {
  schemaVersion: typeof CURRENT_SAVE_SCHEMA_VERSION;
}

export interface SaveMigrationStep {
  id: string;
  fromVersion: number;
  toVersion: number;
  migrate: (envelope: VersionedSaveEnvelope) => VersionedSaveEnvelope;
}

export type SaveMigrationRegistry = Readonly<Record<number, SaveMigrationStep>>;

export interface SaveMigrationChainResult {
  sourceVersion: number;
  targetVersion: number;
  appliedMigrations: string[];
  envelope: VersionedSaveEnvelope;
}

export interface SaveMigrationResult extends Omit<SaveMigrationChainResult, 'envelope'> {
  envelope: CurrentSaveEnvelope;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isRootStateLike = (value: unknown): value is RootState => {
  if (!isRecord(value)) return false;
  return isRecord(value.player) && isRecord(value.meta);
};

const cloneSerializable = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

const readGameVersion = (state: RootState, explicitVersion?: unknown): string => {
  if (typeof explicitVersion === 'string' && explicitVersion.length > 0) {
    return explicitVersion;
  }

  const meta = state.meta as unknown as Record<string, unknown>;
  return typeof meta.gameVersion === 'string' && meta.gameVersion.length > 0
    ? meta.gameVersion
    : '1.0.0';
};

export const detectSaveSchemaVersion = (payload: unknown): number => {
  if (!isRecord(payload)) {
    throw new SaveMigrationError(
      'Save payload must be an object.',
      'INVALID_SAVE'
    );
  }

  if (payload.schemaVersion === undefined) {
    return LEGACY_SAVE_SCHEMA_VERSION;
  }

  // Schema identity is part of the persistent contract. Do not coerce strings,
  // null, booleans, or other malformed values into a numeric version because
  // doing so can route corrupt payloads through the wrong migration path.
  if (
    typeof payload.schemaVersion !== 'number' ||
    !Number.isInteger(payload.schemaVersion) ||
    payload.schemaVersion < 0
  ) {
    throw new SaveMigrationError(
      `Invalid save schema version: ${String(payload.schemaVersion)}`,
      'INVALID_SAVE'
    );
  }

  return payload.schemaVersion;
};

const normalizeLegacyPayload = (payload: unknown): VersionedSaveEnvelope => {
  if (!isRecord(payload)) {
    throw new SaveMigrationError('Legacy save payload must be an object.', 'INVALID_SAVE');
  }

  const wrappedState = Object.prototype.hasOwnProperty.call(payload, 'state')
    ? payload.state
    : payload;

  if (!isRootStateLike(wrappedState)) {
    throw new SaveMigrationError(
      'Legacy save payload does not contain a recognizable game state.',
      'INVALID_SAVE',
      LEGACY_SAVE_SCHEMA_VERSION,
      CURRENT_SAVE_SCHEMA_VERSION
    );
  }

  const timestamp =
    typeof payload.timestamp === 'number' && Number.isFinite(payload.timestamp)
      ? payload.timestamp
      : 0;

  return {
    schemaVersion: LEGACY_SAVE_SCHEMA_VERSION,
    gameVersion: readGameVersion(wrappedState, payload.version),
    timestamp,
    state: cloneSerializable(wrappedState),
  };
};

const normalizeVersionedEnvelope = (payload: unknown): VersionedSaveEnvelope => {
  if (!isRecord(payload)) {
    throw new SaveMigrationError('Versioned save payload must be an object.', 'INVALID_SAVE');
  }

  const schemaVersion = detectSaveSchemaVersion(payload);
  if (!isRootStateLike(payload.state)) {
    throw new SaveMigrationError(
      `Save schema v${schemaVersion} does not contain a recognizable game state.`,
      'INVALID_SAVE',
      schemaVersion,
      CURRENT_SAVE_SCHEMA_VERSION
    );
  }

  const timestamp = Number(payload.timestamp);
  if (!Number.isFinite(timestamp)) {
    throw new SaveMigrationError(
      `Save schema v${schemaVersion} has an invalid timestamp.`,
      'INVALID_SAVE',
      schemaVersion,
      CURRENT_SAVE_SCHEMA_VERSION
    );
  }

  return {
    schemaVersion,
    gameVersion: readGameVersion(payload.state, payload.gameVersion),
    timestamp,
    state: cloneSerializable(payload.state),
  };
};

const migrateV0ToV1: SaveMigrationStep = {
  id: 'save-schema-v0-to-v1',
  fromVersion: 0,
  toVersion: 1,
  migrate: envelope => ({
    ...envelope,
    schemaVersion: 1,
  }),
};

export const SAVE_MIGRATIONS: SaveMigrationRegistry = {
  0: migrateV0ToV1,
};

export const runSaveMigrationChain = (
  payload: unknown,
  targetVersion: number,
  registry: SaveMigrationRegistry = SAVE_MIGRATIONS
): SaveMigrationChainResult => {
  const sourceVersion = detectSaveSchemaVersion(payload);

  if (sourceVersion > targetVersion) {
    throw new SaveMigrationError(
      `Save schema v${sourceVersion} is newer than supported schema v${targetVersion}.`,
      'FUTURE_SCHEMA',
      sourceVersion,
      targetVersion
    );
  }

  let envelope =
    sourceVersion === LEGACY_SAVE_SCHEMA_VERSION
      ? normalizeLegacyPayload(payload)
      : normalizeVersionedEnvelope(payload);

  const appliedMigrations: string[] = [];

  while (envelope.schemaVersion < targetVersion) {
    const step = registry[envelope.schemaVersion];
    const expectedNextVersion = envelope.schemaVersion + 1;

    if (!step) {
      throw new SaveMigrationError(
        `Missing save migration v${envelope.schemaVersion} -> v${expectedNextVersion}.`,
        'MISSING_MIGRATION',
        envelope.schemaVersion,
        targetVersion
      );
    }

    if (
      step.fromVersion !== envelope.schemaVersion ||
      step.toVersion !== expectedNextVersion
    ) {
      throw new SaveMigrationError(
        `Invalid migration registration ${step.id}: expected v${envelope.schemaVersion} -> v${expectedNextVersion}, got v${step.fromVersion} -> v${step.toVersion}.`,
        'INVALID_MIGRATION_RESULT',
        envelope.schemaVersion,
        targetVersion
      );
    }

    const nextEnvelope = step.migrate(cloneSerializable(envelope));
    const normalizedNext = normalizeVersionedEnvelope(nextEnvelope);

    if (normalizedNext.schemaVersion !== step.toVersion) {
      throw new SaveMigrationError(
        `Migration ${step.id} produced schema v${normalizedNext.schemaVersion}; expected v${step.toVersion}.`,
        'INVALID_MIGRATION_RESULT',
        envelope.schemaVersion,
        targetVersion
      );
    }

    envelope = normalizedNext;
    appliedMigrations.push(step.id);
  }

  return {
    sourceVersion,
    targetVersion,
    appliedMigrations,
    envelope,
  };
};

export const migrateSavePayload = (payload: unknown): SaveMigrationResult => {
  const result = runSaveMigrationChain(
    payload,
    CURRENT_SAVE_SCHEMA_VERSION,
    SAVE_MIGRATIONS
  );

  if (result.envelope.schemaVersion !== CURRENT_SAVE_SCHEMA_VERSION) {
    throw new SaveMigrationError(
      `Save migration stopped at schema v${result.envelope.schemaVersion}; expected v${CURRENT_SAVE_SCHEMA_VERSION}.`,
      'INVALID_MIGRATION_RESULT',
      result.sourceVersion,
      CURRENT_SAVE_SCHEMA_VERSION
    );
  }

  return {
    ...result,
    envelope: result.envelope as CurrentSaveEnvelope,
  };
};

export const createCurrentSaveEnvelope = (
  state: RootState,
  timestamp: number = Date.now()
): CurrentSaveEnvelope => ({
  schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
  gameVersion: readGameVersion(state),
  timestamp,
  state: cloneSerializable(state),
});
