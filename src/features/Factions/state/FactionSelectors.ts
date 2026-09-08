import type { RootState } from '../../../app/store';

/**
 * Read institutional standing without reconstructing it from NPC Relationships.
 * A legacy-like state without the M23 root is neutral by definition.
 */
export const selectFactionReputation = (
  state: RootState,
  factionId: string
): number => {
  const reputationByFactionId =
    (state as RootState & {
      factions?: { reputationByFactionId?: Record<string, number> };
    }).factions?.reputationByFactionId ?? {};

  const value = reputationByFactionId[factionId];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
};
