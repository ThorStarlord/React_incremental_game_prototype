import type { RootState } from '../../app/store';
import { getCopyProductionTaskDefinition } from './CopyTaskDefinitions';
import type {
  CopyExceptionContext,
  CopyProductionTaskId,
} from './state/CopyTypes';

export type ProcedureFamilyId = 'network_assurance';
export type OperationalDomainId = 'known_state_stewardship';

export interface ProcedureFamilyDefinition {
  id: ProcedureFamilyId;
  name: string;
  description: string;
  requiredRoutineIds: CopyProductionTaskId[];
}

export interface ProcedureFamilyProgress extends ProcedureFamilyDefinition {
  masteredRoutineIds: CopyProductionTaskId[];
  missingRoutineIds: CopyProductionTaskId[];
  status: 'developing' | 'mastered';
}

export interface StandingResponsibilityView {
  copyId: string;
  copyName: string;
  routineId: CopyProductionTaskId;
  routineName: string;
}

export type OperationalDomainStatus =
  | 'developing'
  | 'ready'
  | 'operating'
  | 'attention_required';

export interface OperationalDomainProgress {
  id: OperationalDomainId;
  name: string;
  description: string;
  status: OperationalDomainStatus;
  reasons: string[];
}

export type CopyEscalationBoundaryId =
  | 'unknown_or_conflicting_evidence'
  | 'conflicting_policy'
  | 'irreversible_consequence'
  | 'social_novelty'
  | 'repeated_failure';

export interface CopyEscalationBoundaryDefinition {
  id: CopyEscalationBoundaryId;
  label: string;
  description: string;
}

export const COPY_ESCALATION_BOUNDARIES: Record<
  CopyEscalationBoundaryId,
  CopyEscalationBoundaryDefinition
> = {
  unknown_or_conflicting_evidence: {
    id: 'unknown_or_conflicting_evidence',
    label: 'Unknown or conflicting evidence',
    description:
      'The observed state no longer fits the mastered procedure or its established evidence assumptions.',
  },
  conflicting_policy: {
    id: 'conflicting_policy',
    label: 'Conflicting authorized policies',
    description:
      'Two player-authored standing responsibilities cannot both be satisfied safely without a new priority decision.',
  },
  irreversible_consequence: {
    id: 'irreversible_consequence',
    label: 'Irreversible consequence',
    description:
      'The next action would commit a narrative, social, faction, or world-state consequence that remains player-owned.',
  },
  social_novelty: {
    id: 'social_novelty',
    label: 'Novel social judgment',
    description:
      'The situation requires interpreting a person, relationship, or institution beyond an already-mastered routine.',
  },
  repeated_failure: {
    id: 'repeated_failure',
    label: 'Repeated procedure failure',
    description:
      'An established response has failed often enough that repeating it is no longer safe evidence of mastery.',
  },
};

export const PROCEDURE_FAMILY_DEFINITIONS: ProcedureFamilyDefinition[] = [
  {
    id: 'network_assurance',
    name: 'Network Assurance',
    description:
      'Calibration and independent verification share a bounded method: preserve a known-good state, test it against evidence, and return anomalies instead of inventing a new interpretation.',
    requiredRoutineIds: ['resonance_calibration', 'archive_verification'],
  },
];

export const CAMPAIGN_ONE_COPY_ORGANIZATION_CEILING = {
  id: 'specialized_copies_with_standing_responsibilities',
  name: 'Specialized Copies with standing responsibilities',
  summary:
    'Campaign One stops at player -> specialized Copies -> authored standing responsibilities -> exception escalation.',
  allows: [
    'player-authored routine priorities',
    'authored standing condition maintenance for personally mastered work',
    'specialized Copy roles',
    'durable exception escalation back to the player',
  ],
  excludes: [
    'Copy-managed subordinate Copies',
    'generic queues or behavior planners',
    'autonomous strategic goal selection',
    'irreversible narrative, social, faction, or world decisions',
    'offline standing-order selection or chaining',
  ],
} as const;

export const getCopyExceptionBoundaryDefinition = (
  _context: CopyExceptionContext
): CopyEscalationBoundaryDefinition =>
  COPY_ESCALATION_BOUNDARIES.unknown_or_conflicting_evidence;

export interface MasteryCompressionOverview {
  masteredRoutineIds: CopyProductionTaskId[];
  procedureFamilies: ProcedureFamilyProgress[];
  standingResponsibilities: StandingResponsibilityView[];
  unresolvedExceptionCount: number;
  operationalDomain: OperationalDomainProgress;
  organizationalCeiling: typeof CAMPAIGN_ONE_COPY_ORGANIZATION_CEILING;
}

