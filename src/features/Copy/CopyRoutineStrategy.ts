import {
  COPY_PRODUCTION_TASKS,
  evaluateCopyProductionTaskEligibility,
  getCopyProductionTaskDefinition,
  type CopyProductionTaskDefinition,
  type CopyProductionTaskEligibility,
} from './CopyTaskDefinitions';
import type { Copy, CopyProductionTaskId } from './state/CopyTypes';

export interface CopyRoutinePriorityEvaluation {
  taskId: CopyProductionTaskId;
  name: string;
  priority: number;
  eligibility: CopyProductionTaskEligibility;
}

export type CopyDelegationReadinessStatus =
  | 'unmastered'
  | 'copy_blocked'
  | 'ready';

export interface CopyDelegationReadinessPresentation {
  status: CopyDelegationReadinessStatus;
  label: string;
  reasons: string[];
  eligibility: CopyProductionTaskEligibility;
}

const AUTHORED_TASK_IDS = new Set<CopyProductionTaskId>(
  COPY_PRODUCTION_TASKS.map(task => task.id)
);

/**
 * Keep only currently authored production routines, preserving the player's
 * first occurrence of each id. Unknown or duplicate ids fail closed.
 */
export const normalizeCopyRoutinePriority = (
  taskIds: readonly string[]
): CopyProductionTaskId[] => {
  const seen = new Set<CopyProductionTaskId>();
  const normalized: CopyProductionTaskId[] = [];

  taskIds.forEach(rawId => {
    const taskId = rawId as CopyProductionTaskId;
    if (!AUTHORED_TASK_IDS.has(taskId) || seen.has(taskId)) return;
    seen.add(taskId);
    normalized.push(taskId);
  });

  return normalized;
};

/**
 * Player-facing readiness projection over the existing M20 eligibility
 * authority. This helper does not create familiarity, change Copy state, or
 * start/choose a task.
 */
export const presentCopyProductionTaskReadiness = (
  copy: Copy,
  task: CopyProductionTaskDefinition,
  isFamiliar: boolean
): CopyDelegationReadinessPresentation => {
  const eligibility = evaluateCopyProductionTaskEligibility(
    copy,
    task,
    isFamiliar
  );

  if (!isFamiliar) {
    return {
      status: 'unmastered',
      label: `Not mastered yet: ${task.familiarityHint}`,
      reasons: [task.familiarityHint],
      eligibility,
    };
  }

  if (eligibility.eligible) {
    return {
      status: 'ready',
      label: 'Ready to delegate: mastered by you, and this Copy meets the current requirements.',
      reasons: [],
      eligibility,
    };
  }

  return {
    status: 'copy_blocked',
    label: 'Mastered by you; this Copy is not ready yet.',
    reasons: eligibility.reasons,
    eligibility,
  };
};

export const evaluateCopyRoutinePriority = (
  copy: Copy,
  routineFamiliarity: Partial<Record<CopyProductionTaskId, unknown>>,
  priority: readonly CopyProductionTaskId[] = copy.routinePriority ?? []
): CopyRoutinePriorityEvaluation[] =>
  normalizeCopyRoutinePriority(priority).flatMap((taskId, index) => {
    const definition = getCopyProductionTaskDefinition(taskId);
    if (!definition) return [];
    return [{
      taskId,
      name: definition.name,
      priority: index + 1,
      eligibility: evaluateCopyProductionTaskEligibility(
        copy,
        definition,
        Boolean(routineFamiliarity[taskId])
      ),
    }];
  });

export const getFirstEligiblePreferredProductionTask = (
  copy: Copy,
  routineFamiliarity: Partial<Record<CopyProductionTaskId, unknown>>
): CopyProductionTaskId | undefined =>
  evaluateCopyRoutinePriority(copy, routineFamiliarity).find(
    candidate => candidate.eligibility.eligible
  )?.taskId;
