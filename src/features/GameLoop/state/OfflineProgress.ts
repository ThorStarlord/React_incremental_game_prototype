import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { processPassiveGenerationThunk } from '../../Essence/state/EssenceThunks';
import { processCopyTasksThunk } from '../../Copy/state/CopyThunks';
import { getCopyProductionTaskDefinition } from '../../Copy/CopyTaskDefinitions';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { markOfflineSettlementSource } from './GameLoopSlice';

export const MAX_OFFLINE_PROGRESS_MS = 8 * 60 * 60 * 1000;

export type OfflineProgressSkipReason =
  | 'invalid_timestamp'
  | 'non_positive_elapsed'
  | 'game_not_running'
  | 'game_paused'
  | 'already_settled';

export interface OfflineProgressWindow {
  rawElapsedMs: number;
  elapsedMs: number;
  capped: boolean;
  skipReason?: 'invalid_timestamp' | 'non_positive_elapsed';
}

export interface OfflineTaskProgressSummary {
  copyId: string;
  copyName: string;
  productionTaskId: string;
  taskName: string;
  completed: boolean;
  progressSeconds: number;
  durationSeconds: number;
  progressPercent: number;
}

export interface OfflineProgressSummary {
  savedTimestamp: number;
  resumeTimestamp: number;
  rawElapsedMs: number;
  elapsedMs: number;
  capped: boolean;
  essenceGenerated: number;
  tasks: OfflineTaskProgressSummary[];
  skipReason?: OfflineProgressSkipReason;
}

export interface SettleOfflineProgressRequest {
  savedTimestamp: number;
  resumeTimestamp?: number;
}

export const calculateOfflineProgressWindow = (
  savedTimestamp: number,
  resumeTimestamp: number,
  maxElapsedMs: number = MAX_OFFLINE_PROGRESS_MS
): OfflineProgressWindow => {
  if (
    !Number.isFinite(savedTimestamp) ||
    !Number.isFinite(resumeTimestamp) ||
    !Number.isFinite(maxElapsedMs) ||
    savedTimestamp <= 0 ||
    maxElapsedMs <= 0
  ) {
    return {
      rawElapsedMs: 0,
      elapsedMs: 0,
      capped: false,
      skipReason: 'invalid_timestamp',
    };
  }

  const rawElapsedMs = resumeTimestamp - savedTimestamp;
  if (rawElapsedMs <= 0) {
    return {
      rawElapsedMs,
      elapsedMs: 0,
      capped: false,
      skipReason: 'non_positive_elapsed',
    };
  }

  const elapsedMs = Math.min(rawElapsedMs, maxElapsedMs);
  return {
    rawElapsedMs,
    elapsedMs,
    capped: rawElapsedMs > maxElapsedMs,
  };
};

const formatEssence = (amount: number): string => {
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
};

/**
 * Settle the deliberately small M21 offline allowlist once for one restored save.
 *
 * This is snapshot settlement, not GameLoop replay:
 *   1. persisted passive Essence rate over bounded elapsed time;
 *   2. already-running M20 Copy task progress/completion.
 */
export const settleOfflineProgressThunk = createAsyncThunk<
  OfflineProgressSummary,
  SettleOfflineProgressRequest,
  { state: RootState }
>(
  'gameLoop/settleOfflineProgress',
  async ({ savedTimestamp, resumeTimestamp: requestedResumeTimestamp }, { getState, dispatch }) => {
    const resumeTimestamp = requestedResumeTimestamp ?? Date.now();
    const window = calculateOfflineProgressWindow(savedTimestamp, resumeTimestamp);
    const baseSummary: OfflineProgressSummary = {
      savedTimestamp,
      resumeTimestamp,
      rawElapsedMs: window.rawElapsedMs,
      elapsedMs: window.elapsedMs,
      capped: window.capped,
      essenceGenerated: 0,
      tasks: [],
      skipReason: window.skipReason,
    };

    if (window.elapsedMs <= 0) {
      return baseSummary;
    }

    const restoredState = getState();
    if (restoredState.gameLoop.lastOfflineSettlementSourceTimestamp === savedTimestamp) {
      return { ...baseSummary, skipReason: 'already_settled', elapsedMs: 0 };
    }
    if (!restoredState.gameLoop.isRunning) {
      return { ...baseSummary, skipReason: 'game_not_running', elapsedMs: 0 };
    }
    if (restoredState.gameLoop.isPaused) {
      return { ...baseSummary, skipReason: 'game_paused', elapsedMs: 0 };
    }

    const beforeTasks = Object.values(restoredState.copy.copies).flatMap(copy => {
      const task = copy.activeTask;
      if (!task || task.status !== 'running' || !task.productionTaskId) return [];
      return [{
        copyId: copy.id,
        copyName: copy.name,
        productionTaskId: task.productionTaskId,
        durationSeconds: task.durationSeconds,
      }];
    });

    // Frozen M21 order: snapshot passive Essence first, then M20 Copy task settlement.
    const essenceResult = await dispatch(processPassiveGenerationThunk(window.elapsedMs)).unwrap();
    await dispatch(processCopyTasksThunk(window.elapsedMs)).unwrap();

    const settledState = getState();
    const tasks: OfflineTaskProgressSummary[] = [];

    for (const before of beforeTasks) {
      const definition = getCopyProductionTaskDefinition(before.productionTaskId);
      if (!definition) continue;

      const afterTask = settledState.copy.copies[before.copyId]?.activeTask;
      let completed: boolean;
      let progressSeconds: number;
      let durationSeconds: number;

      if (!afterTask) {
        completed = true;
        progressSeconds = before.durationSeconds;
        durationSeconds = before.durationSeconds;
      } else {
        completed = false;
        progressSeconds = Math.min(afterTask.progressSeconds, afterTask.durationSeconds);
        durationSeconds = afterTask.durationSeconds;
      }

      const progressPercent = durationSeconds > 0
        ? Math.min(100, Math.floor((progressSeconds / durationSeconds) * 100))
        : 100;

      tasks.push({
        copyId: before.copyId,
        copyName: before.copyName,
        productionTaskId: before.productionTaskId,
        taskName: definition.name,
        completed,
        progressSeconds,
        durationSeconds,
        progressPercent,
      });
    }

    dispatch(markOfflineSettlementSource(savedTimestamp));

    const summaryParts: string[] = [];
    if (essenceResult.generated > 0) {
      summaryParts.push(`+${formatEssence(essenceResult.generated)} Essence`);
    }
    for (const task of tasks) {
      summaryParts.push(
        task.completed
          ? `${task.copyName} completed ${task.taskName}`
          : `${task.copyName} ${task.taskName} ${task.progressPercent}%`
      );
    }

    dispatch(addNotification({
      type: 'info',
      message: `While you were away: ${summaryParts.length > 0 ? summaryParts.join('; ') : 'no offline-safe progress'}.`,
    }));

    return {
      ...baseSummary,
      skipReason: undefined,
      essenceGenerated: essenceResult.generated,
      tasks,
    };
  }
);
