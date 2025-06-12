export { default as gameLoopReducer } from './state/GameLoopSlice';
export {
  startGame,
  pauseGame,
  resumeGame,
  stopGame,
  tick,
  setGameSpeed,
  setTickRate,
  updateAutoSave
} from './state/GameLoopSlice';

// FIXED: Corrected the list of exported selectors to match what exists.
export {
  selectGameLoop,
  selectIsRunning, // Corrected from selectIsGameRunning
  selectGameSpeed,
  selectIsPaused, // Added for completeness
  selectTotalGameTime // Added for completeness
} from './state/GameLoopSelectors';

export { useGameLoop } from './hooks/useGameLoop';
export { GameControlPanel } from './components/ui/GameControlPanel';
export type { GameLoopState, TickData } from './state/GameLoopTypes';