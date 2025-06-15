import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameLoopState } from './GameLoopTypes';

const initialState: GameLoopState = {
  isRunning: true, // FIXED: Set to true by default
  isPaused: false,
  currentTick: 0,
  tickRate: 10, // 10 ticks per second
  lastUpdateTime: 0,
  totalGameTime: 0,
  gameSpeed: 1.0,
  autoSaveInterval: 30000, // 30 seconds
  lastAutoSave: 0,
};

export const gameLoopSlice = createSlice({
  name: 'gameLoop',
  initialState,
  reducers: {
    // This action is now more of a "reset and start" if needed
    startGame: (state) => {
      state.isRunning = true;
      state.isPaused = false;
      state.lastUpdateTime = Date.now();
    },
    pauseGame: (state) => {
      if (state.isRunning) { // Can only pause if running
        state.isPaused = true;
      }
    },
    resumeGame: (state) => {
      if (state.isRunning) { // Can only resume if running
        state.isPaused = false;
        state.lastUpdateTime = Date.now();
      }
    },
    // Stop game now means to halt the loop entirely
    stopGame: (state) => {
      state.isRunning = false;
      state.isPaused = false;
    },
    tick: (state, action: PayloadAction<{ deltaTime: number; timestamp: number }>) => {
      const { deltaTime, timestamp } = action.payload;
      state.currentTick += 1;
      state.totalGameTime += deltaTime;
      state.lastUpdateTime = timestamp;
    },
    setGameSpeed: (state, action: PayloadAction<number>) => {
      state.gameSpeed = Math.max(0.1, Math.min(10, action.payload));
    },
    setTickRate: (state, action: PayloadAction<number>) => {
      state.tickRate = Math.max(1, Math.min(60, action.payload));
    },
    updateAutoSave: (state, action: PayloadAction<number>) => {
      state.lastAutoSave = action.payload;
    },
  },
});

export const {
  startGame,
  pauseGame,
  resumeGame,
  stopGame,
  tick,
  setGameSpeed,
  setTickRate,
  updateAutoSave,
} = gameLoopSlice.actions;

export default gameLoopSlice.reducer;