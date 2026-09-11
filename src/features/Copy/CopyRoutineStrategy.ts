import {
  COPY_PRODUCTION_TASKS,
  evaluateCopyProductionTaskEligibility,
  getCopyProductionTaskDefinition,
  type CopyProductionTaskEligibility,
} from './CopyTaskDefinitions';
import type { Copy, CopyProductionTaskId } from './state/CopyTypes';

export interface CopyRoutinePriorityEvaluation {
  taskId: CopyProductionTaskId;
  name: string;
  priority: number;
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
