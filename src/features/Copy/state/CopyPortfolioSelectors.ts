import type { RootState } from '../../../app/store';
import {
  COPY_PRODUCTION_TASKS,
  evaluateCopyProductionTaskEligibility,
  getCopyProductionTaskDefinition,
} from '../CopyTaskDefinitions';

export interface CopyPortfolioTaskOption {
  taskId: string;
  name: string;
  eligible: boolean;
  reasons: string[];
}

export interface CopyPortfolioRow {
  copyId: string;
  name: string;
  role: string;
  location: string;
  runningTaskId: string | null;
  runningTaskName: string | null;
  taskOptions: CopyPortfolioTaskOption[];
}

export interface CopyPortfolioSummary {
  totalCopies: number;
  runningCopies: number;
  availableCopies: number;
  utilizationPercent: number;
  runningByTask: Record<string, number>;
}

/** Capacity summary only; it does not recommend or assign work. */
export const selectCopyPortfolioSummary = (state: RootState): CopyPortfolioSummary => {
  const copies = Object.values(state.copy.copies);
  const running = copies.filter(copy => copy.activeTask?.status === 'running');
  const runningByTask: Record<string, number> = {};

  for (const copy of running) {
    const taskId = copy.activeTask?.productionTaskId ?? 'legacy';
    runningByTask[taskId] = (runningByTask[taskId] ?? 0) + 1;
  }

  return {
    totalCopies: copies.length,
    runningCopies: running.length,
    availableCopies: copies.length - running.length,
    utilizationPercent: copies.length === 0 ? 0 : (running.length / copies.length) * 100,
    runningByTask,
  };
};

/**
 * Present the player's current Copy portfolio and the authored task choices each
 * Copy is eligible for. The selector does not rank, recommend, or choose tasks.
 */
export const selectCopyPortfolioRows = (state: RootState): CopyPortfolioRow[] =>
  Object.values(state.copy.copies)
    .map(copy => {
      const runningTaskId = copy.activeTask?.status === 'running'
        ? copy.activeTask.productionTaskId ?? 'legacy'
        : null;
      const runningDefinition = runningTaskId && runningTaskId !== 'legacy'
        ? getCopyProductionTaskDefinition(runningTaskId)
        : undefined;

      return {
        copyId: copy.id,
        name: copy.name,
        role: copy.role ?? 'none',
        location: copy.location,
        runningTaskId,
        runningTaskName: runningTaskId
          ? runningDefinition?.name ?? 'Legacy task'
          : null,
        taskOptions: COPY_PRODUCTION_TASKS.map(task => {
          const eligibility = evaluateCopyProductionTaskEligibility(
            copy,
            task,
            Boolean(state.player.routineFamiliarity?.[task.id])
          );
          return {
            taskId: task.id,
            name: task.name,
            eligible: copy.activeTask?.status !== 'running' && eligibility.eligible,
            reasons: copy.activeTask?.status === 'running'
              ? ['A task is already running for this Copy.']
              : eligibility.reasons,
          };
        }),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));