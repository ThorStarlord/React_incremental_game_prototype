import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../../../app/store';
import { addNotification } from '../../../shared/state/NotificationSlice';
import {
  getFirstEligiblePreferredProductionTask,
  normalizeCopyRoutinePriority,
} from '../CopyRoutineStrategy';
import { evaluateCopyStandingOrder } from '../CopyStandingOrderEngine';
import type {
  CopyProductionTaskId,
  CopyStandingOrder,
} from './CopyTypes';
import {
  assignArchiveVerificationCase,
  assignForgeMaintenanceCase,
  markCopyStandingOrderTriggered,
  setCopyStandingOrder,
  updateCopy,
} from './CopySlice';
import { startCopyProductionTaskThunk } from './CopyThunks';

export const setCopyRoutinePriorityThunk = createAsyncThunk<
  { copyId: string; routinePriority: CopyProductionTaskId[] },
  { copyId: string; taskIds: readonly string[] },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'copy/setRoutinePriority',
  async ({ copyId, taskIds }, { getState, dispatch, rejectWithValue }) => {
    const copy = getState().copy.copies[copyId];
    if (!copy) return rejectWithValue('Copy not found.');

    const routinePriority = normalizeCopyRoutinePriority(taskIds);
    dispatch(updateCopy({ copyId, updates: { routinePriority } }));
    dispatch(addNotification({
      type: 'success',
      message: routinePriority.length > 0
        ? 'Routine priority updated.'
        : 'Routine priority cleared.',
    }));

    return { copyId, routinePriority };
  }
);

/**
 * Start the first player-approved routine that is currently eligible.
 *
 * This is a bounded convenience action, not autonomous planning: it reads only
 * the player's ordered allowlist, never chains tasks, and delegates execution to
 * the existing M20 start thunk so one-active-task and eligibility rules remain
 * authoritative.
 */
export const startPreferredCopyProductionTaskThunk = createAsyncThunk<
  { copyId: string; taskId: CopyProductionTaskId },
  string,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'copy/startPreferredProductionTask',
  async (copyId, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const copy = state.copy.copies[copyId];
    if (!copy) return rejectWithValue('Copy not found.');
    if (copy.activeTask?.status === 'running') {
      return rejectWithValue('Task already running.');
    }

    const taskId = getFirstEligiblePreferredProductionTask(
      copy,
      state.player.routineFamiliarity ?? {}
    );
    if (!taskId) {
      const message = 'No preferred routine is currently eligible.';
      dispatch(addNotification({ type: 'warning', message }));
      return rejectWithValue(message);
    }

    await dispatch(startCopyProductionTaskThunk({
      copyId,
      taskId,
      origin: { type: 'preferred_manual' },
    })).unwrap();
    return { copyId, taskId };
  }
);


/**
 * Enable or disable a bounded standing responsibility.
 *
 * Authored standing orders exist for Archive Verification and Forge Assistance
 * only. Enabling does not make an ineligible Copy eligible; the live evaluator
 * will report it as blocked until the existing production-task requirements
 * are satisfied.
 */
export const setCopyStandingOrderThunk = createAsyncThunk<
  { copyId: string; taskId: CopyProductionTaskId; enabled: boolean },
  { copyId: string; taskId: CopyProductionTaskId; enabled: boolean },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'copy/setStandingOrder',
  async ({ copyId, taskId, enabled }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const copy = state.copy.copies[copyId];
    if (!copy) return rejectWithValue('Copy not found.');

    if (taskId !== 'archive_verification' && taskId !== 'forge_assistance') {
      return rejectWithValue('No authored standing order exists for this routine.');
    }

    if (!state.player.routineFamiliarity?.[taskId]) {
      return rejectWithValue('Master this routine personally before assigning a standing responsibility.');
    }

    const routineName = taskId === 'forge_assistance' ? 'Forge Assistance' : 'Archive Verification';

    if (!enabled) {
      dispatch(setCopyStandingOrder({ copyId, routineId: taskId, order: null }));
      dispatch(addNotification({
        type: 'info',
        message: `${routineName} standing order disabled.`,
      }));
      return { copyId, taskId, enabled };
    }

    const order: CopyStandingOrder = {
      enabled: true,
      condition: taskId === 'forge_assistance'
        ? {
            type: 'forge_maintenance_backlog',
            targetPending: 0,
          }
        : {
            type: 'archive_verification_backlog',
            targetPending: 0,
          },
      enabledAtTick: state.gameLoop.currentTick,
    };

    dispatch(setCopyStandingOrder({ copyId, routineId: taskId, order }));

    const normalizedPriority = normalizeCopyRoutinePriority([
      ...(copy.routinePriority ?? []),
      taskId,
    ]);
    dispatch(updateCopy({ copyId, updates: { routinePriority: normalizedPriority } }));

    dispatch(addNotification({
      type: 'success',
      message: taskId === 'forge_assistance'
        ? 'Forge Assistance standing order enabled. Known maintenance work may now start automatically; structural deviations still require your judgment.'
        : 'Archive Verification standing order enabled. Known verification work may now start automatically; anomalies still require your judgment.',
    }));

    return { copyId, taskId, enabled };
  }
);

/**
 * Evaluate standing orders once per admitted live GameLoop tick.
 *
 * Copies are processed in stable id order and each Copy may start at most one
 * task per tick. Existing production-task authority performs final validation.
 */
export const processCopyStandingOrdersThunk = createAsyncThunk<
  { started: number },
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  'copy/processStandingOrders',
  async (_payload, { getState, dispatch }) => {
    let started = 0;
    const copyIds = Object.keys(getState().copy.copies).sort();

    for (const copyId of copyIds) {
      let state = getState();
      let copy = state.copy.copies[copyId];
      if (!copy || copy.activeTask?.status === 'running') continue;

      const priority = normalizeCopyRoutinePriority(copy.routinePriority ?? []);

      for (const routineId of priority) {
        state = getState();
        copy = state.copy.copies[copyId];
        const order = copy?.standingOrders?.[routineId];
        if (!copy || !order?.enabled || copy.activeTask?.status === 'running') continue;

        const evaluation = evaluateCopyStandingOrder(state, copy, routineId, order);
        if (evaluation.kind !== 'start_task') continue;

        const result = await dispatch(startCopyProductionTaskThunk({
          copyId,
          taskId: evaluation.taskId,
          origin: {
            type: 'standing_order',
            routineId: evaluation.taskId,
            subjectId: evaluation.subjectId,
          },
        }));

        if (!startCopyProductionTaskThunk.fulfilled.match(result)) continue;

        if (evaluation.taskId === 'forge_assistance') {
          dispatch(assignForgeMaintenanceCase({
            caseId: evaluation.subjectId,
            copyId,
          }));
        } else {
          dispatch(assignArchiveVerificationCase({
            caseId: evaluation.subjectId,
            copyId,
          }));
        }
        dispatch(markCopyStandingOrderTriggered({
          copyId,
          routineId: evaluation.taskId,
          tick: getState().gameLoop.currentTick,
        }));
        started += 1;
        break;
      }
    }

    return { started };
  }
);
