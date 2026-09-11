import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { addNotification } from '../../../shared/state/NotificationSlice';
import {
  evaluateCopyProductionTaskEligibility,
  getCopyProductionTaskDefinition,
  getCopyProductionTaskDurationSeconds,
} from '../CopyTaskDefinitions';
import { startCopyTask } from './CopySlice';
import type { CopyProductionTaskId, CopyTask } from './CopyTypes';

export interface CopyPortfolioAssignment {
  copyId: string;
  taskId: string;
}

export interface CopyPortfolioIssue {
  copyId?: string;
  taskId?: string;
  reason: string;
}

export interface CopyPortfolioPreflight {
  eligible: boolean;
  assignments: CopyPortfolioAssignment[];
  issues: CopyPortfolioIssue[];
}

/**
 * Validate the complete player-authored plan before any Copy task changes.
 * The portfolio layer never selects a task on the player's behalf.
 */
export const evaluateCopyPortfolioPlan = (
  state: RootState,
  assignments: CopyPortfolioAssignment[]
): CopyPortfolioPreflight => {
  const issues: CopyPortfolioIssue[] = [];
  const seenCopies = new Set<string>();

  if (assignments.length === 0) {
    issues.push({ reason: 'Choose at least one Copy assignment.' });
  }

  for (const assignment of assignments) {
    if (seenCopies.has(assignment.copyId)) {
      issues.push({
        copyId: assignment.copyId,
        taskId: assignment.taskId,
        reason: 'A Copy can receive only one task in a portfolio plan.',
      });
      continue;
    }
    seenCopies.add(assignment.copyId);

    const copy = state.copy.copies[assignment.copyId];
    if (!copy) {
      issues.push({
        copyId: assignment.copyId,
        taskId: assignment.taskId,
        reason: 'Copy not found.',
      });
      continue;
    }

    const definition = getCopyProductionTaskDefinition(assignment.taskId);
    if (!definition) {
      issues.push({
        copyId: assignment.copyId,
        taskId: assignment.taskId,
        reason: 'Unknown production task.',
      });
      continue;
    }

    if (copy.activeTask?.status === 'running') {
      issues.push({
        copyId: assignment.copyId,
        taskId: assignment.taskId,
        reason: 'A task is already running for this Copy.',
      });
      continue;
    }

    const eligibility = evaluateCopyProductionTaskEligibility(
      copy,
      definition,
      Boolean(state.player.routineFamiliarity?.[definition.id])
    );
    for (const reason of eligibility.reasons) {
      issues.push({
        copyId: assignment.copyId,
        taskId: assignment.taskId,
        reason,
      });
    }
  }

  return {
    eligible: issues.length === 0,
    assignments: assignments.map(assignment => ({ ...assignment })),
    issues,
  };
};

/**
 * Start a portfolio of explicit player assignments after a whole-plan preflight.
 * All task identities come from the existing M20 allowlist and each Copy still
 * receives at most one active task. No narrative or irreversible decisions are
 * delegated by this operation.
 */
export const startCopyPortfolioThunk = createAsyncThunk<
  { assignments: Array<{ copyId: string; taskId: CopyProductionTaskId; durationSeconds: number }> },
  { assignments: CopyPortfolioAssignment[] },
  { state: RootState; rejectValue: string }
>(
  'copy/startPortfolio',
  async ({ assignments }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const preflight = evaluateCopyPortfolioPlan(state, assignments);
    if (!preflight.eligible) {
      const message = preflight.issues.map(issue => issue.reason).join(' ');
      dispatch(addNotification({ type: 'warning', message }));
      return rejectWithValue(message);
    }

    const startedAt = Date.now();
    const started: Array<{
      copyId: string;
      taskId: CopyProductionTaskId;
      durationSeconds: number;
    }> = [];

    // No state mutation occurs before the complete plan passes preflight.
    // Redux dispatch is synchronous here; these actions apply the already
    // validated player-authored assignments without making new choices.
    preflight.assignments.forEach((assignment, index) => {
      const copy = state.copy.copies[assignment.copyId];
      const definition = getCopyProductionTaskDefinition(assignment.taskId)!;
      const durationSeconds = getCopyProductionTaskDurationSeconds(copy, definition);
      const task: CopyTask = {
        id: `task_${definition.id}_${startedAt}_${index}`,
        type: 'timed',
        productionTaskId: definition.id,
        durationSeconds,
        progressSeconds: 0,
        status: 'running',
        startedAt,
        data: { portfolioAssignment: true },
      };
      dispatch(startCopyTask({ copyId: copy.id, task }));
      started.push({ copyId: copy.id, taskId: definition.id, durationSeconds });
    });

    dispatch(addNotification({
      type: 'success',
      message: `Started ${started.length} player-selected Copy assignment${started.length === 1 ? '' : 's'}.`,
    }));

    return { assignments: started };
  }
);