const activeStandingResponsibilities = (
  state: RootState
): StandingResponsibilityView[] =>
  Object.values(state.copy.copies)
    .flatMap(copy =>
      (Object.keys(copy.standingOrders ?? {}) as CopyProductionTaskId[])
        .filter(routineId => Boolean(copy.standingOrders?.[routineId]?.enabled))
        .map(routineId => ({
          copyId: copy.id,
          copyName: copy.name,
          routineId,
          routineName:
            getCopyProductionTaskDefinition(routineId)?.name ?? routineId,
        }))
    )
    .sort((a, b) =>
      a.copyName.localeCompare(b.copyName) ||
      a.routineName.localeCompare(b.routineName)
    );

export const deriveMasteryCompressionOverview = (
  state: RootState
): MasteryCompressionOverview => {
  const masteredRoutineIds = (
    Object.keys(state.player.routineFamiliarity ?? {}) as CopyProductionTaskId[]
  ).sort();

  const mastered = new Set<CopyProductionTaskId>(masteredRoutineIds);
  const procedureFamilies = PROCEDURE_FAMILY_DEFINITIONS.map(definition => {
    const masteredFamilyRoutines = definition.requiredRoutineIds.filter(id =>
      mastered.has(id)
    );
    const missingRoutineIds = definition.requiredRoutineIds.filter(
      id => !mastered.has(id)
    );

    return {
      ...definition,
      masteredRoutineIds: masteredFamilyRoutines,
      missingRoutineIds,
      status: missingRoutineIds.length === 0
        ? 'mastered' as const
        : 'developing' as const,
    };
  });

  const standingResponsibilities = activeStandingResponsibilities(state);
  const unresolvedExceptionCount = Object.values(state.copy.exceptionsById ?? {})
    .filter(exception => exception.status !== 'resolved').length;

  const networkAssurance = procedureFamilies.find(
    family => family.id === 'network_assurance'
  )!;
  const forgeMastered = mastered.has('forge_assistance');
  const archiveStanding = standingResponsibilities.some(
    responsibility => responsibility.routineId === 'archive_verification'
  );

  const reasons: string[] = [];
  if (networkAssurance.status !== 'mastered') {
    reasons.push(
      `Network Assurance still needs ${networkAssurance.missingRoutineIds.length} mastered routine${networkAssurance.missingRoutineIds.length === 1 ? '' : 's'}.`
    );
  }
  if (!forgeMastered) {
    reasons.push('Forge Assistance is not yet personally mastered.');
  }
  if (networkAssurance.status === 'mastered' && forgeMastered && !archiveStanding) {
    reasons.push(
      'The player has enough personal mastery for known-state stewardship, but no authored Archive standing responsibility is active.'
    );
  }
  if (unresolvedExceptionCount > 0) {
    reasons.push(
      `${unresolvedExceptionCount} automation exception${unresolvedExceptionCount === 1 ? '' : 's'} currently require player judgment.`
    );
  }

  let status: OperationalDomainStatus = 'developing';
  if (networkAssurance.status === 'mastered' && forgeMastered) {
    if (!archiveStanding) {
      status = 'ready';
    } else if (unresolvedExceptionCount > 0) {
      status = 'attention_required';
    } else {
      status = 'operating';
    }
  }

  return {
    masteredRoutineIds,
    procedureFamilies,
    standingResponsibilities,
    unresolvedExceptionCount,
    operationalDomain: {
      id: 'known_state_stewardship',
      name: 'Known-State Stewardship',
      description:
        'Personally learned support, calibration, and verification have become enough shared procedure to preserve known conditions while novel judgment remains with the player.',
      status,
      reasons,
    },
    organizationalCeiling: CAMPAIGN_ONE_COPY_ORGANIZATION_CEILING,
  };
};

export const formatMasteryCompressionEpilogue = (
  overview: MasteryCompressionOverview
): string | null => {
  const active = overview.standingResponsibilities;
  if (active.length > 0) {
    const labels = active.map(
      responsibility => `${responsibility.routineName} under ${responsibility.copyName}`
    );
    const attention = overview.unresolvedExceptionCount > 0
      ? ` ${overview.unresolvedExceptionCount} exception${overview.unresolvedExceptionCount === 1 ? ' still returns' : 's still return'} to your judgment.`
      : ' Anything outside that mastered authority still returns to your judgment.';

    return `Mastery compression: ${labels.join('; ')} now operate as standing responsibilities, so known work can proceed without direct scheduling.${attention}`;
  }

  if (overview.masteredRoutineIds.length > 0) {
    return `Mastery compression: ${overview.masteredRoutineIds.length} routine${overview.masteredRoutineIds.length === 1 ? ' is' : 's are'} personally mastered, but no standing responsibility remains active; the knowledge is durable even when direct scheduling is still required.`;
  }

  return null;
};
