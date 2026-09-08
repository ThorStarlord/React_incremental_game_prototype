import { WHISPERING_WOODS_LOCATION_ID } from '../Exploration/LocationDefinitions';
import type { CombatEncounterDefinition } from './CombatTypes';

export const TELLURIC_ECHO_ENCOUNTER: CombatEncounterDefinition = {
  id: 'encounter_m17_telluric_echo',
  targetId: 'enemy_m17_telluric_echo_fragment',
  name: 'Telluric Echo Fragment',
  description:
    'A telluric manifestation keeps rebuilding itself through a repeating Essence feedback cycle. Conventional pressure can still destroy it, but the pattern may reveal another tactical route.',
  requiredLocationId: WHISPERING_WOODS_LOCATION_ID,
  playerMaxHealth: 12,
  enemyMaxHealth: 12,
  strikeDamage: 4,
  guardReduction: 2,
  phases: {
    stable: {
      incomingDamage: 2,
      nextPhase: 'building',
    },
    building: {
      incomingDamage: 3,
      nextPhase: 'release',
    },
    release: {
      incomingDamage: 1,
      regeneration: 4,
      nextPhase: 'stable',
    },
  },
  feedbackPattern: {
    requiredPermanentTraitIds: ['WillowsWisdom'],
    traceLabel: 'Trace the Cycle',
    traceDescription:
      "Apply Willow's slow-pattern method to read how the Echo's stable, building, and release phases feed one another. This spends tempo instead of dealing damage.",
    disruptLabel: 'Disrupt the Feedback',
    disruptDescription:
      'Interfere at the release phase so the feedback loop can no longer rebuild the manifestation. This does not deal damage by itself.',
    disruptPhase: 'release',
  },
};

export const COMBAT_ENCOUNTERS: CombatEncounterDefinition[] = [
  TELLURIC_ECHO_ENCOUNTER,
];

export const getCombatEncounterByTargetId = (
  targetId: string
): CombatEncounterDefinition | undefined =>
  COMBAT_ENCOUNTERS.find(encounter => encounter.targetId === targetId);
