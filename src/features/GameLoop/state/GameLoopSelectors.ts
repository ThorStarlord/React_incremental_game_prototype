import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { GameLoopState } from './GameLoopTypes';

export const selectGameLoop = (state: RootState): GameLoopState => state.gameLoop;

export const selectIsRunning = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.isRunning
);

export const selectIsPaused = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.isPaused
);

export const selectCurrentTick = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.currentTick
);

export const selectTotalGameTime = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.totalGameTime
);

export const selectGameSpeed = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.gameSpeed
);

export const selectTickRate = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.tickRate
);

export const selectAutoSaveInterval = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.autoSaveInterval
);

export const selectLastAutoSave = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.lastAutoSave
);

export const selectGameLoopStatus = createSelector(
  [selectIsRunning, selectIsPaused],
  (isRunning, isPaused) => ({
    isRunning,
    isPaused,
    status: !isRunning ? 'stopped' : isPaused ? 'paused' : 'running'
  })
);

export const selectGameTiming = createSelector(
  [selectTotalGameTime, selectCurrentTick, selectTickRate],
  (totalGameTime, currentTick, tickRate) => ({
    totalGameTime,
    currentTick,
    tickRate,
    averageTickTime: totalGameTime / Math.max(currentTick, 1)
  })
);
