import type { RootState } from '../../app/store';
import {
  evaluateCopyProductionTaskEligibility,
  getCopyProductionTaskDefinition,
} from './CopyTaskDefinitions';
import type {
  Copy,
  CopyProductionTaskId,
  CopyStandingOrder,
} from './state/CopyTypes';

export type CopyStandingOrderEvaluation =
  | { kind: 'satisfied' }
  | { kind: 'blocked'; reasons: string[] }
  | {
      kind: 'start_task';
      taskId: CopyProductionTaskId;
      subjectId: string;
    };

/**
 * Pure standing-order evaluation.
 *
 * Standing orders never mutate state or bypass the existing production-task
 * eligibility authority. They decide only whether an already-mastered,
 * player-approved routine has one bounded unit of work ready to start.
 */
export const evaluateCopyStandingOrder = (
  state: RootState,
  copy: Copy,
  routineId: CopyProductionTaskId,
  order: CopyStandingOrder
): CopyStandingOrderEvaluation => {
  if (!order.enabled) return { kind: 'satisfied' };

  const isArchive =
    routineId === 'archive_verification' &&
    order.condition.type === 'archive_verification_backlog';
  const isForge =
    routineId === 'forge_assistance' &&
    order.condition.type === 'forge_maintenance_backlog';

  if (!isArchive && !isForge) {
    return {
      kind: 'blocked',
      reasons: ['No authored standing-order evaluator exists for this routine.'],
    };
  }

  const unresolvedException = Object.values(state.copy.exceptionsById ?? {})
    .find(exception =>
      exception.copyId === copy.id &&
      exception.routineId === routineId &&
      exception.status !== 'resolved'
    );

  if (unresolvedException) {
    return {
      kind: 'blocked',
      reasons: ['Player judgment is required before this standing responsibility can continue.'],
    };
  }

  const definition = getCopyProductionTaskDefinition(routineId);
  if (!definition) {
    return {
      kind: 'blocked',
      reasons: ['The authored production-task definition is unavailable.'],
    };
  }

  const eligibility = evaluateCopyProductionTaskEligibility(
    copy,
    definition,
    Boolean(state.player.routineFamiliarity?.[routineId])
  );
  if (!eligibility.eligible) {
    return { kind: 'blocked', reasons: eligibility.reasons };
  }

  const candidateCases: Array<{ id: string; status: string; createdAtTick: number }> = isForge
    ? Object.values(state.copy.forgeMaintenanceCasesById ?? {})
    : Object.values(state.copy.archiveVerificationCasesById ?? {});

  const pendingCases = candidateCases
    .filter(candidate => candidate.status === 'pending')
    .sort((a, b) =>
      a.createdAtTick - b.createdAtTick || a.id.localeCompare(b.id)
    );

  if (pendingCases.length <= order.condition.targetPending) {
    return { kind: 'satisfied' };
  }

  return {
    kind: 'start_task',
    taskId: routineId,
    subjectId: pendingCases[0].id,
  };
};
