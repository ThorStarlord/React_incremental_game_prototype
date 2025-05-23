export interface GameLoopState {
  isRunning: boolean;
  isPaused: boolean;
  currentTick: number;
  tickRate: number; // ticks per second
  lastUpdateTime: number;
  totalGameTime: number; // total time in milliseconds
  gameSpeed: number; // multiplier for game speed (1.0 = normal)
  autoSaveInterval: number; // in milliseconds
  lastAutoSave: number;
}

export interface TickData {
  deltaTime: number;
  currentTick: number;
  totalGameTime: number;
}
