import {
  getLocationDefinition,
  resolveCanonicalLocationId,
} from '../Exploration/LocationDefinitions';
import type { CombatEncounterDefinition } from './CombatTypes';

export interface CombatEncounterLocationAvailability {
  available: boolean;
  currentLocationId?: string;
  requiredLocationId?: string;
  requiredLocationName?: string;
}

/**
 * Bounded active-play availability for encounters authored at one canonical
 * location. Combat arithmetic remains world-agnostic; this helper belongs to the
 * production bridge that decides whether an encounter can be entered at all.
 */
export const getCombatEncounterLocationAvailability = (
  definition: CombatEncounterDefinition,
  playerLocationValue: string
): CombatEncounterLocationAvailability => {
  if (!definition.requiredLocationId) {
    return { available: true };
  }

  const currentLocationId = resolveCanonicalLocationId(playerLocationValue);
  const requiredLocationId = resolveCanonicalLocationId(definition.requiredLocationId);
  const requiredLocationName = requiredLocationId
    ? getLocationDefinition(requiredLocationId)?.name
    : undefined;

  return {
    available: Boolean(
      currentLocationId &&
      requiredLocationId &&
      currentLocationId === requiredLocationId
    ),
    currentLocationId,
    requiredLocationId,
    requiredLocationName,
  };
};
