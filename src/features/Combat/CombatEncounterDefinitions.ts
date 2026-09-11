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

/**
 * Post-M25 cross-domain capability case for Scholarly Insight.
 *
 * This encounter is intentionally engine-qualified before content routing. It
 * demonstrates that the same relationship-derived capability used to reopen an
 * investigation model can also alter tactical option space without becoming a
 * generic numeric buff. Ordinary Strike/Guard remain valid baseline actions.
 */
export const CONTRADICTION_ECHO_ENCOUNTER: CombatEncounterDefinition = {
  id: 'encounter_post_m25_contradiction_echo',
  targetId: 'enemy_post_m25_contradiction_echo',
  name: 'Contradiction Echo',
  description:
    'The manifestation alternates between mutually incompatible readings of the same field. Raw force can still destroy it, but Scholarly Insight can turn the inconsistency into a tactical opening.',
  playerMaxHealth: 14,
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
      incomingDamage: 2,
      regeneration: 3,
      nextPhase: 'stable',
    },
  },
  feedbackPattern: {
    requiredPermanentTraitIds: ['ScholarlyInsight'],
    traceLabel: 'Challenge the Model',
    traceDescription:
      'Apply Scholarly Insight to compare the incompatible readings instead of accepting either one as the whole explanation.',
    disruptLabel: 'Exploit the Contradiction',
    disruptDescription:
      'Act at the point where the two models become mutually inconsistent, preventing the Echo from reconciling itself back into a stable loop.',
    disruptPhase: 'building',
  },
};

export const COMBAT_ENCOUNTERS: CombatEncounterDefinition[] = [
  TELLURIC_ECHO_ENCOUNTER,
  CONTRADICTION_ECHO_ENCOUNTER,
];

export const getCombatEncounterByTargetId = (
  targetId: string
): CombatEncounterDefinition | undefined =>
  COMBAT_ENCOUNTERS.find(encounter => encounter.targetId === targetId);
