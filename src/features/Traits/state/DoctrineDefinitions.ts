/**
 * Bounded Campaign One doctrine definitions.
 *
 * A doctrine is not independently persisted progression. It is an authored
 * interpretation of permanently learned Traits that are currently foregrounded
 * together by the player.
 */

export const DOCTRINE_FOCUS_CAPACITY = 2 as const;

export type DoctrineId =
  | 'structural_steward'
  | 'countermodeler';

export interface DoctrineDefinition {
  id: DoctrineId;
  name: string;
  description: string;
  requiredPermanentTraitIds: readonly string[];
}

export const DOCTRINE_DEFINITIONS: Record<DoctrineId, DoctrineDefinition> = {
  structural_steward: {
    id: 'structural_steward',
    name: 'Structural Steward',
    description:
      'Combines Willow\'s slow-system cognition with Gronk\'s constraint-first judgment.',
    requiredPermanentTraitIds: ['WillowsWisdom', 'ConstraintSense'],
  },
  countermodeler: {
    id: 'countermodeler',
    name: 'Countermodeler',
    description:
      'Combines Elara\'s evidence-first revision with Lyra\'s adversarial calibration.',
    requiredPermanentTraitIds: ['ScholarlyInsight', 'AdversarialCalibration'],
  },
};
