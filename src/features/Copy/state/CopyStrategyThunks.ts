import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../../../app/store';
import { addNotification } from '../../../shared/state/NotificationSlice';
import {
  getFirstEligiblePreferredProductionTask,
  normalizeCopyRoutinePriority,
} from '../CopyRoutineStrategy';
import type { CopyProductionTaskId } from './CopyTypes';
import { updateCopy } from './CopySlice';
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

    await dispatch(startCopyProductionTaskThunk({ copyId, taskId })).unwrap();
    return { copyId, taskId };
  }
);
