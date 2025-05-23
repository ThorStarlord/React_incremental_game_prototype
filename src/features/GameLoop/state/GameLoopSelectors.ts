import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

export const selectGameLoop = (state: RootState) => state.gameLoop;

export const selectIsGameRunning = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.isRunning && !gameLoop.isPaused
);

export const selectGameSpeed = createSelector(
  [selectGameLoop],
  (gameLoop) => gameLoop.gameSpeed
);

export const selectFormattedGameTime = createSelector(
  [selectGameLoop],
  (gameLoop) => {
    const seconds = Math.floor(gameLoop.totalGameTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
);

export const selectShouldAutoSave = createSelector(
  [selectGameLoop],
  (gameLoop) => 
    gameLoop.totalGameTime - gameLoop.lastAutoSave >= gameLoop.autoSaveInterval
);
