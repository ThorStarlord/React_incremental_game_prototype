import type { RootState } from '../../app/store';

/**
 * Runtime-only notifications are deliberately excluded from saves. The
 * remaining slices are the canonical player/domain projections required to
 * reconstruct a playable session.
 */
export type PersistedGameState = Omit<RootState, 'notifications'>;

const PERSISTED_DOMAIN_KEYS: readonly (keyof PersistedGameState)[] = [
  'gameLoop',
  'player',
  'traits',
  'essence',
  'settings',
  'meta',
  'npcs',
  'copy',
  'quest',
  'relationships',
  'knowledge',
  'factions',
  'worldState',
  'inventory',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/** Create the explicit persistence projection from runtime Redux state. */
export const createPersistedGameState = (state: RootState): PersistedGameState => {
  const { notifications: _notifications, ...persisted } = state;
  return persisted;
};

/**
 * Runtime validation for decoded/migrated save payloads. TypeScript types do
 * not protect this seam because the input is untrusted JSON.
 */
export const isPersistedGameState = (value: unknown): value is PersistedGameState => {
  if (!isRecord(value)) return false;

  return PERSISTED_DOMAIN_KEYS.every(key => isRecord(value[key])) &&
    !Object.prototype.hasOwnProperty.call(value, 'notifications');
};

/** Validate a complete runtime state before it crosses the Redux replacement seam. */
export const isRuntimeGameState = (value: unknown): value is RootState => {
  if (!isRecord(value)) return false;
  const { notifications, ...persisted } = value;
  return isRecord(notifications) && isPersistedGameState(persisted);
};

/** Rebuild a complete runtime state, resetting transient notifications. */
export const rehydratePersistedGameState = (
  persisted: PersistedGameState,
  runtimeBaseline: RootState
): RootState => {
  if (!isPersistedGameState(persisted)) {
    throw new Error('Persisted game state is incomplete or malformed.');
  }

  if (!runtimeBaseline || !isRecord(runtimeBaseline.notifications)) {
    throw new Error('Runtime baseline is required to rehydrate persisted state.');
  }

  return {
    ...runtimeBaseline,
    ...persisted,
  };
};
